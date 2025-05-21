import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, MenuItem,
  FormControl, InputLabel, Select, Card, CardContent, Grid, List, ListItem, ListItemButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getNotes, addTextNote, addFileNote, deleteNote } from '../api/Noteapi';
import '../styles/NotesPage.css';

const NotesPage = ({ userId }) => {
  const theme = useTheme();

  // Form state
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [noteType, setNoteType] = useState('');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Notes state
  const [notesData, setNotesData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes(userId);
      setNotesData(res.data);
    } catch (err) {
      setNotesData([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (noteType === "text") {
        await addTextNote({
          studentId: userId,
          subject,
          chapter,
          type: "text",
          content: text,
        });
      } else if (noteType === "file" && file) {
        const formData = new FormData();
        formData.append("studentId", userId);
        formData.append("subject", subject);
        formData.append("chapter", chapter);
        formData.append("type", "file");
        formData.append("file", file);
        await addFileNote(formData);
      }
      setSubject('');
      setChapter('');
      setNoteType('');
      setFile(null);
      setText('');
      setSubmitted(true);
      fetchNotes();
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      setSubmitted(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      // Optionally show error
    }
  };

  // Group notes by subject and chapter for display
  const groupedNotes = notesData.reduce((acc, note) => {
    if (!acc[note.subject]) acc[note.subject] = {};
    if (!acc[note.subject][note.chapter]) acc[note.subject][note.chapter] = [];
    acc[note.subject][note.chapter].push(note);
    return acc;
  }, {});

  const subjects = Object.keys(groupedNotes);
  const chapters =
    selectedSubject && groupedNotes[selectedSubject]
      ? Object.keys(groupedNotes[selectedSubject])
      : [];
  const notes =
    selectedSubject &&
    selectedChapter &&
    groupedNotes[selectedSubject] &&
    groupedNotes[selectedSubject][selectedChapter]
      ? groupedNotes[selectedSubject][selectedChapter]
      : [];

  return (
    <Box className="notes-page-root">
      <Grid container className="notes-grid" spacing={0}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper className="notes-form-section" elevation={3}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Add Note
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <FormControl fullWidth required margin="normal">
                <InputLabel>Type of Notes</InputLabel>
                <Select
                  value={noteType}
                  label="Type of Notes"
                  onChange={(e) => setNoteType(e.target.value)}
                >
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
              </FormControl>
              {noteType === 'file' && (
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    required={noteType === 'file'}
                  />
                </Button>
              )}
              {noteType === 'text' && (
                <TextField
                  label="Notes"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={!subject || !chapter || !noteType || (noteType === 'file' && !file) || (noteType === 'text' && !text)}
              >
                Submit
              </Button>
            </form>
            {submitted && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                Note submitted successfully!
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Notes Display Section */}
        <Grid item xs={12} md={6}>
          <Paper className="notes-display-section" elevation={2}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Your Notes
            </Typography>
            <Grid container spacing={2}>
              {/* Subjects */}
              {subjects.map((subjectName) => (
                <Grid item xs={12} sm={6} md={4} key={subjectName}>
                  <Card
                    className={`subject-card${selectedSubject === subjectName ? " selected" : ""}`}
                    onClick={() => {
                      setSelectedSubject(subjectName);
                      setSelectedChapter(null);
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{subjectName}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Chapters */}
            {selectedSubject && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Chapters in {selectedSubject}
                </Typography>
                <List>
                  {chapters.map((ch) => (
                    <ListItem key={ch} disablePadding>
                      <ListItemButton
                        selected={selectedChapter === ch}
                        onClick={() => setSelectedChapter(ch)}
                      >
                        <Typography>{ch}</Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Notes */}
            {selectedChapter && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Notes in {selectedChapter}
                </Typography>
                <List>
                  {notes.map((note, idx) => (
                    <ListItem key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {note.type === 'text' ? (
                        <Paper sx={{ p: 2, width: '100%' }}>{note.content}</Paper>
                      ) : (
                        <a
                          href={`/api/notes/download/${note._id}`}
                          download={note.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="outlined">{note.filename}</Button>
                        </a>
                      )}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(note._id)}
                        sx={{ ml: 2 }}
                      >
                        Delete
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotesPage;
