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

export function filterByOwned( relations ){
  const id = getUserId();
  if( !Boolean(id) ){
    return [];
  }
  return relations.filter( r => (r.user === id));
}

export function sortByOwned( o1, o2 ){
  const id = getUserId();
  if( o1.user === id ){
    return -1
  }
  if( o2.user === id ){
      return 1
  }
  sortByLatest( o1, o2 );
}

export function sortByLatest( o1, o2 ){
  if( o1.creation_date > o2.creation_date ){
    return -1
  }
  if( o1.creation_date < o2.creation_date ){
    return 1
  }
  return 0
}



export function shuffle(array) {
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  let currentIndex = array.length,  randomIndex;

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

export function combineLessonsWithRelations( relations, lessons ){

  const cached_lesson_obj = {};
  for( let i=0 ; i < lessons.length ; i++){
    cached_lesson_obj[ lessons[i].id ] = lessons[i]; 
  }
  for( let i=0 ; i<relations.length ; i++){
    const lesson1 = cached_lesson_obj[ relations[i].lessons[0].id ];
    if(lesson1){
      lesson1.relations ? lesson1.relations.push( relations[i] ) : lesson1.relations = [ relations[i] ];
      cached_lesson_obj[ relations[i].lessons[0].id ] = lesson1;

    }
    const lesson2 = cached_lesson_obj[ relations[i].lessons[1].id ];
    
    if(lesson2){
      lesson2.relations ? lesson2.relations.push( relations[i] ) : lesson2.relations = [ relations[i] ];
      cached_lesson_obj[ relations[i].lessons[1].id ] = lesson2;

    }

  }

  return Object.keys(cached_lesson_obj).map( id => (cached_lesson_obj[id]));
}