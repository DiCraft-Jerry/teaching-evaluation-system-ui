import request from "../request";
import { uploadFileRequest } from "../request";
export function doList(param:any){
    return request(`/case/doList`,param,'POST')
}
export function doSave(param:FormData){
    return uploadFileRequest("/case/doSave",param,'POST')
}
export function doModify(param:FormData){
    return uploadFileRequest('/case/doModify',param,'PUT')
}
export function doRemove(param:any){
    return request('/case/doRemove',param,'DELETE')
}
export function doModifyStatus(id: string, status: number) {
    return request(`/case/doModifyStatus/${id}/${status}`,{},'PUT')
}