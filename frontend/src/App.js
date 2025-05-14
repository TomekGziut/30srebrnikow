import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import CreateGroup from './components/CreateGroup';

const App = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [view, setView] = useState('home');

  if (!token) {
    return (
      <>
        <Register />
        <Login setToken={setToken} setUserId={setUserId} />
      </>
    );
  }

  return (
    <div>
      <button onClick={() => setView('createGroup')}>Create Group</button>
      
      {view === 'createGroup' && <CreateGroup userId={userId} />}
    </div>
  );
};

export default App;
