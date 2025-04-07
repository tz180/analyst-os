import { useState } from 'react';

export default function DailyCheckIn() {
  const [deepWork1, setDeepWork1] = useState(false);
  const [deepWork2, setDeepWork2] = useState(false);
  const [journal, setJournal] = useState('');

  return (
    <div>
      <h2>Daily Check-In</h2>
      <label><input type="checkbox" checked={deepWork1} onChange={() => setDeepWork1(!deepWork1)} /> Deep Work Block 1</label><br />
      <label><input type="checkbox" checked={deepWork2} onChange={() => setDeepWork2(!deepWork2)} /> Deep Work Block 2</label><br />
      <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Journal entry..." />
    </div>
  );
}