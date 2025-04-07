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

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const weeklyWins = momentum.filter((m) => {
    const date = new Date(m.date);
    return date >= oneWeekAgo;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">📋 Dashboard</h2>

      {/* Today’s Plan */}
      <div className="bg-white rounded-xl shadow p-6 space-y-2 border">
        <h3 className="text-xl font-semibold text-gray-800">📝 Today’s Plan</h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="What’s the most important work to push forward today?"
          value={todayPlan}
          onChange={(e) => setTodayPlan(e.target.value)}
        />
      </div>

      {/* Weekly Goals */}
      <div className="bg-white rounded-xl shadow p-6 space-y-2 border">
        <h3 className="text-xl font-semibold text-gray-800">🎯 Weekly Goals</h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="What will you feel great about completing this week?"
          value={weekGoals}
          onChange={(e) => setWeekGoals(e.target.value)}
        />
      </div>

      {/* Weekly Momentum */}
      <div className="bg-white rounded-xl shadow p-6 space-y-2 border">
        <h3 className="text-xl font-semibold text-gray-800">📈 Weekly Momentum</h3>

        {weeklyWins.length === 0 ? (
          <p className="text-gray-500 italic">No wins logged yet this week. Let’s get it.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-1 text-gray-700 text-sm">
            {weeklyWins.map((entry, i) => (
              <li key={i}>
                <span className="font-medium">
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  :
                </span>{' '}
                {entry.summary}
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 text-sm text-gray-600">
          ✅ <strong>{weeklyWins.length}</strong> wins this week
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
