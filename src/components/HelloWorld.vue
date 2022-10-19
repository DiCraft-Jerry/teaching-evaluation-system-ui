<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const count = ref(0);
const userName = ref(localStorage.getItem("userName"));
const router = useRouter();

const handelLockScreen = () => {
	router.push("/unLockScreen");
};
</script>

<template>
	<div class="finish-wrap">
		<el-card class="box-card">
			你好，<span
				><font color="red">{{ userName }}</font></span
			>！
			<br />
			<img class="logo" src="../assets/asoul.jpg" />
			<br />
			欢迎登录本系统！
			<br />
			<el-button type="primary" @click="handelLockScreen">
				<el-icon> <Lock /> </el-icon>关闭屏幕锁定
			</el-button>
		</el-card>
	</div>
</template>

<style scoped>
.text {
	font-size: 14px;
}

.item {
	padding: 18px 0;
}

.box-card {
	width: 480px;
}

body {
	color: #42b983;
}

label {
	margin: 0 0.5em;
	font-weight: bold;
}

code {
	background-color: #eee;
	padding: 2px 4px;
	border-radius: 4px;
	color: #304455;
}

.finish-wrap {
	min-height: 100vh;
	height: 100%;
	position: fixed;
	width: 100%;
	left: 40%;
}

.logo {
	vertical-align: middle;
	width: 200px;
}
</style>
