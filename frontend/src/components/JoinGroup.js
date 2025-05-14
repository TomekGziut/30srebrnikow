import React, { useState } from 'react';
import axios from 'axios';

const JoinGroup = () => {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');

  const joinGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/groups/join',
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || 'Dołączono do grupy!');
    } catch (error) {
      console.error('Błąd podczas dołączania do grupy:', error);
      setMessage(error.response?.data?.message || 'Wystąpił błąd.');
    }
  };

  return (
    <div>
      <h1>Dołącz do grupy</h1>
      <input
        type="text"
        placeholder="Wprowadź ID grupy"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <button onClick={joinGroup}>Dołącz</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinGroup;
