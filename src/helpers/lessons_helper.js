/*
    Combines lessons with relations and translates ids into names
    example: 
        before lesson.origin -> AIkkshaodlfi
        after lesson.origin -> Lecture
*/
export function setupLessons( relations, lessons, domains, origins, tags ){
    lessons = combineLessonsWithRelations( relations, lessons );
    let lesson;
    return Object.keys(lessons).map( id => {
        lesson = lessons[id];
        lesson.domain = domains[ lesson.domain ].domain;
        lesson.origin = origins[ lesson.origin ].origin;
        if( lesson.tags ){
            lesson.tags = lesson.tags.map( tagId => tags[ tagId ].tag )
        }

        return lesson
    })

}

// This exists because of "check created relations" per lesson
// this creates lessons.relations which is a list of the keys that particular lessons participates in
export function combineLessonsWithRelations(relations, lessons){
    let lesson1;
    let lesson2;
    
    for( const id in relations ){
        lesson1 = lessons[ relations[id].lessons[0] ]
        if(lesson1){
            lesson1.relations ? lesson1.relations.push( id ) : lesson1.relations = [ id ];
            lessons[ relations[id].lessons[0].id ] = lesson1;
        }
    
        lesson2 = lessons[ relations[id].lessons[1] ]
        if(lesson2){
            lesson2.relations ? lesson2.relations.push( id ) : lesson2.relations = [ id ];
            lessons[ relations[id].lessons[1].id ] = lesson2;
        }
    }

    return lessons;
}