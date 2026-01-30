import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top side - Hero Section */}
      <div className="hero-section flex flex-col gap-8 py-20 md:py-28 px-6 max-w-6xl mx-auto animate-fade-in">
        <div className="text-center md:text-left">
          <h1 className="text-slate-800 font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight mb-4">
            Find your next{" "}
            <span className="gradient-text">perfect</span>
            <br />
            place with ease
          </h1>

          <div className="text-gray-600 text-base sm:text-lg max-w-2xl mb-8">
            Evans Estate is the coolest and perfect place you can think of.
            <br />
            We have a wide and diverse range of properties for you to choose from.
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start">
            <Link
              to={"/search"}
              className="modern-btn group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Get Started
                <svg
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No registration required to browse</span>
            </div>
          </div>
        </div>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing, index) => (
            <SwiperSlide key={listing._id || index}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings results for offer, sale and rent */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-12 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="text-4xl">🔥</span>
                  Hot Deals & Offers
                </h2>
                <p className="text-gray-600 mt-2">Limited time special offers on premium properties</p>
              </div>
              <Link
                className="modern-btn px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                to={"/search?offer=true"}
              >
                Explore All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="text-4xl">🏠</span>
                  Available for Rent
                </h2>
                <p className="text-gray-600 mt-2">Find your perfect rental home today</p>
              </div>
              <Link
                className="modern-btn px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                to={"/search?type=rent"}
              >
                Explore All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="w-full animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="text-4xl">🏡</span>
                  Featured Properties for Sale
                </h2>
                <p className="text-gray-600 mt-2">Invest in your dream property</p>
              </div>
              <Link
                className="modern-btn px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                to={"/search?type=sale"}
              >
                Explore All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
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
