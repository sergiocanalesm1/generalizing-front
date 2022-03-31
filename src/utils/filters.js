export function filterByDomain( relations, sortedDomains ){
    return relations.filter( r => {
        const newD1 = r.lessons[0].domain;
        const newD2 = r.lessons[1].domain;
        const set2 = [newD1,newD2].sort()
        return sortedDomains[0]=== set2[0]  && sortedDomains[1]=== set2[1]
      })
}

export function sortArray(array,key){
    
}