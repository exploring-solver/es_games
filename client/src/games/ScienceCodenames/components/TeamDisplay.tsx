import React from 'react';

interface TeamDisplayProps {
  currentTeam: 'red' | 'blue';
  redScore: number;
  blueScore: number;
  redTotal: number;
  blueTotal: number;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  currentTeam,
  redScore,
  blueScore,
  redTotal,
  blueTotal,
}) => {
  return (
    <div className="team-display">
      <div className={`team-panel red ${currentTeam === 'red' ? 'active' : ''}`}>
        <div className="team-name">🔴 Red Team</div>
        <div className="team-progress">
          <div className="progress-bar">
            <div
              className="progress-fill red"
              style={{ width: `${(redScore / redTotal) * 100}%` }}
            />
          </div>
          <div className="score-text">
            {redScore} / {redTotal}
          </div>
        </div>
      </div>

      <div className="vs-divider">VS</div>

      <div className={`team-panel blue ${currentTeam === 'blue' ? 'active' : ''}`}>
        <div className="team-name">🔵 Blue Team</div>
        <div className="team-progress">
          <div className="progress-bar">
            <div
              className="progress-fill blue"
              style={{ width: `${(blueScore / blueTotal) * 100}%` }}
            />
          </div>
          <div className="score-text">
            {blueScore} / {blueTotal}
          </div>
        </div>
      </div>
    </div>
  );
};
