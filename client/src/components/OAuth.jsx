import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router';



export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      const res = await fetch('/api/auth/google', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })

      const data = await res.json();
      dispatch(signInSuccess(data))
      navigate('/')

    } catch (error) {
      console.log('could not sign in with google', error);
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex items-center justify-center gap-3 w-full bg-white/50 backdrop-blur-md border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all duration-300 shadow-sm"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5 w-5" />
      <span>Continue with Google</span>
    </button>
  )
}
