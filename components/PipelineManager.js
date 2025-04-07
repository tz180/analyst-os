import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PipelineManager = () => {
  const [ideas, setIdeas] = useLocalStorage('pipeline', []);
  const [newIdea, setNewIdea] = useState('');

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
    const diff = new Date() - new Date(date);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pipeline Manager</h2>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="New idea..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addIdea}>
          Add Idea
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Idea</th>
            <th className="border px-4 py-2">Days in Pipeline</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea, index) => {
            const days = calculateDaysInPipeline(idea.dateAdded);
            const stale = days > 30;
            return (
              <tr key={index} className={stale ? 'bg-red-100' : ''}>
                <td className="border px-4 py-2">{idea.name}</td>
                <td className="border px-4 py-2">{days} days</td>
                <td className="border px-4 py-2">{idea.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="text-green-600" onClick={() => updateStatus(index, 'Active')}>
                    Move to Active
                  </button>
                  <button className="text-yellow-600" onClick={() => updateStatus(index, 'Needs Follow-Up')}>
                    Needs Follow-Up
                  </button>
                  <button className="text-gray-600" onClick={() => updateStatus(index, 'Archived')}>
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
