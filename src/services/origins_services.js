import { collection, getDocs } from "firebase/firestore";

const originsCollection = "origins";

export async function getAllOrigins(db){
    const origins = {}
    const querySnapshot = await getDocs(collection(db, originsCollection));
    querySnapshot.forEach((doc) => {
        //origins.push({[doc.id]:doc.data()})
        origins[doc.id] = doc.data();
    });
    return origins;
}
