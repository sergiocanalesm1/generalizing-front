import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export async function signin(email,username,password,onSuccess,onError){
    
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        onSuccess();
        return userCredential.user

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        onError()
      });
      /*
    const response = await fetch(`${url}users/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            username: username,
            password: password
        })
    })

    if(response.ok){
        const user = await response.json();
        const userToSet = {
            id: user['id'] ,
            uuid: user['uuid']
        }
        setUser( userToSet );
        onSuccess();
    }
    else{
        onError()
    }
    */
}

export async function login(email, password,onSuccess,onError){

    const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                onSuccess();
                return userCredential.user
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                onError()
    });

    /*
    const response = await fetch(`${url}login/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    if(response.ok){
        const user = await response.json();
        const userToSet = {
            id: user['id'] ,
            uuid: user['uuid']
        }
        setUser( userToSet );
        onSuccess();
    }
    else{
        onError()
    }
    */
}