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
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Send, 
  Forum, 
  Message as MessageIcon,
  EmojiEmotions,
  AttachFile
} from '@mui/icons-material';
import { getAllMessages, sendMessage } from '../api/ChatForumApi';

const ChatForumsPage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  // Mock data for UI testing
  const mockMessages = [
    {
      _id: "1",
      senderId: "user1",
      senderName: "Alice Johnson",
      message: "Hey everyone! Has anyone completed the physics assignment yet?",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      _id: "2", 
      senderId: userId,
      senderName: "You",
      message: "I'm working on it right now. The thermodynamics problems are quite challenging!",
      timestamp: "2024-01-15T10:32:00Z"
    },
    {
      _id: "3",
      senderId: "user2", 
      senderName: "Bob Smith",
      message: "Same here! Question 3 is particularly tricky. Anyone want to form a study group?",
      timestamp: "2024-01-15T10:35:00Z"
    },
    {
      _id: "4",
      senderId: "user3",
      senderName: "Carol Davis",
      message: "Great idea! I'm free this afternoon. We could meet in the library.",
      timestamp: "2024-01-15T10:37:00Z"
    },
    {
      _id: "5",
      senderId: userId,
      senderName: "You", 
      message: "Count me in! What time works for everyone?",
      timestamp: "2024-01-15T10:40:00Z"
    },
    {
      _id: "6",
      senderId: "user4",
      senderName: "Dave Wilson",
      message: "How about 3 PM? I can bring my notes from the last lecture.",
      timestamp: "2024-01-15T10:42:00Z"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getAllMessages();
      setMessages(fetchedMessages);
      scrollToBottom();
    } catch (err) {
      console.log('Database error, using mock data for chat messages');
      setMessages(mockMessages);
      setError('Failed to load messages from database. Showing sample conversation.');
      console.error(err);
      scrollToBottom();
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
    <Box sx={{ p: { xs: 1, md: 2 }, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ 
        p: { xs: 2, md: 3 }, 
        mb: 2, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}>
            <Forum sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant={{ xs: 'h6', md: 'h5' }} sx={{ fontWeight: 700 }}>
              Chat Forum
            </Typography>
            <Typography variant={{ xs: 'caption', md: 'body2' }} sx={{ opacity: 0.9 }}>
              Connect and discuss with your classmates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`${messages.length} messages`} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }} 
            />
          </Box>
        </Box>
      </Paper>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
          <Typography color="error" variant="body2">{error}</Typography>
        </Paper>
      )}

      {/* Messages Container */}
      <Paper 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <List sx={{ p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <MessageIcon sx={{ fontSize: '4rem', color: '#e0e0e0', mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No messages yet
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Be the first to start the conversation!
              </Typography>
            </Box>
          ) : (
            messages.map((msg, index) => (
              <React.Fragment key={msg._id || index}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    flexDirection: msg.senderId === userId ? 'row-reverse' : 'row',
                    mb: 2
                  }}
                >
                  <Avatar 
                    sx={{
                      bgcolor: msg.senderId === userId ? '#667eea' : '#4CAF50',
                      mr: msg.senderId === userId ? 0 : { xs: 1, md: 2 },
                      ml: msg.senderId === userId ? { xs: 1, md: 2 } : 0,
                      width: { xs: 32, md: 40 },
                      height: { xs: 32, md: 40 },
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    {msg.senderName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  <Card
                    sx={{
                      maxWidth: { xs: '85%', md: '70%' },
                      bgcolor: msg.senderId === userId ? '#667eea' : '#ffffff',
                      color: msg.senderId === userId ? 'white' : '#2c3e50',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      borderRadius: 3,
                      border: msg.senderId !== userId ? '1px solid #e1e8ed' : 'none'
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1 
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            opacity: msg.senderId === userId ? 0.9 : 0.8
                          }}
                        >
                          {msg.senderName || 'Unknown User'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            opacity: 0.7,
                            fontSize: '0.7rem'
                          }}
                        >
                          {formatTimestamp(msg.timestamp)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: 'break-word',
                          lineHeight: 1.4
                        }}
                      >
                        {msg.message}
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              </React.Fragment>
            ))
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      {/* Message Input */}
      <Paper 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: { xs: 1.5, md: 2 }, 
          mt: 2,
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 2 },
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea'
              }
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" sx={{ color: '#667eea' }}>
                  <EmojiEmotions />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newMessage.trim()}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
            },
            '&:disabled': {
              background: '#e0e0e0',
              boxShadow: 'none'
            }
          }}
        >
          <Send />
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatForumsPage;