import request from "../request"

// 分页条件查询
export function doList(tUserOffer: object) {
    return request('/userOffer/doList', tUserOffer, 'POST')
}
// 修改状态
export function doModify(params: any) {
    return request(`/userOffer/doModify`, params, 'PUT')
}
// 查询报价产品详细
export function doUserOffer(productType: string, id: string) {
    return request(`/userOffer/doUserOffer/${productType}/${id}`, {}, 'GET')
}
// 导出当前行Excel
export function exportUserOffer(params: any) {
    return request(`/userOffer/exportUserOffer/`, params, "POST", 'blob')
}
// 导出所有用户为Excel
export function exportAllUserOffer() {
    return request(`/userOffer/exportAllUserOffer/`, {}, "POST", 'blob')
}
// 删除报价
export function doRemove(params:any){
    return request('/userOffer/doRemove', params, 'DELETE')
}