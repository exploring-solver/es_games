import React, { useState } from 'react';

export const RoleSelector: React.FC = () => {
  const [showSpymasterView, setShowSpymasterView] = useState(false);

  return (
    <div className="role-selector">
      <button
        className={`role-btn ${showSpymasterView ? 'active' : ''}`}
        onClick={() => setShowSpymasterView(!showSpymasterView)}
      >
        {showSpymasterView ? '👁️ Spymaster View ON' : '👤 Operative View'}
      </button>

      {showSpymasterView && (
        <div className="spymaster-legend">
          <h4>Spymaster Key:</h4>
          <div className="legend-items">
            <span className="legend-item red">🔴 Your Team (9)</span>
            <span className="legend-item blue">🔵 Opponent (8)</span>
            <span className="legend-item neutral">⚪ Neutral (7)</span>
            <span className="legend-item assassin">💀 Assassin (1)</span>
          </div>
        </div>
      )}
    </div>
  );
};
