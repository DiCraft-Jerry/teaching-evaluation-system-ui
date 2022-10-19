
import request from "../request";
import { uploadFileRequest } from "../request";
export function doSave(param:any){
    return uploadFileRequest("/slideshow/doSave",param)
}

export function doList(){
    return request("/slideshow/doList",{},'GET')
}
export function doModify(param:any){
    return  uploadFileRequest("/slideshow/doModify",param,'PUT')
}

export function doModifyStatus(id:string,status:number){
    return request(`/slideshow/doModifyStatus/${id}/${status}`,{},'PUT')
}
export function doRemove(ids:string[]){
    return request("/slideshow/doRemove",ids,'DELETE')
}