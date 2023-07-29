<template>
  <div class="createCatalogContent">
      <div style="margin-bottom: 16px">
        <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="start">
          添加
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `已选 ${state.selectedRowKeys.length} 件产品` }}
          </template>
        </span>
        <close-outlined @click="clostWrap" class="clostWrap"/>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ x: 0, y: 300 }"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, preserveSelectedRowKeys: true }"
      >
        <template #bodyCell="{ record,column}">
          <template v-if="column.dataIndex === 'product_img'">
            <template v-if="record.product_img">
              <img :src="JSON.parse(record.product_img)[0]" />
            </template>
            <template v-if="!record.product_img">
              <img src="" />
            </template>
          </template>
        </template>
      </a-table>
  </div>
</template>


<script>
import router from '@/router';
import { CloseOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { defineComponent,ref,computed } from 'vue';

export default defineComponent({
  props: {
    catalog_id: {
      type: String,
      default: ''
    },
    closeCreateCatalogWraop: {
      type: Function,
      default: null
    },
    oldProductIds: {
      type: Function,
      default: null
    }
  },
  components: {
    CloseOutlined
  },
  setup(props) {
    const clostWrap = () => {
      props.closeCreateCatalogWraop()
    }
    const columns = ref([{
        title: '产品ID',
        dataIndex: 'id',
        width: 50
      }, {
        title: '产品名称',
        dataIndex: 'name',
        ellipsis: true,
        width: 200
      }, {
        title: '产品图',
        dataIndex: 'product_img',
        width: 100

      },{
        title: '在库',
        dataIndex: 'status',
        width: 100
      }
    ])
    const loading = ref(true)
    const state = ref({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
      selectedRows: [],
      oldSelectedRowKeys: []
    });

    const dataSource = ref([])
    const page = ref({})
    const pagination = ref({})
    let newProductIds = ref([])
    const getProductList = () => {
      axios.post('getProductsList', { page: 1, pageSize: 10,id: props.catalog_id }).then(res => {
        if(res.status == 200 && res.data) {
          const result = res.data
          dataSource.value = result.data
          page.value = result.pageData
          page.value.total = result.total
          pagination.value = {
            total: result.total,
            pageSize: result.pageData.pageSize,
            hideOnSinglePage: true,
            showQuickJumper: true,
            showSizeChanger: false
          }
        }
      })
    }

    const handleTableChange = (pagination) => {
      loading.value = true
      axios.post('getProductsList', { page: pagination.current, pageSize: pagination.pageSize })
        .then((res) => {
          dataSource.value = res.data.data
          loading.value = false
        })
    }

    const hasSelected = computed(() => state.value.selectedRowKeys.length > 0);
    const start = () => {
      state.value.loading = true;
      // ajax request after empty completing
      axios.post('addProductOfCatalog',{id: props.catalog_id, arr: newProductIds.value}).then(res => {
        if(res.status == 200) {
          state.value.oldSelectedRowKeys = state.value.selectedRowKeys
          state.value.loading = false;
          state.value.selectedRowKeys = [];
          router.go(0)
        }
      })
    };
    const onSelectChange = (selectedRowKeys) => {
      state.value.selectedRowKeys = selectedRowKeys;
      newProductIds.value = [...props.oldProductIds, ...selectedRowKeys]
    };
    
    return {
      hasSelected,
      start,
      onSelectChange,
      dataSource,
      state,
      columns,
      handleTableChange,
      pagination,
      page,
      clostWrap,
      getProductList,
      newProductIds
    }
  }

})
</script>

<style>
  .clostWrap{
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 28px;
  }
</style>