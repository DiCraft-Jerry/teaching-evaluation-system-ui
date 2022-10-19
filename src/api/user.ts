import request from '../request'

export function doLogin(params) {
	return request('/user/doLogin', params, 'POST')
}

export function doCheckLogin() {
	return request('/user/doCheckLogin', {}, 'GET')
}

export function doLogout() {
	return request('/user/doLogout', {}, 'GET')
}

export function doList(params) {
	return request('/user/doList', params, 'POST')
}

export function doSave(params) {
	return request('/user/doSave', params, 'POST')
}

export function doModify(params) {
	return request('/user/doModify', params, 'PUT')
}

export function doRemove(params) {
	return request('/user/doRemove', params, 'DELETE')
}

export function doGet() {
	return request('/user/doGet', {}, 'GET')
}

export function doResetPassword(params) {
	return request('/user/doResetPassword', params, 'POST')
}

export function doListAll() {
	return request('/user/doListAll', {}, 'GET')
}
