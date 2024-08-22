import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Calendar from './pages/calendar';
import Navbar from './components/navbar';
import Eachcamp from './pages/eachcamp';
import CampDetail from './components/CampDetail';
import Login from './pages/LoginPage.jsx';
import Dashboard from './pages/TrainerDashboard.jsx';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>  
        <Route path="/" element={<Login />} />
        <Route path="/camps" element={<Eachcamp />} />
        <Route path="/camps/:id" element={<CampDetail />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/trainer/:id" element={<Dashboard />} />
        <Route path="/date/:id" element={<Eachcamp />} />
      </Routes>
    </Router>
  );
}
