import { collection, getDocs, setDoc, addDoc, doc, deleteDoc } from "firebase/firestore";
import { reportError } from "../helpers/bug_reporter";


const lessonsCollection = "lessons";

export async function getAllLessons(db){

    const lessons = {};
    let data;
    try{
        const querySnapshot = await getDocs(collection(db, lessonsCollection));
        querySnapshot.forEach((doc) => {
            data = doc.data();
            lessons[doc.id] = data;
            // Lessons.push({[doc.id]:data})
        });
    }
    catch(error){
        reportError( error );
    }

    return lessons;
}

export async function updateLesson( db, id, lesson, onSuccess, onError ){
    try{
        const ref = doc(db, lessonsCollection, id);
        await setDoc(ref, lesson, { merge: true });
        onSuccess();
    }
    catch(error) {
        onError()
        reportError( error );
    }
}

export async function createLesson( db, lesson, onSuccess, onError ){
    try{
        await addDoc(collection(db, lessonsCollection), lesson);
        onSuccess();
    }
    catch(error) {
        onError()
        reportError( error );
    }
}

export async function deleteLesson( db, id ){
    try{
        await deleteDoc(doc(db, lessonsCollection, id));
        return true
    }
    catch(error){
        reportError( error );
        return false
    }
}
/*

Export async function getLesson( uuid ){
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
*/
