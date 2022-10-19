import request from "../request";

export function getVideoAddress(param: string) {
    return request(`/oss/getVideoAddress/${param}`, {}, 'GET')
}