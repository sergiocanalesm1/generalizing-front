import { sortByOwned } from "../utils/filters";
import { getUserId } from "../utils/user";
import { url } from "./urls";

export async function getAllRelations(){

    const response = await fetch(
        `${url}relations/`,
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

export async function createOrUpdateRelation( relation, files, method, onSuccess, onError ){
    const uuid = method ? `${relation.uuid}` : ``;
    let response = await fetch(`${url}relations/${uuid}`,{
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relation)
    })

    if( response.ok ){
        const createdRelation = await response.json();

        if( files.name ) {
          let formData = new FormData();
          formData.append( 'relation', parseInt(createdRelation.id) )
          formData.append( 'file', files );

          response = await fetch(`${url}rfiles/`,{
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