import { collection, getDocs } from "firebase/firestore";

const originsCollection = "origins";

export async function getAllOrigins(db){
    const origins = {};
    try{
        const querySnapshot = await getDocs(collection(db, originsCollection));
        querySnapshot.forEach((doc) => {
            //origins.push({[doc.id]:doc.data()})
            origins[doc.id] = doc.data();
        });
    }
    catch(error){
        console.log(error)
    }
    return origins;
}
