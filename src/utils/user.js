export function getUser(){
    return localStorage.getItem('user');
}

export function setUser(user){
    return localStorage.setItem('user',user);
}

export function clearUser(){
    localStorage.clear();
}