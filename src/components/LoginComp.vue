<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { User, Lock, Key } from "@element-plus/icons-vue";

import { ElMessage } from "element-plus";

import { doLogin } from "../api/user";

import { createCircleCaptcha } from "../api/system";

import store from "../store";

const router = useRouter();

const show = ref(false);

const title = ref("在线学习系统系统v1.0");
const loading = ref(false);

const formData = ref({
  account: "",
  password: "",
  verifyCode: "",
  verifyKey: "",
});

onMounted(() => {
  formData.value.verifyKey = uuid(32, 0);
  show.value = true;
  handelCaptcha();
});

const handleLogin = () => {
  if (formData.value.account === "" || formData.value.account === undefined) {
    ElMessage({
      message: "请输入用户账户！",
      grouping: true,
      type: "error",
    });
    return;
  }
  if (formData.value.password === "" || formData.value.password === undefined) {
    ElMessage({
      message: "请输入登录密码！",
      grouping: true,
      type: "error",
    });
    return;
  }
  if (
    formData.value.verifyCode === "" ||
    formData.value.verifyCode === undefined
  ) {
    ElMessage({
      message: "请输入验证码！",
      grouping: true,
      type: "error",
    });
    return;
  }
  loading.value = true;
  doLogin(formData.value)
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
        handelCaptcha();
      } else {
        ElMessage({
          message: "登录成功",
          grouping: true,
          type: "success",
        });
        let tokenName = res.data.tokenName;
        let tokenValue = res.data.tokenValue;
        let resources = res.data.resources;
        let userName = res.data.userName;
        let roleLabel = res.data.roleLabel;
        localStorage.setItem("tokenName", tokenName);
        localStorage.setItem("tokenValue", tokenValue);
        localStorage.setItem("resources", resources.toString());
        localStorage.setItem("userName", userName);
        localStorage.setItem("roleLabel", roleLabel);
        store.commit("userStore/addResource", resources.toString());
        router.push("/Dashboard/1");
      }
      loading.value = false;
    })
    .catch((err) => {
      ElMessage({
        message: err,
        grouping: true,
        type: "error",
      });
      loading.value = false;
      formData.value.verifyCode = "";
      handelCaptcha();
    });
};

const captchaImage = ref();

const handelCaptcha = () => {
  createCircleCaptcha(formData.value.verifyKey)
    .then((res) => {
      let binaryData = [];
      binaryData.push(res);
      captchaImage.value = window.URL.createObjectURL(new Blob(binaryData));
    })
    .catch((err) => {
      ElMessage({
        message: err,
        grouping: true,
        type: "error",
      });
    });
};

const uuid = (len, radix) => {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
};
</script>

<template>
  <div class="loginBg">
    <div class="loginBoxBg">
      <Transition name="loginbg-slide-fade"
        ><img v-show="show" src="../assets/login-box-bg.svg"
      /></Transition>
      <Transition name="loginbg-slide-fade-title">
        <div class="title" v-show="show">{{ title }}</div>
      </Transition>
    </div>
  </div>
  <div class="loginForm">
    <div class="loginBoxBg">
      <Transition name="loginform-slide-fade"
        ><div class="title" v-show="show">用户登录</div></Transition
      >
      <Transition name="loginform-slide-fade-input">
        <el-input
          v-show="show"
          v-model="formData.account"
          size="large"
          clearable
          placeholder="请输入用户工号"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </Transition>
      <Transition name="loginform-slide-fade-input">
        <el-input
          style="margin-top: 24px"
          v-show="show"
          v-model="formData.password"
          size="large"
          type="password"
          clearable
          placeholder="请输入登录密码"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </Transition>
      <Transition name="loginform-slide-fade-input">
        <div v-show="show" style="display: flex; margin-top: 24px">
          <div style="width: 60%">
            <el-input
              style="text-align: left; margin-top: 5px"
              v-model="formData.verifyCode"
              size="large"
              clearable
              placeholder="请输入验证码"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </div>
          <img
            style="height: 48px; cursor: pointer"
            :src="captchaImage"
            @click="handelCaptcha"
          />
        </div>
      </Transition>
      <Transition name="loginform-slide-fade-btn">
        <el-button
          v-show="show"
          style="margin-top: 24px; width: 100%; font-size: 110%"
          type="primary"
          size="large"
          color="#2a7dc9"
          @click="handleLogin"
          :loading="loading"
        >
          登 录
        </el-button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@import url("../transition.css");

.loginBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  background-image: url("../assets/login-bg.svg");
  background-position: 100%;
  background-repeat: no-repeat;
  background-size: auto 100%;
  content: "";
}

* .loginBoxBg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.loginBg .loginBoxBg img {
  width: 50%;
  vertical-align: middle;
  text-align: center;
}

.loginBg .loginBoxBg .title {
  margin: 0 auto;
  width: 50%;
  color: #fff;
  line-height: 2;
  font-size: 200%;
  padding: 12px 12px;
}

.loginForm {
  position: absolute;
  top: 0;
  left: 70%;
  width: 25%;
  height: 100%;
}

.loginForm .loginBoxBg .title {
  text-align: left;
  width: 100%;
  padding: 0 0 24px 0;
  font-size: 200%;
}
</style>
