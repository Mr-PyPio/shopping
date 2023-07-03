<template>
  <a-table sticky :columns="columns" :data-source="dataSource" id="productList"
  :pagination="pagination" @change="handleTableChange" :loading = "loading">
  <!-- <template #bodyCell="{ text, record, index, column }">
      <template >
        <a>
          {{ text }}{{ record }}{{ index }}{{ column }}
        </a>
      </template>
     </template> -->
     <template #bodyCell="{ record,column }">
        <template v-if="column.dataIndex === 'id'">
          <router-link :to="'/section/' + record.id + '.html' ">
            {{ record.id }}
          </router-link>
        </template>
        <template v-if="column.dataIndex === 'name'">
            <router-link :to="'/section/' + record.id + '.html'">
              {{ record.name }}
            </router-link>
        </template>
      </template>
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
import {defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductList',
  data() {
    return {
      allData: {},
      dataSource: [],
      columns: [],
      page: {},
      pagination: {},
      loading: true
    }
  },

  methods: {
    getProductData() {
      const postInfo = async () => {
        const { data: res } = await this.$axios.post('productList',{ page :1, pageSize :30})
        if (res.status == '200') {
          this.allData = res
          this.dataSource = res.data
          let att = []
          for (var i in res.columns) {
            let cen = res.columns[i]
            cen.width = 100
            if (cen.dataIndex == 'name') {
              cen.ellipsis = true
              cen.width = 200
            }
            if (cen.dataIndex == 'updated_at' || cen.dataIndex == 'created_at') {
              cen.width = 170
            }
            att.push(cen)
          }
          this.columns = att
          this.page = res.pageData
          this.page.total = res.total
          this.pagination = {
            total: res.total,
            pageSize: res.pageData.pageSize,
            hideOnSinglePage: true,
            showQuickJumper: true,
            showSizeChanger: false
          }
        }
        this.loading = false
      }
      postInfo()
      // this.$axios.post('productList').then(res => {
      //   console.log(res)
      // })
    },
    handleTableChange(pagination) {
      this.loading = true
      this.$axios.post('productList', { page: pagination.current, pageSize: pagination.pageSize })
        .then((res) => {
          this.dataSource = res.data.data
          this.loading = false
          window.scrollTo(0,0)
      })
    }
  },
  created() {
    this.getProductData()
  }
});
</script>