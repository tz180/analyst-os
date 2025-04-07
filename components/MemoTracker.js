import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const STAGES = ['Started', 'In Draft', 'Sent', 'Stalled'];

const MemoTracker = () => {
  const hasMounted = useHasMounted();
  const [memos, setMemos] = useLocalStorage('memos', []);
  const [newMemo, setNewMemo] = useState('');

  if (!hasMounted) return null;

  const addMemo = () => {
    if (!newMemo.trim()) return;
    const today = new Date().toISOString();
    setMemos([
      ...memos,
      {
        title: newMemo,
        stage: 'Started',
        lastUpdated: today
      }
    ]);
    setNewMemo('');
  };

  const updateStage = (index, newStage) => {
    const updated = [...memos];
    updated[index].stage = newStage;
    updated[index].lastUpdated = new Date().toISOString();
    setMemos(updated);
  };

  const getPriorityScore = (memo) => {
    const ageDays = Math.floor((new Date() - new Date(memo.lastUpdated)) / (1000 * 60 * 60 * 24));
    let score = 0;
    if (memo.stage === 'Stalled') score += 3;
    if (memo.stage === 'Started') score += 2;
    score += Math.min(ageDays / 5, 5); // Add some age weight
    return score;
  };

  const sortedMemos = [...memos].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📑 Memo / Model Tracker</h2>

      <div className="flex items-center gap-2">
        <input
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New memo or model title..."
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={addMemo}
        >
          Add
        </button>
      </div>

      {sortedMemos.length === 0 ? (
        <p className="text-gray-500 italic">No memos in progress yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="border-b px-4 py-2">Title</th>
              <th className="border-b px-4 py-2">Stage</th>
              <th className="border-b px-4 py-2">Last Updated</th>
              <th className="border-b px-4 py-2">Priority</th>
              <th className="border-b px-4 py-2">Change Stage</th>
            </tr>
          </thead>
          <tbody>
            {sortedMemos.map((memo, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{memo.title}</td>
                <td className="border-b px-4 py-2">{memo.stage}</td>
                <td className="border-b px-4 py-2">
                  {new Date(memo.lastUpdated).toLocaleDateString()}
                </td>
                <td className="border-b px-4 py-2 font-semibold">
                  {getPriorityScore(memo).toFixed(1)}
                </td>
                <td className="border-b px-4 py-2 space-y-1">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStage(i, s)}
                      className={`text-sm px-2 py-1 rounded ${
                        memo.stage === s
                          ? 'bg-blue-600 text-white'
                          : 'text-blue-600 hover:underline'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemoTracker;
