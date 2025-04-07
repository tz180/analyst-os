import React, { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const MomentumLog = () => {
  const hasMounted = useHasMounted();
  const [checkIns] = useLocalStorage('checkIns', {});
  const [momentum] = useLocalStorage('momentum', []);

  if (!hasMounted) return null;

  // Combine and sort entries by day (descending)
  const allDates = Array.from(
    new Set([
      ...Object.keys(checkIns),
      ...momentum.map((m) => m.date.split('T')[0])
    ])
  ).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📘 Momentum Log</h2>

      {allDates.length === 0 ? (
        <p className="text-gray-500 italic">No entries yet — start building your streak today.</p>
      ) : (
        <div className="space-y-4">
          {allDates.map((date, idx) => {
            const checkIn = checkIns[date];
            const dailyWins = momentum.filter((m) => m.date.startsWith(date));

            return (
              <div
                key={idx}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-2"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </h3>

                {dailyWins.length > 0 && (
                  <div>
                    <strong>🏆 Wins:</strong>
                    <ul className="list-disc ml-6 text-sm text-gray-700">
                      {dailyWins.map((win, i) => (
                        <li key={i}>{win.summary}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {checkIn?.morning && (
                  <div>
                    <strong>🌅 Morning:</strong>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{checkIn.morning}</p>
                  </div>
                )}

                {checkIn?.evening && (
                  <div>
                    <strong>🌇 Evening:</strong>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{checkIn.evening}</p>
                  </div>
                )}

                {checkIn?.rating && (
                  <div className="text-sm text-gray-500">
                    Discipline Rating: <strong>{checkIn.rating}/5</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MomentumLog;
