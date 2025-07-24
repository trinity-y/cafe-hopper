import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const baseUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // dont redirect on login or signup
  const shouldRedirect = () => {
    const publicRoutes = ['/login', '/signup', '/complete-signup'];
    return !publicRoutes.includes(location.pathname);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!authInitialized) {
        setAuthInitialized(true);
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        if (shouldRedirect()) {
          navigate('/login', { replace: true });
        }
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/users/firebase/${firebaseUser.uid}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const matched = await res.json();
        if (matched) {
          setUser(matched);
          console.log('user: ', matched);
        } else {
          setUser(null);
          if (shouldRedirect()) {
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error fetching backend user:', err);
        setUser(null);
        if (shouldRedirect()) {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname, authInitialized]);

  // Additional effect to handle route changes when user is null
  useEffect(() => {
    if (authInitialized && !loading && !user && shouldRedirect()) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, authInitialized, location.pathname, navigate]);

  useEffect(() => {
    window.firebaseSignOut = () => signOut(getAuth());
    window.getCurrentUser = () => { // can use getCurrentUser() to see current user.id value
      console.log('Current user:', user);
      return user;
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userId: user?.id, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

