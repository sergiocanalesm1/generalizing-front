import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { dbState, userState } from "../globalState/globalState";

export function initFirebase(){

    const firebaseConfig = {
        // TODO all env variables
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: "generalizing-a91c7.firebaseapp.com",
        projectId: "generalizing-a91c7",
        storageBucket: "generalizing-a91c7.appspot.com",
        messagingSenderId: "759187085409",
        appId: "1:759187085409:web:a4dfe4f85be424c8f7b220",
        measurementId: "G-9X20L89CPF"
      };
      
    const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
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
