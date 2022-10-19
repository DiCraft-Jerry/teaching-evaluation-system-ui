import request from '../request'
export function doListCourseAndWareByUserId() {
    return request('/courseware/doListCourseAndWareByUserId',{},'GET')
}