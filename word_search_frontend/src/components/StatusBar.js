import React from 'react';

// PUBLIC_INTERFACE
function StatusBar({ time, score, onRestart }) {
  /** 
   * Displays the top game status bar with timer, score, and restart button.
   * Props:
   * - time: number (seconds left or elapsed)
   * - score: number (words found)
   * - onRestart: function (callback to restart the game)
   */
  return (
    <div className="status-bar">
      <div className="sb-time" aria-label="Game timer">
        ⏰ {time}s
      </div>
      <div className="sb-title">Word Search</div>
      <div className="sb-score" aria-label="Score">
        ⭐ {score}
      </div>
      <button className="sb-restart" onClick={onRestart} aria-label="Restart Game">
        ⟳ Restart
      </button>
    </div>
  );
}

export default StatusBar;
