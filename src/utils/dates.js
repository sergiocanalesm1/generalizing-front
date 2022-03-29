export function toDate(dateString) {
    const date = new Date(dateString);
    //return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    return date.toLocaleDateString('en-US');
}