import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const CreateGroup = ({ userId, fetchGroups }) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/groups');
        setGroups(response.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    fetchAllGroups();

    socket.on('groupUpdated', (updatedGroups) => {
      setGroups(updatedGroups);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const createGroup = async () => {
    if (!groupName.trim()) {
      setError('Please provide a group name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/groups/create',
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setGroupName('');
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/groups/join',
        { groupId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError('');
      setMessage('Successfully joined the group!');
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err.response?.data?.message || 'Error joining group');
    }
  };

  return (
    <div>
      <h2>Existing Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name} ({group.members.length} members)
            <button onClick={() => joinGroup(group._id)}>Join</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <h2>Create a New Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={createGroup}>Create Group</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default CreateGroup;
