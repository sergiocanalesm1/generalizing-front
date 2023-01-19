export function filterByDomain( relations, lessons, sortedDomains, allDomains ){
  // Should return array of keys
    let d1; 
    let d2; 
    let set2;
    const filteredRelationsIds = [];
    Object.keys(relations).forEach( id => {
      d1 = allDomains[ lessons[relations[id].lessons[0]].domain ].domain;
      d2 = allDomains[ lessons[relations[id].lessons[1]].domain ].domain;
      set2 = [d1,d2].sort()
      if(sortedDomains[0] === set2[0]  && sortedDomains[1] === set2[1]){
        filteredRelationsIds.push(id);
      }
    })
    return filteredRelationsIds;
}

export function filterByOwned( ids, objects, uid ){
  if( !uid ){
    return [];
  }

  const owned = {};
  ids.forEach( id => {
    if( objects[id].userUid === uid ){
      owned[id] = objects[id]
    }
  })
  return owned;
}

export function filterByOrigin( lessons, originId ){
  const filteredIds = [];
  Object.keys(lessons).forEach( id => {
    if( lessons[id].origin === originId ){
      filteredIds.push(id)
    }
  })
  return filteredIds;
}

export function sortByOwned( o1, o2, uid ){
  if( o1.userUid === uid ){
    return -1
  }

  if( o2.userUid === uid ){
      return 1
  }

  sortByLatest( o1, o2 );
}

export function sortByLatest( o1, o2 ){
  if( o1.creationDate > o2.creationDate ){
    return -1
  }

  if( o1.creationDate < o2.creationDate ){
    return 1
  }

  return 0
}



export function shuffle(array) {
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  let currentIndex = array.length;
  let  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}