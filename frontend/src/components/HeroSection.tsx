
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-white text-center px-4"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <motion.h1
        className="text-6xl md:text-7xl font-bold drop-shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Content Hub
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl mt-4 max-w-2xl drop-shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        A place to share blogs, videos, and ideas with the world. Inspire and be inspired.
      </motion.p>

      <motion.button
        className="mt-8 bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Learn Now
      </motion.button>
    </section>
  );
};

export default HeroSection;
