<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doGet } from '../api/user.ts';
import { doLoginLog } from '../api/log.ts';
import { ElMessage } from 'element-plus';

import PasswordReset from './PasswordReset.vue';

const dialogVisible = ref(false);
const userInfo = ref({
	actualName: '',
	mobile: '',
	email: '',
	sex: '',
	description: '',
	roleLabel: ''
});

const loginLog = ref([]);

const handelUserInfo = () => {
	doGet()
		.then(res => {
			if (res.code != 200) {
				ElMessage({
					message: res.msg === null ? '系统后台异常！' : res.msg,
					grouping: true,
					type: 'error'
				});
			} else {
				userInfo.value = res.data;
			}
		})
		.catch(err => {
			ElMessage({
				message: err,
				grouping: true,
				type: 'error'
			});
		});
};

const handelLoginLog = () => {
	doLoginLog()
		.then(res => {
			if (res.code != 200) {
				ElMessage({
					message: res.msg === null ? '系统后台异常！' : res.msg,
					grouping: true,
					type: 'error'
				});
			} else {
				loginLog.value = res.data;
			}
		})
		.catch(err => {
			ElMessage({
				message: err,
				grouping: true,
				type: 'error'
			});
		});
};

const handelDialogClose = () => {
	dialogVisible.value = false;
};

onMounted(() => {
	handelUserInfo();
	handelLoginLog();
});
</script>

<template>
	<div style="background-color: #fff;padding: 12px;">
		<el-descriptions title="资料信息" :column="3" border>
			<template #extra>
				<el-button type="primary" @click="dialogVisible = true">修改密码</el-button>
			</template>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">用户姓名</div>
				</template>
				{{ userInfo.actualName }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">电话号码</div>
				</template>
				{{ userInfo.mobile }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">邮箱地址</div>
				</template>
				{{ userInfo.email }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">性别</div>
				</template>
				<el-tag effect="dark" v-if="userInfo.sex === 1">男</el-tag>
				<el-tag type="danger" effect="dark" v-else>女</el-tag>
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">所属角色</div>
				</template>
				{{ userInfo.roleLabel }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">注册时间</div>
				</template>
				{{ userInfo.createTime }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">备注信息</div>
				</template>
				{{ userInfo.description }}
			</el-descriptions-item>
		</el-descriptions>
	</div>
	<div style="background-color: #fff;padding: 12px;margin-top:18px;">
		<div style="font-size:16px;font-weight:700;text-align: left;">登录日志</div>
		<el-table :data="loginLog" style="width: 100%;margin-top:18px;">
			<el-table-column type="index" width="50" />
			<el-table-column prop="account" label="登录账号" />
			<el-table-column prop="latestTime" label="登录时间" />
			<el-table-column prop="latestIp" label="IP地址" />
		</el-table>
	</div>
	<el-dialog v-model="dialogVisible" title="密码修改" width="30%"><PasswordReset @closeDialog="handelDialogClose"></PasswordReset></el-dialog>
</template>

<style scoped></style>
