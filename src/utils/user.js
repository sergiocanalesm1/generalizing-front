const uuid = 'uuid';
const id = 'id';
const firstTimer = 'firstTimer';

export function getUserUuid(){
    return localStorage.getItem(uuid);
}

export function getUserId(){
    return parseInt( localStorage.getItem(id) );
}

export function setUser(user){
    localStorage.setItem(uuid,user.uuid);
    localStorage.setItem(id,user.id);
}

export function clearUser(){
    localStorage.removeItem(uuid);
    localStorage.removeItem(id);
}

export function setFirstTimer(){
    localStorage.setItem(firstTimer, 'unremovable! :)')
}

export function getFirstTimer(){
    return localStorage.getItem(firstTimer);
}