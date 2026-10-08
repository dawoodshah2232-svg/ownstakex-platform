import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import Legal from "./pages/Legal";
import Reporting from "./pages/Reporting";
import SubmitProject from "./pages/SubmitProject";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvestorDashboard from "./pages/InvestorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Shell><Home /></Shell>} />
          <Route path="/projects" element={<Shell><Projects /></Shell>} />
          <Route path="/projects/:slug" element={<Shell><ProjectDetail /></Shell>} />
          <Route path="/how-it-works" element={<Shell><HowItWorks /></Shell>} />
          <Route path="/about" element={<Shell><About /></Shell>} />
          <Route path="/blog" element={<Shell><Blog /></Shell>} />
          <Route path="/blog/:slug" element={<Shell><BlogPost /></Shell>} />
          <Route path="/contact" element={<Shell><Contact /></Shell>} />
          <Route path="/faqs" element={<Shell><Faqs /></Shell>} />
          <Route path="/legal" element={<Shell><Legal /></Shell>} />
          <Route path="/reporting" element={<Shell><Reporting /></Shell>} />
          <Route path="/submit-project" element={<Shell><SubmitProject /></Shell>} />
          <Route path="/login" element={<Shell><Login /></Shell>} />
          <Route path="/register" element={<Shell><Register /></Shell>} />
          <Route
            path="/investor"
            element={<Shell><ProtectedRoute roles={["investor", "admin"]}><InvestorDashboard /></ProtectedRoute></Shell>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}
          />
          <Route path="*" element={<Shell><NotFound /></Shell>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
