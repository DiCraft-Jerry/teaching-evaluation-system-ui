<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onUnmounted, onMounted, ref, computed, watch } from "vue";

import { Setting, Edit, Delete } from "@element-plus/icons-vue";

import { doList, doSave, doModify, doRemove } from "../api/role";
import { nextTick } from "vue";

import { doList as doResourceList } from "../api/resource";

import { ElMessage, FormRules, ElLoading } from "element-plus";

import store from "../store";

const resources = store.state.userStore.resources;

const roleQuery = ref({
  name: "",
  status: "",
  pageNo: 1,
  pageSize: 10,
});

watch(roleQuery.value, () => {
  if (resources.indexOf("Settings-Role-Query") > -1) {
    handelList();
  }
});

const roleModify = ref({
  id: "",
  name: "",
  status: 1,
  resourceList: [],
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
  title: "新增角色",
});

const isDigit = (rule: any, value: any, callback: any) => {
  if (value == "" || value == null) {
    callback(new Error("不能为空"));
  }
  setTimeout(() => {
    if (!/^-?[1-9]\d*$/.test(value)) {
      callback(new Error("请输入正确的数字"));
    } else {
      callback();
    }
  }, 500);
};
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: "blur",
    },
  ],
  value: [
    {
      required: true,
      message: "请输入角色值",
      trigger: "blur",
    },
  ],
  sortCode: [
    {
      required: true,
      message: "请输入排序",
      trigger: "blur",
      validator: isDigit,
    },
  ],
});

const showDrawer = (type, title, data) => {
  drawer.value.type = type;
  drawer.value.show = true;
  drawer.value.title = title;
  if (type === "edit") {
    nextTick(function () {
      roleModify.value = JSON.parse(JSON.stringify(data));
    });
  }
};

const treeRef = ref();

const closeDrawer = () => {
  drawer.value.show = false;
  roleModify.value = {
    id: "",
    name: "",
    status: 1,
    resourceList: [],
    description: "",
  };
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([]);
  }
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
};

const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList(roleQuery.value)
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
      doSave(roleModify.value)
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

const handelModify = (row) => {
  const loading = ElLoading.service({
    lock: true,
    text: "修改中，请稍后...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (!ruleFormRef) return loading.close();
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
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

const resource = ref([]);

const handelResourceList = () => {
  doResourceList()
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        resource.value = res.data;
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

const resourceChange = (node, nodes) => {
  let resourceIds = [];
  for (let i in nodes.checkedNodes) {
    let node = nodes.checkedNodes[i];
    resourceIds.push(node.id);
  }
  roleModify.value.resourceList = resourceIds;
};
const topBarRef = ref();

const tabelHeight = ref(250);
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
};
onMounted(() => {
  document.addEventListener("resize", setTabelHeight, true);
  handelList();
  handelResourceList();
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
      <label style="width: 120px; line-height: 32px">角色名称</label>
      <el-input v-model="roleQuery.name" placeholder="请输入" clearable />
    </div>

    <div style="display: flex; width: 200px; margin-top: 12px">
      <label style="width: 60px; line-height: 32px">状态</label>
      <div style="">
        <el-select v-model="roleQuery.status" placeholder="请选择" clearable>
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </div>
    </div>
    <div style="display: flex; padding-left: 12px; margin-top: 12px">
      <el-button
        v-if="resources.indexOf('Settings-Role-Query') > -1"
        type="primary"
        @click="handelList"
        :loading="loading"
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
      <el-col :span="4"><div style="line-height: 32px">角色列表</div></el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Settings-Role-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增角色')"
          >新增角色</el-button
        >
      </el-col>
      <!-- <el-col :span="1" style="text-align: right;">
				<el-icon :size="20" style="cursor: pointer;margin-top:6px">
					<Setting />
				</el-icon>
			</el-col> -->
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
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="value" label="角色值" />
      <el-table-column prop="status" label="状态">
        <template
          #default="scope"
          v-if="resources.indexOf('Settings-Role-Modify') > -1"
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
      <!-- <el-table-column prop="sortCode" label="排序" /> -->
      <el-table-column prop="description" label="备注" />
      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Settings-Role-Modify') > -1 ||
          resources.indexOf('Settings-Role-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-tooltip
              v-if="resources.indexOf('Settings-Role-Modify') > -1"
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
                  @click="showDrawer('edit', '编辑角色', scope.row)"
                  ><Edit
                /></el-icon>
              </el-breadcrumb-item>
            </el-tooltip>
            <el-tooltip
              v-if="resources.indexOf('Settings-Role-Remove') > -1"
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

    <el-row v-if="resources.indexOf('Settings-Role-Query') > -1">
      <el-col :span="24">
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            v-model:current-page="roleQuery.pageNo"
            v-model:page-size="roleQuery.pageSize"
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
        :model="roleModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name"
          ><el-input v-model="roleModify.name" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="角色值" prop="value"
          ><el-input v-model="roleModify.value" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="roleModify.status"
            inline-prompt
            active-text="已启用"
            :active-value="1"
            inactive-text="已禁用"
            :inactive-value="0"
            :width="65"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortCode"
          ><el-input v-model="roleModify.sortCode" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="roleModify.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="备注信息,非必填"
          />
        </el-form-item>
        <el-form-item label="角色资源" prop="sources">
          <div style="border: 1px solid #dcdfe6; width: 100%">
            <el-tree
              :default-checked-keys="roleModify.resourceList"
              show-checkbox
              node-key="id"
              style="margin-top: 6px"
              ref="treeRef"
              class="filter-tree"
              :data="resource"
              :props="{
                children: 'children',
                label: 'name',
              }"
              default-expand-all
              @check="resourceChange"
            />
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button
          type="primary"
          @click="handelAdd"
          v-if="drawer.type === 'add'"
          >提交</el-button
        >
        <el-button type="primary" @click="handelModify(roleModify)" v-else
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