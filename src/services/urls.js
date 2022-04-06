import { sortByOwned } from "../utils/filters";
import { getUserId, setUser } from "../utils/user";

const _url = process.env.REACT_APP_API_URL;

const CREATE = "CREATE";
const UPDATE = "UPDATE";

export const methods = {
    [CREATE] : "POST",
    [UPDATE] : "PUT"
}

//Lessons

export async function getAllLessons(){

    const response = await fetch(
        `${_url}lessons/`,
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedLessons = await response.json();
        if( Boolean(getUserId()) ){
            fetchedLessons.sort(sortByOwned);
        }
        return fetchedLessons;
    }
}

export async function createOrUpdateLesson( lesson, files, method, onSuccess, onError ){
    const uuid = method ? `${lesson.uuid}` : ``;
    let response = await fetch(`${_url}lessons/${uuid}`,{
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lesson)
    })

    if( response.ok ){
        const createdLesson = await response.json();

        if( files.length > 0 ) {
          let formData = new FormData();
          formData.append( 'lesson', createdLesson.id )
          formData.append( 'file', files );

          response = await fetch(`${_url}lfiles/`,{
              method: 'POST',
              body: formData
          });

          if( response.ok ){
          }
        }
        onSuccess()
    }
    else{
        onError()
    }
}

//Relations

export async function getAllRelations(){

    const response = await fetch(
        `${_url}relations/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedRelations = await response.json();
        if( Boolean(getUserId()) ){
            fetchedRelations.sort(sortByOwned);
        }
        return fetchedRelations;
    }
}

export async function createRelation( relation, files, onSuccess, onError ){
    let response = await fetch(`${_url}relations/`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relation)
    })

    if( response.ok ){
        const createdRelation = await response.json();

        if( files.length > 0 ) {
          let formData = new FormData();
          formData.append( 'relation', parseInt(createdRelation.id) )
          formData.append( 'file', files );

          response = await fetch(`${_url}rfiles/`,{
              method: 'POST',
              body: formData
          });

          if( response.ok ){

            }
        }
        onSuccess();
    }
    else{
        onError()
    }
}

//Challenges

export async function getLastChallenge(){
    const response = await fetch(
        `${_url}challenges/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedChallenges = await response.json();
        return fetchedChallenges[ fetchedChallenges.length - 1 ];//fix, create an endpoint for this
    }
}

//user

export async function signin(email,username,password,onSuccess,onError){

    const response = await fetch(`${_url}users/`,{
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
    const response = await fetch(`${_url}login/`,{
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