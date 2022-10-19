import request from '../request'

export function createCircleCaptcha(t) {
	return request('/system/createCircleCaptcha/'+t,{},'GET','blob')
}