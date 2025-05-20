import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, MenuItem,
  FormControl, InputLabel, Select, Card, CardContent, Grid, List, ListItem, ListItemButton
} from '@mui/material';
import '../styles/NotesPage.css';

const mockNotes = [
  {
    subject: 'Math',
    chapters: [
      {
        chapter: 'Algebra',
        notes: [
          { type: 'text', content: 'Algebra notes here...' },
          { type: 'file', filename: 'algebra.pdf' }
        ]
      },
      {
        chapter: 'Calculus',
        notes: [
          { type: 'text', content: 'Calculus notes here...' }
        ]
      }
    ]
  },
  {
    subject: 'Physics',
    chapters: [
      {
        chapter: 'Mechanics',
        notes: [
          { type: 'file', filename: 'mechanics.docx' }
        ]
      }
    ]
  }
];

const NotesPage = () => {
  // Form state
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [noteType, setNoteType] = useState('');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Display state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Replace mockNotes with your fetched notes from backend
  const notesData = mockNotes;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to backend
    setSubmitted(true);
  };

  // Find chapters for selected subject
  const chapters = selectedSubject
    ? notesData.find(s => s.subject === selectedSubject)?.chapters || []
    : [];

  // Find notes for selected chapter
  const notes = selectedChapter
    ? chapters.find(c => c.chapter === selectedChapter)?.notes || []
    : [];

  return (
    <Grid container spacing={2} className="notes-grid" direction="row-reverse">
      {/* Right: Form */}
      <Grid item xs={12} md={4} className="notes-form-section">
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Add Note
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
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
        </Box>
      </Grid>

      {/* Left: Notes Display */}
      <Grid item xs={12} md={8} className="notes-display-section">
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Your Notes
          </Typography>
          <Grid container spacing={2}>
            {/* Subjects */}
            {notesData.map((subjectObj) => (
              <Grid item xs={12} sm={6} md={4} key={subjectObj.subject}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedSubject === subjectObj.subject ? '#e3f2fd' : 'white'
                  }}
                  onClick={() => {
                    setSelectedSubject(subjectObj.subject);
                    setSelectedChapter(null);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{subjectObj.subject}</Typography>
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
                  <ListItem key={ch.chapter} disablePadding>
                    <ListItemButton
                      selected={selectedChapter === ch.chapter}
                      onClick={() => setSelectedChapter(ch.chapter)}
                    >
                      <Typography>{ch.chapter}</Typography>
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
                  <ListItem key={idx}>
                    {note.type === 'text' ? (
                      <Paper sx={{ p: 2, width: '100%' }}>{note.content}</Paper>
                    ) : (
                      <Button variant="outlined">{note.filename}</Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotesPage;