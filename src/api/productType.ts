import request from "../request";

export function doList(data:any){
    return request("/productType/doList",data,'POST')
}

export function doSave(data:any){
    return request("/productType/doSave",data,'POST')
}
export function doModify(data:any){
    return request("/productType/doModify",data,'PUT')
}
export function doRemove(data:any){
    return request("/productType/doRemove",data,'DELETE')
}
export function doListReturnSelectVo(){
    return request("/productType/doListReturnSelectVo",{},'GET')
}