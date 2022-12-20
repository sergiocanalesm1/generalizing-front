import { collection, getDocs } from "firebase/firestore";

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
        console.log(error)
    }
    return examples;
}
