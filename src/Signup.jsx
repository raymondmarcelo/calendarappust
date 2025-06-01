import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Signup successful! Check your email to confirm.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-blue-300 via-purple-300 to-yellow-200">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <img
            src="https://www.freeiconspng.com/uploads/calendar-image-png-3.png"
            alt="Calendar Icon"
            className="mx-auto w-16 mb-2"
          />
          <h2 className="text-xl font-bold">Create an Account</h2>
          <p className="text-sm text-gray-500">Sign up to start planning your day</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              id="firstName"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Your name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="•••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            CREATE ACCOUNT
          </button>

          <div className="text-center text-sm mt-3">
            <Link to="/" className="text-blue-600 hover:underline">
              Already have an account? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
