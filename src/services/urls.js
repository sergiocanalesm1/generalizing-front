const _url = process.env.REACT_APP_API_URL;

export async function getAllLessons(){

    const response = await fetch(
        `${_url}lessons/`,
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedLessons = await response.json();
        return fetchedLessons;
    }
}

export async function getAllRelations(){

    const response = await fetch(
        `${_url}relations/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
        },
    });
    if( response.ok ) {
        const fetchedRelations = await response.json();
        return fetchedRelations;
    }
}