import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Search bar for header, supports live update.
 * @param {String} query - current query value
 * @param {Function} onChange - callback(e)
 */
export default function SearchBar({ query, onChange }) {
  return (
    <input
      className="search-bar"
      type="search"
      placeholder="Search notes…"
      aria-label="Search notes"
      value={query}
      onChange={onChange}
      spellCheck={false}
      autoComplete="off"
    />
  );
}
