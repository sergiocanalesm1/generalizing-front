import { url } from "./urls";

export async function getAllTags(){
    const response = await fetch(
        `${url}tags/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedTags = await response.json();
        return fetchedTags;
    }
}