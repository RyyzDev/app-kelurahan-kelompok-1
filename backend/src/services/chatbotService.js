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
          alasan_permohonan: { type: "string", description: "Alasan pengajuan surat secara detail (minimal 10 karakter)" },
          format_surat: { type: "string", enum: ["digital", "cap_basah"], description: "Format surat yang diinginkan: 'digital' untuk surat digital atau 'cap_basah' untuk surat fisik dengan cap basah." }
        },
        required: ["jenis_surat_id", "alasan_permohonan", "format_surat"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cek_event_tersedia",
      description: "Mendapatkan daftar event (kegiatan) kelurahan yang sedang aktif/tersedia beserta ID-nya."
    }
  },
  {
    type: "function",
    function: {
      name: "daftar_event",
      description: "Mendaftarkan warga (user) ke event (kegiatan) kelurahan berdasarkan ID event.",
      parameters: {
        type: "object",
        properties: {
          event_id: { type: "string", description: "ID event yang didapatkan dari cek_event_tersedia" }
        },
        required: ["event_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cek_jadwal_vaksinasi",
      description: "Mendapatkan daftar jadwal vaksinasi yang tersedia beserta ID-nya."
    }
  },
  {
    type: "function",
    function: {
      name: "daftar_vaksinasi",
      description: "Mendaftarkan warga (user) ke jadwal vaksinasi berdasarkan ID jadwal.",
      parameters: {
        type: "object",
        properties: {
          jadwal_id: { type: "string", description: "ID jadwal vaksinasi yang didapatkan dari cek_jadwal_vaksinasi" }
        },
        required: ["jadwal_id"]
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
      const { jenis_surat_id, alasan_permohonan, format_surat } = args;
      
      if (!userId) {
        return "Gagal: User belum login atau sesi tidak valid.";
      }

      if (!alasan_permohonan || alasan_permohonan.trim().length < 10) {
        return "Gagal: Alasan permohonan terlalu pendek (minimal 10 karakter).";
      }

      const jenisSurat = await prisma.jenisSurat.findUnique({ where: { id: jenis_surat_id } });
      if (!jenisSurat || !jenisSurat.is_active) {
        return "Gagal: Layanan surat tidak ditemukan.";
      }

      const permohonan = await prisma.permohonanSurat.create({
        data: {
          user_id: userId,
          jenis_surat_id,
          format_surat: format_surat === 'cap_basah' ? 'cap_basah' : 'digital',
          alasan_permohonan,
          status: 'verifikasi'
        }
      });

      return `Berhasil! Permohonan surat "${jenisSurat.nama_layanan}" dengan format ${permohonan.format_surat === 'cap_basah' ? 'Cap Basah' : 'Digital'} telah dibuat dengan ID: ${permohonan.id}. Warga dapat memantau statusnya di menu Status Surat.`;
    }
    else if (name === 'cek_event_tersedia') {
      // Auto-update past events to 'berakhir'
      await prisma.event.updateMany({
        where: {
          tanggal: { lt: new Date() },
          status: 'aktif'
        },
        data: { status: 'berakhir' }
      });

      const events = await prisma.event.findMany({
        where: { status: 'aktif' },
        select: { id: true, nama_event: true, deskripsi: true, tanggal: true, lokasi: true }
      });
      return JSON.stringify(events);
    }
    else if (name === 'daftar_event') {
      const { event_id } = args;
      
      if (!userId) {
        return "Gagal: User belum login atau sesi tidak valid.";
      }

      const event = await prisma.event.findUnique({ where: { id: event_id } });
      if (!event || event.status !== 'aktif') {
        return "Gagal: Event tidak ditemukan atau sudah tidak aktif.";
      }

      const existingRegistration = await prisma.eventRegistration.findUnique({
        where: { user_id_event_id: { user_id: userId, event_id } }
      });

      if (existingRegistration) {
        return "Gagal: Anda sudah terdaftar di event ini.";
      }

      const registration = await prisma.eventRegistration.create({
        data: {
          user_id: userId,
          event_id
        }
      });

      return `Berhasil mendaftar ke event "${event.nama_event}". ID Pendaftaran: ${registration.id}. Warga dapat mengecek tiketnya di menu Notifikasi.`;
    }
    else if (name === 'cek_jadwal_vaksinasi') {
      // Auto-update past vaccine schedules to 'SELESAI'
      await prisma.jadwalVaksinasi.updateMany({
        where: { tanggal: { lt: new Date() }, status: { not: 'SELESAI' } },
        data: { status: 'SELESAI' }
      });

      const schedules = await prisma.jadwalVaksinasi.findMany({
        where: { status: 'TERSEDIA' },
        select: { id: true, nama_vaksin: true, deskripsi: true, tanggal: true, jam_mulai: true, jam_selesai: true, lokasi: true, sisa_kuota: true }
      });
      return JSON.stringify(schedules);
    }
    else if (name === 'daftar_vaksinasi') {
      const { jadwal_id } = args;

      if (!userId) {
        return "Gagal: User belum login atau sesi tidak valid.";
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
          const jadwal = await tx.jadwalVaksinasi.findUnique({
            where: { id: jadwal_id }
          });

          if (!jadwal || jadwal.status !== 'TERSEDIA') {
            throw new Error('Jadwal tidak tersedia, sudah berakhir, atau penuh.');
          }

          if (jadwal.sisa_kuota <= 0) {
            throw new Error('Kuota untuk jadwal ini sudah habis.');
          }

          const existingRegistration = await tx.pendaftaranVaksinasi.findUnique({
            where: { user_id_jadwal_id: { user_id: userId, jadwal_id } }
          });

          if (existingRegistration) {
            throw new Error('Anda sudah terdaftar pada jadwal ini.');
          }

          const nomorAntrian = jadwal.kuota - jadwal.sisa_kuota + 1;

          const newRegistration = await tx.pendaftaranVaksinasi.create({
            data: {
              user_id: userId,
              jadwal_id,
              nomor_antrian: nomorAntrian
            }
          });

          const newSisaKuota = jadwal.sisa_kuota - 1;
          await tx.jadwalVaksinasi.update({
            where: { id: jadwal_id },
            data: { 
              sisa_kuota: newSisaKuota,
              status: newSisaKuota === 0 ? 'PENUH' : 'TERSEDIA'
            }
          });

          return { id: newRegistration.id, nama_vaksin: jadwal.nama_vaksin, nomor_antrian: nomorAntrian };
        });

        return `Berhasil mendaftar vaksinasi "${result.nama_vaksin}". Nomor antrian Anda: ${result.nomor_antrian}. ID Pendaftaran: ${result.id}. Warga dapat mengecek tiketnya di menu Notifikasi.`;
      } catch (err) {
        return `Gagal mendaftar: ${err.message}`;
      }
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
    content: 'Anda adalah Asisten AI SI-GERCAP. Bantu warga dengan berbagai layanan kelurahan:\n' +
             '1. Pembuatan surat: Panggil cek_jenis_surat, lalu buat_permohonan_surat dengan parameter jenis_surat_id, alasan_permohonan, dan format_surat (\'digital\' atau \'cap_basah\') sesuai permintaan/pilihan warga. Setelah berhasil memanggil `buat_permohonan_surat`, WAJIB akhiri respon Anda dengan tombol markdown untuk cek status, seperti ini: [Cek Status Surat](/warga/persuratan/status).\n' +
             '2. Pendaftaran event: Panggil cek_event_tersedia untuk melihat event aktif, lalu daftar_event dengan parameter event_id untuk mendaftarkan warga. Setelah berhasil memanggil `daftar_event`, WAJIB akhiri respon Anda dengan tombol markdown untuk cek tiket/notifikasi, seperti ini: [Cek Tiket Event](/warga/notifikasi).\n' +
             '3. Pendaftaran vaksinasi: Panggil cek_jadwal_vaksinasi untuk melihat jadwal vaksinasi yang tersedia, lalu daftar_vaksinasi dengan parameter jadwal_id untuk mendaftarkan warga. Setelah berhasil memanggil `daftar_vaksinasi`, WAJIB akhiri respon Anda dengan tombol markdown untuk cek tiket/notifikasi, seperti ini: [Cek Tiket Vaksinasi](/warga/notifikasi).\n' +
             'Selalu gunakan Bahasa Indonesia yang ramah.'
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

