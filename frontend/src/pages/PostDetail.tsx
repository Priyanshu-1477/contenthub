import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayerLib from "react-player";
const ReactPlayer = ReactPlayerLib as any;
import { Download, File as FileIcon, FileText, FileSpreadsheet, Archive } from "lucide-react";
import api from "../services/api";

interface Post {
    id: number;
    title: string;
    content: string;
    media_type: string;
    media_url: string;
    created_at: string;
    author: {
        username: string;
    };
}

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Failed to load post", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
    if (!post) return <div className="text-center py-20 text-red-400">Post not found</div>;

    const streamUrl = `${api.defaults.baseURL}/api/posts/${post.id}/stream`;
    const downloadUrl = `${api.defaults.baseURL}/api/posts/${post.id}/download`;

    // Fallback UI component for non-renderable media
    const NonVisualMediaRenderer = () => {
        let Icon = FileIcon;
        if (post.media_type === "document") Icon = FileText;
        if (post.media_type === "spreadsheet") Icon = FileSpreadsheet;
        if (post.media_type === "archive") Icon = Archive;

        return (
            <div className="w-full bg-slate-800/80 rounded-2xl flex flex-col items-center justify-center py-20 shadow-xl border border-slate-700/50 mb-8 border-dashed">
                <Icon className="w-24 h-24 text-slate-500 mb-6" />
                <h3 className="text-2xl font-semibold text-slate-300 mb-2">Attached File</h3>
                <p className="text-slate-400 max-w-md text-center mb-8">
                    This post contains a {post.media_type} file. Please download it securely below to view the contents on your device.
                </p>
                <a
                    href={downloadUrl}
                    download
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-900/40 hover:scale-105 transition-transform"
                >
                    <Download size={20} />
                    Download File Instead
                </a>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            {/* Media Player Header */}
            {post.media_type === "video" && (
                <div className="w-full bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl shadow-blue-900/20 mb-8 border border-white/10 relative group">
                    <ReactPlayer
                        url={streamUrl}
                        controls
                        width="100%"
                        height="100%"
                        playing={true}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload'
                                }
                            }
                        } as any}
                    />
                </div>
            )}

            {post.media_type === "audio" && (
                <div className="w-full bg-slate-800 rounded-2xl p-6 shadow-xl mb-8 flex justify-center items-center">
                    <audio src={streamUrl} controls className="w-full max-w-2xl outline-none" autoPlay />
                </div>
            )}

            {post.media_type === "image" && post.media_url && (
                <div className="w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
                    <img src={`${api.defaults.baseURL}/${post.media_url}`} alt={post.title} className="w-full h-auto max-h-[70vh] object-cover" />
                </div>
            )}

            {post.media_type === "pdf" && post.media_url && (
                <div className="w-full rounded-2xl overflow-hidden mb-8 shadow-2xl h-[80vh] bg-slate-800 relative z-20">
                    <object data={downloadUrl} type="application/pdf" className="w-full h-full text-slate-400 pt-12 flex justify-center border-0" >
                        <p className="text-center absolute w-full top-1/2 left-0 -translate-y-1/2">
                            Your browser doesn't support built-in PDF viewing. <a href={downloadUrl} className="text-blue-400 hover:underline">Download it here</a>.
                        </p>
                    </object>
                </div>
            )}

            {["document", "spreadsheet", "archive", "other"].includes(post.media_type) && post.media_url && (
                <NonVisualMediaRenderer />
            )}

            <div className="glass-card rounded-2xl p-8">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-8">
                            <span className="bg-white/10 px-3 py-1 rounded-full">{post.media_type.toUpperCase()}</span>
                            <span>By <span className="text-blue-400 font-medium">{post.author.username}</span></span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {(post.media_type === "video" || post.media_type === "image") && (
                        <a
                            href={downloadUrl}
                            download
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1"
                        >
                            <Download size={20} />
                            Download High Quality
                        </a>
                    )}
                </div>

                <div className="prose prose-invert prose-lg max-w-none mt-4 text-gray-300">
                    {post.content ? (
                        <p className="whitespace-pre-wrap">{post.content}</p>
                    ) : (
                        <p className="italic text-gray-500">No description provided.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
