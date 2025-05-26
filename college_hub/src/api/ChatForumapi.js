import axios from 'axios';

// Get all chat messages
export const getAllMessages = async () => {
  try {
    const response = await axios.get('/api/chat/messages');
    return response.data;
  } catch (error) {
    console.error('Get messages error:', error.response || error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (payload) => {
  try {
    const response = await axios.post('/api/chat/messages', payload);
    return response.data;
  } catch (error) {
    console.error('Send message error:', error.response || error);
    throw error;
  }
};