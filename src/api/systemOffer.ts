import request from "../request"

// 分页条件查询
export function doList(tUserOffer: any) {
    return request('/systemOffer/doList', tUserOffer, 'POST')
}
// 系统方案修改
export function doModify(param: any) {
    return request('/systemOffer/doModify', param, 'PUT')
}
// 系统方案删除
export function doRemove(params: any) {
    return request('/systemOffer/doRemove', params, 'DELETE')
}
// 系统方案新增
export function doSave(params: any) {
    return request('/systemOffer/doSave', params, 'POST')
}