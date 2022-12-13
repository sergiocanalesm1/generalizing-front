import { getAllLessons } from "../services/lessons_services"
import { getAllRelations } from "../services/relations_services"
import { getAllDomains } from "../services/domains_services"
import { getAllTags } from "../services/tags_services"
import { getAllOrigins } from "../services/origins_services"
import { setupLessons } from "./lessons_helper"

export async function fetchData(db){
    getAllRelations(db).then( fetchedRelations => {         
        getAllLessons(db).then( fetchedLessons => {
            getAllDomains(db).then( fetchedDomains => {
                getAllTags(db).then( fetchedTags => {
                    getAllOrigins(db).then( fetchedOrigins => {
                        fetchedLessons = setupLessons(fetchedRelations, fetchedLessons, fetchedDomains, fetchedOrigins, fetchedTags);
                        
                        return {fetchedRelations, fetchedLessons, fetchedDomains, fetchedOrigins, fetchedTags}
                    })
                })
            })
        })
    })
}