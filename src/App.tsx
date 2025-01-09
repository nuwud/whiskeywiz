import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder for Angular project
const Home = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <h1 className="text-4xl">WhiskeyWiz Angular</h1>
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