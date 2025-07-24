import admin from "firebase-admin";
import serviceAccount from "./cafe-hopper-460919-firebase-adminsdk-fbsvc-15066907fe.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;