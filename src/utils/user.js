export function getUserUuid(){
    return localStorage.getItem('uuid');
}

export function getUserId(){
    return parseInt( localStorage.getItem('id') );
}

export function setUser(user){
    localStorage.setItem('uuid',user.uuid);
    localStorage.setItem('id',user.id);
}

export function clearUser(){
    localStorage.clear();
}