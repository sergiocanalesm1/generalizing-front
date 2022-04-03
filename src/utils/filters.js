import { getUserId } from "./user";

export function filterByDomain( relations, sortedDomains ){
    return relations.filter( r => {
        const newD1 = r.lessons[0].domain;
        const newD2 = r.lessons[1].domain;
        const set2 = [newD1,newD2].sort()
        return sortedDomains[0]=== set2[0]  && sortedDomains[1]=== set2[1]
      })
}

export function filterByChallenge( relations, challengeId ){
  return relations.filter( r => (r.challenge === challengeId ))
}

export function sortByOwned( o1, o2 ){
  const id = getUserId();
  if( o1.user === id ){
    return -1
  }
  if( o2.user === id ){
      return 1
  }
  if( o1.creation_date < o2.creation_date ){
    return -1
  }
  if( o1.creation_date > o2.creation_date ){
    return 1
  }
  return 0
}