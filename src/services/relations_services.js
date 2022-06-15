import { methods, url } from "./urls";

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
        fetchedRelations.reverse();//latest first
        return fetchedRelations;
    }
}

export async function createOrUpdateRelation( relation, files, method, onSuccess, onError ){
    const uuid = method === methods.UPDATE ? `${relation.uuid}` : ``;
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
          formData.append( 'relation', createdRelation.id )
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

export async function getRelation( uuid ){
    const relations = await getAllRelations();
    return relations.filter( r => (r.uuid === uuid ))[0];
}

export async function deleteRelation( uuid ){
    const response = await fetch(
        `${url}relations/${uuid}`,
        {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.ok;
}