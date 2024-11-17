import { useState } from "react";

export default function ToggleList({ models, datasets }) {
  const [showModels, setShowModels] = useState(true);

  return (
    <div>
      <button onClick={() => setShowModels(true)}>Models</button>
      <button onClick={() => setShowModels(false)}>Datasets</button>
      <div>
        {showModels
          ? models.map((model) => <div key={model.id}>{model.name}</div>)
          : datasets.map((dataset) => <div key={dataset.id}>{dataset.name}</div>)}
      </div>
    </div>
  );
}
