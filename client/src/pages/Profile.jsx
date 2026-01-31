import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { FaCamera, FaSignOutAlt, FaTrash, FaList, FaHeart, FaPlusCircle, FaEdit } from "react-icons/fa";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      () => {
        setFileUploadError(true);
        setSuccessMessage("");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false);
          setSuccessMessage("Profile picture updated!");
          setTimeout(() => setSuccessMessage(""), 5000);
        });
      }
    );
  };

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 5000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent.")) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) return console.log(data.message);

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      setSuccessMessage("Listing removed.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-beige-primary min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start animate-fade-in">

        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-8 text-center relative overflow-hidden" hover={false}>
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-brand"></div>
            <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />

            <div className="relative inline-block mt-8">
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-white shadow-xl hover:opacity-90 transition-all"
              />
              <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-100 pointer-events-none">
                <FaCamera className="text-purple-600 text-xs" />
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{currentUser.username}</h2>
              <p className="text-slate-500 font-medium">{currentUser.email}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link to="/favorites" className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 group hover:bg-red-100 transition-all">
                <div className="flex items-center gap-3">
                  <FaHeart className="text-red-500 group-hover:scale-125 transition-transform" />
                  <span className="font-bold text-red-700">My Favorites</span>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-lg text-xs font-black text-red-500 shadow-sm border border-red-100">
                  {currentUser.favorites?.length || 0}
                </span>
              </Link>

              <button onClick={handleSignOut} className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200 hover:bg-slate-200 transition-all text-slate-700 font-bold">
                <FaSignOutAlt /> Sign Out
              </button>

              <button onClick={handleDeleteUser} className="text-xs font-bold text-red-400 hover:text-red-600 hover:underline pt-2 transition-colors">
                Close Account
              </button>
            </div>
          </GlassCard>

          <Link to="/create-listing" className="flex items-center justify-center gap-3 w-full modern-btn py-5 rounded-3xl font-black text-lg shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest">
            <FaPlusCircle /> List a Property
          </Link>
        </div>

        {/* Settings & Listings Area */}
        <div className="lg:col-span-2 space-y-12">
          <GlassCard className="p-10" hover={false}>
            <div className="flex items-center gap-3 mb-8 border-b border-black/5 pb-6">
              <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><FaEdit /></div>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h3>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  className="modern-input w-full"
                  id="username"
                  defaultValue={currentUser.username}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="email"
                  className="modern-input w-full"
                  id="email"
                  defaultValue={currentUser.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Update Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="modern-input w-full"
                  id="password"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  disabled={loading}
                  className="modern-btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg uppercase tracking-wider"
                >
                  {loading ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>

            {(error || updateSuccess || successMessage) && (
              <div className="mt-8">
                {error && <p className="p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm text-center">{error}</p>}
                {updateSuccess && <p className="p-4 bg-green-50 text-green-600 rounded-2xl font-bold text-sm text-center">Settings saved successfully!</p>}
                {successMessage && <p className="p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm text-center">{successMessage}</p>}
              </div>
            )}
          </GlassCard>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><FaList /></div>
                <h4 className="text-2xl font-bold text-slate-800 tracking-tight">My Property Listings</h4>
              </div>
              <button
                onClick={handleShowListings}
                className="text-sm font-black text-purple-600 hover:text-purple-800 uppercase tracking-widest border-b-2 border-purple-200 pb-0.5 transition-colors"
              >
                Refresh List
              </button>
            </div>

            {userListings && userListings.length > 0 ? (
              <div className="grid gap-4">
                {userListings.map((listing) => (
                  <GlassCard key={listing._id} className="p-4 group" hover={true}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Link to={`/listing/${listing._id}`}>
                          <img
                            src={listing.imageUrls[0]}
                            alt="Listing"
                            className="h-20 w-20 object-cover rounded-2xl border border-black/5"
                          />
                        </Link>
                        <div>
                          <Link to={`/listing/${listing._id}`}>
                            <p className="font-bold text-slate-800 hover:text-purple-600 transition-colors line-clamp-1">{listing.name}</p>
                          </Link>
                          <p className="text-xs font-bold text-gold-accent mt-0.5 uppercase tracking-widest">₹{listing.regularPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/update-listing/${listing._id}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleListingDelete(listing._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="bg-white/40 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No listings found yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
