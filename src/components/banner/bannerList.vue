<template>
  <div class="bannerList">
    <!-- <button>

    </button>
    <a-table :dataSource="dataSource" :columns="columns" /> -->
    <div style="margin-bottom: 16px">
      <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="clear">
        删除
      </a-button>
      <a-button type="primary" @click="addBanner">
        创建广告位
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="data"
      :customRow="rowClick"
    >
    </a-table>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import axios from 'axios';
import router from '@/router';
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'code',
  dataIndex: 'code',
  key: 'code',
}, {
  title: '成员数量',
  key: 'num',
  dataIndex: 'num',
}];
export default defineComponent({
  setup() {
    const data = ref([]);
    const lastId = ref(1);
    axios.post('bannerList').then(res => {
      const result = res.data
      if (result.status == 200) {
        if (result.data.length > 0) {
          console.log(result)
          data.value = result.data
          for (let i = 0; i < result.data.length; i++) {
            data.value[i].key = (i + 1)
          }
          lastId.value = result.data.length + 1
        }
      }
    })

    const rowClick = ref((record) => {
      return {
        onclick: () => {
            console.log(record.id)
            router.push(`/banner/banner-${record.id}.html`)
          }
      }
    })

    const state = reactive({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const clear = () => {

    };
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const addBanner = () => {
      router.push(`/banner/banner-${lastId.value}.html`)
    }
    return {
      data,
      addBanner,
      columns,
      hasSelected,
      ...toRefs(state),
      // func
      clear,
      onSelectChange,
      lastId,
      rowClick
    };
  },
})
</script>

<style lang="less" scoped>
</style>