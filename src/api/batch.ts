import request from "../request";
export function doSave(param: any) {
    return request('/batch/doSave', param, 'POST')
}
export function doList(param: any) {
    return request('/batch/doList', param, 'POST')
}
export function doModify(param: any) {
    return request('/batch/doModify', param, 'PUT')
}
export function doRemove(param: any) {
    return request('/batch/doRemove', param, 'DELETE')
}
export function doModifyStatus(id: any, status: any) {
    return request(`/batch/doModifyStatus/${id}/${status}`, {}, 'PUT')
}

export function doListAll() {
    return request('/batch/doListAll', {}, 'GET')
}