import { collection, getDocs } from "firebase/firestore";

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
