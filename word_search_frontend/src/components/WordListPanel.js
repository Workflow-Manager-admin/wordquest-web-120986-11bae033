import React from 'react';

// PUBLIC_INTERFACE
function WordListPanel({ words, foundWords }) {
  /**
   * Displays the sidebar panel listing target words,
   * with visual indication for found words.
   * Props:
   * - words: array of string (target word list)
   * - foundWords: set/object of found words
   */
  return (
    <aside className="word-list-panel">
      <h2>Words to Find</h2>
      <ul>
        {words.map(word => (
          <li
            key={word}
            className={foundWords.has(word) ? 'found' : ''}
            aria-checked={foundWords.has(word)}
          >
            {word}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default WordListPanel;
