import { sendSignInLinkToEmail } from 'firebase/auth';
import auth from '../firebase/firebase';

const frontendUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_FRONTEND_URL : process.env.REACT_APP_PROD_FRONTEND_URL;
// const apiUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;
const handleLogin = async (email) => {
    try{
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
            url: `${frontendUrl}/login`,
            handleCodeInApp: true
        });
        // add to DB
    } catch {

    }
}
const authAPI = {
    handleLogin,
    handleSignup,
}
export default authAPI;