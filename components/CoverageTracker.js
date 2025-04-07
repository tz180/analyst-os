import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const REASONS = ['Valuation', 'Management', 'Outlook', 'Competition', 'Not a Fit'];

const CoverageTracker = () => {
  const hasMounted = useHasMounted();
  const [companies, setCompanies] = useLocalStorage('coverage', []);
  const [passList, setPassList] = useLocalStorage('passList', []);
  const [newCompany, setNewCompany] = useState('');

  if (!hasMounted) return null;

  const addCompany = () => {
    if (!newCompany.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setCompanies([
      ...companies,
      {
        name: newCompany,
        lastModelUpdate: today,
        lastMemoDate: today,
        status: 'Pipeline'
      }
    ]);
    setNewCompany('');
  };

  const updateField = (index, field, value) => {
    const updated = [...companies];
    updated[index][field] = value;
    setCompanies(updated);
  };

  const dropCompany = (index, reason) => {
    const removed = companies[index];
    setPassList([
      ...passList,
      {
        name: removed.name,
        reason,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    const remaining = companies.filter((_, i) => i !== index);
    setCompanies(remaining);
  };

  const calculateDaysSince = (dateStr) => {
    const now = new Date();
    const past = new Date(dateStr);
    return Math.floor((now - past) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white border shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Coverage Tracker</h2>

      <div className="flex items-center gap-2">
        <input
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add company..."
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={addCompany}
        >
          Add
        </button>
      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            <th className="border-b px-4 py-2">Company</th>
            <th className="border-b px-4 py-2">Last Model Update</th>
            <th className="border-b px-4 py-2">Last Memo Date</th>
            <th className="border-b px-4 py-2">Status</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, i) => {
            const modelStale = calculateDaysSince(c.lastModelUpdate) > 90;
            return (
              <tr key={i} className={modelStale ? 'bg-red-50' : 'hover:bg-gray-50'}>
                <td className="border-b px-4 py-2">{c.name}</td>
                <td className="border-b px-4 py-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={c.lastModelUpdate}
                    onChange={(e) => updateField(i, 'lastModelUpdate', e.target.value)}
                  />
                </td>
                <td className="border-b px-4 py-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={c.lastMemoDate}
                    onChange={(e) => updateField(i, 'lastMemoDate', e.target.value)}
                  />
                </td>
                <td className="border-b px-4 py-2">{c.status}</td>
                <td className="border-b px-4 py-2 space-y-1 space-x-1">
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => updateField(i, 'status', 'Active')}
                  >
                    Active
                  </button>
                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() => updateField(i, 'status', 'Pipeline')}
                  >
                    Pipeline
                  </button>
                  <select
                    className="border text-gray-600 px-1 py-1 rounded"
                    onChange={(e) => dropCompany(i, e.target.value)}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Drop ⬇
                    </option>
                    {REASONS.map((r, idx) => (
                      <option key={idx} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {passList.length > 0 && (
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📁 Passed List</h3>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="border-b px-4 py-2">Company</th>
                <th className="border-b px-4 py-2">Reason</th>
                <th className="border-b px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {passList.map((p, i) => (
                <tr key={i}>
                  <td className="border-b px-4 py-2">{p.name}</td>
                  <td className="border-b px-4 py-2">{p.reason}</td>
                  <td className="border-b px-4 py-2">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoverageTracker;
