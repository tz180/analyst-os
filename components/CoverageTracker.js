import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const defaultCompanies = [
  { name: 'Apple', lastModelUpdate: '2024-12-15', lastMemoDate: '2024-12-20', status: 'Active' },
  { name: 'Tesla', lastModelUpdate: '2024-11-01', lastMemoDate: '2024-12-01', status: 'Pipeline' },
];

const CoverageTracker = () => {
  const [companies, setCompanies] = useLocalStorage('coverage', defaultCompanies);
  const [newCompany, setNewCompany] = useState('');

  const addCompany = () => {
    if (!newCompany.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setCompanies([...companies, {
      name: newCompany,
      lastModelUpdate: today,
      lastMemoDate: today,
      status: 'Pipeline'
    }]);
    setNewCompany('');
  };

  const updateStatus = (index, status) => {
    const updated = [...companies];
    updated[index].status = status;
    setCompanies(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Coverage Tracker</h2>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Add company..."
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addCompany}>
          Add
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Last Model Update</th>
            <th className="border px-4 py-2">Last Memo Date</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, i) => {
            const daysSinceUpdate = Math.floor((new Date() - new Date(c.lastModelUpdate)) / (1000 * 60 * 60 * 24));
            const stale = daysSinceUpdate > 90;

            return (
              <tr key={i} className={stale ? 'bg-red-100' : ''}>
                <td className="border px-4 py-2">{c.name}</td>
                <td className="border px-4 py-2">{c.lastModelUpdate}</td>
                <td className="border px-4 py-2">{c.lastMemoDate}</td>
                <td className="border px-4 py-2">{c.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => updateStatus(i, 'Active')} className="text-green-600">Active</button>
                  <button onClick={() => updateStatus(i, 'Pipeline')} className="text-yellow-600">Pipeline</button>
                  <button onClick={() => updateStatus(i, 'Dropped')} className="text-gray-600">Dropped</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoverageTracker;
