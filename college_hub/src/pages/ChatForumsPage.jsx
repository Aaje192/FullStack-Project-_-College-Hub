import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { getAllMessages, sendMessage } from '../api/ChatForumApi';

const ChatForumsPage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getAllMessages();
      setMessages(fetchedMessages);
      scrollToBottom();
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages every 3 seconds
    pollInterval.current = setInterval(fetchMessages, 3000);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        senderId: userId,
        message: newMessage.trim()
      });
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Student Chat Forum
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, 
          mb: 2, 
          overflow: 'auto',
          maxHeight: 'calc(100vh - 250px)',
          p: 2,
          bgcolor: '#f5f5f5'
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <React.Fragment key={msg._id || index}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  flexDirection: msg.senderId === userId ? 'row-reverse' : 'row',
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: msg.senderId === userId ? '#4a4a4a' : '#757575',
                    mr: msg.senderId === userId ? 0 : 2,
                    ml: msg.senderId === userId ? 2 : 0
                  }}
                >
                  {msg.senderName[0].toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: msg.senderId === userId ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {msg.senderName}
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(msg.timestamp)}
                      </Typography>
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        bgcolor: msg.senderId === userId ? '#e0e0e0' : '#ffffff',
                        p: 1,
                        borderRadius: 1,
                        maxWidth: '80%',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.message}
                    </Typography>
                  }
                  sx={{
                    textAlign: msg.senderId === userId ? 'right' : 'left',
                  }}
                />
              </ListItem>
              {index < messages.length - 1 && <Divider variant="middle" sx={{ bgcolor: '#e0e0e0' }} />}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Paper 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          bgcolor: '#f5f5f5'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#ffffff'
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<Send />}
          disabled={!newMessage.trim()}
          sx={{
            bgcolor: '#4a4a4a',
            '&:hover': {
              bgcolor: '#333333'
            },
            '&:disabled': {
              bgcolor: '#cccccc'
            }
          }}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatForumsPage;