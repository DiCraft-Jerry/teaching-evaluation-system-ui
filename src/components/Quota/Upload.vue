<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'



</script>
<template>
    <el-card>
        <span>指标文件上传</span>
        <br>
        <br>
        <br>

        <el-upload 
       v-model:file-list="fileList"
       action=""
       class="upload-demo"
       :limit="3"
       multiple
       >
            <el-button type="primary">点击上传</el-button>
        </el-upload>
    </el-card>


</template>

<style>

</style>