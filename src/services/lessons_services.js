import { sortByOwned } from "../utils/filters";
import { getUserId } from "../utils/user";
import { url } from "./urls";

export async function getAllLessons(){

    const response = await fetch(
        `${url}lessons/`,
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
    let response = await fetch(`${url}lessons/${uuid}`,{
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lesson)
    })

    if( response.ok ){
        const createdLesson = await response.json();
        if( files.name ) {
          let formData = new FormData();
          formData.append( 'lesson', createdLesson.id )
          formData.append( 'file', files );

          response = await fetch(`${url}lfiles/`,{
              method: 'POST',
              body: formData
          });

          if( response.ok ){
          }
        }
        onSuccess();
    }
    else{
        onError();
    }
}