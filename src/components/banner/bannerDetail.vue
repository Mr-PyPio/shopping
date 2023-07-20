<template>
  <div class="bannerDetail">
    <div class="bannerMessage">
        <div class="banner_name">
          <p>名称</p>
          <input type="text"  id="" v-model="banner_name">
        </div>
        <div class="banner_code">
          <p>code</p>
          <input type="text"  id="" v-model="banner_code">
        </div>
        <button type="button" ref="submitBtn" class="submitBtn" @click="submitSaveBanner">
          保存
        </button>
    </div>
    <div class="bannerItems" ref="bannerItems" style="display:none">
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
        :data-source="banner_data"
      />
    </div>

    <div class="createBannerWrap" ref="createBannerWrap">
      <div class="createcontent" style="display: flex;">
          <div style="margin-right: 20px">
            <p>成员名称:</p>
            <input type="text" v-model="itemsName">
            <p>排序:</p>
            <input type="text" v-model="itemsSort">
            <p>连接: </p>
            <input type="text" v-model="itemsLink">
          </div>
          <div class="clearfix">
            <p>图片: </p>
            <a-upload v-model:file-list="fileList" action="http://192.168.0.102:8081/api/upLoadImg"
              list-type="picture-card" @preview="handlePreview" @change="handleChange">
              <div v-if="fileList.length < 1">
                <plus-outlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
      </div>
      <div style="display:flex;justify-content: flex-end;margin-top: 20px;">
          <a-button type="primary" style="margin-left: 16px" @click="saveBannerItems">
            Create
          </a-button>
          <a-button type="primary" style="margin-left: 16px" @click="closeWrap">
            Close
          </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref ,computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import axios from 'axios';
export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    const router = useRouter()
    const banner_id = router.currentRoute.value.params.ids
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');
    const fileList = ref([])
    const submitBtn = ref(null)
    const createBannerWrap = ref(null)
    const bannerItems = ref(null)
    const banner_name = ref('')
    const banner_code = ref('')
    const itemsName = ref('')
    const itemsSort = ref('')
    const itemsLink = ref('')
    let defaultKey = 1
    const columns = ref([{
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Sort',
      dataIndex: 'sort',
    }, {
      title: 'Link',
      dataIndex: 'link',
    }])
    const banner_data = ref([]);
    const banner_num = ref(0);

    axios.post('bannerDetail',{id : banner_id}).then(res => {
        const result = res.data.data
        console.log(result)
      if (res.data.status == '200' && result.length > 0) {
        banner_name.value = result[0].name
        banner_code.value = result[0].code
        submitBtn.value.createorsave = 'save'
        bannerItems.value.style.display = 'block'
        if(result[0].detail) {
          // banner_data.value = result[0].detail
          console.log(JSON.parse(result[0].detail))
          banner_data.value = JSON.parse(result[0].detail)
          defaultKey = banner_data.value.length + 1
          banner_num.value = banner_data.value.length
        }
      } else {
        bannerItems.value.style.display = 'none'
      }
    })

    const submitSaveBanner = () => {
      const disabled = submitBtn.value.createorsave
      if(disabled != 'save') {
        axios.post('bannerCreate',{id: banner_id,name: banner_name.value,code: banner_code.value}).then( res => {
          if (res.status == '200') {
            submitBtn.value.createorsave = 'save'
            bannerItems.value.style.display = 'block'
          }
        })
      } else {
        axios.post('changeBanner',{id: banner_id,name: banner_name.value,code: banner_code.value}).then(res => {
          if(res.status == 200) {
            console.log(1)
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
        banner_num.value --
        banner_data.value.splice(i-1,1)
      }
      changeBannerAjax(function () {
        state.value.loading = false;
        state.value.selectedRowKeys = [];
      })
    };
    const createItems = () => {
      createBannerWrap.value.style.display = 'block'
    }
    const saveBannerItems = () => {
      const detail = 
        {
          key:defaultKey,
          name: itemsName.value,
          sort: itemsSort.value,
          link: itemsLink.value,
          img: previewImage.value
        }
      banner_data.value.push(detail)
      changeBannerAjax()
    }
    const changeBannerAjax = callBack => {
      axios.post('changeBanner', { data: JSON.stringify(banner_data.value), num: banner_num.value, id: banner_id}).then(res => {
        console.log(res)
        if(res.data.status == '200') {
          defaultKey++
          itemsName.value = ''
          itemsSort.value = ''
          itemsLink.value = ''
          previewImage.value = ''
          createBannerWrap.value.style.display = 'none'
          if(callBack) {
            callBack()
          }
        }
      })
    }
    const closeWrap = () => {
      createBannerWrap.value.style.display = 'none'
    }

    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.value.selectedRowKeys = selectedRowKeys;
    };
     const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = '';
    };
    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = file.response;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };
    const handleChange = async info => {
      console.log(info)
      if (info.file.status === 'done') {
        previewImage.value = info.file.response
        console.log(previewImage.value)
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };
    return {
      banner_name,
      banner_code,
      hasSelected,
      start,
      onSelectChange,
      columns,
      state,
      banner_data,
      createItems,
      fileList,
      handleCancel,
      handleChange,
      previewVisible,
      previewImage,
      previewTitle,
      handlePreview,
      closeWrap,
      createBannerWrap,
      itemsName,
      itemsSort,
      itemsLink,
      saveBannerItems,
      banner_id,
      submitSaveBanner,
      submitBtn,
      bannerItems,
      banner_num
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
.bannerDetail{
  .bannerMessage{
    height: 220px;
    position: relative;
    .banner_name,.banner_code{
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

  .bannerItems{
    padding-top: 20px;
    border-top: 1px solid #ccc;
    margin-top: 30px;

    h3{
      font-size: 25px;
      font-weight: 600;
      padding-bottom: 20px;
    }
  }
  .createBannerWrap{
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

    p{
      font-weight: 600;
      font-size: 16px;
      padding: 8px 0;
      margin-top: 15px;
    }

    input{
      padding:5px 12px;
      border-radius: 8px;
      border: 1px solid #ddd;
      width: 200px;
      text-align: left;
    }
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