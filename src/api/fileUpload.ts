import request from "../request";

export function getfileAddress(param: string) {
    return request(`/quota/upload`, param, 'GET')
}