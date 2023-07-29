<template>
  <div class="catalogList">
    <div style="margin-bottom: 16px">
      <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="clear">
        删除
      </a-button>
      <a-button type="primary" @click="addCatalog">
        创建勾选位
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns"
      :data-source="data" :customRow="rowClick">
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
},
{
  title: 'code',
  dataIndex: 'code',
  key: 'code',
}, {
  title: '状态',
  key: 'disabled',
  dataIndex: 'disabled',
}];
export default defineComponent({
  setup() {
    const data = ref([]);
    const lastId = ref(1);
    axios.post('catalogList').then(res => {
      const result = res.data
      if (result.status == 200) {
        if (result.data.length > 0) {
          console.log(result)
          data.value = result.data
          for (let i = 0; i < result.data.length; i++) {
            data.value[i].key = result.data[result.data.length - 1].id
          }
          lastId.value = result.data[result.data.length - 1].id + 1
        }
      }
    })

    const rowClick = ref((record) => {
      return {
        onclick: () => {
          console.log(record.id)
          router.push(`/catalog/catalog-${record.id}.html`)
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
      axios.post('delateCatalogList',{id: state.selectedRowKeys}).then(res => {
        if(res.status == 200) {
          router.go(0)
        }
      })
    };
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };
    const addCatalog = () => {
      router.push(`/catalog/catalog-${lastId.value}.html`)
    }
    return {
      data,
      addCatalog,
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

<style lang="less" scoped></style>