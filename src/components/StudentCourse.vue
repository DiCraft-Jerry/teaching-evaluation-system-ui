<script setup lang="ts">
import { onUnmounted, onMounted, ref, watch, reactive } from "vue";
import {
  Edit,
  Delete,
  Plus,
  Pointer,
  Check,
  SuccessFilled,
  Picture as IconPicture,
} from "@element-plus/icons-vue";
import { nextTick } from "vue";
import { doModify, getScore } from "../api/ucc";
import { doListCourseAndWareByUserId } from "../api/studentCourse";
import { ElMessage, UploadFile } from "element-plus";
import { ElLoading } from "element-plus";
import store from "../store";
import { ElTree } from "element-plus";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const resources = store.state.userStore.resources;
const tabelHeight1 = ref(250);

const courseQuery = ref({
  courseName: "",
  pageNo: 1,
  pageSize: 5,
});
watch(courseQuery.value, () => {
  handelList();
});

const listResponse = ref({
  records: [],
  total: 0,
});

const ruleFormRef = ref();

const switchLoading = ref(false);

const handelList = () => {
  loading.value = true;
  setTimeout(() => {
    doListCourseAndWareByUserId()
      .then((res: any) => {
        if (res.code != 200) {
          ElMessage({
            message: res.msg === null ? "系统后台异常！" : res.msg,
            grouping: true,
            type: "error",
          });
        } else {
          listResponse.value = res.data;
          console.log("listResponse", res.data);
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

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
const defaultProps = {
  children: "children",
  label: "label",
};
const diglogVideoAddress = ref("");
const startStudy = (node: any, data: any) => {
  uccModify.value = JSON.parse(JSON.stringify(data));
  dialogVisible.value = true;
  diglogVideoAddress.value = data.address;
  const courseId = node.parent.data.id;
  const coursewareId = data.id;
  uccModify.value.courseId = courseId;
  uccModify.value.coursewareId = coursewareId;
  console.log("uccModify", uccModify.value);
};
const handelEnded = () => {
  uccModify.value.end = 1;
};
const dialogVisible = ref(false);
const handleDialogClose = () => {
  console.log("关闭dialog");
  dialogVisible.value = false;
  diglogVideoAddress.value = "";
  //保存数据
  doModify(uccModify.value)
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
        handelScore();
        handelList();
      }
    })
    .catch((err: any) => {
      ElMessage({
        message: err,
        grouping: true,
        type: "error",
      });
    });
  //清空数据
  uccModify.value = {
    id: "",
    courseId: "",
    coursewareId: "",
    notes: "",
    end: 0,
  };
};
const codeSave = () => {
  console.log("保存。。。");
};
const uccModify = ref({
  id: "",
  courseId: "",
  coursewareId: "",
  notes: "",
  end: 0,
});
const scoreInfo = ref([]);
const handelScore = () => {
  getScore().then((res) => {
    scoreInfo.value = res.data;
    console.log("getScore", scoreInfo.value);
  });
};

const getScoreByCourseId = (courseId: any) => {
  console.log("courseId", scoreInfo.value);

  for (let i = 0; i < scoreInfo.value.length; i++) {
    if (scoreInfo.value[i].courseId === courseId) {
      console.log(scoreInfo.value[i].score);

      return scoreInfo.value[i].score;
    }
  }
};


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
  document.addEventListener("resize", setTabelHeight, true);
  handelScore();
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
  <el-card class="box-card"   
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
    </el-row>
    <el-table 
      :max-height="tabelHeight1"
      empty-text="未选课程"
      style="width: 100%; margin-top: 18px"
      row-key="id"
      border
      
      v-loading="loading"
      :tree-props="{ children: 'children' }"
      table-layout="auto"
    >
      <el-table-column label="课程&课件名称" />
      <el-table-column label="学习状态">
    
      </el-table-column>
      <el-table-column label="成绩" width="100px"/>
      <el-table-column label="学习">
      </el-table-column>
    </el-table>
  </el-card>
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
    </el-row>
    <el-tree
      :data="listResponse"
      node-key="id"
      empty-text="未选课程"
      highlight-current
      :filter-node-method="filterNode"
      accordion
      :expand-on-click-node="false"
      :props="defaultProps"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span
            >{{ node.label }}
            <el-icon color="green" v-if="getScoreByCourseId(data.id) === 100"
              ><SuccessFilled
            /></el-icon>
          </span>

          <span v-if="!data.address"
            >成绩:{{ getScoreByCourseId(data.id) }}</span
          >
          <span>
            <el-button
              @click="startStudy(node, data)"
              v-if="data.address"
              size="small"
            >
              学习
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>

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

    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="90%"
      align-center
      draggable
      append-to-body
      :before-close="handleDialogClose"
    >
      <div style="width: 500px; height: 400px">
        <video
          @ended="handelEnded"
          :src="diglogVideoAddress"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            width: auto;
            margin: 5px;
          "
          controls
        ></video>

        <MdEditor
          style="position: relative; left: 147%; top: -103%; margin-left: 100px"
          v-model="uccModify.notes"
        >
        </MdEditor>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-icon:hover {
  cursor: pointer;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
