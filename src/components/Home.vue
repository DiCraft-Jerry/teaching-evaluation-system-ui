<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref, reactive, computed, onMounted } from "vue";

import {
	Menu as IconMenu,
	Setting,
	Goods,
	Operation,
	Fold,
	Expand,
	SwitchButton,
	Document,
	Lock,
	Route,
	ArrowDown,
} from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";

import { doLogout } from "../api/user";

import store from "../store";
import { useRouter } from "vue-router";

const isCollapse = ref(false);

const handleClick = () => {
	// eslint-disable-next-line no-alert
	alert("button click");
};

const windows = reactive({
	windowsHeight:
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight,
	windowsWidth:
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth,
});

const menuHeight = windows.windowsHeight - 49;

const menuWidth = computed(() => {
	return isCollapse.value ? 64 : 200;
});

const menuCollapse = () => {
	isCollapse.value = !isCollapse.value;
};

const menuSelect = (index, indexPath, item, routeResult) => {
	menuTagPush(index);
};

const menuTagPush = (path) => {
	router.getRoutes().forEach((x) => {
		if (x.path === path) {
			let exist = false;
			menuTags.value.forEach((tag) => {
				if (tag.name === x.name) {
					exist = true;
					return;
				}
			});
			if (!exist) {
				menuTags.value.push({
					name: x.name,
					path: x.path,
				});
			}
			activeMenu.value = x.path;
		}
	});
};

const menuTagClick = (path) => {
	menuTags.value.forEach((tag) => {
		if (tag.path === path && activeMenu.value != tag.path) {
			router.push(tag.path);
			activeMenu.value = tag.path;
			return;
		}
	});
};

const menuTagClose = (path) => {
	for (let i in menuTags.value) {
		let tag = menuTags.value[i];
		if (tag.path === path) {
			let nextPath = activeMenu.value;
			if (tag.path === activeMenu.value) {
				if (i == 0) {
					if (menuTags.value.length == 1) {
						nextPath = "/";
					} else {
						nextPath = menuTags.value[Number(i + 1)].path;
					}
				} else {
					nextPath = menuTags.value[i - 1].path;
				}
				activeMenu.value = nextPath;
			}
			menuTags.value.splice(i, 1);
			router.push(nextPath);
			return;
		}
	}
};

const router = useRouter();

const menuTags = ref([]);

const activeMenu = ref();

const handelLogout = () => {
	doLogout()
		.then((res) => {
			if (res.code != 200) {
				ElMessage({
					message: res.msg === null ? "系统后台异常！" : res.msg,
					grouping: true,
					type: "error",
				});
			} else {
				localStorage.removeItem("tokenName");
				localStorage.removeItem("tokenValue");
				localStorage.removeItem("resources");
				localStorage.removeItem("userName");
				localStorage.removeItem("roleLabel");
				store.commit("userStore/cleanrResource");
				ElMessage({
					message: "登出成功",
					grouping: true,
					type: "success",
				});
				router.push("/login");
			}
		})
		.catch((err) => {
			ElMessage({
				message: err,
				grouping: true,
				type: "error",
			});
		});
};

const handelUserInfo = () => {
	menuTagPush("/User/Info");
	router.push("/User/Info");
};

const handelLockScreen = () => {
	router.push("/lockScreen");
};

const resources = store.state.userStore.resources;
const userName = ref(localStorage.getItem("userName"));
const roleLabel = ref(localStorage.getItem("roleLabel"));

onMounted(() => {
	let currentRoute = router.currentRoute.value;
	if (currentRoute.path === "/") return;
	activeMenu.value = currentRoute.path;

	menuTags.value.push({
		name: currentRoute.name,
		path: currentRoute.path,
	});
});
</script>

<template>
	<el-container>
		<el-aside :width="menuWidth + 'px'">
			<div class="title">
				<img class="title-logo" src="../assets/logo.png" />
				<span v-if="!isCollapse" class="title-text"
					><font color="#fff">在线学习系统</font></span
				>
			</div>
			<el-scrollbar :height="menuHeight + 'px'">
				<el-menu
					class="el-menu-vertical-demo"
					active-text-color="#ffd04b"
					background-color="#545c64"
					:collapse="isCollapse"
					:unique-opened="true"
					:default-active="activeMenu"
					router
					@select="menuSelect"
					:collapse-transition="false"
					text-color="#fff"
				>
					<el-menu-item index="/Dashboard/1">
						<el-icon>
							<icon-menu />
						</el-icon>
						首页
					</el-menu-item>
					<el-sub-menu
						index="/Settings"
						v-if="resources.indexOf('Settings') != -1"
					>
						<template #title>
							<el-icon>
								<Setting />
							</el-icon>
							<span>系统管理</span>
						</template>
						<el-menu-item
							index="/Settings/User"
							v-if="resources.indexOf('Settings-User') != -1"
							>用户管理</el-menu-item
						>
						<el-menu-item
							index="/Settings/Role"
							v-if="resources.indexOf('Settings-Role') != -1"
							>角色管理</el-menu-item
						>
						<el-menu-item
							index="/Settings/Department"
							v-if="resources.indexOf('Settings-Department') != -1"
							>部门管理
						</el-menu-item>

						<el-menu-item
							index="/Settings/Resource"
							v-if="resources.indexOf('Settings-Resource') != -1"
							>资源管理
						</el-menu-item>
					</el-sub-menu>
					<el-sub-menu
						index="/Operations"
						v-if="resources.indexOf('Operations') != -1"
					>
						<template #title>
							<el-icon>
								<Goods />
							</el-icon>
							<span>业务管理</span>
						</template>
						<el-menu-item
							index="/Operations/Course"
							v-if="resources.indexOf('Operations-Course') != -1"
							>课程管理
						</el-menu-item>
						<el-menu-item
							index="/Operations/Courseware"
							v-if="resources.indexOf('Operations-Courseware') != -1"
							>课件管理
						</el-menu-item>
						<el-menu-item
							index="/Operations/Batch"
							v-if="resources.indexOf('Operations-Batch') != -1"
							>批次管理
						</el-menu-item>
						<el-menu-item
							index="/Operations/UserBatch"
							v-if="resources.indexOf('Operations-UserBatch') != -1"
							>用户批次管理
						</el-menu-item>
					</el-sub-menu>
					<el-sub-menu
						index="/Students"
						v-if="resources.indexOf('Students') != -1"
					>
						<template #title>
							<el-icon>
								<Goods />
							</el-icon>
							<span>学员课程</span>
						</template>
						<el-menu-item
							index="/Students/Course"
							v-if="resources.indexOf('Students-Course') != -1"
							>课程学习</el-menu-item
						>
					</el-sub-menu>
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header
				:height="'48px'"
				style="
					padding-left: 10px;
					background-color: #545c64;
					display: flex;
					border-bottom: 1px solid #dcdfe6;
				"
			>
				<div style="text-align: left; padding: 0 6px">
					<div v-if="!isCollapse">
						<el-icon
							:size="18"
							style="margin-top: 15px; cursor: pointer"
							@click="menuCollapse"
							color="#fff"
						>
							<Fold />
						</el-icon>
					</div>
					<div :span="2" v-else>
						<el-icon
							:size="18"
							style="margin-top: 15px; cursor: pointer"
							@click="menuCollapse"
							color="#fff"
						>
							<Expand />
						</el-icon>
					</div>
				</div>
				<div
					style="
						text-align: left;
						padding-left: 12px;
						width: calc(100% - 135px);
					"
				>
					<!-- <el-breadcrumb separator="/" style="line-height: 48px;">
						<el-breadcrumb-item>{{breadcrumbItem.parent.name}}</el-breadcrumb-item>
						<el-breadcrumb-item>{{breadcrumbItem.name}}</el-breadcrumb-item>
					</el-breadcrumb> -->
				</div>
				<div>
					<el-avatar
						style="margin-top: 3.5px"
						src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
					/>
				</div>
				<div style="float: right">
					<el-dropdown>
						<span class="el-dropdown-link" style="color: #fff">
							{{ userName }}
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="handelUserInfo">
									<el-icon> <Document /> </el-icon>个人资料
								</el-dropdown-item>
								<el-dropdown-item @click="handelLockScreen">
									<el-icon> <Lock /> </el-icon>锁定屏幕
								</el-dropdown-item>
								<el-dropdown-item divided @click="handelLogout">
									<el-icon> <SwitchButton /> </el-icon>退出系统
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</el-header>
			<el-container>
				<el-header
					:height="'40px'"
					style="border-bottom: 1px solid #dcdfe6"
					v-if="menuTags.length > 0"
				>
					<div class="menu-tags">
						<el-tag
							v-for="(item, index) in menuTags"
							class="menu-tag-item"
							hit
							:effect="activeMenu === item.path ? 'dark' : 'plain'"
							@click="menuTagClick(item.path)"
							@close="menuTagClose(item.path)"
							:closable="menuTags.length > 1"
							>{{ item.name }}</el-tag
						>
					</div>
				</el-header>
				<el-main style="background-color: rgb(195, 215, 223)">
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>

<style scoped>
.el-aside {
	overflow: hidden;
	background-color: #545c64;
	border-right: 1px solid #c9c9c9;
}

.title {
	text-align: center;
	border-bottom: 1px solid #545c64;
	line-height: 47px;
}

.title .title-logo {
	vertical-align: middle;
	width: 30px;
}

.title .title-text {
	margin-left: 6px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
}

.menu-tags {
	text-align: left;
	line-height: 40px;
}

.menu-tags .menu-tag-item {
	margin-right: 6px;
	cursor: pointer;
}

.menu-tags .menu-tag-item .el-tag {
	color: #000;
}

.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	align-items: center;
	line-height: 47px;
}
</style>
