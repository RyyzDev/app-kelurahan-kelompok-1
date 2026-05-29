const slots = [
  { id: 1, time: '08:00 - 09:00', capacity: 10, remaining: 5 },
  { id: 2, time: '09:00 - 10:00', capacity: 10, remaining: 2 },
  { id: 3, time: '10:00 - 11:00', capacity: 10, remaining: 0 },
  { id: 4, time: '11:00 - 12:00', capacity: 10, remaining: 8 },
  { id: 5, time: '13:00 - 14:00', capacity: 10, remaining: 10 },
];

const SlotPicker = ({ onSelect, selectedSlot }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {slots.map((slot) => {
        const isFull = slot.remaining === 0;
        const isSelected = selectedSlot?.id === slot.id;

        return (
          <button
            key={slot.id}
            disabled={isFull}
            onClick={() => onSelect(slot)}
            className={`
              p-4 rounded-xl border-2 transition-all text-left
              ${isFull ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60' : 'cursor-pointer'}
              ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-text-h'}`}>
                {slot.time}
              </span>
              {isFull && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Penuh</span>}
            </div>
            <div className="text-sm text-text">
              Sisa: <span className={`font-bold ${slot.remaining < 3 ? 'text-red-500' : 'text-green-600'}`}>{slot.remaining}</span> / {slot.capacity}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SlotPicker;
