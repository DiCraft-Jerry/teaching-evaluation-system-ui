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
import { doList, doSave, doModify, doRemove } from "../api/courseware";
import { doListAll } from "../api/course";
import { getVideoAddress } from "../api/upload";
import { ElMessage } from "element-plus";
import { ElLoading } from "element-plus";
import store from "../store";

const resources = store.state.userStore.resources;
const coursewareQuery = ref({
  coursewareName: "",
  courseId: "",
  pageNo: 1,
  pageSize: 5,
});
watch(coursewareQuery.value, () => {
  if (resources.indexOf("Operations-Courseware-Query") > -1) {
    handelList();
  }
});
const coursewareModify = ref({
  id: "",
  coursewareName: "",
  courseId: "",
  address: "",
  studyTime: "",
  videoId: "",
  // status: 1,
});

const uploadAttribute = reactive({
  action: "http://127.0.0.1:50000/api/oss/upload",
});
const listResponse = ref({
  records: [],
  total: 0,
});

const ruleFormRef = ref();

const switchLoading = ref(false);
const courseOption = ref([]);
// const handelChangeStatus = (data: any) => {
//   doModify(data)
//     .then((res) => {
//       if (res.code != 200) {
//         ElMessage({
//           message: res.msg === null ? "系统后台异常！" : res.msg,
//           grouping: true,
//           type: "error",
//         });
//       } else {
//         ElMessage({
//           message: res.msg,
//           grouping: true,
//           type: "success",
//         });
//         closeDrawer();
//         handelList();
//       }
//     })
//     .catch((err) => {
//       ElMessage({
//         message: err,
//         grouping: true,
//         type: "error",
//       });
//     });
// };

const handelBeforeUpload = () => {};
const drawer = ref({
  type: "add",
  show: false,
  title: "新增课件",
});

//表单规则
const rules = ref<FormRules>({
  coursewareName: [
    {
      required: true,
      message: "请输入商品名",
      trigger: "blur",
    },
  ],
  // status: [
  //   {
  //     required: true,
  //     message: "状态",
  //     trigger: "blur",
  //   },
  // ],
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
      coursewareModify.value = JSON.parse(JSON.stringify(data));
    });
  }
};

//关闭弹出框
const closeDrawer = () => {
  if (ruleFormRef.value) {
    //清空表单
    ruleFormRef.value.resetFields();
    coursewareModify.value = {
      id: "",
      coursewareName: "",
      courseId: "",
      address: "",
      studyTime: "",
      // status: 1,
    };
  }
  drawer.value.show = false;
};
const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doList(coursewareQuery.value)
      .then((res: any) => {
        if (res.code != 200) {
          ElMessage({
            message: res.msg === null ? "系统后台异常！" : res.msg,
            grouping: true,
            type: "error",
          });
        } else {
          listResponse.value = res.data;
          console.log("data", res.data);
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
      doSave(coursewareModify.value)
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

      doModify(coursewareModify.value)
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

const handelQueryCourseOption = () => {
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
        console.log("courseOption", res.data);
        courseOption.value = res.data;
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
const handleUploadSuccess = (res: any) => {
  //根据id获取视频播放地址
  const videoId = res.data;
  console.log("videoId", videoId);

  coursewareModify.value.videoId = videoId;
  handelVideoAddress(videoId);
};
// const videoAddress = ref("");

const handelVideoAddress = (videoId: string) => {
  getVideoAddress(videoId).then((res) => {
    coursewareModify.value.address = res.data;
  });
};
const handleSelectChange = () => {
  handelList();
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

onMounted(() => {
  handelQueryCourseOption();
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
        >课件名</label
      >
      <el-input
        v-model="coursewareQuery.coursewareName"
        placeholder="请输入"
        clearable
      />
    </div>

    <div style="display: flex; width: 200px; margin-top: 12px">
      <label
        style="width: 120px; line-height: 32px"
        :show-overflow-tooltip="true"
        >课程名</label
      >
      <el-select
        v-model="coursewareQuery.courseId"
        class="m-2"
        placeholder="选择课程"
        clearable
      >
        <el-option
          v-for="(item, index) in courseOption"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div style="display: flex; padding-left: 12px; margin-top: 12px">
      <el-button
        v-if="resources.indexOf('Operations-Courseware-Query') > -1"
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
        <div style="line-height: 32px" ref="titleColRef">课件列表</div>
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          v-if="resources.indexOf('Operations-Courseware-Add') > -1"
          type="primary"
          @click="showDrawer('add', '新增课件')"
        >
          新增课件
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
        prop="coursewareName"
        label="课件名"
        width="300"
        autosize
        resizable
      />
      <el-table-column
        prop="courseName"
        label="课程名"
        width="300"
        autosize
        resizable
      />
      <el-table-column label="播放" autosize resizable>
        <template #default="scope">
          <el-link type="success" :href="scope.row.address">{{
            scope.row.address
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="90"
        v-if="
          resources.indexOf('Operations-Courseware-Modify') > -1 ||
          resources.indexOf('Operations-Courseware-Remove') > -1
        "
      >
        <template #default="scope">
          <el-breadcrumb separator="|">
            <el-tooltip
              v-if="resources.indexOf('Operations-Courseware-Modify') > -1"
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
                  @click="showDrawer('edit', '编辑课件信息', scope.row)"
                >
                  <Edit />
                </el-icon>
              </el-breadcrumb-item>
            </el-tooltip>
            <el-tooltip
              v-if="resources.indexOf('Operations-Courseware-Remove') > -1"
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

    <el-row v-if="resources.indexOf('Operations-Courseware-Query') > -1">
      <el-col :span="24">
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            v-model:current-page="coursewareQuery.pageNo"
            v-model:page-size="coursewareQuery.pageSize"
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
        :model="coursewareModify"
        :rules="rules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="课件名" prop="coursewareName">
          <el-input
            v-model="coursewareModify.coursewareName"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="关联课程" prop="courseId">
          <el-select
            v-model="coursewareModify.courseId"
            class="m-2"
            placeholder="选择课程"
          >
            <el-option
              v-for="(item, index) in courseOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课件上传">
          <el-upload
            class="avatar-uploader"
            :action="uploadAttribute.action"
            :show-file-list="false"
            :before-upload="handelBeforeUpload"
            :on-success="handleUploadSuccess"
          >
            <video
              controls
              metud
              autoplay
              v-if="coursewareModify.address !== ''"
              :src="coursewareModify.address"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
        <el-button type="primary" @click="handelModify(coursewareModify)" v-else
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
.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
<style scope>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-icon:hover {
  cursor: pointer;
}
</style>
