import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories on load
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen text-white w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Abstract Background matching user request */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black"></div>
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center px-4 max-w-4xl mx-auto space-y-6"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg"
          >
            Content Hub
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
            Discover and share captivating blogs, stunning images, PDFs, files, and immersive videos.
          </p>
          <div className="pt-6 flex gap-4 justify-center">
            <Link to="/blogs" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 duration-200">
              Start Reading
            </Link>
            <Link to="/videos" className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors rounded-full font-semibold border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95 duration-200">
              Explore Media
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Explore Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className="group w-full relative h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity group-hover:opacity-50"></div>
                  <span className="relative z-20 font-bold tracking-wide text-lg text-slate-300 group-hover:text-blue-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
