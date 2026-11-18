import { useEffect, useState } from 'react';

export function ScrubText({ children, className }) {
  return <p className={className}>{children}</p>;
}

export function Marquee({ items }) {
  return (
    <div className="marquee" aria-label="Technologies">
      <div className="track">
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

export function Clock({ tz = 'Asia/Kolkata' }) {
  const format = () => {
    try {
      return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date());
    } catch {
      const date = new Date();
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  };
  const [time, setTime] = useState(format);
  useEffect(() => {
    const update = () => setTime(format());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <span className="clock">Local time {time}</span>;
}
