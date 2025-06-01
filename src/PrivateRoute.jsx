import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkSession();
  }, []);

  if (user === undefined) return null; // loading state
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
