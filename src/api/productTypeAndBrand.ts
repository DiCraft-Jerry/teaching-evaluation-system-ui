import request from "../request";

export function doList(){
    return request('/productType/doListTypeAndBrand',{},'GET')
}

export function doSaveTypeOrBrand(param:any){
    return request('/productType/doSaveTypeOrBrand',param,'POST')
}
export function doRemoveTypeOrBrand(param:string[]){
    return request("/productType/doRemoveTypeOrBrand",param,'DELETE')
}
export function doRemoveProductType(param:string[]){
    return request("/productType/doRemove",param,'DELETE')
}
export function doRemoveBrand(param:string[]){
    return request("/brand/doRemove",param,'DELETE')
}
export function doModifyProductType(param:any){
    return request("/productType/doModify",param,'PUT')
}
export function doModifyBrand(param:any){
    return request("/brand/doModify",param,'PUT')
}