import { Download, FileSpreadsheet, FileText as FilePdf } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const ExportButton = ({ data, filename = 'laporan-sigercap' }) => {
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success('Excel berhasil diunduh');
    } catch {
      toast.error('Gagal mengekspor Excel');
    }
  };

  const exportToPdf = () => {
    try {
      const doc = new jsPDF();
      doc.text('Laporan Distribusi SI-GERCAP', 14, 15);
      
      const tableColumn = Object.keys(data[0] || {});
      const tableRows = data.map(item => Object.values(item));

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [0, 71, 171] }
      });

      doc.save(`${filename}.pdf`);
      toast.success('PDF berhasil diunduh');
    } catch {
      toast.error('Gagal mengekspor PDF');
    }
  };

  return (
    <div className="relative group inline-block">
      <button className="flex items-center space-x-3 px-8 py-4 bg-[#0047AB] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-95">
        <Download size={18} strokeWidth={3} />
        <span>Export Laporan</span>
      </button>
      
      <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[24px] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 overflow-hidden transform origin-top-right group-hover:translate-y-0 translate-y-2">
        <button 
          onClick={exportToExcel}
          className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-green-50 transition-colors"
        >
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
             <FileSpreadsheet size={18} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-extrabold text-gray-700">Excel (.xlsx)</span>
        </button>
        <button 
          onClick={exportToPdf}
          className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-red-50 transition-colors"
        >
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
             <FilePdf size={18} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-extrabold text-gray-700">PDF (.pdf)</span>
        </button>
      </div>
    </div>
  );
};

export default ExportButton;
