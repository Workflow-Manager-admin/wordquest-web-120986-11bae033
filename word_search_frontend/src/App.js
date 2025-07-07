import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import StatusBar from './components/StatusBar';
import WordListPanel from './components/WordListPanel';
import WordGrid from './components/WordGrid';

// --- GAME CONSTANTS AND HELPER LOGIC ---

// Example static puzzle (for demonstration, a real app would random/generate)
const WORDS = ['APPLE', 'PEAR', 'BERRY', 'PEACH', 'GRAPE'];
const GRID = [
  ['A', 'P', 'P', 'L', 'E'],
  ['G', 'R', 'A', 'P', 'E'],
  ['B', 'E', 'R', 'R', 'Y'],
  ['P', 'E', 'A', 'C', 'H'],
  ['G', 'B', 'A', 'N', 'A'],
];
// Map words to positions; for real puzzles compute this dynamically!
const SOLUTIONS = {
  APPLE: [[0,0],[0,1],[0,2],[0,3],[0,4]],
  GRAPE: [[1,0],[1,1],[1,2],[1,3],[1,4]],
  BERRY: [[2,0],[2,1],[2,2],[2,3],[2,4]],
  PEACH: [[3,0],[3,1],[3,2],[3,3],[3,4]],
  PEAR:  [[0,1],[1,1],[2,1],[3,1]],
};

// --- APP MAIN ---

// PUBLIC_INTERFACE
function App() {
  /**
   * Complete modern, minimalistic word search game app.
   * - Shows status bar (timer/score), grid, word list; supports highlight/select.
   * - Responsive and styled; supports dark/light mode via button.
   */
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(0);         // Seconds elapsed
  const [timerActive, setTimerActive] = useState(true);
  const [foundWords, setFoundWords] = useState(new Set());
  const [foundCoords, setFoundCoords] = useState([]); // For highlighting found words

  // Theme logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Timer logic
  useEffect(() => {
    let timer = null;
    if (timerActive && foundWords.size < WORDS.length) {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    if (foundWords.size === WORDS.length) {
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, foundWords]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setFoundWords(new Set());
    setFoundCoords([]);
    setTime(0);
    setTimerActive(true);
  };

  // Given: drag path (array of [row,col]), try to match any word and mark as found
  // PUBLIC_INTERFACE
  const handleWordSelect = useCallback((cellPath) => {
    // Normalize input: Should match a solution exactly (for demo)
    for (const word of WORDS) {
      const sol = SOLUTIONS[word];
      if (sol.length === cellPath.length && sol.every((coord, idx) =>
        coord[0] === cellPath[idx][0] && coord[1] === cellPath[idx][1]
      )) {
        if (!foundWords.has(word)) {
          // Mark word as found!
          setFoundWords(prev => {
            const next = new Set(prev);
            next.add(word);
            return next;
          });
          setFoundCoords(prev => [...prev, sol]);
        }
        break;
      }
    }
  }, [foundWords]);

  return (
    <div className="App">
      <StatusBar
        time={time}
        score={foundWords.size}
        onRestart={handleRestart}
      />
      <main className="main-layout">
        <div className="grid-panel">
          <WordGrid
            grid={GRID}
            onWordSelect={handleWordSelect}
            foundHighlights={foundCoords}
          />
        </div>
        <WordListPanel words={WORDS} foundWords={foundWords} />
      </main>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {foundWords.size === WORDS.length &&
        <div className="victory-banner" aria-live="polite">
          🎉 All Words Found! Score: {WORDS.length} Time: {time}s
        </div>
      }
    </div>
  );
}

export default App;
