import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { dbState, userState } from "../globalState/globalState";

export function initFirebase(){

    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        projectId: process.env.REACT_APP_PROJECTID,
        storageBucket: process.env.REACT_APP_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGESENDERID,
        appId: process.env.REACT_APP_APPID,
        measurementId: process.env.REACT_APP_MEASUREMENTID
      };
      
    const app = initializeApp(firebaseConfig);
    // Const analytics = getAnalytics(app); TODO setup analytics
    const firestoreDB = getFirestore(app);
    dbState.set(firestoreDB);

    const auth = getAuth()
    onAuthStateChanged( auth, (user) =>{
      if( user ){
        userState.set(user)
      }
      else{
        userState.set({})
      }
    })
}
