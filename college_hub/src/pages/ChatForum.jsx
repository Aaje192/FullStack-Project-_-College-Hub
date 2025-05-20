import React, { useEffect, useState } from 'react';

const ChatForum = () => {
  const [messages, setMessages] = useState([]);
  const [topic, setTopic] = useState('');
  const [user, setUser] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [reply, setReply] = useState({});
  const [info, setInfo] = useState('');

  // Fetch all messages for the selected topic
  useEffect(() => {
    if (topic) {
      fetch(`http://localhost:5174/api/chat?topic=${topic}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => setMessages([]));
    } else {
      setMessages([]);
    }
  }, [topic]);

  // Post a new message
  const handlePost = async () => {
    if (!topic.trim() || !newMessage.trim()) {
      setInfo('Please enter a topic and message.');
      return;
    }
    const res = await fetch('http://localhost:5174/api/ChatForumapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, user: user || 'Anonymous', text: newMessage }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      setInfo('Message posted.');
    } else {
      setInfo('Failed to post message.');
    }
  };

  // Post a reply to a message
  const handleReply = async (parentId) => {
    if (!reply[parentId] || !reply[parentId].trim()) return;
    const res = await fetch(`http://localhost:5174/api/chat/${parentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user || 'Anonymous', text: reply[parentId] }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMessages(msgs =>
        msgs.map(m => (m._id === parentId ? updated : m))
      );
      setReply(r => ({ ...r, [parentId]: '' }));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Chat Forum</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          style={{ marginRight: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Your name (optional)"
          value={user}
          onChange={e => setUser(e.target.value)}
          style={{ marginRight: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          style={{ width: 300, marginRight: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="button" onClick={handlePost} style={{ padding: '6px 16px' }}>
          Post
        </button>
        {info && <span style={{ marginLeft: 12, color: '#007bff' }}>{info}</span>}
      </div>
      <div>
        {messages.map(msg => (
          <div key={msg._id} style={{ marginBottom: 18, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
            <b>{msg.user}:</b> {msg.text}
            <div style={{ marginLeft: 16, marginTop: 8 }}>
              {msg.replies && msg.replies.map(rep => (
                <div key={rep._id} style={{ marginBottom: 6 }}>
                  <span style={{ color: '#555' }}><b>{rep.user}:</b> {rep.text}</span>
                </div>
              ))}
              <input
                type="text"
                placeholder="Reply..."
                value={reply[msg._id] || ''}
                onChange={e => setReply(r => ({ ...r, [msg._id]: e.target.value }))}
                style={{ width: 200, marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <button type="button" onClick={() => handleReply(msg._id)} style={{ padding: '4px 12px' }}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatForum;