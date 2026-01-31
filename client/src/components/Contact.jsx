import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-6 animate-fade-in'>
          <div className="flex items-center gap-4">
            <img src={landlord.avatar} alt="Agent" className="h-12 w-12 rounded-full object-cover border-2 border-purple-200" />
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-tight">Agent</p>
              <p className="text-xl font-black text-slate-800">{landlord.username}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Message</label>
            <textarea
              name='message'
              id='message'
              rows='3'
              value={message}
              onChange={onChange}
              placeholder={`Hi ${landlord.username}, I'm interested in ${listing.name}...`}
              className='modern-input w-full p-4 text-sm'
            ></textarea>
          </div>

          <Link
            to={`mailto:${landlord.email}?subject=Interested in ${listing.name}&body=${message}`}
            className='modern-btn w-full py-5 rounded-2xl font-black text-lg tracking-widest text-center shadow-xl'
          >
            SEND INQUIRY ✉️
          </Link>
        </div>
      )}
    </>
  );
}


Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
