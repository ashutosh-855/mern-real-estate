import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import GlassCard from "../components/GlassCard";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 9;

  const [sidebarData, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    bedrooms: "all",
    city: "all",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const bedroomsFromUrl = urlParams.get("bedrooms");
    const cityFromUrl = urlParams.get("city");
    const pageFromUrl = parseInt(urlParams.get("page")) || 1;

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      bedroomsFromUrl ||
      cityFromUrl ||
      pageFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        bedrooms: bedroomsFromUrl || "all",
        city: cityFromUrl || "all",
      });
      setPage(pageFromUrl);
    }
    // ... fetchListings logic remains the same as it uses location.search ...

    const fetchListings = async () => {
      setLoading(true);

      const startIndex = (pageFromUrl - 1) * ITEMS_PER_PAGE;
      const fetchParams = new URLSearchParams(location.search);
      if (!fetchParams.get('limit')) fetchParams.set('limit', ITEMS_PER_PAGE);
      fetchParams.set('startIndex', startIndex);

      const query = fetchParams.toString();

      try {
        const res = await fetch(`/api/listing/get?${query}`);
        const data = await res.json();

        let resultListings = [];
        let total = 0;

        if (Array.isArray(data)) {
          resultListings = data;
        } else {
          resultListings = data.listings || [];
          total = data.totalListings || 0;
        }

        setListings(resultListings);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
      setSidebardata({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({
        ...sidebarData,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebarData, sort, order });
    }

    if (e.target.id === "bedrooms" || e.target.id === "city") {
      setSidebardata({ ...sidebarData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    urlParams.set("bedrooms", sidebarData.bedrooms);
    urlParams.set("city", sidebarData.city);
    urlParams.set("page", 1);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", newPage);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row bg-beige-primary min-h-screen">
      <div className="p-7 md:w-1/4 lg:w-1/5 animate-slide-in-left">
        <GlassCard className="p-8 sticky top-24" hover={false}>
          <div className="flex items-center gap-2 mb-8 border-b border-black/5 pb-4">
            <FaFilter className="text-purple-600" />
            <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Beach, Villa..."
                  className="modern-input w-full pl-10"
                  onChange={handleChange}
                  value={sidebarData.searchTerm}
                />
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">City</label>
              <select
                id="city"
                onChange={handleChange}
                value={sidebarData.city}
                className="modern-input w-full font-medium"
              >
                <option value="all">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">BHK (Bedrooms)</label>
              <select
                id="bedrooms"
                onChange={handleChange}
                value={sidebarData.bedrooms}
                className="modern-input w-full font-medium"
              >
                <option value="all">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK+</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Property Type</label>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Listings' },
                  { id: 'rent', label: 'For Rent' },
                  { id: 'sale', label: 'For Sale' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      id={item.id}
                      name="type"
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
                      onChange={handleChange}
                      checked={sidebarData.type === item.id}
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amenities</label>
              <div className="space-y-3">
                {[
                  { id: 'offer', label: 'Special Offers' },
                  { id: 'parking', label: 'Parking Spot' },
                  { id: 'furnished', label: 'Fully Furnished' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id={item.id}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                      onChange={handleChange}
                      checked={sidebarData[item.id]}
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sort Results</label>
              <select
                className="modern-input w-full cursor-pointer font-medium"
                name="sort_order"
                id="sort_order"
                onChange={handleChange}
                value={`${sidebarData.sort}_${sidebarData.order}`}
              >
                <option value="regularPrice_desc">Price: High to Low</option>
                <option value="regularPrice_asc">Price: Low to High</option>
                <option value="createdAt_desc">Newest Listings</option>
                <option value="createdAt_asc">Oldest Listings</option>
              </select>
            </div>

            <button className="modern-btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg">
              Apply Filters
            </button>
          </form>
        </GlassCard>
      </div>

      <div className="flex-1 p-7 md:pt-12 animate-fade-in">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Search Results
          </h1>
          {!loading && totalPages > 0 && (
            <p className="text-slate-500 font-medium">Page {page} of {totalPages}</p>
          )}
        </div>

        <div className="w-full">
          {!loading && listings.length === 0 && (
            <div className="text-center py-20 bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-2xl font-bold text-slate-400">Oops! No properties found matching your criteria.</p>
              <button
                onClick={() => navigate('/search')}
                className="mt-4 text-purple-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Spinner />
              <p className="text-slate-500 font-medium animate-pulse">Finding your perfect home...</p>
            </div>
          )}

          {!loading && listings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <div key={listing._id} className="w-full">
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 flex-wrap">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>

              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={index} className="px-2 text-slate-400 font-bold">...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-12 h-12 rounded-2xl font-bold transition-all border ${page === pageNum
                      ? 'modern-bg text-white border-transparent shadow-lg shadow-purple-200 scale-110'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-600'
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
