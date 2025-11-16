import React, { useEffect, useRef, useState } from 'react';
import { SeasonResult } from '../utils/ecologyEngine';

interface EventLogProps {
  lastResult: SeasonResult | null;
  seasonCount: number;
}

interface LogEntry {
  id: number;
  season: number;
  type: 'event' | 'extinction' | 'achievement' | 'change' | 'info';
  message: string;
  icon: string;
  timestamp: Date;
}

export const EventLog: React.FC<EventLogProps> = ({ lastResult, seasonCount }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'events' | 'species' | 'achievements'>('all');
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(0);

  // Process new results and add to logs
  useEffect(() => {
    if (!lastResult) return;

    const newLogs: LogEntry[] = [];

    // Add environmental events
    lastResult.events.forEach(eventOccurrence => {
      if (eventOccurrence.isNew) {
        newLogs.push({
          id: logIdCounter.current++,
          season: seasonCount,
          type: 'event',
          message: eventOccurrence.message,
          icon: eventOccurrence.event.icon,
          timestamp: new Date()
        });
      }
    });

    // Add extinctions
    lastResult.extinctions.forEach(speciesName => {
      newLogs.push({
        id: logIdCounter.current++,
        season: seasonCount,
        type: 'extinction',
        message: `${speciesName} has gone extinct!`,
        icon: '💀',
        timestamp: new Date()
      });
    });

    // Add achievements
    lastResult.achievements.forEach(achievement => {
      newLogs.push({
        id: logIdCounter.current++,
        season: seasonCount,
        type: 'achievement',
        message: `${achievement.name}: ${achievement.description}`,
        icon: achievement.icon,
        timestamp: new Date()
      });
    });

    // Add significant population changes
    lastResult.changes.forEach(change => {
      if (Math.abs(change.percentChange) > 50) {
        const direction = change.change > 0 ? 'increased' : 'decreased';
        newLogs.push({
          id: logIdCounter.current++,
          season: seasonCount,
          type: 'change',
          message: `${change.speciesName} population ${direction} by ${Math.abs(change.percentChange).toFixed(0)}% (${change.reason})`,
          icon: change.change > 0 ? '📈' : '📉',
          timestamp: new Date()
        });
      }
    });

    if (newLogs.length > 0) {
      setLogs(prev => [...prev, ...newLogs].slice(-100)); // Keep last 100 logs
    }
  }, [lastResult, seasonCount]);

  // Auto-scroll to bottom when new logs added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'events') return log.type === 'event';
    if (filter === 'species') return log.type === 'extinction' || log.type === 'change';
    if (filter === 'achievements') return log.type === 'achievement';
    return true;
  });

  // Get log color
  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'event': return '#3498db';
      case 'extinction': return '#e74c3c';
      case 'achievement': return '#f39c12';
      case 'change': return '#9b59b6';
      case 'info': return '#95a5a6';
      default: return '#34495e';
    }
  };

  // Clear logs
  const clearLogs = () => {
    if (confirm('Clear all log entries?')) {
      setLogs([]);
    }
  };

  return (
    <div className="event-log">
      <style>{`
        .event-log {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          height: 400px;
          display: flex;
          flex-direction: column;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .log-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .log-controls {
          display: flex;
          gap: 8px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 6px 12px;
          border: none;
          background: #ecf0f1;
          color: #7f8c8d;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #3498db;
          color: white;
        }

        .filter-btn:hover:not(.active) {
          background: #bdc3c7;
        }

        .clear-btn {
          padding: 6px 12px;
          border: none;
          background: #e74c3c;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .clear-btn:hover {
          background: #c0392b;
        }

        .log-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
        }

        .log-entry {
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          background: #f8f9fa;
          border-left: 4px solid;
          animation: slideIn 0.3s ease-out;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .log-entry:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .log-header-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .log-icon {
          font-size: 1.2rem;
        }

        .log-season {
          font-size: 0.75rem;
          color: #7f8c8d;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .log-time {
          font-size: 0.7rem;
          color: #95a5a6;
          margin-left: auto;
        }

        .log-message {
          font-size: 0.9rem;
          color: #2c3e50;
          line-height: 1.4;
          margin-left: 32px;
        }

        .empty-log {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #95a5a6;
        }

        .empty-log-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .empty-log-text {
          font-size: 1rem;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #bdc3c7;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #95a5a6;
        }

        .log-stats {
          display: flex;
          gap: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 0.85rem;
        }

        .log-stat {
          color: #7f8c8d;
        }

        .log-stat strong {
          color: #2c3e50;
          margin-left: 4px;
        }
      `}</style>

      <div className="log-header">
        <h2 className="log-title">Event Log</h2>
        <div className="log-controls">
          <button className="clear-btn" onClick={clearLogs}>
            Clear
          </button>
        </div>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({logs.length})
        </button>
        <button
          className={`filter-btn ${filter === 'events' ? 'active' : ''}`}
          onClick={() => setFilter('events')}
        >
          Events ({logs.filter(l => l.type === 'event').length})
        </button>
        <button
          className={`filter-btn ${filter === 'species' ? 'active' : ''}`}
          onClick={() => setFilter('species')}
        >
          Species ({logs.filter(l => l.type === 'extinction' || l.type === 'change').length})
        </button>
        <button
          className={`filter-btn ${filter === 'achievements' ? 'active' : ''}`}
          onClick={() => setFilter('achievements')}
        >
          Achievements ({logs.filter(l => l.type === 'achievement').length})
        </button>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-log">
          <div className="empty-log-icon">📋</div>
          <div className="empty-log-text">
            {logs.length === 0
              ? 'No events yet. Start the simulation to see what happens!'
              : 'No events match the current filter.'}
          </div>
        </div>
      ) : (
        <div className="log-list">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="log-entry"
              style={{ borderLeftColor: getLogColor(log.type) }}
            >
              <div className="log-header-line">
                <span className="log-icon">{log.icon}</span>
                <span className="log-season">Season {log.season}</span>
                <span className="log-time">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="log-message">{log.message}</div>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}

      <div className="log-stats">
        <span className="log-stat">
          Total Events: <strong>{logs.filter(l => l.type === 'event').length}</strong>
        </span>
        <span className="log-stat">
          Extinctions: <strong>{logs.filter(l => l.type === 'extinction').length}</strong>
        </span>
        <span className="log-stat">
          Achievements: <strong>{logs.filter(l => l.type === 'achievement').length}</strong>
        </span>
      </div>
    </div>
  );
};
