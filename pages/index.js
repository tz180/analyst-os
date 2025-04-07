import CoverageTracker from '../components/CoverageTracker';
import PipelineManager from '../components/PipelineManager';
import Dashboard from '../components/Dashboard';
import DailyCheckIn from '../components/DailyCheckIn';
import MemoTracker from '../components/MemoTracker';
import MomentumLog from '../components/MomentumLog';


export default function Home() {
  return (
    <main className="p-4 space-y-8">
      <CoverageTracker />
      <PipelineManager />
      <Dashboard />
      <DailyCheckIn />
      <MemoTracker />
      <MomentumLog />
    </main>
  );
}
