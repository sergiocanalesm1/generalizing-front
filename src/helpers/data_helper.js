export const invertResource = (resource,keyName) => {
    const newObject = {};
    for(const id in resource){
        newObject[resource[id][keyName]] = id
    }

    return newObject;

}