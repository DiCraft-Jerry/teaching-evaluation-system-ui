<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus';

import {doResetPassword} from '../api/user.ts'

const ruleFormRef = ref<FormInstance>()

const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入当前密码'))
  }
  callback()
}

const validateNewPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新设密码'))
  } else {
    if (ruleForm.newPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPassword', () => null)
    }
    callback()
  }
}
const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== ruleForm.newPassword) {
    callback(new Error("两次新密码不一致"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  password: '',
  newPassword: '',
  checkPassword: '',
})

const rules = reactive({
  password: [{ validator: validatePassword, trigger: 'blur' }],
  newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
  checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
	  doResetPassword(ruleForm).then(res =>{
		  if (res.code != 200) {
		  	ElMessage({
		  		message: res.msg === null ? '系统后台异常！' : res.msg,
		  		grouping: true,
		  		type: 'error'
		  	});
		  } else {
		  	ElMessage({
		  		message: res.msg,
		  		grouping: true,
		  		type: 'success'
		  	});
			resetForm(ruleFormRef.value);
		  }
	  }).catch(err => {
		ElMessage({
			message: err,
			grouping: true,
			type: 'error'
		});
	});
    } else {
      return false
    }
  })
}

const emits = defineEmits(['closeDialog'])
const resetForm = (formEl: FormInstance | undefined) => {
  if (formEl){
	formEl.resetFields();
	emits('closeDialog');
  }
}
</script>

<template>
	<el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
		<el-form-item label="当前密码" prop="password"><el-input v-model="ruleForm.password" type="password" autocomplete="off" /></el-form-item>
		<el-form-item label="新设密码" prop="newPassword"><el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" /></el-form-item>
		<el-form-item label="密码确认" prop="checkPassword"><el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off" /></el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitForm(ruleFormRef)">修改</el-button>
			<el-button @click="resetForm(ruleFormRef)">关闭</el-button>
		</el-form-item>
	</el-form>
</template>

<style scoped></style>
