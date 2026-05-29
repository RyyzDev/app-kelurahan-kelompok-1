const slots = [
  { id: 1, time: '08:00 - 09:00', capacity: 10, remaining: 5 },
  { id: 2, time: '09:00 - 10:00', capacity: 10, remaining: 2 },
  { id: 3, time: '10:00 - 11:00', capacity: 10, remaining: 0 },
  { id: 4, time: '11:00 - 12:00', capacity: 10, remaining: 8 },
  { id: 5, time: '13:00 - 14:00', capacity: 10, remaining: 10 },
];

const SlotPicker = ({ onSelect, selectedSlot }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {slots.map((slot) => {
        const isFull = slot.remaining === 0;
        const isSelected = selectedSlot?.id === slot.id;

        return (
          <button
            key={slot.id}
            disabled={isFull}
            onClick={() => onSelect(slot)}
            className={`
              p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden
              ${isFull ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}
              ${isSelected 
                ? 'border-[#0047AB] bg-[#EEF5FF] shadow-lg shadow-blue-100' 
                : 'border-gray-100 bg-white hover:border-[#0047AB]/30 hover:shadow-md'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0047AB"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              <span className={`font-extrabold text-lg tracking-tight ${isSelected ? 'text-[#0047AB]' : 'text-[#333]'}`}>
                {slot.time}
              </span>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-400">
                  Tersisa: <span className={`font-bold ${slot.remaining < 3 ? 'text-red-500' : 'text-[#34A853]'}`}>{slot.remaining}</span>
                </div>
                {isFull ? (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Habis</span>
                ) : (
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${slot.remaining < 3 ? 'bg-red-500' : 'bg-[#34A853]'}`}
                      style={{ width: `${(slot.remaining / slot.capacity) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SlotPicker;
