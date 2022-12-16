import { hookstate } from '@hookstate/core';

export const db = hookstate({});

export const relationsState = hookstate({});
export const lessonsState = hookstate({});
export const domainsState = hookstate({});
export const tagsState = hookstate({});
export const originsState = hookstate({});
export const userState = hookstate({});

//this variable is used so that the d3 graph does not get rendered constantly. it is an array of the relation ids
export const relationsToListState = hookstate([]);

//this is used to handle the navigation when an user is updating the lesson or relation
export const updatingObjectState = hookstate({
    object: {},
    state: false
});
//this is used for the button "another idea? relate these lessons"
export const lessonsToRelateState = hookstate([]);