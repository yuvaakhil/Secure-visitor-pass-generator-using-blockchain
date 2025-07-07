import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Upload from './pages/Upload';
import GatePass from './pages/GatePass';
import Verify from './pages/Verify';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/gatepass/:id" element={<GatePass />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/admin" element={<Admin />} />
            

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;