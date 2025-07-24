import { sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import auth from '../firebase/firebase';
import { client } from './base';

const frontendUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_FRONTEND_URL : process.env.REACT_APP_PROD_FRONTEND_URL;
// const apiUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const loginFromLink = async (email, url) => {
    try {
        const result = await signInWithEmailLink(auth, email, url);
        return result.user;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const completeSignup = async (username, firebase_uid) => {
    const res = await client.post('/users/', { username, firebase_uid });
    return res.data; // the created user object
}

const handleLogin = async (email) => {
    try {
        window.localStorage.setItem('emailForSignIn', email);
        await sendSignInLinkToEmail(auth, email, {
            url: `${frontendUrl}/login`, // fill in later
            handleCodeInApp: true,
        });
        return true;
    } catch {
        return false;
    }
}

const handleSignup = async (email, username) => {
    try {
        window.localStorage.setItem('emailForSignIn', email);
        await sendSignInLinkToEmail(auth, email, {
            url: `${frontendUrl}/complete-signup?username=${encodeURIComponent(username)}`,
            handleCodeInApp: true
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const doesEmailExist = async (email) => {
    try {
        const response = await client.get('/users/emailExists', {
            params: { email },
        });
        return response.data;
    } catch (e) {
        return false;
    }
};

const validUsername = async (username) => {
    try {
        const response = await client.get('/users/usernameExists', {
            params: { username },
        });
        return !response.data; // username is valid if it doesn't exist
    } catch (e) {
        return true; // fallback to allow username if error occurs
    }
};

const authAPI = {
    handleLogin,
    handleSignup,
    loginFromLink,
    completeSignup,
    doesEmailExist,
    validUsername,
}
export default authAPI;