<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref, onMounted, computed, watch } from "vue";

import { Setting, Edit, Delete } from "@element-plus/icons-vue";

import {
  doList,
  doParentList,
  doSave,
  doModify,
  doRemove,
} from "../api/resource.ts";

import { ElMessage, ElLoading } from "element-plus";
import { nextTick } from "vue";
import store from "../store";

const resources = store.state.userStore.resources;

const typeOptions = ref([
  {
    label: "页面",
    value: 0,
  },
  {
    label: "按钮",
    value: 1,
  },
]);

const resourceQuery = ref({
  name: "",
  status: "",
  pageNo: 1,
  pageSize: 10,
});

watch(resourceQuery.value, () => {
  if (resources.indexOf("Settings-Resources-Query") > -1) {
    handelList();
  }
});

const resourceModify = ref({
  id: "",
  name: "",
  pid: "0",
  status: 1,
  type: 0,
  path: "",
  sortCode: "",
  sourceKey: "",
  description: "",
});

const parentList = ref([]);

const listResponse = ref([]);

const ruleFormRef = ref();

const loading = ref(false);

const switchLoading = ref(false);

const drawer = ref({
  type: "add",
  show: false,
  title: "新增部门",
});
const direction = ref("rtl");

const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur",
    },
  ],
  sortCode: [
    {
      required: true,
      message: "请输入排序",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请输入选择类型",
      trigger: "blur",
    },
  ],
  sourceKey: [
    {
      required: true,
      message: "请输入资源编码",
      trigger: "blur",
    },
  ],
});

const showDrawer = (type, title, data) => {
  drawer.value.type = type;
  drawer.value.show = true;
  drawer.value.title = title;
  if (type === "edit") {
    nextTick(function () {
      resourceModify.value = JSON.parse(JSON.stringify(data));
    });
  }
};

const closeDrawer = () => {
  drawer.value.show = false;
  resourceModify.value = {
    id: "",
    name: "",
    pid: "0",
    status: 1,
    type: 0,
    path: "",
    sortCode: "",
    sourceKey: "",
    description: "",
  };
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
};

const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList()
      .then((res) => {
        if (res.code != 200) {
          ElMessage({
            message: res.msg === null ? "系统后台异常！" : res.msg,
            grouping: true,
            type: "error",
          });
        } else {
          setTabelHeight();
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
      doSave(resourceModify.value)
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
            handelParentList();
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
          handelParentList();
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
  doParentList()
    .then((res) => {
      if (res.code != 200) {
        ElMessage({
          message: res.msg === null ? "系统后台异常！" : res.msg,
          grouping: true,
          type: "error",
        });
      } else {
        parentList.value.push({
          id: "0",
          name: "无",
        });
        parentList.value = parentList.value.concat(res.data);
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

const tabelHeight = ref(250);

const setTabelHeight = () => {
  let windowsHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  tabelHeight.value = windowsHeight - 47 - 40 - 40 - 24 - 32 - 20;
};

onMounted(() => {
  handelList();
  handelParentList();
});
</script>

<template>
  <!-- <div style="display: flex;background-color: #fff;padding: 0 12px 12px 12px;flex-flow: wrap;">
		<div style="display: flex;width: 200px;margin-top:12px;">
			<label style="width: 120px;line-height: 32px;">资源名称</label>
			<el-input v-model="resourceQuery.name" placeholder="请输入" clearable />
		</div>
		<div style="display: flex;width: 200px;margin-top:12px;">
			<label style="width: 120px;line-height: 32px;">状态</label>
			<div style="">
				<el-select v-model="resourceQuery.status" placeholder="请选择" clearable>
					<el-option label="启用" value="1" />
					<el-option label="禁用" value="0" />
				</el-select>
			</div>
		</div>
		<div style="display: flex;padding-left: 12px;margin-top:12px;"><el-button type="primary" @click="handelList" :loading="loading">搜索</el-button></div>
	</div> -->
  <div style="background-color: #fff; padding: 12px; text-align: left">
    <el-row>
      <el-col :span="4">
        <div style="line-height: 32px">资源列表</div>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Settings-Resource-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增资源')"
          >新增资源</el-button
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
      :data="listResponse"
      border
      style="width: 100%; margin-top: 18px"
      row-key="id"
      :tree-props="{ children: 'children' }"
      empty-text="暂无数据"
      table-layout="auto"
      v-loading="loading"
    >
      <el-table-column prop="name" label="资源名称" />
      <el-table-column prop="sortCode" label="排序" width="60" />
      <el-table-column prop="status" label="状态">
        <template
          #default="scope"
          v-if="resources.indexOf('Settings-Resource-Modify') > -1"
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
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag type="danger" effect="dark" v-if="scope.row.type === 1"
            >按钮</el-tag
          >
          <el-tag effect="dark" v-else>页面</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="前端路径" />
      <el-table-column prop="description" label="备注" />
      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Settings-Resource-Modify') > -1 ||
          resources.indexOf('Settings-Resource-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-breadcrumb-item>
              <el-tooltip
                v-if="resources.indexOf('Settings-Resource-Modify') > -1"
                class="box-item"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <el-icon
                  class="icon-btn"
                  :size="18"
                  style="margin-top: 2px"
                  color="#409EFF"
                  @click="showDrawer('edit', '编辑部门', scope.row)"
                >
                  <Edit />
                </el-icon>
              </el-tooltip>
            </el-breadcrumb-item>
            <el-tooltip
              v-if="resources.indexOf('Settings-Resource-Remove') > -1"
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-breadcrumb-item>
                <el-popconfirm
                  title="确定删除该部门？"
                  @confirm="handelRemove(scope.row.id)"
                >
                  <template #reference>
                    <el-icon
                      class="icon-btn"
                      :size="18"
                      style="margin-top: 2px"
                      color="#F56C6C"
                    >
                      <Delete />
                    </el-icon>
                  </template>
                </el-popconfirm>
              </el-breadcrumb-item>
            </el-tooltip>
          </el-breadcrumb>
        </template>
      </el-table-column>
    </el-table>
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
        :model="resourceModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="resourceModify.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="父节点" prop="pid">
          <el-tree-select
            style="width: 100%"
            v-model="resourceModify.pid"
            :data="parentList"
            node-key="id"
            check-strictly
            :render-after-expand="false"
            show-checkbox
            check-on-click-node
            :props="{ label: 'name' }"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="resourceModify.status"
            inline-prompt
            active-text="已启用"
            :active-value="1"
            inactive-text="已禁用"
            :inactive-value="0"
            :width="65"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            style="width: 100%"
            v-model="resourceModify.type"
            class="m-2"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <!-- <el-option label="页面" value="0" />
						<el-option label="按钮" value="1" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="前端路径" prop="path">
          <el-input
            v-model="resourceModify.path"
            placeholder="父节点页面/按钮可不填"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortCode">
          <el-input v-model="resourceModify.sortCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="资源编码" prop="sourceKey">
          <el-input v-model="resourceModify.sourceKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="resourceModify.description"
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
        <el-button type="primary" @click="handelModify(resourceModify)" v-else
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
