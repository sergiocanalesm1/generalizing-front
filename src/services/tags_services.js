import { collection, getDocs, addDoc  } from "firebase/firestore";

const tagsCollection = "tags";

export async function getAllTags(db){
    const tags = {}
    const querySnapshot = await getDocs(collection(db, tagsCollection));
    querySnapshot.forEach((doc) => {
        //tags.push({[doc.id]:doc.data()})
        tags[doc.id] = doc.data();
    });
    return tags;
}

export async function createDBTag(db, tag){
    try{
        const docRef = await addDoc(collection(db, tagsCollection), tag);
        return docRef.id;
    }
    catch( error ){
        //console.log(error)
    }
}
