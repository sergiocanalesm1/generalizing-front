export function toDate(dateString) {
    const date = new Date(dateString);
    // Return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    return date.toLocaleDateString('en-US');
}