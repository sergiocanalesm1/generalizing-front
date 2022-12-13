import { hookstate } from '@hookstate/core';

export const db = hookstate({})

export const globalState = hookstate({
    relations: {},
    lessons: {},
    domains: {},
    tags: {}
}); // relations to show? lo averiguaremos

export const relationsState = hookstate({});
export const lessonsState = hookstate({});
export const domainsState = hookstate({});
export const tagsState = hookstate({});
export const originsState = hookstate({});
export const userState = hookstate({});