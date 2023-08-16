const obj = localStorage.getItem("authUser") !== "" && JSON.parse(localStorage.getItem("authUser"))
let accessToken = "";
if (obj && obj.token) {
    accessToken = `Bearer ${obj.token}`
}
export default accessToken
