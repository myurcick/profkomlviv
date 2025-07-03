import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import ProfPage from './pages/ProfPage';
import ServicesPage from './pages/ServicesPage';
import DocumentsPage from './pages/DocumentsPage';
import ContactsPage from './pages/ContactsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NewsPage from './pages/NewsPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/fuck" element={<ProfPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;