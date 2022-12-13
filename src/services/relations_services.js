import { collection, getDocs } from "firebase/firestore";

import { methods, url } from "./urls";


const relationsCollection = "relations";

export async function getAllRelations(db){
    const relations = {}
    let data, lessons;
    const querySnapshot = await getDocs(collection(db, relationsCollection));
    querySnapshot.forEach((doc) => {
        data = doc.data();
        lessons = data.lessons.split(",")
        data.lessons = lessons
        relations[doc.id] = data;
        //relations.push({[doc.id]:data})
    });
    return relations;
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