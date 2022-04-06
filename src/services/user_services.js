import { setUser } from "../utils/user";
import { url } from "./urls";

export async function signin(email,username,password,onSuccess,onError){

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
}

export async function login(email, password,onSuccess,onError){
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
}