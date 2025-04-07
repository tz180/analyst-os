import React, { useState } from 'react';
import Dashboard from './Dashboard';
import CoverageTracker from './CoverageTracker';
import PipelineManager from './PipelineManager';
import DailyCheckIn from './DailyCheckIn';
import MemoTracker from './MemoTracker';
import MomentumLog from './MomentumLog';

const tabs = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Discipline Engine', id: 'checkin' },
  { label: 'Coverage Tracker', id: 'coverage' },
  { label: 'Pipeline Manager', id: 'pipeline' },
  { label: 'Memo Tracker', id: 'memos' },
  { label: 'Momentum Log', id: 'momentum' }
];

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'checkin':
        return <DailyCheckIn />;
      case 'coverage':
        return <CoverageTracker />;
      case 'pipeline':
        return <PipelineManager />;
      case 'memos':
        return <MemoTracker />;
      case 'momentum':
        return <MomentumLog />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 bg-white border p-3 rounded-xl shadow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="bg-white p-6 rounded-xl shadow">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainDashboard;
