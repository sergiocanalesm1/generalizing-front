import { collection, getDocs } from "firebase/firestore";
import { reportError } from "../helpers/bug_reporter";

const domainsCollection = "domains";

export async function getAllDomains(db){
    const domains = {};
    try{
        const querySnapshot = await getDocs(collection(db, domainsCollection));
        querySnapshot.forEach((doc) => {
            // Domains.push({[doc.id]:doc.data()})
            domains[doc.id] = doc.data();
        });
    }
    catch(error){
        reportError(error);
    }

    return domains;
}
