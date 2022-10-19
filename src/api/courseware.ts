import request from "../request";
export function doSave(param: any) {
    return request('/courseware/doSave', param, 'POST')
}
export function doList(param: any) {
    return request('/courseware/doList', param, 'POST')
}
export function doModify(param: any) {
    return request('/courseware/doModify', param, 'PUT')
}
export function doRemove(param: any) {
    return request('/courseware/doRemove', param, 'DELETE')
}
export function doListAll() {
    return request('/courseware/doListAll', {}, 'GET')
}