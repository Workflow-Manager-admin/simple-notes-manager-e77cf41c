import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Editor form for creating or updating a note.
 * @param {Object} initialData - {title, content}
 * @param {Function} onSave - callback(data) called with note data
 * @param {Function} onCancel - callback()
 * @param {String} mode - 'edit' or 'create'
 */
export default function NoteEditor({ initialData = {}, onSave, onCancel, mode = "edit" }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");

  const submit = (e) => {
    e.preventDefault();
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="note-editor" onSubmit={submit}>
      <div className="editor-row">
        <input
          className="note-title-input"
          placeholder="Title"
          aria-label="Note title"
          value={title}
          maxLength={80}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
      </div>
      <div className="editor-row">
        <textarea
          className="note-content-input"
          placeholder="Type your note here…"
          aria-label="Note content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div className="editor-actions">
        <button type="submit" className="primary-btn">{mode === 'edit' ? "Save" : "Create"}</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
