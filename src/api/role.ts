import request from '../request'

export function doAll() {
	return request('/role/doAll',{},'GET')
}

export function doList(params) {
	return request('/role/doList',params,'POST')
}

export function doSave(params) {
	return request('/role/doSave',params,'POST')
}

export function doModify(params) {
	return request('/role/doModify',params,'PUT')
}

export function doRemove(params) {
	return request('/role/doRemove',params,'DELETE')
}
