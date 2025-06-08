// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBfpghFMu5DCVgXr7tx35_uipcwpUlb5ZY",
    authDomain: "lagerverwaltung-backend-10629.firebaseapp.com",
    projectId: "lagerverwaltung-backend-10629",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
