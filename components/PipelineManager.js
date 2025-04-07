import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const PipelineManager = () => {
  const hasMounted = useHasMounted();
  const [ideas, setIdeas] = useLocalStorage('pipeline', []);
  const [newIdea, setNewIdea] = useState('');

  if (!hasMounted) return null;

  const addIdea = () => {
    if (!newIdea.trim()) return;
    setIdeas([
      ...ideas,
      {
        name: newIdea,
        dateAdded: new Date().toISOString(),
        status: 'Needs Follow-Up'
      }
    ]);
    setNewIdea('');
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...ideas];
    updated[index].status = newStatus;
    setIdeas(updated);
  };

  const calculateDaysInPipeline = (date) => {
    const now = new Date();
    const added = new Date(date);
    return Math.floor((now - added) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🚦 Pipeline Manager</h2>

      <div className="flex items-center gap-2">
        <input
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New idea..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={addIdea}
        >
          Add Idea
        </button>
      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            <th className="border-b px-4 py-2">Idea</th>
            <th className="border-b px-4 py-2">Days in Pipeline</th>
            <th className="border-b px-4 py-2">Status</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea, index) => {
            const days = calculateDaysInPipeline(idea.dateAdded);
            const stale = days > 30;

            return (
              <tr key={index} className={stale ? 'bg-red-50' : 'hover:bg-gray-50'}>
                <td className="border-b px-4 py-2">{idea.name}</td>
                <td className="border-b px-4 py-2">{days} days</td>
                <td className="border-b px-4 py-2">{idea.status}</td>
                <td className="border-b px-4 py-2 space-x-2">
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => updateStatus(index, 'Active')}
                  >
                    Move to Active
                  </button>
                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() => updateStatus(index, 'Needs Follow-Up')}
                  >
                    Needs Follow-Up
                  </button>
                  <button
                    className="text-gray-600 hover:underline"
                    onClick={() => updateStatus(index, 'Archived')}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PipelineManager;
