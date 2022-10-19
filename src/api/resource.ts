import request from '../request'

export function doList() {
	return request('/resource/doList',{},'GET')
}

export function doParentList() {
	return request('/resource/doParentList',{},'GET')
}

export function doSave(params) {
	return request('/resource/doSave',params,'POST')
}

export function doModify(params) {
	return request('/resource/doModify',params,'PUT')
}

export function doRemove(params) {
	return request('/resource/doRemove',params,'DELETE')
}
