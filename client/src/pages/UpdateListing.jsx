import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { FaCloudUploadAlt, FaTrash, FaPlus, FaCalendarAlt, FaFire } from "react-icons/fa";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    isUpcoming: false,
    launchDate: "",
    hypeDescription: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) return console.log(data.message);

      // Format date for the input field
      if (data.launchDate) {
        data.launchDate = new Date(data.launchDate).toISOString().split('T')[0];
      }
      setFormData(data);
    };
    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload up to 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done!`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
    } else if (id === "parking" || id === "furnished" || id === "offer" || id === "isUpcoming") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-beige-primary min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">Update <span className="gradient-text">Listing</span></h1>
          <p className="text-slate-500 font-medium mt-2">Refine your property details to attract more interest</p>
        </div>

        <form onSubmit={handleFormSubmit} className="grid lg:grid-cols-2 gap-12 animate-fade-in">
          {/* Left Column: Basic Info */}
          <div className="space-y-8">
            <GlassCard className="p-8 space-y-6" hover={false}>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Property Name</label>
                <input
                  type="text"
                  placeholder="e.g. Modern 3BHK Penthouse"
                  className="modern-input w-full"
                  id="name"
                  maxLength={62}
                  minLength={10}
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  placeholder="Detailed overview of the property..."
                  className="modern-input w-full min-h-[120px]"
                  id="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                <input
                  type="text"
                  placeholder="Street, City, Zip"
                  className="modern-input w-full"
                  id="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
            </GlassCard>

            <GlassCard className="p-8 space-y-8" hover={false}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'sale', label: 'Sale', checked: formData.type === 'sale' },
                    { id: 'rent', label: 'Rent', checked: formData.type === 'rent' }
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="listingType" id={item.id} className="w-5 h-5 accent-purple-600" onChange={handleChange} checked={item.checked} />
                      <span className="font-bold text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'parking', label: 'Parking Space', checked: formData.parking },
                    { id: 'furnished', label: 'Furnished', checked: formData.furnished },
                    { id: 'offer', label: 'Special Offer', checked: formData.offer }
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" id={item.id} className="w-5 h-5 accent-purple-600 rounded" onChange={handleChange} checked={item.checked} />
                      <span className="font-bold text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-black/5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pricing (₹)</label>
                  <input type="number" id="regularPrice" min="50" max="100000000" required className="modern-input w-full" onChange={handleChange} value={formData.regularPrice} />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Base Price {formData.type === 'rent' ? '/ Month' : ''}</p>
                </div>
                {formData.offer && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-black text-green-600 uppercase tracking-widest">Offer Price (₹)</label>
                    <input type="number" id="discountPrice" min="0" max="100000000" required className="modern-input w-full border-green-200" onChange={handleChange} value={formData.discountPrice} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</label>
                  <input type="number" id="bedrooms" min="1" max="10" required className="modern-input w-full" onChange={handleChange} value={formData.bedrooms} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bathrooms</label>
                  <input type="number" id="bathrooms" min="1" max="10" required className="modern-input w-full" onChange={handleChange} value={formData.bathrooms} />
                </div>
              </div>
            </GlassCard>

            {/* Hype Section */}
            <GlassCard className="p-8 space-y-6 border-gold-accent/20 bg-gradient-brand/5" hover={false}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaFire className="text-red-500 animate-pulse" />
                  <h3 className="font-black text-slate-800 uppercase tracking-widest">Hype Banner Feature</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="isUpcoming" className="sr-only peer" checked={formData.isUpcoming} onChange={handleChange} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-accent"></div>
                </label>
              </div>

              {formData.isUpcoming && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gold-accent uppercase tracking-widest flex items-center gap-2"><FaCalendarAlt /> Launch Date</label>
                    <input type="date" id="launchDate" required className="modern-input w-full" onChange={handleChange} value={formData.launchDate} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gold-accent uppercase tracking-widest">Hype Tagline</label>
                    <input type="text" id="hypeDescription" placeholder="e.g. Premium 3BHK starting ₹50 Lac!" className="modern-input w-full" onChange={handleChange} value={formData.hypeDescription} />
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Column: Media */}
          <div className="space-y-8">
            <GlassCard className="p-8 space-y-6" hover={false}>
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <FaCloudUploadAlt className="text-blue-600 text-2xl" />
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Gallery Upload</h3>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">The first image will be your listing cover (6 images max)</p>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <input onChange={(e) => setFiles(e.target.files)} className="p-4 border border-slate-200 rounded-2xl w-full bg-white/50 text-sm font-bold" type="file" id="images" accept="image/*" multiple />
                  <button type="button" onClick={handleImageSubmit} disabled={uploading} className="p-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl font-black text-xs uppercase hover:bg-blue-100 transition-all disabled:opacity-50">
                    {uploading ? "..." : <FaPlus />}
                  </button>
                </div>
                {imageUploadError && <p className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100">{imageUploadError}</p>}

                <div className="grid grid-cols-2 gap-4 mt-2">
                  {formData.imageUrls.map((url, index) => (
                    <div key={url} className="relative group rounded-2xl overflow-hidden border border-black/5 aspect-square bg-slate-100">
                      <img src={url} alt="Listing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white p-3 rounded-full text-red-600 shadow-xl scale-75 group-hover:scale-100 transition-transform"><FaTrash /></div>
                      </button>
                      {index === 0 && <div className="absolute top-2 left-2 bg-purple-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Cover</div>}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4 pt-8">
              <button disabled={loading || uploading} className="w-full modern-btn py-6 rounded-[2.5rem] font-black text-2xl shadow-xl shadow-purple-500/20 uppercase tracking-[0.15em] hover:scale-[1.02] transition-all disabled:opacity-70">
                {loading ? "Updating listing..." : "Update Listing"}
              </button>
              {error && <p className="p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm text-center border border-red-100 animate-shake">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
