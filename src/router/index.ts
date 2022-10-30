import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router";

import {
	doCheckLogin
} from '../api/user'

import {
	ElMessage,
	ElLoading
} from 'element-plus'

import store from '../store'

const routes: RouteRecordRaw[] = [
	//pc端路由
	{
		path: "/login",
		name: "login",
		component: () => import('../components/LoginComp.vue'),
	},
	{
		path: "/lockScreen",
		name: "lockScreen",
		component: () => import('../components/HelloWorld.vue'),
	},
	{ 	path: "/unLockScreen",
		name: "unLockScreen",
		component: () => import('../components/Home.vue'), 
	},
	{
		path: "/",
		name: "home",
		component: () => import('../components/Home.vue'),
		children: [{
			path: "Dashboard/1",
			name: '首页',
			component: () => import('../components/HelloWorld.vue')
		},{
			path: "User/Info",
			name: '个人资料',
			component: () => import('../components/UserInfo.vue')
		}, {
			path: "Settings/Role",
			name: '角色管理',
			component: () => import('../components/Role.vue')
		}, {
			path: "Settings/User",
			name: '用户管理',
			component: () => import('../components/User.vue')
		}, {
			path: "Settings/Resource",
			name: '资源管理',
			component: () => import('../components/Resource.vue')
		}, {
			path: '/Operations/Course',
			name: '课程管理',
			component: () => import('../components/Course.vue')
		},
		{
			path: 'Operations/Courseware',
			name: '课件管理',
			component: () => import('../components/Courseware.vue')
		},
		{
			path: 'Operations/Batch',
			name: '批次管理',
			component: () => import('../components/Batch.vue')
		},
		{
			path: 'Operations/UserBatch',
			name: '用户批次管理',
			component: () => import('../components/UserBatch.vue')
		},
		{
			path: 'Students/Course',
			name: '学生课程管理',
			component: () => import('../components/StudentCourse.vue')
		},
		{
			path: 'Operations/Score',
			name: '成绩管理',
			component: () => import('../components/Score.vue')
		},
		{
			path: 'Quota/Upload',
			name: '指标上传',
			component: () => import('../components/Quota/Upload.vue')
		},
		{
			path: 'Quota/Settings',
			name: '指标管理',
			component: () => import('../components/Quota/Settings.vue')
		}



		]
	}
]

const router: Router = createRouter({
	history: createWebHashHistory(),
	routes: routes
})

let loading = null
router.beforeEach((to, from, next) => {
	if (to.name != 'login' && to.path.indexOf('mobile') == -1) {
		const token = localStorage.getItem("tokenValue");
		if (token) {
			doCheckLogin().then((res: any) => {
				if (res.code != 200) {
					ElMessage({
						message: res.msg === null ? '系统后台异常！' : res.msg,
						grouping: true,
						type: 'error',
					})
					next({ name: 'login' })
				} else {
					store.commit('userStore/addResource', res.data.toString())
					next()
				}
			})
				.catch(err => {
					ElMessage({
						message: err,
						grouping: true,
						type: 'error',
					})
					next({ name: 'login' })
				})
		} else {
			ElMessage({
				message: '请重新登录！',
				grouping: true,
				type: 'warning',
			})
			next({ name: 'login' })
		}
	} else {
		if (to.path === '/mobile') {
			next({ name: 'mobile-home' })
		} else {
			next()
		}
	}
})
export default router
