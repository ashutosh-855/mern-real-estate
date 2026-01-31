import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaInfoCircle,
} from "react-icons/fa";

import "swiper/css/bundle";
import { useSelector, useDispatch } from "react-redux";
import Contact from "../components/Contact";
import GlassCard from "../components/GlassCard";
import { updateUserSuccess } from "../redux/user/userSlice";

export default function Listing() {
  const params = useParams();
  const dispatch = useDispatch();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (listing?.isUpcoming && listing?.launchDate) {
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
    }
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const isFavorite = currentUser?.favorites?.includes(listing?._id);

  const handleFavoriteToggle = async () => {
    if (!currentUser) return alert("Please sign in to save properties!");
    try {
      const res = await fetch(`/api/user/favorites/${listing._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        const updatedFavorites = data.isFavorite
          ? [...currentUser.favorites, listing._id]
          : currentUser.favorites.filter(id => id !== listing._id);
        dispatch(updateUserSuccess({ ...currentUser, favorites: updatedFavorites }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-beige-primary flex flex-col items-center justify-center gap-4">
      <Spinner />
      <p className="text-slate-500 font-bold animate-pulse">Gathering property details...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-beige-primary flex flex-col items-center justify-center gap-4">
      <div className="text-6xl text-slate-300">Oops!</div>
      <p className="text-slate-500 font-bold">Property not found or something went wrong.</p>
    </div>
  );

  return (
    <main className="bg-beige-primary min-h-screen">
      {listing && (
        <div className="animate-fade-in">
          {/* Hero Swiper */}
          <div className="relative group">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              effect={'fade'}
              className="h-[50vh] md:h-[70vh] shadow-xl hype-swiper"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Quick Actions Overlay */}
            <div className="absolute top-8 right-8 z-10 flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl hover:bg-white/80 transition-all active:scale-95"
                title="Share Property"
              >
                <FaShare className="text-slate-700" />
              </button>
              <button
                onClick={handleFavoriteToggle}
                className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl hover:bg-white/80 transition-all active:scale-95"
                title="Toggle Favorite"
              >
                {isFavorite ? <FaHeart className="text-red-500 animate-heart-beat" /> : <FaRegHeart className="text-slate-700" />}
              </button>
            </div>

            {copied && (
              <div className="absolute top-24 right-8 z-10 px-6 py-2 bg-slate-900/80 text-white rounded-full text-xs font-bold animate-fade-in backdrop-blur-md">
                Link Copied!
              </div>
            )}
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
            {/* Primary Details */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  {listing.offer && (
                    <span className="px-4 py-1.5 bg-gold-accent text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-gold-accent/20">
                      Best Value Offer
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
                  {listing.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                  <FaMapMarkerAlt className="text-purple-600" />
                  {listing.address}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { icon: <FaBed />, label: "Bedrooms", val: listing.bedrooms },
                  { icon: <FaBath />, label: "Bathrooms", val: listing.bathrooms },
                  { icon: <FaParking />, label: "Parking", val: listing.parking ? "Available" : "No" },
                  { icon: <FaChair />, label: "Furnished", val: listing.furnished ? "Yes" : "No" }
                ].map((item, idx) => (
                  <GlassCard key={idx} className="p-6 text-center space-y-2 border-none bg-white/50" hover={false}>
                    <div className="text-purple-600 text-2xl flex justify-center">{item.icon}</div>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{item.val}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  </GlassCard>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                  <FaInfoCircle className="text-purple-600 text-xl" />
                  <h3 className="text-2xl font-bold text-slate-800">Property Overview</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Price & Contact Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <GlassCard className="p-10 border-none bg-gradient-to-br from-white/80 to-purple-50/50 relative overflow-hidden" hover={false}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Asking Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-slate-800 tracking-tighter">
                        ₹{listing.offer
                          ? listing.discountPrice.toLocaleString('en-IN')
                          : listing.regularPrice.toLocaleString('en-IN')}
                      </span>
                      {listing.type === 'rent' && <span className="text-sm font-bold text-slate-500">/ month</span>}
                    </div>
                    {listing.offer && (
                      <p className="text-green-600 font-black text-sm mt-2 uppercase tracking-wide bg-green-50 inline-block px-3 py-1 rounded-lg">
                        You save ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')}!
                      </p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-black/5">
                    {listing.isUpcoming ? (
                      <div className="space-y-6">
                        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center animate-pulse">
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Launching In</p>
                          <div className="flex justify-center gap-4 text-slate-800">
                            <div className="flex flex-col">
                              <span className="text-3xl font-black">{timeLeft.days || 0}</span>
                              <span className="text-[8px] font-bold uppercase text-slate-400">Days</span>
                            </div>
                            <div className="text-3xl font-black text-slate-300">:</div>
                            <div className="flex flex-col">
                              <span className="text-3xl font-black">{timeLeft.hours || 0}</span>
                              <span className="text-[8px] font-bold uppercase text-slate-400">Hrs</span>
                            </div>
                            <div className="text-3xl font-black text-slate-300">:</div>
                            <div className="flex flex-col">
                              <span className="text-3xl font-black">{timeLeft.minutes || 0}</span>
                              <span className="text-[8px] font-bold uppercase text-slate-400">Min</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const email = prompt("Enter your email to get notified on launch!");
                            if (email) {
                              localStorage.setItem(`notify_${listing._id}`, email);
                              alert("You're on the list! We'll notify you when this property launches.");
                            }
                          }}
                          className="w-full modern-btn py-6 rounded-[2.5rem] font-black text-xl shadow-xl shadow-gold-accent/20 uppercase tracking-[0.15em] bg-gold-accent"
                        >
                          Notify Me 🔥
                        </button>
                      </div>
                    ) : !contact ? (
                      <button
                        onClick={() => setContact(true)}
                        className="w-full modern-btn py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-purple-500/20 uppercase tracking-[0.15em] hover:scale-[1.02] transition-all"
                      >
                        Contact Agent
                      </button>
                    ) : (
                      <Contact listing={listing} />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Listing ID: {listing._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Secure Trust Badges */}
              <div className="px-6 py-4 bg-white/50 rounded-3xl border border-white/60 flex items-center justify-center gap-6">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/shield-check-illustration-download-in-svg-png-gif-file-formats--verified-security-safe-protection-business-interface-pack-concept-illustrations-4848971.png" className="h-10 opacity-60 grayscale" alt="Secure" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                  Verified Listing <br /> Property Inspected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
