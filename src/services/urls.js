import { sortByOwned } from "../utils/filters";
import { getUserId } from "../utils/user";

const _url = process.env.REACT_APP_API_URL;

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

export async function createRelation( relation, files, onSuccess ){
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
    }
    onSuccess();
}

export async function createLesson( lesson, files, onSuccess ){
    let response = await fetch(`${_url}lessons/`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lesson)
    })

    if( response.ok ){
        const createdLesson = await response.json();

        if( files.length > 0 ) {
          let formData = new FormData();
          formData.append( 'lesson', createdLesson['id'] )
          formData.append( 'file', files );

          response = await fetch(`${_url}lfiles/`,{
              method: 'POST',
              body: formData
          });

          if( response.ok ){
          }
        }
    }
    onSuccess()

}
