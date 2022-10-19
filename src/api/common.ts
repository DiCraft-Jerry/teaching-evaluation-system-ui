
import request from "../request";
import {uploadFileRequest} from '../request'
import axios from "axios";

export function doRemoveImg(params:any) {
	return request('/upload/ids',params,'DELETE')
}

export function doRemoveImgByPaths(params:any) {
	return request('/upload/paths',params,'DELETE')
}
export function doUploadFiles(params:any){
	return uploadFileRequest('/upload/image',params)
}