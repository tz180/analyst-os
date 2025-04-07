import { useState } from 'react';

export default function PipelineManager() {
  const [name, setName] = useState('');
  const [ideas, setIdeas] = useState([]);

  const addIdea = () => {
    if (!name.trim()) return;
    setIdeas([...ideas, { name, stage: 'Watchlist' }]);
    setName('');
  };

  return (
    <div>
      <h2>Pipeline Manager</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Idea" />
      <button onClick={addIdea}>Add</button>
      <ul>
        {ideas.map((idea, i) => <li key={i}>{idea.name} - {idea.stage}</li>)}
      </ul>
    </div>
  );
}