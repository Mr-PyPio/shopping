<template>
  <div id="categoryList">
      <a-tree
        :show-line="showLine"
        :show-icon="showIcon"
        :default-expanded-keys="['0-0-0']"
        :tree-data="treeData"
        @select="onSelect"
      >
        <template #icon><carry-out-outlined /></template>
        <template #title="{ dataRef }">
          <template v-if="dataRef.key === '0-0-0-1'">
            <div>multiple line title</div>
            <div>multiple line title</div>
          </template>
          <template v-else>{{ dataRef.title }}</template>
        </template>
        <template #switcherIcon="{ dataRef, defaultIcon }">
          <SmileTwoTone v-if="dataRef.key === '0-0-2'" />
          <component :is="defaultIcon" v-else />
        </template>
      </a-tree>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
  setup() {
    const showLine = ref(true);
    const showIcon = ref(false);
    const treeData = ref([]);
    const onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    };

    axios.post('getCategoryList').then(res => {
      treeData.value = res.data.data.arr
    })

    return {
      onSelect,
      showLine,
      showIcon,
      treeData
    }
  },
}
</script>

<style lang="less" scoped>

</style>