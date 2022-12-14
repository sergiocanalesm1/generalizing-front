import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export async function signin(email,username,password,onSuccess,onError){
    
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onSuccess();
        return userCredential.user
    }
    catch(error) {
        //const errorCode = error.code;
        //const errorMessage = error.message;
        onError();
        return;
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
        //const errorCode = error.code;
        //const errorMessage = error.message;
        onError()
        return;
    }
}

export async function logout(){
    const auth = getAuth();
    try{
        await auth.signOut();
    }
    catch(error){

    }
}