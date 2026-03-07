
// function App() {
//   return (
//     <div className="min-h-screen bg-gray-400 text-shadow-black">
//       <header className="flex flex-col items-center justify-start pt-10">
//         <div className="flex items-center gap-4">
//           <span className="text-6xl">📚</span>
//           <h1 className="text-7xl font-bold mr-12">Content Hub</h1>
//         </div>
//         <p className="text-2xl text-shadow-black ml-20">Share blogs, videos, and ideas with the world</p>
//         <hr className="w-3/4 border-t border-gray-600 mt-4" />
//       </header>

//       <main className="mt-20 flex justify-center text-gray-800">
//         <p>Main content will go here...</p>
//       </main>
//     </div>
//   );
// }

// export default App;
// src/App.tsx
// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import Videos from "./pages/Videos";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post/:id" element={<PostDetail />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
