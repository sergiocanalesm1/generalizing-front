import { hookstate } from '@hookstate/core';

export const dbState = hookstate();

export const relationsState = hookstate();
export const lessonsState = hookstate();
export const domainsState = hookstate();
export const tagsState = hookstate();
export const originsState = hookstate();
export const userState = hookstate();

export const filterTypeState = hookstate("");
export const filtersState = hookstate("")


// These variables are used so that the graphs dont rendered constantly. it is an array of ids
export const relationsToListState = hookstate([]);
export const lessonsToListState = hookstate([]);

// This is used to handle the navigation when an user is updating the lesson or relation
export const updatingOrCreatingObjectState = hookstate({
    object: {},
    updating: false,
    creating: false
});