import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { reportError } from "../helpers/bug_reporter";



export async function signin(email,password,onSuccess,onError){
    
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onSuccess();
        return userCredential.user
    }
    catch(error) {
        onError();
        reportError( error );
    }
}

export async function signinWithGoogle(onSuccess,onError){
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try{
    
        await signInWithPopup(auth, provider);
        // Const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        // const user = result.user;
        onSuccess();
    }
    catch( error ){
        reportError( error );
        onError();
    }
}

export async function resetPassword(email, onSuccess, onError) {
    const auth = getAuth();
    try{
        sendPasswordResetEmail(auth, email);
        onSuccess();
    }
    catch(error){
        reportError( error );
        onError();
    }
}

export async function sendVerification(){
    const auth = getAuth();
    try{
        sendEmailVerification(auth.currentUser)
    }
    catch(error){
        reportError( error );
    }

}

export async function login(email, password,onSuccess,onError){

    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
        return userCredential.user
    }
    catch(error) {
        reportError( error );
        onError()
        
    }
}

export async function logout(){
    const auth = getAuth();
    try{
        await auth.signOut();
    }
    catch(error){
        reportError( error );
    }
}