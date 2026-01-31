import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaFire, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlassCard from "./GlassCard";

const CountdownItem = ({ label, value }) => (
    <div className="flex flex-col items-center gap-1">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-lg">
            {value}
        </div>
        <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">{label}</span>
    </div>
);

const UpcomingSlide = ({ listing }) => {
    const [timeLeft, setTimeLeft] = useState({});
    const defaultImg = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200';

    useEffect(() => {
        const timer = setInterval(() => {
            const distance = new Date(listing.launchDate) - new Date();
            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({});
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [listing.launchDate]);

    return (
        <div className="h-full w-full relative group overflow-hidden">
            {/* Background Image with Fallback */}
            <img
                src={listing.imageUrls[0] || defaultImg}
                alt={listing.name}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                loading="lazy"
            />

            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <GlassCard className="p-8 md:p-12 max-w-4xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-fade-in relative z-10">
                    <div className="flex flex-col items-center gap-6">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-600/90 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl transform -rotate-1">
                            <FaFire className="animate-pulse" /> Trending Launch
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                {listing.hypeDescription || listing.name}
                            </h2>
                            <p className="text-white/90 font-bold text-lg md:text-xl flex items-center justify-center gap-2 drop-shadow-md">
                                <FaCalendarAlt className="text-gold-accent" />
                                Launching on {new Date(listing.launchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 md:gap-8 py-4">
                            <CountdownItem label="Days" value={timeLeft.days ?? 0} />
                            <CountdownItem label="Hrs" value={timeLeft.hours ?? 0} />
                            <CountdownItem label="Min" value={timeLeft.minutes ?? 0} />
                            <CountdownItem label="Sec" value={timeLeft.seconds ?? 0} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    const email = prompt("Enter your email for exclusive launch access!");
                                    if (email) alert("Success! You'll be the first to know.");
                                }}
                                className="bg-gold-accent text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all active:scale-95"
                            >
                                Get Notified
                            </button>
                            <Link
                                to={`/listing/${listing._id}`}
                                className="px-10 py-4 bg-gradient-brand text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20"
                            >
                                View Detail <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default function HypeBanner() {
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const res = await fetch("/api/listing/getUpcoming");
                const data = await res.json();
                setUpcoming(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchUpcoming();
    }, []);

    if (loading || upcoming.length === 0) return null;

    return (
        <div className="w-full h-[600px] md:h-[750px] bg-slate-900 relative overflow-hidden">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                autoplay={{ delay: 7000, disableOnInteraction: false }}
                navigation
                pagination={{ clickable: true }}
                loop={upcoming.length > 1}
                className="h-full w-full hype-swiper"
            >
                {upcoming.map((listing) => (
                    <SwiperSlide key={listing._id}>
                        <UpcomingSlide listing={listing} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Decorative Branding */}
            <div className="absolute top-12 left-12 z-10 pointer-events-none opacity-20 hidden md:block">
                <h4 className="text-white text-9xl font-black tracking-tighter uppercase select-none">UPCOMING</h4>
            </div>
        </div>
    );
}
