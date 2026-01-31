import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import GlassCard from "../components/GlassCard";
import { FaHeart, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/user/favorites/get");
                const data = await res.json();
                setFavorites(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="bg-beige-primary min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/profile" className="p-3 bg-white/60 rounded-2xl border border-black/5 hover:bg-white transition-colors">
                        <FaChevronLeft className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
                            Your Saved <span className="gradient-text">Favorites</span>
                            <FaHeart className="text-red-500 text-3xl animate-heart-beat" />
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Properties you've saved for later</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Spinner />
                        <p className="text-slate-500 font-medium">Loading your favorites...</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-32 bg-white/40 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-300 text-5xl mx-auto mb-6">
                            <FaHeart />
                        </div>
                        <p className="text-2xl font-bold text-slate-700">You haven't saved any properties yet.</p>
                        <p className="text-slate-500 mt-2 font-medium">Start exploring and click the heart icon on properties you like!</p>
                        <Link to="/search">
                            <button className="modern-btn mt-8 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl">
                                Find Properties
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
                        {favorites.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
