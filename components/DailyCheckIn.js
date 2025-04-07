import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const DailyCheckIn = () => {
  const hasMounted = useHasMounted();
  const today = new Date().toISOString().split('T')[0];

  const [checkIns, setCheckIns] = useLocalStorage('checkIns', {});
  const [momentum, setMomentum] = useLocalStorage('momentum', []);

  const todayCheckIn = checkIns[today] || { morning: '', evening: '', rating: 0 };

  const [morning, setMorning] = useState(todayCheckIn.morning);
  const [evening, setEvening] = useState(todayCheckIn.evening);
  const [rating, setRating] = useState(todayCheckIn.rating);
  const [saved, setSaved] = useState(false);

  if (!hasMounted) return null;

  const saveCheckIn = () => {
    // 1. Save to checkIns
    const updated = {
      ...checkIns,
      [today]: { morning, evening, rating },
    };
    setCheckIns(updated);

    // 2. Add to momentum log
    const momentumEntry = {
      date: new Date().toISOString(),
      summary: `✅ Daily check-in completed (Discipline: ${rating}/5)`
    };
    setMomentum([...momentum, momentumEntry]);

    // 3. Show confirmation and clear fields
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setMorning('');
    setEvening('');
    setRating(0);
  };

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🧠 Discipline Engine</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">🌅 Morning Check-in</h3>
        <textarea
          className="w-full border rounded p-3"
          rows={3}
          placeholder="What’s your top 1–2 outputs today?"
          value={morning}
          onChange={(e) => setMorning(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">🌇 Evening Check-out</h3>
        <textarea
          className="w-full border rounded p-3"
          rows={3}
          placeholder="Did you hit your goals today?"
          value={evening}
          onChange={(e) => setEvening(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">🎯 Discipline Rating</h3>
        <select
          className="border rounded px-3 py-2"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        >
          <option value={0} disabled>
            Select a rating (1–5)
          </option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={saveCheckIn}
        >
          Save Check-in
        </button>
        {saved && <span className="text-green-600 font-medium">✓ Saved!</span>}
      </div>
    </div>
  );
};

export default DailyCheckIn;
