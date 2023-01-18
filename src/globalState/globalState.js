import { hookstate } from '@hookstate/core';

export const dbState = hookstate();

export const relationsState = hookstate();
export const lessonsState = hookstate();
export const domainsState = hookstate();
export const tagsState = hookstate();
export const originsState = hookstate();
export const userState = hookstate();


// This variable is used so that the d3 graph does not get rendered constantly. it is an array of the relation ids
export const relationsToListState = hookstate([]);

// This is used to handle the navigation when an user is updating the lesson or relation
export const updatingOrCreatingObjectState = hookstate({
    object: {},
    updating: false,
    creating: false
});