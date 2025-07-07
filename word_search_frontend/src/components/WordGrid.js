import React, { useRef, useState } from 'react';

/**
 * Helper function to compute grid cell position (row, col) from a linear index.
 */
function getCellCoords(index, gridSize) {
  return { row: Math.floor(index / gridSize), col: index % gridSize };
}

/**
 * Helper to check if (row,col) is in a set of highlighted cells.
 */
function isCellHighlighted(row, col, highlights) {
  return highlights.some(([r, c]) => r === row && c === col);
}

// PUBLIC_INTERFACE
function WordGrid({ grid, onWordSelect, foundHighlights }) {
  /**
   * Renders the game letter grid and handles highlight selection.
   * Props:
   * - grid: 2D array of letters [rows][cols]
   * - onWordSelect: fn(start, end): callback when selection is finished
   * - foundHighlights: array of arrays of cell coords for already found words
   */
  const [dragStart, setDragStart] = useState(null); // {row, col} or null
  const [dragEnd, setDragEnd] = useState(null);     // {row, col} or null
  const [dragPath, setDragPath] = useState([]);     // List of [row, col]
  const gridRef = useRef(null);

  const gridSize = grid.length;

  // Mouse/touch event helpers
  function getGridCoordsFromEvent(e) {
    // Support mouse or touch
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // Compute cell
    const cellW = rect.width / gridSize;
    const cellH = rect.height / gridSize;
    const col = Math.floor(x / cellW);
    const row = Math.floor(y / cellH);
    return (row >= 0 && col >= 0 && row < gridSize && col < gridSize)
      ? { row, col }
      : null;
  }

  /** Returns the path (list of [r,c]) from start to end if in straight line; else empty. */
  function getHighlightPath(start, end) {
    if (!start || !end) return [];
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [[start.row, start.col]];
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    // Must be in a straight line
    if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return [];
    const path = [];
    for (let i = 0; i <= len; ++i) {
      path.push([start.row + i * stepR, start.col + i * stepC]);
    }
    return path;
  }

  // Mouse event handlers
  const handleMouseDown = e => {
    const coords = getGridCoordsFromEvent(e);
    if (coords) {
      setDragStart(coords);
      setDragEnd(coords);
      setDragPath([[coords.row, coords.col]]);
    }
    e.preventDefault();
  };
  const handleMouseMove = e => {
    if (dragStart) {
      const coords = getGridCoordsFromEvent(e);
      if (coords) {
        setDragEnd(coords);
        setDragPath(getHighlightPath(dragStart, coords));
      }
    }
  };
  const handleMouseUp = e => {
    if (dragStart && dragEnd) {
      const path = getHighlightPath(dragStart, dragEnd);
      if (path.length > 1) {
        onWordSelect(path);
      }
    }
    setDragStart(null);
    setDragEnd(null);
    setDragPath([]);
  };

  // Touch events delegate to mouse logic
  const handleTouchStart = handleMouseDown;
  const handleTouchMove = handleMouseMove;
  const handleTouchEnd = handleMouseUp;

  // Prepare highlights: current drag and found words
  const currentHighlightSet = new Set(dragPath.map(([r, c]) => `${r},${c}`));
  const foundHighlightsSet = new Set(
    foundHighlights.flat().map(([r, c]) => `${r},${c}`)
  );

  return (
    <div
      className="word-grid"
      ref={gridRef}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Word search grid"
      role="grid"
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="word-grid-row" role="row">
          {row.map((letter, colIdx) => {
            const key = `${rowIdx},${colIdx}`;
            const isDrag = currentHighlightSet.has(key);
            const isFound = foundHighlightsSet.has(key);
            return (
              <span
                className={
                  'word-grid-cell' +
                  (isDrag ? ' highlighted' : '') +
                  (isFound ? ' word-found' : '')
                }
                key={key}
                role="gridcell"
                aria-selected={isDrag || isFound}
              >
                {letter}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default WordGrid;
