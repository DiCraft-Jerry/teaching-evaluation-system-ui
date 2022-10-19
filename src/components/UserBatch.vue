<script setup lang="ts">
import { onUnmounted, onMounted, ref, watch, reactive } from "vue";
import {
  Edit,
  Delete,
  Plus,
  Pointer,
  Picture as IconPicture,
} from "@element-plus/icons-vue";
import { nextTick } from "vue";
import { doList, doSave, doModify, doRemove } from "../api/userBatch";
import { ElMessage } from "element-plus";
import { doListAll } from "../api/user";
import { doListAll as doBatchList } from "../api/batch";

import { ElLoading } from "element-plus";
import store from "../store";

const resources = store.state.userStore.resources;
const userBatchQuery = ref({
  actualName: "",
  userId: "",
  batchName: "",
  batchId: "",
  pageNo: 1,
  pageSize: 10,
});
watch(userBatchQuery.value, () => {
  if (resources.indexOf("Operations-UserBatch-Query") > -1) {
    handelList();
  }
});
const userBatchModify = ref({
  id: "",
  actualName: "",
  userId: "",
  batchName: "",
  batchId: "",
  userIds: [],
  batchIds: [],
});

const listResponse = ref({
  records: [],
  total: 0,
});
const ruleFormRef = ref();
const switchLoading = ref(false);
const drawer = ref({
  type: "add",
  show: false,
  title: "新增用户-批次",
});

//表单规则
const rules = ref<FormRules>({
  userBatchName: [
    {
      required: true,
      message: "请输入批次名",
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: "状态",
      trigger: "blur",
    },
  ],
  sort: [
    {
      required: true,
      message: "请输入排序",
      trigger: "blur",
    },
  ],
});

const showDrawer = (type: string, title: string, data?: any) => {
  drawer.value.type = type;
  drawer.value.show = true;
  drawer.value.title = title;

  if (type === "edit") {
    nextTick(() => {
      userBatchModify.value = JSON.parse(JSON.stringify(data));
      userBatchModify.value.batchIds = [];

      listResponse.value.records.forEach((record) => {
        if (record.userId === userBatchModify.value.userId) {
          userBatchModify.value.batchIds.push(record.batchId);
        }
      });
      console.log(userBatchModify.value.batchIds);

      userBatchModify.value.userIds = [userBatchModify.value.userId];
    });
  }
};

//关闭弹出框
const closeDrawer = () => {
  if (ruleFormRef.value) {
    //清空表单
    ruleFormRef.value.resetFields();
    userBatchModify.value = {
      id: "",
      userBatchName: "",
      sort: "",
      status: 1,
    };
  }
  drawer.value.show = false;
};
const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList(userBatchQuery.value)
      .then((res: any) => {
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
      .catch((err: any) => {
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
  if (!ruleFormRef) {
    return loading.close();
  }
  ruleFormRef.value.validate((valid: any, fields: any) => {
    if (valid) {
      doSave(userBatchModify.value)
        .then((res: any) => {
          if (res.code != 200) {
            loading.close();
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
          loading.close();
          ElMessage({
            message: err,
            grouping: true,
            type: "error",
          });
        });
    } else {
      loading.close();
    }
  });
};

const handelModify = (row: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "修改中，请稍后...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  if (!ruleFormRef) return loading.close();

  ruleFormRef.value.validate((valid: boolean, fields: any) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: "修改中，请稍后...",
        background: "rgba(0, 0, 0, 0.7)",
      });

      doModify(userBatchModify.value)
        .then((res) => {
          if (res.code != 200) {
            loading.close();
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
          loading.close();
          ElMessage({
            message: err,
            grouping: true,
            type: "error",
          });
        });
    } else {
      loading.close();
    }
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
const userOption = ref([]);
const batchOption = ref([]);
const handelUserOption = () => {
  doListAll()
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
        console.log("userData", res.data);
        userOption.value = res.data;
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
const handelBatchOption = () => {
  doBatchList()
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
        console.log("batchData", res.data);
        batchOption.value = res.data;
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
const handleUserTransfer = () => {
  console.log(userBatchModify.value.userIds);
};
const handleBatchTransfer = () => {
  console.log(userBatchModify.value.batchIds);
};

const resource = ref([]);

const loading = ref(true);

const topBarRef = ref();
const titleColRef = ref();

const tabelHeight = ref(
  (window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight) - 365
);

const timer = ref(true);

const setTabelHeight = () => {
  // 动态获取流量器当前高度
  const windowsHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  // tabelHeight.value = windowsHeight - topBarRef.value.clientHeight - titleColRef.value.clientHeight

  if (!timer.value) {
    //防止多次触发监听页面卡顿
    setTimeout(function () {
      timer.value.timer = false;
    }, 400);
  }
};

const uploadImage = ref({
  imgCover: [],
  imgList: [],
  imgParam: [],
});

onMounted(() => {
  document.addEventListener("resize", setTabelHeight, true);
  handelList();
  handelUserOption();
  handelBatchOption();
});
onUnmounted(() => {
  document.removeEventListener("resize", setTabelHeight);
});
</script>

<template>
  <!-- 搜索 -->
  <div
    ref="topBarRef"
    style="
      display: flex;
      background-color: #fff;
      padding: 0 12px 12px 12px;
      flex-flow: wrap;
      /* justify-content: left; */
    "
  >
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label
        style="width: 120px; line-height: 32px"
        :show-overflow-tooltip="true"
        >用户名</label
      >
      <el-input
        v-model="userBatchQuery.actualName"
        placeholder="请输入"
        clearable
      />
    </div>
    <div style="display: flex; width: 200px; margin-top: 12px">
      <label
        style="width: 120px; line-height: 32px"
        :show-overflow-tooltip="true"
        >批次名</label
      >
      <el-input
        v-model="userBatchQuery.batchName"
        placeholder="请输入"
        clearable
      />
    </div>
    <div style="display: flex; padding-left: 12px; margin-top: 12px">
      <el-button
        v-if="resources.indexOf('Operations-UserBatch-Query') > -1"
        type="primary"
        @click="handelList"
        :loading="loading"
        >搜索</el-button
      >
    </div>
  </div>
  <!-- 展示 -->
  <div
    style="
      background-color: #fff;
      padding: 12px;
      text-align: left;
      margin-top: 18px;
    "
  >
    <el-row>
      <el-col :span="4">
        <div style="line-height: 32px" ref="titleColRef">用户-批次列表</div>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Operations-UserBatch-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增用户-批次')"
        >
          新增用户-批次
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :height="tabelHeight"
      :data="listResponse.records"
      border
      :max-height="tabelHeight"
      style="width: 100%; margin-top: 18px"
      empty-text="暂无数据"
      table-layout="auto"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="用户id" autosize resizable />
      <el-table-column prop="actualName" label="用户名" autosize resizable />
      <el-table-column prop="batchName" label="批次名" autosize resizable />
      <el-table-column prop="batchId" label="批次id" autosize resizable />

      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Operations-UserBatch-Modify') > -1 ||
          resources.indexOf('Operations-UserBatch-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-tooltip
              v-if="resources.indexOf('Operations-UserBatch-Modify') > -1"
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
                  @click="showDrawer('edit', '编辑用户批次信息', scope.row)"
                >
                  <Edit />
                </el-icon>
              </el-breadcrumb-item>
            </el-tooltip>
            <el-tooltip
              v-if="resources.indexOf('Operations-UserBatch-Remove') > -1"
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-breadcrumb-item>
                <el-popconfirm
                  title="确定删除该用户-批次信息？"
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

    <el-row v-if="resources.indexOf('Operations-UserBatch-Query') > -1">
      <el-col :span="24">
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            v-model:current-page="userBatchQuery.pageNo"
            v-model:page-size="userBatchQuery.pageSize"
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
    size="50%"
  >
    <template #header>
      <h4>{{ drawer.title }}</h4>
    </template>
    <template #default>
      <el-form
        :model="userBatchModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="用户" v-if="!userBatchModify.id">
          <el-transfer
            v-model="userBatchModify.userIds"
            style="text-align: left; display: inline-block"
            filterable
            :props="{
              key: 'id',
              label: 'actualName',
            }"
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="['用户目录', '选中用户']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            :data="userOption"
            @change="handleUserTransfer"
          >
            <template #default="{ option }">
              <span style="width: 500px"
                >{{ option.mobile }} - {{ option.actualName }}</span
              >
            </template>
            <template #left-footer>
              <!-- <el-button class="transfer-footer" size="small"
                >Operation</el-button
              > -->
            </template>
            <template #right-footer>
              <!-- <el-button class="transfer-footer" size="small"
                >Operation</el-button
              > -->
            </template>
          </el-transfer>
        </el-form-item>
        <el-form-item label="用户id" v-if="userBatchModify.id">
          <el-input
            v-model="userBatchModify.userId"
            disabled
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="用户名" v-if="userBatchModify.id">
          <el-input
            v-model="userBatchModify.actualName"
            disabled
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="批次">
          <el-transfer
            v-model="userBatchModify.batchIds"
            style="text-align: left; display: inline-block"
            filterable
            :props="{
              key: 'id',
              label: 'batchName',
            }"
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            :titles="['批次目录', '选中批次']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            :data="batchOption"
            @change="handleBatchTransfer"
          >
            <template #default="{ option }">
              <span style="width: 500px"
                >{{ option.id }} - {{ option.batchName }}</span
              >
            </template>
            <template #left-footer>
              <!-- <el-button class="transfer-footer" size="small"
                >Operation</el-button
              > -->
            </template>
            <template #right-footer>
              <!-- <el-button class="transfer-footer" size="small"
                >Operation</el-button
              > -->
            </template>
          </el-transfer>
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
        <el-button type="primary" @click="handelModify(userBatchModify)" v-else
          >修改</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.el-icon:hover {
  cursor: pointer;
}
</style>

<style>
.el-transfer-panel {
  width: auto;
}
</style>
