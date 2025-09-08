import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, MenuItem,
  FormControl, InputLabel, Select, Card, CardContent, 
  Grid, List, ListItem, ListItemButton, IconButton,
  Fade, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle,
  Chip, Avatar, Stack, Alert, Snackbar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as FileIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Notes as NotesIcon,
  MenuBook,
  TextSnippet,
  AttachFile,
  Download,
  Folder
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getNotes, addTextNote, addFileNote, deleteNote, downloadNote } from '../api/Noteapi';

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

  // File preview state
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewContent, setFilePreviewContent] = useState(null);

  // Viewing file state
  const [viewingFile, setViewingFile] = useState(null);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    try {
      const res = await getNotes(userId);
      setNotesData(res.data);
    } catch (err) {
      setNotesData([]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('File selected:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
      setFile(selectedFile);
    } else {
      console.log('No file selected');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (noteType === "text") {
        console.log('Submitting text note:', {
          studentId: userId,
          subject,
          chapter,
          type: "text",
          content: text,
        });
        
        await addTextNote({
          studentId: userId,
          subject,
          chapter,
          type: "text",
          content: text,
        });
      } else if (noteType === "file" && file) {
        console.log('Preparing file upload:', {
          filename: file.name,
          type: file.type,
          size: file.size
        });

        const formData = new FormData();
        formData.append("studentId", userId);
        formData.append("subject", subject);
        formData.append("chapter", chapter);
        formData.append("type", "file");
        formData.append("file", file);

        // Log FormData contents for debugging
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
        }

        console.log('Submitting file note...');
        const response = await addFileNote(formData);
        console.log('File upload response:', response);
      } else {
        throw new Error('Please select a file');
      }

      // Clear form and show success
      setSubject('');
      setChapter('');
      setNoteType('');
      setFile(null);
      setText('');
      setSubmitted(true);
      await fetchNotes();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Error submitting note:', err);
      alert('Failed to save note: ' + (err.response?.data?.message || err.message));
      setSubmitted(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      // Handle error
    }
  };

  const handleViewFile = async (id) => {
    try {
      console.log('Fetching file with id:', id);
      const response = await downloadNote(id);
      const data = response.data;
      console.log('File data received:', {
        mimeType: data.mimeType,
        filename: data.filename,
        hasContent: !!data.content
      });

      if (data.mimeType?.includes('text')) {
        // For text files, show in a dialog
        setViewingFile({
          content: data.content,
          filename: data.filename,
          mimeType: data.mimeType
        });
      } else if (data.isBase64) {
        // For PDFs and images
        const blob = base64ToBlob(data.content, data.mimeType);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
      } else {
        // For binary downloads
        const blob = new Blob([data], { type: data.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error viewing file:', err);
      alert('Failed to view file: ' + (err.response?.data?.message || err.message));
    }
  };

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Group notes by subject and chapter for display
  const groupedNotes = notesData.reduce((acc, note) => {
    if (!acc[note.subject]) acc[note.subject] = {};
    if (!acc[note.subject][note.chapter]) acc[note.subject][note.chapter] = [];
    acc[note.subject][note.chapter].push(note);
    return acc;
  }, {});

  const subjects = Object.keys(groupedNotes);
  const chapters = selectedSubject && groupedNotes[selectedSubject]
    ? Object.keys(groupedNotes[selectedSubject])
    : [];
  const notes = selectedSubject && selectedChapter && groupedNotes[selectedSubject]
    && groupedNotes[selectedSubject][selectedChapter]
    ? groupedNotes[selectedSubject][selectedChapter]
    : [];

  const FilePreviewModal = () => (
    <Dialog
      open={filePreviewOpen}
      onClose={() => setFilePreviewOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        {filePreviewContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFilePreviewOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box className="notes-page-root" sx={{ p: { xs: 1, md: 2 } }}>
      <Typography variant={{ xs: 'h5', md: 'h4' }} gutterBottom sx={{ mb: { xs: 2, md: 4 }, fontWeight: "bold", textAlign: "center" }}>
        Notes
      </Typography>
      <Grid container className="notes-grid" spacing={{ xs: 2, md: 3 }}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper className="notes-form-section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant={{ xs: 'h6', md: 'h5' }}>
              Add New Note
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                fullWidth
                required
                variant="outlined"
              />
              <FormControl fullWidth required variant="outlined">
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
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<FileIcon />}
                    fullWidth
                    sx={{
                      borderColor: file ? 'success.main' : 'primary.main',
                      color: file ? 'success.main' : 'primary.main',
                    }}
                  >
                    {file ? `Selected: ${file.name}` : 'Choose File'}
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      required
                    />
                  </Button>
                  {file && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      File type: {file.type || 'Unknown'}, Size: {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  )}
                </Box>
              )}
              {noteType === 'text' && (
                <TextField
                  label="Notes Content"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<AddIcon />}
                disabled={!subject || !chapter || !noteType || (noteType === 'file' && !file) || (noteType === 'text' && !text)}
              >
                Add Note
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Notes Display Section */}
        <Grid item xs={12} md={6}>
          <Paper className="notes-display-section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant={{ xs: 'h6', md: 'h5' }}>
              Your Notes
            </Typography>
            <Grid container spacing={{ xs: 1, md: 2 }}>
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

            {selectedSubject && (
              <Box className="chapter-list">
                <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
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

            {selectedChapter && (
              <Box className="notes-list">
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Notes in {selectedChapter}
                </Typography>
                <List>
                  {notes.map((note, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        {note.type === 'text' ? (
                          <Typography sx={{ wordBreak: 'break-word' }}>{note.content}</Typography>
                        ) : (
                          <Button
                            className="file-button"
                            onClick={() => handleViewFile(note._id)}
                            startIcon={<FileIcon />}
                            sx={{ 
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              textTransform: 'none'
                            }}
                          >
                            {note.filename}
                          </Button>
                        )}
                      </Box>
                      <Tooltip title="Delete Note">
                        <IconButton
                          className="delete-button"
                          color="error"
                          onClick={() => handleDelete(note._id)}
                          size="small"
                          sx={{ ml: 2 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Success Message */}
      <Fade in={submitted}>
        <Typography className="success-message">
          Note added successfully!
        </Typography>
      </Fade>

      <FilePreviewModal />

      {viewingFile && (
        <Dialog 
          open={!!viewingFile} 
          onClose={() => setViewingFile(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              height: '90vh',
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {viewingFile.filename}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setViewingFile(null)}
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box 
              component="pre"
              sx={{
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                m: 0,
                p: 2,
                overflowY: 'auto',
                height: '100%',
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            >
              {viewingFile.content}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default NotesPage;
