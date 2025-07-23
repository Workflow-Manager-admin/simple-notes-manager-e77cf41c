import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar list displaying all notes and allowing selection & deletion.
 * @param {Object[]} notes - list of note objects
 * @param {String} selectedId - id of currently selected note
 * @param {Function} onSelect - callback(id)
 * @param {Function} onDelete - callback(id)
 */
export default function NoteList({ notes, selectedId, onSelect, onDelete }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-title">Notes</div>
      <ul className="notes-list">
        {notes && notes.length > 0 ? notes.map(note => (
          <li
            key={note.id}
            className={selectedId === note.id ? "note-item selected" : "note-item"}
            onClick={() => onSelect(note.id)}
            tabIndex={0}
            role="button"
            aria-label={`Select note ${note.title}`}
          >
            <div className="note-title-row">
              <span className="note-title">{note.title || '(Untitled)'}</span>
              <button
                className="delete-btn"
                aria-label="Delete note"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                tabIndex={-1}
              >✕</button>
            </div>
            <div className="note-snippet">{note.content ? note.content.slice(0, 30) + (note.content.length > 30 ? '…' : '') : ''}</div>
          </li>
        )) : (
          <li className="empty">No notes yet.</li>
        )}
      </ul>
    </nav>
  );
}
