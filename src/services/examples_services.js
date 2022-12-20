import { collection, getDocs } from "firebase/firestore";
import { reportError } from "../helpers/bug_reporter";

const examplesCollection = "examples";

export async function getExamples(db){
    const examples = {}
    try{
        const querySnapshot = await getDocs(collection(db, examplesCollection));
        querySnapshot.forEach(doc => {
            examples[doc.id] = doc.data();
        });
    }
    catch( error ){
        reportError(error);
    }
    return examples;
}
