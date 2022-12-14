import { methods, url } from "./urls";

import { collection, getDocs } from "firebase/firestore";


const lessonsCollection = "lessons";

export async function getAllLessons(db){

    const lessons = {};
    let data, tags = [];
    const querySnapshot = await getDocs(collection(db, lessonsCollection));
    querySnapshot.forEach((doc) => {
        data = doc.data();
        if( data.tags ){
            tags = data.tags.split(",");
            data.tags = tags;
        }
        lessons[doc.id] = data;
        //lessons.push({[doc.id]:data})
    });
    return lessons;
}

export async function createOrUpdateLesson( lesson, files, method, onSuccess, onError ){
    const uuid = method === methods.UPDATE ? `${lesson.uuid}` : ``;
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

export async function getLesson( uuid ){
    const lessons = await getAllLessons();
    return lessons.filter( l => (l.uuid === uuid) )[0];
}

export async function deleteLesson( uuid ){
    const response = await fetch(
        `${url}lessons/${uuid}`,
        {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.ok;
}
