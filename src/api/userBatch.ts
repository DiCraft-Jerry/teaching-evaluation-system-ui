import request from "../request";
export function doSave(param: any) {
    return request('/userCourseBatch/doSave', param, 'POST')
}
export function doList(param: any) {
    return request('/userCourseBatch/doList', param, 'POST')
}
export function doModify(param: any) {
    return request('/userCourseBatch/doModify', param, 'PUT')
}
export function doRemove(param: any) {
    return request('/userCourseBatch/doRemove', param, 'DELETE')
}
export function doListAll() {
    return request('/userCourseBatch/doListAll', {}, 'GET')
}