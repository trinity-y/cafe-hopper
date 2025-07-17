import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!authInitialized) {
        setAuthInitialized(true);  // firebase has reported auth state at least once
      }

      if (!firebaseUser) {
        // if user was set during login/signup don't clear user early
        if (authInitialized && user !== null) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const users = await res.json();
        const matched = users.find((u) => u.firebase_uid === firebaseUser.uid);

        if (matched) {
          setUser(matched);
        }
      } catch (err) {
        console.error('Error fetching backend user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [authInitialized, user]);

  // added for testing purposes; can use firebaseSignOut() in the console to test with new users
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

