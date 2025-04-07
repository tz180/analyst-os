'use client';
import MainDashboard from '../components/MainDashboard';

export default function Page() {
  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow text-xl">
        ✅ Tailwind is working
      </div>
      <MainDashboard />
    </div>
  );
}
