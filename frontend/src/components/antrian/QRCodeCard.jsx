import { QRCodeSVG } from 'qrcode.react';

const QRCodeCard = ({ queueData }) => {
  if (!queueData) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-border flex flex-col items-center max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-text-h mb-1">Tiket Antrean</h2>
      <p className="text-text text-sm mb-6">{queueData.date}</p>

      <div className="bg-primary/5 p-4 rounded-xl mb-6">
        <QRCodeSVG
          value={queueData.qrValue}
          size={200}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>

      <div className="text-center w-full">
        <p className="text-text text-xs uppercase tracking-widest mb-1">Nomor Antrean</p>
        <p className="text-5xl font-black text-primary mb-4">{queueData.number}</p>
        
        <div className="bg-secondary p-3 rounded-lg text-left mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text">Waktu:</span>
            <span className="font-bold text-text-h">{queueData.slot}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text">Lokasi:</span>
            <span className="font-bold text-text-h">Balai Desa Kelurahan</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-text-h text-white rounded-xl font-semibold hover:bg-black transition"
        >
          Cetak / Simpan Tiket
        </button>
      </div>
    </div>
  );
};

export default QRCodeCard;
