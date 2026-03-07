import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, FileText, Image as ImageIcon, Video, File, Headphones, Archive } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Post {
  id: number;
  title: string;
  media_type: string;
  media_url: string | null;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await api.get("/api/posts/user/me");
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5 text-pink-400" />;
      case "image": return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case "blog": return <FileText className="w-5 h-5 text-green-400" />;
      case "pdf":
      case "document":
      case "spreadsheet": return <File className="w-5 h-5 text-orange-400" />;
      case "audio": return <Headphones className="w-5 h-5 text-purple-400" />;
      case "archive": return <Archive className="w-5 h-5 text-yellow-400" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-6 bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md mb-12 shadow-2xl"
      >
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-full shadow-lg">
          <div className="bg-slate-900 p-4 rounded-full">
            <User className="w-16 h-16 text-slate-300" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {user?.username || "Your Profile"}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Manage your awesome content and uploads</p>
        </div>
      </motion.div>

      {/* Posts Section */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-semibold text-slate-200">Your Published Posts</h2>
        <span className="bg-slate-800 px-4 py-1 rounded-full text-slate-300 border border-slate-700 font-medium">
          {posts.length} Total
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
          <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl text-slate-300 font-medium">You haven't posted anything yet.</h3>
          <p className="text-slate-500 mt-2 mb-6">Share your ideas, videos, and files with the world!</p>
          <Link to="/create" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-colors">
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-slate-800/60 rounded-2xl overflow-hidden hover:bg-slate-800/80 transition-all duration-300 border border-slate-700 hover:border-slate-500 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <Link to={`/post/${post.id}`} className="block p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-900 rounded-lg shadow-inner">
                    {getMediaIcon(post.media_type)}
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.media_type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-200 mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Post →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
