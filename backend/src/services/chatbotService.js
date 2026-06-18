import OpenAI from 'openai';
import prisma from '../lib/prisma.js';

let openaiClient = null;

const getClient = () => {
  if (!openaiClient) {
    let baseURL = process.env.LLM_API_URL;
    if (baseURL && baseURL.endsWith('/chat/completions')) {
      baseURL = baseURL.replace('/chat/completions', '');
    }
    
    openaiClient = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: baseURL || undefined,
    });
  }
  return openaiClient;
};

// Define the tools available to the chatbot
const tools = [
  {
    type: "function",
    function: {
      name: "cek_jenis_surat",
      description: "Mendapatkan daftar layanan jenis surat yang tersedia di Kelurahan beserta ID-nya."
    }
  },
  {
    type: "function",
    function: {
      name: "buat_permohonan_surat",
      description: "Membantu warga membuat permohonan surat baru ke kelurahan.",
      parameters: {
        type: "object",
        properties: {
          jenis_surat_id: { type: "string", description: "ID jenis surat (didapatkan dari cek_jenis_surat)" },
          alasan_permohonan: { type: "string", description: "Alasan pengajuan surat secara detail (minimal 10 karakter)" }
        },
        required: ["jenis_surat_id", "alasan_permohonan"]
      }
    }
  }
];

// Tool Implementation Map
const executeTool = async (name, args, userId) => {
  try {
    if (name === 'cek_jenis_surat') {
      const services = await prisma.jenisSurat.findMany({
        where: { is_active: true },
        select: { id: true, nama_layanan: true, deskripsi: true, estimasi_pengerjaan: true }
      });
      return JSON.stringify(services);
    } 
    else if (name === 'buat_permohonan_surat') {
      const { jenis_surat_id, alasan_permohonan } = args;
      
      if (!userId) {
        return "Gagal: User belum login atau sesi tidak valid.";
      }

      const jenisSurat = await prisma.jenisSurat.findUnique({ where: { id: jenis_surat_id } });
      if (!jenisSurat || !jenisSurat.is_active) {
        return "Gagal: Layanan surat tidak ditemukan.";
      }

      const permohonan = await prisma.permohonanSurat.create({
        data: {
          user_id: userId,
          jenis_surat_id,
          format_surat: 'digital', // Default digital untuk kemudahan via chat
          alasan_permohonan,
          status: 'verifikasi'
        }
      });

      return `Berhasil! Permohonan surat "${jenisSurat.nama_layanan}" telah dibuat dengan ID: ${permohonan.id}. Warga dapat memantau statusnya di menu Status Surat.`;
    }
    return `Tool ${name} tidak dikenali.`;
  } catch (error) {
    console.error(`Tool Execution Error (${name}):`, error);
    return `Terjadi kesalahan saat memproses ${name}: ${error.message}`;
  }
};

/**
 * Handle streaming and tool execution loop
 */
export const processChatStream = async (messages, userId, res) => {
  const client = getClient();
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  const systemMessage = {
    role: 'system',
    content: 'Anda adalah Asisten AI SI-GERCAP. Bantu warga membuat surat dengan memanggil fungsi cek_jenis_surat lalu buat_permohonan_surat jika mereka memintanya. Setelah berhasil memanggil `buat_permohonan_surat`, WAJIB akhiri respon Anda dengan tombol markdown untuk cek status, seperti ini: [Cek Status Surat](/warga/persuratan/status). Selalu gunakan Bahasa Indonesia yang ramah.'
  };

  const currentMessages = [systemMessage, ...messages];

  try {
    // We will loop to handle potential multi-step tool calls
    while (true) {
      const stream = await client.chat.completions.create({
        model,
        messages: currentMessages,
        tools: tools,
        stream: true,
        temperature: 0.7,
      });

      let toolCalls = {};
      let hasToolCall = false;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        
        // Accumulate tool calls
        if (delta?.tool_calls) {
          hasToolCall = true;
          for (const tc of delta.tool_calls) {
            if (!toolCalls[tc.index]) {
              toolCalls[tc.index] = { id: tc.id, type: 'function', function: { name: tc.function.name, arguments: '' } };
            }
            if (tc.function.arguments) {
              toolCalls[tc.index].function.arguments += tc.function.arguments;
            }
          }
        } 
        
        // Stream text content directly to client
        if (delta?.content && !hasToolCall) {
          res.write(`data: ${JSON.stringify({ content: delta.content })}\n\n`);
        }
      }

      if (!hasToolCall) {
        // Conversation is finished
        res.write('data: [DONE]\n\n');
        res.end();
        break;
      } else {
        // Execute accumulated tool calls
        const finalToolCalls = Object.values(toolCalls);
        
        // Append the assistant's tool call message to history
        currentMessages.push({
          role: 'assistant',
          content: null,
          tool_calls: finalToolCalls
        });

        // Execute each tool and append the result
        for (const tc of finalToolCalls) {
          let args = {};
          try {
            args = JSON.parse(tc.function.arguments);
          } catch (e) {
            console.error("Failed to parse tool arguments", tc.function.arguments);
          }

          const result = await executeTool(tc.function.name, args, userId);
          
          currentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: result
          });
        }
        // Loop will continue and call the LLM again with the tool results
      }
    }
  } catch (err) {
    console.error('--- OpenAI Stream Error ---');
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: err.message || 'Terjadi kesalahan saat streaming.' })}\n\n`);
    res.end();
  }
};

