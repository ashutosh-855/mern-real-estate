import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import HypeBanner from "../components/HypeBanner";
import { FaArrowRight, FaHome, FaPercent, FaHandshake } from "react-icons/fa";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        const listings = Array.isArray(data.listings) ? data.listings : (Array.isArray(data) ? data : []);
        setOfferListings(listings);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        const listings = Array.isArray(data.listings) ? data.listings : (Array.isArray(data) ? data : []);
        setRentListings(listings);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        const listings = Array.isArray(data.listings) ? data.listings : (Array.isArray(data) ? data : []);
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-beige-primary">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-100/50 rounded-l-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-100/40 rounded-r-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 px-4 py-2 rounded-full shadow-sm">
              <span className="text-purple-600 bg-purple-100 p-1 rounded-full"><FaHome className="text-sm" /></span>
              <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Premier Real Estate</span>
            </div>

            <h1 className="text-slate-800 font-extrabold text-5xl sm:text-6xl lg:text-8xl leading-[1.1] tracking-tight">
              Find your <br />
              <span className="gradient-text">Dream Home</span> <br />
              with ease.
            </h1>

            <p className="text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed">
              Doheera Estate helps you discover the most luxurious and comfortable properties across the country. Your perfect sanctuary is just a search away.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link
                to="/search"
                className="modern-btn group flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Exploring
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="flex -space-x-4 items-center">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="pl-6">
                  <p className="text-sm font-bold text-slate-800">10k+ Happy Clients</p>
                  <p className="text-xs text-slate-500">Trusted in the community</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative animate-float">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Modern House"
              className="rounded-[4rem] shadow-2xl border-8 border-white object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/40 animate-fade-in delay-300">
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 p-3 rounded-2xl text-white text-2xl"><FaHandshake /></div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">500+</p>
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Daily Listings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 bg-beige-primary">
        <HypeBanner />
      </div>

      {/* Main Sections */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-24 my-10 pb-20">

        {/* Hot Deals */}
        {offerListings && offerListings.length > 0 && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold uppercase tracking-wider">
                  <FaPercent className="text-xs" /> Best Value
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Available Offers</h2>
                <p className="text-slate-500 text-lg">Unbeatable prices for your favorite locations.</p>
              </div>
              <Link
                className="modern-btn px-8 py-3 font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                to={"/search?offer=true"}
              >
                View all offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* For Rent */}
        {rentListings && rentListings.length > 0 && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold uppercase tracking-wider">
                  Rentals
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Recent Rentals</h2>
                <p className="text-slate-500 text-lg">Modern apartments for your urban lifestyle.</p>
              </div>
              <Link
                className="modern-btn px-8 py-3 font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                to={"/search?type=rent"}
              >
                Explore rentals
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* For Sale */}
        {saleListings && saleListings.length > 0 && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold uppercase tracking-wider">
                  Properties
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Available For Sale</h2>
                <p className="text-slate-500 text-lg">Find your permanent residence and investment.</p>
              </div>
              <Link
                className="modern-btn px-8 py-3 font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                to={"/search?type=sale"}
              >
                Browse sales
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
