
const CREATE = "CREATE";
const UPDATE = "UPDATE";

export const url = process.env.REACT_APP_API_URL;

export const methods = {
    [CREATE] : "POST",
    [UPDATE] : "PUT"
}
