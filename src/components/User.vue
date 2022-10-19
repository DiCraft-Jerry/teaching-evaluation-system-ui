<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onUnmounted, onMounted, ref, computed, watch, reactive } from "vue";

import { Setting, Edit, Delete } from "@element-plus/icons-vue";

import { doList, doSave, doModify, doRemove } from "../api/user.ts";

import { doAll as doRoleAll } from "../api/role.ts";

import { ElMessage, ElLoading } from "element-plus";

import store from "../store";
import { nextTick } from "vue";

const resources = store.state.userStore.resources;

const userQuery = ref({
  jobNo: "",
  actualName: "",
  mobile: "",
  status: "",
  deptIds: [],
  roleId: "",
  pageNo: 1,
  pageSize: 10,
});

watch(userQuery.value, () => {
  if (resources.indexOf("Settings-User-Query") > -1) {
    handelList();
  }
});

const userModify = ref({
  id: "",
  jobNo: "",
  deptId: "",
  deptLabel: "",
  roleId: "",
  roleLabel: "",
  actualName: "",
  mobile: "",
  email: "",
  password: "",
  sex: 1,
  status: 1,
  description: "",
});

const listResponse = ref({
  records: [],
  total: 0,
});

const ruleFormRef = ref();

const loading = ref(false);

const switchLoading = ref(false);

const drawer = ref({
  type: "add",
  show: false,
  title: "新增用户",
});

const rules = ref<FormRules>({
  jobNo: [
    {
      required: true,
      message: "请输入用户工号",
      trigger: "blur",
    },
  ],
  deptId: [
    {
      required: true,
      message: "请选择所属部门",
      trigger: "blur",
    },
  ],
  roleId: [
    {
      required: true,
      message: "请选择所属角色",
      trigger: "blur",
    },
  ],
  actualName: [
    {
      required: true,
      message: "请输入用户姓名",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      required: true,
      message: "请输入手机号码",
      trigger: "blur",
      //   validator: (rule: any, value: any, callback: any) => {
      //     if (value === "" || !/^1[345789][0-9]{9}$/.test(value)) {
      //       return callback(new Error("请输入正确的手机号！"));
      //     } else {
      //       callback();
      //     }
      //   },
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱地址",
      trigger: "blur",
      // validator: (rule: any, value: string, callback: any) => {
      //   if (value.indexOf("@") === -1) {
      //     return callback(new Error("请输入正确的邮箱！"));
      //   } else {
      //     callback();
      //   }
      // },
    },
  ],
  password: [
    {
      required: true,
      message: "请输入登录密码",
      trigger: "blur",
    },
  ],
});

const departmentList = ref();

const showDrawer = (type, title, data) => {
  drawer.value.type = type;
  drawer.value.show = true;
  drawer.value.title = title;
  if (type === "edit") {
    nextTick(function () {
      userModify.value = JSON.parse(JSON.stringify(data));
    });
  }
};

const closeDrawer = () => {
  drawer.value.show = false;
  userModify.value = {
    id: "",
    jobNo: "",
    deptId: "",
    deptLabel: "",
    roleId: "",
    roleLabel: "",
    actualName: "",
    mobile: "",
    email: "",
    password: "",
    sex: 1,
    status: 1,
    description: "",
  };
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
};

const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList(userQuery.value)
      .then((res) => {
        if (res.code != 200) {
          ElMessage({
            message: res.msg === null ? "系统后台异常！" : res.msg,
            grouping: true,
            type: "error",
          });
        } else {
          listResponse.value = res.data;
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
      });
  }, 300);
};

const handelAdd = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "新增中，请稍后...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (!ruleFormRef) return loading.close();
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      doSave(userModify.value)
        .then((res) => {
          if (res.code != 200) {
            ElMessage({
              message: res.msg === null ? "系统后台异常！" : res.msg,
              grouping: true,
              type: "error",
            });
          } else {
            ElMessage({
              message: res.msg,
              grouping: true,
              type: "success",
            });
            closeDrawer();
            handelList();
          }
          loading.close();
        })
        .catch((err) => {
          ElMessage({
            message: err,
            grouping: true,
            type: "error",
          });
          loading.close();
        });
    } else {
      loading.close();
    }
  });
};

const handelModify = (row) => {
  const loading = ElLoading.service({
    lock: true,
    text: "修改中，请稍后...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (!ruleFormRef) return loading.close();
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      doModify(userModify.value)
        .then((res: any) => {
          if (res.code != 200) {
            ElMessage({
              message: res.msg === null ? "系统后台异常！" : res.msg,
              grouping: true,
              type: "error",
            });
          } else {
            ElMessage({
              message: res.msg,
              grouping: true,
              type: "success",
            });
            closeDrawer();
            handelList();
          }
          loading.close();
        })
        .catch((err) => {
          ElMessage({
            message: err,
            grouping: true,
            type: "error",
          });
          loading.close();
        });
    } else {
      loading.close();
    }
  });
};

const handelChangeStatus = (row) => {
  doModify(row)
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: "success",
        });
        closeDrawer();
        handelList();
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

const handelRemove = (id) => {
  const ids = [id];
  doRemove({ ids })
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        ElMessage({
          message: res.msg,
          grouping: true,
          type: "success",
        });
        handelList();
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

const handelParentList = () => {
  doAll()
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        departmentList.value = res.data;
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

const roleChange = (val) => {
  for (let i in roleList.value) {
    let roleLabel = roleList.value[i].name;
    let roleId = roleList.value[i].id;
    if (roleId === val) {
      userModify.value.roleLabel = roleLabel;
    }
  }
};

const roleList = ref([]);
const handelRoleList = () => {
  doRoleAll()
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        roleList.value = res.data;
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

const topBarRef = ref();

const tabelHeight = ref(550);
const timer = ref(true);
const setTabelHeight = () => {
  let windowsHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  tabelHeight.value =
    windowsHeight - topBarRef.value.clientHeight - 18 - 24 - 20 - 32 - 48;
  if (!timer.value) {
    //防止多次触发监听页面卡顿
    setTimeout(function () {
      timer.value.timer = false;
    }, 400);
  }
  console.log(tabelHeight.value);
};

onMounted(() => {
  document.addEventListener("resize", setTabelHeight, true);
  handelList();
  handelRoleList();
});
onUnmounted(() => {
  document.removeEventListener("resize", setTabelHeight);
});
</script>

<template>
  <div
    ref="topBarRef"
    style="
      display: flex;
      background-color: #fff;
      padding: 0 12px 12px 12px;
      flex-flow: wrap;
    "
  >
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 120px; line-height: 32px">用户工号</label>
      <el-input v-model="userQuery.jobNo" placeholder="请输入" clearable />
    </div>
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 120px; line-height: 32px">用户名称</label>
      <el-input v-model="userQuery.actualName" placeholder="请输入" clearable />
    </div>
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 120px; line-height: 32px">手机号码</label>
      <el-input v-model="userQuery.mobile" placeholder="请输入" clearable />
    </div>
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 120px; line-height: 32px">角色</label>
      <div style="">
        <el-select v-model="userQuery.roleId" placeholder="请选择" clearable>
          <el-option
            v-for="role in roleList"
            :label="role.name"
            :value="role.id"
          />
          <!-- <el-option label="禁用" value="0" /> -->
        </el-select>
      </div>
    </div>
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 120px; line-height: 32px">状态</label>
      <div style="">
        <el-select v-model="userQuery.status" placeholder="请选择" clearable>
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </div>
    </div>
    <div style="display: flex; padding-left: 12px; margin-top: 12px">
      <el-button type="primary" @click="handelList" :loading="loading"
        >搜索</el-button
      >
    </div>
  </div>
  <div
    style="
      background-color: #fff;
      padding: 12px;
      text-align: left;
      margin-top: 18px;
    "
  >
    <el-row>
      <el-col :span="4"
        ><div style="line-height: 32px; text-align: left">用户列表</div></el-col
      >
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Settings-User-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增用户')"
          >新增用户</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :max-height="tabelHeight"
      :data="listResponse.records"
      border
      style="width: 100%; margin-top: 18px"
      empty-text="暂无数据"
      table-layout="auto"
      v-loading="loading"
    >
      <el-table-column prop="actualName" label="用户姓名" />
      <el-table-column prop="jobNo" label="用户工号" />
      <el-table-column prop="roleLabel" label="所属角色" />
      <el-table-column prop="status" label="状态">
        <template
          #default="scope"
          v-if="resources.indexOf('Settings-User-Modify') > -1"
        >
          <el-switch
            v-model="scope.row.status"
            inline-prompt
            active-text="已启用"
            :active-value="1"
            inactive-text="已禁用"
            :inactive-value="0"
            :width="65"
            :loading="switchLoading"
            @change="handelChangeStatus(scope.row)"
          />
        </template>
        <template #default="scope" v-else>
          <el-tag type="success" effect="dark" v-if="scope.row.status === 1"
            >已启用</el-tag
          >
          <el-tag type="danger" effect="dark" v-else>已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <el-tag effect="dark" v-if="scope.row.sex === 1">男</el-tag>
          <el-tag type="danger" effect="dark" v-else>女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" />
      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Settings-User-Modify') > -1 ||
          resources.indexOf('Settings-User-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-tooltip
              v-if="resources.indexOf('Settings-User-Modify') > -1"
              class="box-item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-breadcrumb-item>
                <el-icon
                  class="icon-btn"
                  :size="18"
                  style="margin-top: 2px"
                  color="#409EFF"
                  @click="showDrawer('edit', '编辑用户', scope.row)"
                >
                  <Edit />
                </el-icon>
              </el-breadcrumb-item>
            </el-tooltip>
            <el-tooltip
              v-if="resources.indexOf('Settings-User-Remove') > -1"
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-breadcrumb-item>
                <el-popconfirm
                  title="确定删除该角色？"
                  @confirm="handelRemove(scope.row.id)"
                >
                  <template #reference>
                    <el-icon
                      class="icon-btn"
                      :size="18"
                      style="margin-top: 2px"
                      color="#F56C6C"
                      ><Delete
                    /></el-icon>
                  </template>
                </el-popconfirm>
              </el-breadcrumb-item>
            </el-tooltip>
          </el-breadcrumb>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="resources.indexOf('Settings-User-Query') > -1">
      <el-col :span="24">
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            v-model:current-page="userQuery.pageNo"
            :page-size="userQuery.pageSize"
            layout="total,prev, pager, next, jumper"
            :total="listResponse.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-drawer
    v-model="drawer.show"
    direction="rtl"
    @close="closeDrawer"
    append-to-body
    size="40%"
  >
    <template #header>
      <h4>{{ drawer.title }}</h4>
    </template>
    <template #default>
      <el-form
        :model="userModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="用户工号" prop="jobNo"
          ><el-input v-model="userModify.jobNo" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="所属角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="userModify.roleId"
            @change="roleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名" prop="actualName"
          ><el-input v-model="userModify.actualName" placeholder="请输入"
        /></el-form-item>
        <el-form-item
          label="登录密码"
          prop="password"
          v-if="drawer.type === 'add'"
        >
          <el-input
            v-model="userModify.password"
            placeholder="请输入"
            show-password
            type="password"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile"
          ><el-input v-model="userModify.mobile" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="邮箱地址" prop="email"
          ><el-input v-model="userModify.email" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userModify.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userModify.status"
            inline-prompt
            active-text="已启用"
            :active-value="1"
            inactive-text="已禁用"
            :inactive-value="0"
            :width="65"
          />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="userModify.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="备注信息,非必填"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closeDrawer()">取消</el-button>
        <el-button
          type="primary"
          @click="handelAdd"
          v-if="drawer.type === 'add'"
          >提交</el-button
        >
        <el-button type="primary" @click="handelModify(userModify)" v-else
          >修改</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.icon-btn {
  cursor: pointer;
}
</style>