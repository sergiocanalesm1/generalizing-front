import { collection, getDocs } from "firebase/firestore";

const domainsCollection = "domains";

export async function getAllDomains(db){
    const domains = {};
    try{
        const querySnapshot = await getDocs(collection(db, domainsCollection));
        querySnapshot.forEach((doc) => {
            //domains.push({[doc.id]:doc.data()})
            domains[doc.id] = doc.data();
        });
    }
    catch(error){
        console.log(error)
    }
    return domains;
}
