import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";


const relationsCollection = "relations";

export async function getAllRelations(db){
    const relations = {}
    let data, lessons;
    try{
        const querySnapshot = await getDocs(collection(db, relationsCollection));
        querySnapshot.forEach((doc) => {
            data = doc.data();
            lessons = data.lessons.split(",")
            data.lessons = lessons
            relations[doc.id] = data;
            //relations.push({[doc.id]:data})
        });
    }
    catch(error){
        console.log(error)
    }
    return relations;
}

export async function updateRelation( db, id, relation, onSuccess, onError ){
    try{
        const ref = doc(db, relationsCollection, id);
        await setDoc(ref, relation, { merge: true });
        onSuccess();
    }
    catch(error) {
        onError()
        console.log(error);
    }
}

export async function createRelation( db, relation, onSuccess, onError ){
    try{
        await addDoc(collection(db, relationsCollection), relation);
        onSuccess();
    }
    catch(error) {
        onError()
        console.log(error);
    }
}

export async function deleteRelation( db, id ){
    try{
        await deleteDoc(doc(db, relationsCollection, id));
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}