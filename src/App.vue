<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import store from "./store";

const resources = localStorage.getItem("resources");
if (resources) {
  for (let item of resources.split(",")) {
    store.commit("userStore/addResource", item);
  }
}
</script>

<template>
  <router-view></router-view>
</template>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
