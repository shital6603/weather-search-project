import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

export default function App(){
  const [city, setCity] = useState('Pune');
  return (
    <div className="app-shell">
      <Sidebar onSelectCity={setCity} />
      <main className="main-area">
        <Dashboard city={city} />
      </main>
    </div>
  );
}
