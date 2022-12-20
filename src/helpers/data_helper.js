import { getAllLessons } from "../services/lessons_services"
import { getAllRelations } from "../services/relations_services"
import { getAllDomains } from "../services/domains_services"
import { getAllTags } from "../services/tags_services"
import { getAllOrigins } from "../services/origins_services"
import { setupLessons } from "./lessons_helper"
import { dbState } from "../globalState/globalState"

export const fetchDataResource = () => {
    getAllRelations(dbState.get()).then( relations => {         
        getAllLessons(dbState.get()).then( lessons => {
            getAllDomains(dbState.get()).then( domains => {
                getAllTags(dbState.get()).then( tags => {
                    getAllOrigins(dbState.get()).then( origins => {
                        lessons = setupLessons(relations, lessons, domains, origins, tags);
                        return {relations, lessons, domains, origins, tags}
                    })
                })
            })
        })
    })
}