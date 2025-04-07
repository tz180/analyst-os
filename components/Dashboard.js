import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const Dashboard = () => {
  const [todayPlan, setTodayPlan] = useLocalStorage('todayPlan', '');
  const [weekGoals, setWeekGoals] = useLocalStorage('weekGoals', '');
  const [momentum, setMomentum] = useLocalStorage('momentum', []);

  const addWin = () => {
    const newWin = {
      date: new Date().toISOString(),
      summary: prompt('What did you ship today?')
    };
    if (newWin.summary) {
      setMomentum([...momentum, newWin]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Today's Plan</h3>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          value={todayPlan}
          onChange={(e) => setTodayPlan(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Weekly Goals</h3>
        <textarea
          className="border p-2 w-full rounded"
          rows={3}
          value={weekGoals}
          onChange={(e) => setWeekGoals(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Momentum Tracker</h3>
        <button onClick={addWin} className="bg-green-600 text-white px-3 py-1 rounded mb-2">
          + Log Win
        </button>
        <ul className="list-disc ml-6 space-y-1">
          {momentum.map((m, i) => (
            <li key={i}>
              <span className="font-semibold">{new Date(m.date).toLocaleDateString()}:</span> {m.summary}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
