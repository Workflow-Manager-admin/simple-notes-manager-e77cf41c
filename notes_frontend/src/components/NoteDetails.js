import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Details panel for showing selected note content (read mode).
 * @param {Object} note
 * @param {Function} onEdit - callback()
 */
export default function NoteDetails({ note, onEdit }) {
  if (!note) return (
    <section className="main-panel empty">
      <span>Select a note to view.</span>
    </section>
  );
  return (
    <section className="main-panel">
      <div className="main-header">
        <h2>{note.title || '(Untitled)'}</h2>
        <button className="accent-btn" onClick={onEdit}>Edit</button>
      </div>
      <article className="note-content">{note.content || <em>(No content)</em>}</article>
      <div className="details-meta">
        <span className="meta-label">Edited:</span>{" "}
        {note.updated_at ? new Date(note.updated_at).toLocaleString() : '—'}
      </div>
    </section>
  );
}
