import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const stages = ['Started', 'In Draft', 'Sent', 'Stalled'];

const MemoTracker = () => {
  const [memos, setMemos] = useLocalStorage('memos', []);
  const [newMemo, setNewMemo] = useState('');

  const addMemo = () => {
    if (!newMemo.trim()) return;
    const today = new Date().toISOString();
    setMemos([...memos, {
      title: newMemo,
      stage: 'Started',
      lastUpdated: today
    }]);
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
    score += Math.min(ageDays / 5, 5); // add more weight for older items
    return score;
  };

  const sortedMemos = [...memos].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Memo / Model Tracker</h2>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="New memo or model title..."
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addMemo}>
          Add
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Stage</th>
            <th className="border px-4 py-2">Last Updated</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMemos.map((memo, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{memo.title}</td>
              <td className="border px-4 py-2">{memo.stage}</td>
              <td className="border px-4 py-2">{new Date(memo.lastUpdated).toLocaleDateString()}</td>
              <td className="border px-4 py-2 font-semibold">
                {getPriorityScore(memo).toFixed(1)}
              </td>
              <td className="border px-4 py-2 space-x-2">
                {stages.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStage(i, s)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {s}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemoTracker;
