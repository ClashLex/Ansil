"use client";

import { useEffect, useState } from "react";

export default function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      setTime("IST " + now.toLocaleTimeString("en-US", opts));
    }
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-bar">
      <span className="top-bar-name">Ansil Muhammed</span>
      <span className="top-bar-time">{time}</span>
    </header>
  );
}
