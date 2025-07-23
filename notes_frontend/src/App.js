import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

// Components
import NoteList from './components/NoteList';
import NoteDetails from './components/NoteDetails';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';

// Constants for theme/colors
const COLORS = {
  primary:  '#1976d2',
  secondary: '#424242',
  accent: '#fbc02d'
};

/**
 * PUBLIC_INTERFACE
 * Main app for the Simple Notes UI.
 * Layout: sidebar (note list), main (note detail/edit), header (search/create).
 * All note CRUD via Supabase, live search, and full theming.
 */
function App() {
  // Theme state (light only by spec, support dark for dev option)
  const [theme, setTheme] = useState('light');
  // Notes state
  const [notes, setNotes] = useState([]);
  // The "id" of the selected note (for details/main panel)
  const [selectedId, setSelectedId] = useState(null);
  // The active note object
  const selectedNote = notes.find(n => n.id === selectedId) || null;
  // Search query for header
  const [query, setQuery] = useState("");
  // Editing state: {mode: 'edit'|'create'|null, draft: {...}}
  const [editor, setEditor] = useState({ mode: null, draft: null });
  // App error message
  const [error, setError] = useState("");

  // Apply color variables on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-primary', '#fff');
    document.documentElement.style.setProperty('--bg-secondary', '#f5f7fa');
    document.documentElement.style.setProperty('--primary', COLORS.primary);
    document.documentElement.style.setProperty('--secondary', COLORS.secondary);
    document.documentElement.style.setProperty('--accent', COLORS.accent);
    document.documentElement.style.setProperty('--button-bg', COLORS.primary);
    document.documentElement.style.setProperty('--button-text', '#fff');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load notes on mount & after change
  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error && data) setNotes(data);
    else setError(error?.message || "Error loading notes");
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // CRUD actions ---------------------------------

  // PUBLIC_INTERFACE
  // Add note
  const createNote = async ({ title, content }) => {
    setError("");
    const { data, error: err } = await supabase
      .from('notes').insert([{ title, content }])
      .select().single();
    if (!err && data) {
      setNotes([data, ...notes]);
      setSelectedId(data.id);
      setEditor({ mode: null, draft: null });
    } else setError(err?.message || "Failed to create note");
  };

  // PUBLIC_INTERFACE
  // Update note
  const updateNote = async (note) => {
    setError("");
    const { data, error: err } = await supabase
      .from('notes')
      .update({ title: note.title, content: note.content })
      .eq('id', note.id)
      .select()
      .single();
    if (!err && data) {
      setNotes(notes => notes.map(n => n.id === data.id ? data : n));
      setEditor({ mode: null, draft: null });
    } else setError(err?.message || "Failed to update note");
  };

  // PUBLIC_INTERFACE
  // Delete note
  const deleteNote = async (id) => {
    setError("");
    const { error: err } = await supabase.from('notes').delete().eq('id', id);
    if (!err) {
      setNotes(notes => notes.filter(n => n.id !== id));
      if (selectedId === id) setSelectedId(null);
    } else setError(err?.message || "Failed to delete note");
  };

  // List of notes after search filter
  const filteredNotes = notes.filter(
    n =>
      n.title?.toLowerCase().includes(query.toLowerCase()) ||
      n.content?.toLowerCase().includes(query.toLowerCase())
  );
  // Sidebar selection logic: always show selection from filtered notes
  useEffect(() => {
    // If query causes selected note to be missing, deselect
    if (selectedId && !filteredNotes.some(n => n.id === selectedId)) {
      setSelectedId(filteredNotes[0]?.id || null);
    }
  }, [query, filteredNotes, selectedId]);

  // UI handlers ---------------------------------
  const triggerEdit = () => setEditor({ mode: "edit", draft: { ...selectedNote }});
  const triggerCreate = () => setEditor({ mode: "create", draft: { title: "", content: "" }});

  // Handle editor save
  const handleEditorSave = async (data) => {
    if (editor.mode === "edit") {
      await updateNote({ ...selectedNote, ...data });
    } else if (editor.mode === "create") {
      await createNote(data);
    }
  };

  // UI ---------------------------------
  return (
    <div className="notes-root" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <header className="header-bar">
        <span className="app-title">Simple Notes</span>
        <div className="header-actions">
          <SearchBar query={query} onChange={e => setQuery(e.target.value)} />
          <button className="primary-btn" onClick={triggerCreate}>+ New Note</button>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>
      <div className="main-layout">
        <NoteList
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={deleteNote}
        />
        <main className="main-content">
          {error && <div className="error-banner">{error}</div>}
          {editor.mode ? (
            <NoteEditor
              initialData={editor.mode === "create" ? {} : selectedNote}
              onSave={handleEditorSave}
              onCancel={() => setEditor({ mode: null, draft: null })}
              mode={editor.mode}
            />
          ) : (
            <NoteDetails note={selectedNote} onEdit={triggerEdit} />
          )}
        </main>
      </div>
      <footer className="footer-bar">
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Powered by Supabase</a>
      </footer>
    </div>
  );
}

export default App;
