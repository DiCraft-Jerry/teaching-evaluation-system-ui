import request from "../request";
export function doSave(param: any) {
    return request('/course/doSave', param, 'POST')
}
export function doList(param: any) {
    return request('/course/doList', param, 'POST')
}
export function doModify(param: any) {
    return request('/course/doModify', param, 'PUT')
}
export function doRemove(param: any) {
    return request('/course/doRemove', param, 'DELETE')
}
export function doListAll() {
    return request('/course/doListAll', {}, 'GET')
}