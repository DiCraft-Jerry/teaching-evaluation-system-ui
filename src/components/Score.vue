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
import { doList, doSave, doModify, doRemove } from "../api/course";
import { ElMessage, UploadFile } from "element-plus";
import { ElLoading } from "element-plus";
import store from "../store";

const resources = store.state.userStore.resources;
const courseQuery = ref({
  courseName: "",
  pageNo: 1,
  pageSize: 9,
});
watch(courseQuery.value, () => {
  if (resources.indexOf("Operations-Course-Query") > -1) {
    handelList();
  }
});
const courseModify = ref({
  id: "",
  courseName: "",
  sort: "",
  status: 1,
});

const listResponse = ref({
  records: [],
  total: 0,
});

const ruleFormRef = ref();

const switchLoading = ref(false);
const handelChangeStatus = (data: any) => {
  doModify(data)
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
const drawer = ref({
  type: "add",
  show: false,
  title: "新增课程",
});

//表单规则
const rules = ref<FormRules>({
  courseName: [
    {
      required: true,
      message: "请输入商品名",
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
      courseModify.value = JSON.parse(JSON.stringify(data));
    });
  }
};

//关闭弹出框
const closeDrawer = () => {
  if (ruleFormRef.value) {
    //清空表单
    ruleFormRef.value.resetFields();
    courseModify.value = {
      id: "",
      courseName: "",
      sort: "",
      status: 1,
    };
  }
  drawer.value.show = false;
};
const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList(courseQuery.value)
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
      doSave(courseModify.value)
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

      doModify(courseModify.value)
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
        >课程名</label
      >
      <el-input
        v-model="courseQuery.courseName"
        placeholder="请输入"
        clearable
      />
    </div>

    <div style="display: flex; padding-left: 12px; margin-top: 12px">
      <el-button
        v-if="resources.indexOf('Operations-Course-Query') > -1"
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
        <div style="line-height: 32px" ref="titleColRef">课程列表</div>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Operations-Course-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增课程')"
        >
          新增课程
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
      <el-table-column
        prop="courseName"
        label="课程名"
        width="300"
        autosize
        resizable
      />

      <el-table-column prop="sort" label="排序" sortable="custom" />
      <el-table-column label="状态" sortable="custom" prop="status">
        <template
          #default="scope"
          v-if="resources.indexOf('Operations-Course-Modify') > -1"
        >
          <div style="display: flex; align-items: center">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :width="65"
              inline-prompt
              active-text="已启用"
              inactive-text="已禁用"
              :inactive-value="0"
              :loading="switchLoading"
              @change="handelChangeStatus(scope.row)"
            />
          </div>
        </template>
        <template #default="scope" v-else>
          <div style="display: flex; align-items: center">
            <el-tag type="success" effect="dark" v-if="scope.row.status === 1"
              >可用</el-tag
            >
            <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Operations-Course-Modify') > -1 ||
          resources.indexOf('Operations-Course-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-tooltip
              v-if="resources.indexOf('Operations-Course-Modify') > -1"
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
                  @click="showDrawer('edit', '编辑商品信息', scope.row)"
                >
                  <Edit />
                </el-icon>
              </el-breadcrumb-item>
            </el-tooltip>
            <el-tooltip
              v-if="resources.indexOf('Operations-Course-Remove') > -1"
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-breadcrumb-item>
                <el-popconfirm
                  title="确定删除该商品信息？"
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

    <el-row v-if="resources.indexOf('Operations-Course-Query') > -1">
      <el-col :span="24">
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            v-model:current-page="courseQuery.pageNo"
            v-model:page-size="courseQuery.pageSize"
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
        :model="courseModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="课程名" prop="courseName">
          <el-input v-model="courseModify.courseName" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            :min="1"
            v-model="courseModify.sort"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="courseModify.status"
            :active-value="1"
            :inactive-value="0"
            :width="65"
            inline-prompt
            active-text="已启用"
            inactive-text="已禁用"
            :loading="switchLoading"
          />
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
        <el-button type="primary" @click="handelModify(courseModify)" v-else
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
