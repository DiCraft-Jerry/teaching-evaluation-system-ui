import request from '../request'

export function doLoginLog() {
	return request('/log/doLoginLog',{},'GET')
}