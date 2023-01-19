
export const mapOriginsToRelations = (relations, lessons) => {
    let originId1;
    let originId2;
    let orderedOrigins;
    const newMap = {};
    // Let originsToLessons = {};

    for(const id in relations){
        if( Object.prototype.hasOwnProperty.call(relations, id ) ){
            originId1 = lessons[relations[id].lessons[0]].origin;
            originId2 = lessons[relations[id].lessons[1]].origin;
            orderedOrigins = [originId1,originId2].sort();
            
            if( Object.prototype.hasOwnProperty.call(newMap, orderedOrigins[0] ) ){
                if( Object.prototype.hasOwnProperty.call(newMap[orderedOrigins[0]], orderedOrigins[1] ) ){
                    newMap[ orderedOrigins[0] ][ orderedOrigins[1] ].push(id);
                }
                else{
                    newMap[ orderedOrigins[0] ][ orderedOrigins[1] ] = [id]
                }
            }
            else{
                newMap[ orderedOrigins[0] ] = {
                    [orderedOrigins[1]] : [id]
                }
            }
        }
    }

    return newMap;
}