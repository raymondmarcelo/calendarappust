import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Login successful!');
      navigate('/calendar');
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
          <h2 className="text-xl font-bold">Log In to Calendar</h2>
          <p className="text-sm text-gray-500">Quick & Simple way to Track Your Day and Events</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            PROCEED
          </button>

          <div className="text-center text-sm mt-3">
            <Link to="/signup" className="text-blue-600 hover:underline">
              Don’t have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
