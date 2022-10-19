import request from "../request";
export function doModify(param: any) {
    return request('/ucc/doModify', param, 'PUT')
}
export function getScore() {
    return request('/ucc/getScore', {}, 'GET')
}
