import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const DailyCheckIn = () => {
  const today = new Date().toISOString().split('T')[0];
  const [checkIns, setCheckIns] = useLocalStorage('checkIns', {});
  const todayCheckIn = checkIns[today] || { morning: '', evening: '', rating: 0 };

  const updateCheckIn = (key, value) => {
    const updated = {
      ...checkIns,
      [today]: {
        ...todayCheckIn,
        [key]: value,
      },
    };
    setCheckIns(updated);
  };

  const streak = Object.values(checkIns).reduce((acc, curr) => acc + (curr.rating >= 4 ? 1 : 0), 0);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Discipline Engine</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">Morning Check-In</h3>
        <textarea
          className="border w-full p-2"
          rows={3}
          value={todayCheckIn.morning}
          onChange={(e) => updateCheckIn('morning', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Evening Check-Out</h3>
        <textarea
          className="border w-full p-2"
          rows={3}
          value={todayCheckIn.evening}
          onChange={(e) => updateCheckIn('evening', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Discipline Rating (1–5)</h3>
        <input
          type="number"
          min="1"
          max="5"
          className="border p-2 rounded w-16"
          value={todayCheckIn.rating || ''}
          onChange={(e) => updateCheckIn('rating', parseInt(e.target.value))}
        />
      </div>

      <div className="text-sm text-gray-600">
        Streak Score: <strong>{streak}</strong>
      </div>
    </div>
  );
};

export default DailyCheckIn;
