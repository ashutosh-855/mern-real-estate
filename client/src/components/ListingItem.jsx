import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn, MdKingBed, MdBathtub } from "react-icons/md";
import { FaTag, FaHeart, FaRegHeart } from "react-icons/fa";
import GlassCard from "./GlassCard";
import { useSelector, useDispatch } from "react-redux";
import { updateUserSuccess } from "../redux/user/userSlice";

export default function ListingItem({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const defaultImg = 'https://ysac.ca/wp-content/uploads/2023/06/Illustration-House-investment-growth-Real-estate-Property-value.webp';

  const isFavorite = currentUser?.favorites?.includes(listing?._id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please sign in to save properties!");

    try {
      const res = await fetch(`/api/user/favorites/${listing._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        // Update local user state in Redux
        const updatedFavorites = data.isFavorite
          ? [...(currentUser?.favorites || []), listing._id]
          : (currentUser?.favorites || []).filter(id => id !== listing._id);

        dispatch(updateUserSuccess({ ...currentUser, favorites: updatedFavorites }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GlassCard className="h-full relative overflow-hidden group">
      {/* Heart Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-lg transition-all active:scale-90 hover:bg-white/60"
      >
        {isFavorite ? (
          <FaHeart className="text-red-500 animate-heart-beat" />
        ) : (
          <FaRegHeart className="text-slate-600 hover:text-red-400" />
        )}
      </button>

      <Link to={`/listing/${listing._id}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={listing.imageUrls[0] || defaultImg}
            alt={`Image of ${listing.name}`}
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {listing.offer && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-fade-in shadow-red-200">
              <FaTag className="text-[10px]" /> SAVE BIG
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3 flex-grow">
          <div>
            <p className="text-xl font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
              {listing.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MdLocationOn className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <p className="text-sm text-slate-500 truncate w-full font-medium">
                {listing.address}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">
            {listing.description}
          </p>

          <div className="pt-2">
            <p className="text-gold-accent font-extrabold text-2xl flex items-baseline gap-1">
              <span className="text-sm font-bold">₹</span>
              {listing.offer
                ? (listing.discountPrice || 0).toLocaleString("en-IN")
                : (listing.regularPrice || 0).toLocaleString("en-IN")}
              {listing.type === "rent" && <span className="text-xs text-slate-400 font-bold ml-1">/ month</span>}
            </p>
          </div>

          <div className="text-slate-600 flex gap-6 mt-auto pt-4 border-t border-black/5">
            <div className="font-bold text-xs flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><MdKingBed className="text-base" /></div>
              <span>
                {listing.bedrooms} {listing.bedrooms > 1 ? `Beds` : `Bed`}
              </span>
            </div>

            <div className="font-bold text-xs flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><MdBathtub className="text-base" /></div>
              <span>
                {listing.bathrooms} {listing.bathrooms > 1 ? `Baths` : `Bath`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </GlassCard>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};