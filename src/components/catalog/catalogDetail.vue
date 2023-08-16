<template>
  <div class="catalogDetail">
    <div class="catalogMessage">
        <div class="catalog_name">
          <p>名称</p>
          <input type="text"  id="" v-model="catalog_name">
        </div>
        <div class="catalog_code">
          <p>code</p>
          <input type="text"  id="" v-model="catalog_code">
        </div>
        <button type="button" ref="submitBtn" class="submitBtn" @click="submitSaveCatalog">
          保存
        </button>
    </div>
    <div class="catalogItems" ref="catalogItems" style="display:none">
      <h3>成员</h3>
      <div style="margin-bottom: 16px">
        <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="start">
          删除
        </a-button>
        <a-button type="primary" style="margin-left: 16px" @click="createItems">
          创建
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `Selected ${state.selectedRowKeys.length} items` }}
          </template>
        </span>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="catalog_data">
        <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'name'">
              <router-link :to="'/section/' + record.id + '.html'">
                {{ record.name }}
              </router-link>
            </template>
            <template v-if="column.dataIndex === 'image'">
                <img :src="record.product_img? record.product_img.url :''"  style="width: 100px"/>
            </template>
        </template>
      </a-table>
    </div>

    <div class="createCatalogWrap" ref="createCatalogWrap"> 
        <create-catalog :catalog_id="catalog_id" ref="createCatalogRefs" 
        :closeCreateCatalogWraop="closeCreateCatalogWraop" :oldProductIds="oldProductIds"></create-catalog>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref ,computed } from 'vue'
import { useRouter } from 'vue-router'
import createCatalog from 'components/catalog/createCatalog.vue'
import axios from 'axios';
export default defineComponent({
  components: {
    createCatalog,
  },
  setup() {
    const createCatalogRefs = ref()
    const router = useRouter()
    const catalog_id = router.currentRoute.value.params.ids
    const submitBtn = ref(null)
    const createCatalogWrap = ref(null)
    const catalogItems = ref(null)
    const catalog_name = ref('')
    const catalog_code = ref('')
    let defaultKey = 1
    const columns = ref([{
      title: '产品ID',
      dataIndex: 'id',
      width: 50,
    }, {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200

    }, {
      title: '产品图',
      dataIndex: 'image',
       width: 100,
    },{
      title: '在库',
      dataIndex:'status',
       width: 100,
    }
    ])
    const catalog_data = ref([]);
    const catalog_num = ref(0);
    const oldProductIds = ref([])

    axios.post('catalogDetail',{id : catalog_id}).then(res => {
        const result = res.data.data
        console.log(res)
      if (res.data.status == '200' && result.length > 0) {
        catalog_name.value = result[0].name
        catalog_code.value = result[0].code
        submitBtn.value.createorsave = 'save'
        catalogItems.value.style.display = 'block'
        if(result[0].productsList) {
          oldProductIds.value = JSON.parse(result[0].productsList)
        }else{
          oldProductIds.value = []
        }
        if(res.data.productList) {
          console.log(res.data.productList)
          catalog_data.value = res.data.productList
          defaultKey = catalog_data.value.length + 1
          catalog_num.value = catalog_data.value.length
        }
      } else {
        catalogItems.value.style.display = 'none'
      }
    })

    const submitSaveCatalog = () => {
      const disabled = submitBtn.value.createorsave
      if(disabled != 'save') {
        axios.post('catalogCreate',{id: catalog_id,name: catalog_name.value,code: catalog_code.value}).then( res => {
          if (res.status == '200') {
            submitBtn.value.createorsave = 'save'
            catalogItems.value.style.display = 'block'
          }
        })
      } else {
        axios.post('changeCatalog',{id: catalog_id,name: catalog_name.value,code: catalog_code.value}).then(res => {
          if(res.status == 200) {
            router.go(-1)
          }
        })
      }
    }

    let state = ref({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.value.selectedRowKeys.length > 0);
    const start = () => {
      state.value.loading = true;
      for (let i = 0; i < state.value.selectedRowKeys.length; i++) {
        catalog_num.value--
        catalog_data.value.forEach((items,key) => {
          if (items.id == state.value.selectedRowKeys[i]) {
            catalog_data.value.splice(key,1)
          }
        })
        oldProductIds.value.forEach((items, key) => {
          if (items == state.value.selectedRowKeys[i]) {
             oldProductIds.value.splice(key, 1)
          }
        })
      }
      changeCatalogAjax(function () {
        state.value.loading = false;
        state.value.selectedRowKeys = [];
      })
    };
    const createItems = () => {
      createCatalogWrap.value.style.display = 'block'
      createCatalogRefs.value.getProductList()
    }
    const closeCreateCatalogWraop = () => {
      createCatalogWrap.value.style.display = 'none'
    }
    const changeCatalogAjax = callBack => {
      let data = oldProductIds.value ? JSON.stringify(oldProductIds.value) : ''
      axios.post('changeCatalog', { data: data, num: catalog_num.value, id: catalog_id,name:catalog_name.value,code:catalog_code.value }).then(res => {
        console.log(res)
        if(res.data.status == '200') {
          defaultKey++
          createCatalogWrap.value.style.display = 'none'
          if(callBack) {
            callBack()
          }
        }
      })
    }

    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.value.selectedRowKeys = selectedRowKeys;
    };
    return {
      catalog_name,
      catalog_code,
      hasSelected,
      start,
      onSelectChange,
      columns,
      state,
      catalog_data,
      createItems,
      createCatalogWrap,
      catalog_id,
      submitSaveCatalog,
      submitBtn,
      catalogItems,
      catalog_num,
      defaultKey,
      closeCreateCatalogWraop,
      createCatalogRefs,
      oldProductIds
    }
  },
})
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.catalogDetail{
  .catalogMessage{
    height: 220px;
    position: relative;
    .catalog_name,.catalog_code{
      display: flex;
      align-content: center;
      margin: 10px 0;

      p{
        width: 56px;
        line-height: 36px;
      }

      input{
        width: 200px;
        height: 36px;
        padding:0 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        color: #333;
        font-size: 13px;
        margin-left: 15px;
        text-align: left;
      }
    }

    .submitBtn{
      position: absolute;
      bottom: 0;
      right: 100px;
      width: 100px;
      height: 46px;
      background: #000;
      font-size: 18px;
      color: #fff;
      font-weight: 600;
      text-align: center;
      line-height: 46px;
      border-radius: 12px;
      border: 0;
    }

  }

  .catalogItems{
    padding-top: 20px;
    border-top: 1px solid #ccc;
    margin-top: 30px;

    h3{
      font-size: 25px;
      font-weight: 600;
      padding-bottom: 20px;
    }
  }
  .createCatalogWrap{
    display: none;
    width: auto;
    height: auto;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 0 10px 1px #333;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>
<style>
  .ant-upload.ant-upload-select-picture-card,.ant-upload-list-picture-card-container{
    width: 250px;
    height: 250px;
  }
  .ant-upload-list{
    height: 250px;
  }
</style>