<template>
  <a-table sticky :columns="columns" :data-source="dataSource" id="productList" :pagination="pagination"
    @change="handleTableChange" :loading="loading">
    <template #summary>
      <a-table-summary :fixed="top">
        <a-table-summary-row>
          <a-table-summary-cell :index="0" :col-span="2"></a-table-summary-cell>
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>
<script>
import axios from 'axios';
import { ref, reactive } from 'vue';

export default ({
  name: '_user_list',
  setup() {
    const dataSource = ref([])
    const columns = ref([{
      title: '订单ID',
      dataIndex: 'order_id',
      width: 150
    }, {
      title: '用户ID',
      dataIndex: 'user_id',
      width: 60
    }, {
      title: '用户名',
      dataIndex: 'user_name',
      width: 80
    }, {
      title: '配送',
      dataIndex: 'send_type',
      width: 80
    }, {
      title: '配送费',
      dataIndex: 'send_price',
      width: 60
    }, {
      title: '金额',
      dataIndex: 'order_price',
      width: 100
    }, {
      title: '订单状态',
      dataIndex: 'order_status',
      width: 80
    }, {
      title: '支付方式',
      dataIndex: 'pay_type',
      width: 120
    }
    ])
    const loading = ref(true)
    const pagination = reactive({
      total: '',
      pageSize: '',
      hideOnSinglePage: true,
      showQuickJumper: true,
      showSizeChanger: false
    })
    const init = async () => {
      const { data: data } = await axios.post('getOrderList', { page: 1 })
      console.log(data)
      dataSource.value = data.data
      pagination.total = data.total
      pagination.pageSize = data.pageData.pageSize
      loading.value = false
    }

    init()

    const handleTableChange = () => {
      console.log(1)
    }
    return {
      dataSource,
      columns,
      handleTableChange,
      pagination,
      loading
    }
  }
});
</script>

<style>
.ant-table-thead th {
  text-align: center !important;
}

.ant-table-container td {
  vertical-align: middle;
  text-align: center;
}
</style>