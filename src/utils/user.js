const firstTimer = 'firstTimer';

export function setFirstTimer(){
    localStorage.setItem(firstTimer, 'unremovable! :)')
}

export function getFirstTimer(){
    return localStorage.getItem(firstTimer);
}