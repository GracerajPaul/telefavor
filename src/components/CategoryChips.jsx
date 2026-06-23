\"use client\";
import Icon from \"./Icon\";

const categories = [
  \"\",
  \"Telegram Channel\",
  \"Telegram Group\",
  \"Telegram Bot\",
  \"Telegram Mini App\",
  \"TON\",
  \"Other\",
];

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className=\"flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1\">
      {categories.map((cat, i) => {
        const isActive = selected === cat;
        const label = cat || \"All\";
        return (
          <button
            key={i}
            onClick={() => onSelect(isActive ? \"\" : cat)}
            className=\"chip flex-shrink-0\"
            style={isActive ? {
              background: 'linear-gradient(135deg, rgba(91,141,239,0.18), rgba(155,115,240,0.12))',
              borderColor: 'rgba(91,141,239,0.4)',
              color: '#7eb5ff',
              boxShadow: '0 0 10px rgba(91,141,239,0.15)',
            } : {
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.07)',
              color: 'var(--color-text-muted)',
            }}
          >
            {i === 0 && <Icon name=\"filter\" size={10} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
