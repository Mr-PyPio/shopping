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
        <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="deleteBanner">
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
        :customRow="rowClick"
      />
    </div>

    <div class="createBannerWrap" ref="createBannerWrap">
      <div class="createcontent" style="display: flex;justify-content: space-between;">
          <div style="margin-right: 20px">
            <p>成员名称:</p>
            <input type="text" v-model="itemsName">
            <p>排序:</p>
            <input type="text" v-model="itemsSort">
            <p>链接: </p>
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
      <editor-element ref="editorRefs"></editor-element>
      <div style="display:flex;justify-content: flex-end;margin-top: 20px;">
          <a-button type="primary" style="margin-left: 16px" @click="saveBannerItems">
            创建
          </a-button>
          <a-button type="primary" style="margin-left: 16px" @click="closeWrap">
            关闭
          </a-button>
      </div>
    </div>

    <div>
      <a-modal v-model:open="open" title="提示" @ok="handleOk" @cancel="cancel" :confirm-loading="confirmLoading" okText="保存" cancelText="取消">
        <p>是否保存已修改的内容？</p>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref ,computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import editorElement from 'components/tools/editor.vue'
import axios from 'axios';
export default defineComponent({
  components: {
    PlusOutlined,
    editorElement
  },
  setup() {
    const open = ref(false)
    const confirmLoading = ref(false)
    const isChangecontent = ref(false) 
    const editorRefs = ref()
    const router = useRouter()
    const banner_id = router.currentRoute.value.params.ids
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewImageData = ref({});
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
        bannerItems.value.style.display = 'block'
        if(result[0].detail) {
          console.log(JSON.parse(result[0].detail))
          banner_data.value = JSON.parse(result[0].detail)
          for (let i = 0; i < banner_data.value.length; i++) {
            banner_data.value[i].key = i
          }
          defaultKey = banner_data.value.length + 1
          banner_num.value = banner_data.value.length
        }
      } else {
        bannerItems.value.style.display = 'none'
      }
    })

    const handleOk = () => {
        confirmLoading.value = true;
        const upData = {
          data: JSON.stringify(banner_data.value),
          num: banner_num.value,
          id: banner_id,
          code: banner_code.value,
          name: banner_name.value
        }
        axios.post('changeBanner', upData).then(res => {
          if (res.status == 200) {
            open.value = false;
            confirmLoading.value = false;
            router.push(`/banner.html`)
          }
        })
    }

    const cancel = () => {
      open.value = false;
      confirmLoading.value = false;
      router.push(`/banner.html`)
    }

    const submitSaveBanner = () => {
      if (isChangecontent.value) {
        open.value = true;
        return
      } else {
        if (!banner_data.value.length) {
            axios.post('bannerCreate',{id: banner_id,name: banner_name.value,code: banner_code.value}).then( res => {
                if (res.status == '200') {
                  bannerItems.value.style.display = 'block'
                }
            })
        } else {
          router.push(`/banner.html`)
        }
      }
    }

    const rowClick = ref((record,index) => {
      return {
        onclick: () => {
          const itemData = banner_data.value[index]
          console.log(itemData, record)
          fileList.value = [itemData.img]
          itemsName.value = itemData.name
          itemsSort.value = itemData.sort
          itemsLink.value = itemData.link
          editorRefs.value.changeValueHtml(itemData.desc)
          createBannerWrap.value.style.display = 'block'
        }
      }
    })

    let state = ref({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.value.selectedRowKeys.length > 0);
    const deleteBanner = () => {
      state.value.loading = true;
      for (let i = 0; i < state.value.selectedRowKeys.length; i++) {
        console.log(banner_data.value)
        banner_data.value.splice(state.value.selectedRowKeys[i], 1)
      }
      banner_num.value = banner_data.value.length
      isChangecontent.value = true
      setTimeout(() => {
        state.value.loading = false;
        state.value.selectedRowKeys = []
      },1000)
    };
    const createItems = () => {
      createBannerWrap.value.style.display = 'block'
    }
    const saveBannerItems = () => {
      const desc = editorRefs.value.valueHtml ?? ''
      const detail = 
        {
          key:defaultKey,
          name: itemsName.value,
          sort: itemsSort.value,
          link: itemsLink.value,
          img: previewImageData.value,
          desc: desc
      }
      banner_data.value.push(detail)
      isChangecontent.value = true
      banner_num.value = banner_data.value.length
      defaultKey++
      itemsName.value = ''
      itemsSort.value = ''
      itemsLink.value = ''
      previewImage.value = ''
      previewImageData.value = ''
      createBannerWrap.value.style.display = 'none'
    }
    const closeWrap = () => {
      itemsName.value = ''
      itemsSort.value = ''
      itemsLink.value = ''
      previewImage.value = ''
      previewImageData.value = ''
      editorRefs.value.changeValueHtml('')
      fileList.value = []
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
      previewImageData.value = {
        uid: file.uid,
        status: file.status,
        name: file.name,
        url: file.url || file.preview
      }
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };
    const handleChange = async info => {
      console.log(info)
      if (info.file.status === 'done') {
        previewImage.value = info.file.response
        previewImageData.value = {
          uid: info.file.uid,
          status: info.file.status,
          name: info.file.name,
          url: info.file.response
        }
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };
    return {
      banner_name,
      banner_code,
      hasSelected,
      deleteBanner,
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
      banner_num,
      rowClick,
      editorRefs,
      handleOk,
      open,
      confirmLoading,
      cancel
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
    min-width: 500px;

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
  :where(.css-dev-only-do-not-override-eq3tly).ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload.ant-upload-select{
    width: 200px;
    height: 200px;
  }
  :where(.css-dev-only-do-not-override-eq3tly).ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-container{
     width: 200px;
    height: auto
  }
</style>