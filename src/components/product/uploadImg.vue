<template>
  <div class="clearfix">
    <a-upload v-model:file-list="fileList" action="http://192.168.0.102:8081/api/upLoadImg"
      list-type="picture-card" @preview="handlePreview" @change="handleChange">
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
let product_img = new Array();
const product_icon = ref('');
let fileList = new Array();
export default defineComponent({
  components: {
    PlusOutlined,
  },
  props: {
     productImgList: Array
  },
  setup(props) {
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');
    const getFileList = () => {
      let arr = []
      const data = JSON.parse(JSON.stringify(props.productImgList))
      data.forEach((item, key) => {
        arr.push({
          uid: key,
          status: 'done',
          url: item,
          name: 'image',
        })
        product_img.push(item)
      })
      return arr
    }
    fileList = ref(getFileList());
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
        product_img.push(info.file.response)
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };
    return {
      previewVisible,
      previewImage,
      fileList,
      handleCancel,
      handlePreview,
      previewTitle,
      handleChange,
      product_icon,
      product_img
    };
  },
});
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>