import { sendSignInLinkToEmail } from 'firebase/auth';
import auth from '../firebase/firebase';

const frontendUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_FRONTEND_URL : process.env.REACT_APP_PROD_FRONTEND_URL;
// const apiUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;
export default async function handleLogin(email) {
    try{
        await sendSignInLinkToEmail(auth, email, {
                url: `${frontendUrl}/`, // fill in later
                handleCodeInApp: true,
        });
        return true;
    } catch {
        return false;
    }
}