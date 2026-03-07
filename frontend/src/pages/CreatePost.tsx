import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mediaType, setMediaType] = useState("blog");
    const [categoryId, setCategoryId] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            api.get("/api/categories/")
                .then(res => setCategories(res.data))
                .catch(err => console.error("Failed to load categories", err));
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("media_type", mediaType);

            if (content) formData.append("content", content);
            if (categoryId) formData.append("category_id", categoryId);
            if (subcategory.trim()) formData.append("subcategory_name", subcategory.trim());
            if (file) formData.append("file", file);

            const response = await api.post("/api/posts/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate(`/post/${response.data.id}`);
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="glass-card rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-white">Create New Post</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your post a catchy title"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Media Type</label>
                            <select
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                                value={mediaType}
                                onChange={(e) => setMediaType(e.target.value)}
                            >
                                <option value="blog">Blog (Text)</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="pdf">PDF Document</option>
                                <option value="document">Word / Text Doc</option>
                                <option value="spreadsheet">Excel / Spreadsheet</option>
                                <option value="archive">Zip / Archive</option>
                                <option value="other">Other File</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Category (Required)</label>
                            <select
                                required
                                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="" disabled>Select a Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Subcategory (Optional)</label>
                        <input
                            type="text"
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            placeholder="e.g. Programming, Software, Health (Leave empty for root category)"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Content / Description</label>
                        <textarea
                            rows={6}
                            className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts..."
                        />
                    </div>

                    {mediaType !== "blog" && (
                        <div>
                            <label className="block text-gray-300 mb-2">Upload File</label>
                            <input
                                type="file"
                                required
                                accept={
                                    mediaType === "video" ? "video/*" :
                                        mediaType === "image" ? "image/*" :
                                            mediaType === "audio" ? "audio/*" :
                                                mediaType === "pdf" ? ".pdf" :
                                                    mediaType === "document" ? ".doc,.docx,.txt" :
                                                        mediaType === "spreadsheet" ? ".xls,.xlsx,.csv" :
                                                            mediaType === "archive" ? ".zip,.rar,.tar,.gz" : "*"
                                }
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
