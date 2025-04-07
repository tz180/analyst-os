import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted;
}

const PASS_REASONS = ['Valuation', 'Management', 'Outlook', 'Competition', 'Not a Fit'];

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
        status: 'Pipeline',
      },
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
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    const remaining = companies.filter((_, i) => i !== index);
    setCompanies(remaining);
  };

  const daysSince = (dateStr) => {
    const now = new Date();
    const then = new Date(dateStr);
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📊 Coverage Tracker</h2>
      </div>

      {/* Add Company */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Add new company..."
          className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
        />
        <button
          onClick={addCompany}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Active Coverage Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 border-b text-gray-600 text-left">
            <tr>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Model Update</th>
              <th className="px-4 py-2">Memo Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => {
              const stale = daysSince(c.lastModelUpdate) > 90;
              return (
                <tr key={i} className={stale ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-2 border-b font-medium">{c.name}</td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="date"
                      value={c.lastModelUpdate}
                      className="border rounded px-2 py-1 w-full max-w-[140px]"
                      onChange={(e) => updateField(i, 'lastModelUpdate', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="date"
                      value={c.lastMemoDate}
                      className="border rounded px-2 py-1 w-full max-w-[140px]"
                      onChange={(e) => updateField(i, 'lastMemoDate', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b text-sm">{c.status}</td>
                  <td className="px-4 py-2 border-b space-x-1">
                    <button
                      onClick={() => updateField(i, 'status', 'Active')}
                      className="text-green-600 hover:underline"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => updateField(i, 'status', 'Pipeline')}
                      className="text-yellow-600 hover:underline"
                    >
                      Pipeline
                    </button>
                    <select
                      defaultValue=""
                      onChange={(e) => dropCompany(i, e.target.value)}
                      className="border text-gray-600 px-1 py-1 rounded"
                    >
                      <option disabled value="">
                        Drop ⬇
                      </option>
                      {PASS_REASONS.map((r, idx) => (
                        <option key={idx} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pass List */}
      {passList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">📁 Passed List</h3>
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-50 border-b text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {passList.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{p.name}</td>
                    <td className="px-4 py-2 border-b">{p.reason}</td>
                    <td className="px-4 py-2 border-b">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageTracker;
