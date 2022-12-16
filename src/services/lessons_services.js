import { collection, getDocs, setDoc, addDoc, doc, deleteDoc } from "firebase/firestore";


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

export async function updateLesson( db, id, lesson, onSuccess, onError ){
    try{
        const ref = doc(db, lessonsCollection, id);
        await setDoc(ref, lesson, { merge: true });
        onSuccess();
    }
    catch(error) {
        onError()
        console.log(error);
    }
}

export async function createLesson( db, lesson, onSuccess, onError ){
    try{
        await addDoc(collection(db, lessonsCollection), lesson);
        onSuccess();
    }
    catch(error) {
        onError()
        console.log(error);
    }
}

export async function deleteLesson( db, id ){
    try{
        await deleteDoc(doc(db, lessonsCollection, id));
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}
/*

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
*/