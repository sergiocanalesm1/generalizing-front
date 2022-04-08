import { url } from "./urls";

export async function getLastChallenge(){
    const response = await fetch(
        `${url}challenges/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedChallenges = await response.json();
        return fetchedChallenges[ fetchedChallenges.length - 1 ];//fix, create an endpoint for this
    }
}