import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const MomentumLog = () => {
  const [checkIns] = useLocalStorage('checkIns', {});
  const [momentum] = useLocalStorage('momentum', []);

  const dates = Object.keys({ ...checkIns, ...momentum })
    .sort((a, b) => new Date(b) - new Date(a));

  const getDailyLog = (date) => {
    const c = checkIns[date] || {};
    const wins = momentum.filter(m => m.date.startsWith(date));
    return { date, ...c, wins };
  };

  const logEntries = dates.map(getDailyLog);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Momentum Log</h2>
      <div className="space-y-4">
        {logEntries.map((log, i) => (
          <div key={i} className="border rounded p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-1">{new Date(log.date).toDateString()}</h3>
            {log.wins.length > 0 && (
              <div className="mb-2">
                <strong>Wins:</strong>
                <ul className="list-disc ml-5">
                  {log.wins.map((w, i) => <li key={i}>{w.summary}</li>)}
                </ul>
              </div>
            )}
            {log.morning && (
              <div className="mb-1"><strong>Morning:</strong> {log.morning}</div>
            )}
            {log.evening && (
              <div className="mb-1"><strong>Evening:</strong> {log.evening}</div>
            )}
            {log.rating && (
              <div><strong>Discipline Rating:</strong> {log.rating}/5</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MomentumLog;
