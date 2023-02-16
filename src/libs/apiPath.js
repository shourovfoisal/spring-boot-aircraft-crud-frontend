
export const apiPath = () => {
    let host = "localhost";
    let port = "8080";
    let protocol = "http://";
    let tail = "/api/v1";

    return protocol + host + ":" + port + tail;
}