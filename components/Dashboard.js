import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const Dashboard = () => {
  const hasMounted = useHasMounted();
  const [todayPlan, setTodayPlan] = useLocalStorage('todayPlan', '');
  const [weekGoals, setWeekGoals] = useLocalStorage('weekGoals', '');
  const [momentum] = useLocalStorage('momentum', []);

  if (!hasMounted) return null;

  // Filter wins from the past 7 days
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const weeklyWins = momentum.filter((m) => {
    const date = new Date(m.date);
    return date >= oneWeekAgo;
  });

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📋 Dashboard</h2>

      {/* Today’s Plan */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">🗓 Today’s Plan</h3>
        <textarea
          className="w-full border rounded p-3"
          rows={3}
          placeholder="What’s the most important work to push forward today?"
          value={todayPlan}
          onChange={(e) => setTodayPlan(e.target.value)}
        />
      </div>

      {/* Weekly Goals */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">🎯 Weekly Goals</h3>
        <textarea
          className="w-full border rounded p-3"
          rows={3}
          placeholder="What will you feel great about completing this week?"
          value={weekGoals}
          onChange={(e) => setWeekGoals(e.target.value)}
        />
      </div>

      {/* Weekly Momentum */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">📈 Weekly Momentum</h3>
        {weeklyWins.length === 0 ? (
          <p className="text-gray-500 italic">No wins logged yet this week. You got this.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-800">
            {weeklyWins.map((entry, i) => (
              <li key={i}>
                <span className="font-medium">
                  {new Date(entry.date).toLocaleDateString()}:
                </span>{' '}
                {entry.summary}
              </li>
            ))}
          </ul>
        )}
        <div className="text-sm text-gray-600 pt-2">
          ✅ <strong>{weeklyWins.length}</strong> wins this week
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
