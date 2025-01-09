import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder components
const Home = () => (
  <div className="min-h-screen bg-whiskey-dark text-whiskey-gold flex items-center justify-center">
    <h1 className="text-4xl font-whiskey">WhiskeyWiz</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;