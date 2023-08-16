<template>
  <div class="clearfix">
    <a-upload v-model:file-list="fileList" action="http://192.168.0.102:8081/api/upLoadImg"
      list-type="picture-card" @preview="handlePreview" @change="handleChange">
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

     <button class="saveButton" ref="SaveButton" disabled="disabled" type="button" @click="saveMessage">保存</button>
  </div>
</template>
<script>
import { message , Modal } from 'ant-design-vue';
import { PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, createVNode  } from 'vue';
import { getImgSize } from 'assets/js/common.js'
import axios from 'axios';
import { useRouter, onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  components: {
    PlusOutlined,
  },
  props: {
    productImgList: {
      type: Array,
      default: (() => [])
    },
    id: {
      type: String,
      default: ''
     }
  },
  setup(props) {
    const router = useRouter()
    const SaveButton = ref(null)
    const product_id = ref(props.id)
    const product_img = ref(props.productImgList);
    const product_icon = ref('');
    const fileList = ref(props.productImgList);
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');
    const isChangecontent = ref(false)
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
        const imgMessage = await getImgSize(info.file.response)
        const previewImageData = {
          uid: info.file.uid,
          status: info.file.status,
          name: info.file.name,
          url: info.file.response,
          imgMessage: imgMessage
        }
        product_img.value.push(previewImageData)
        SaveButton.value.disabled = false
        isChangecontent.value = true
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } else if (info.file.status == "removed") {
        const uid = info.file.uid
        product_img.value.forEach((items,key) => {
          if (items.uid == uid) {
            product_img.value.splice(key, 1)
          }
        })
        SaveButton.value.disabled = false
        isChangecontent.value = true
      }
    };
    const saveMessage = () => {
      axios.post('productAddImg', {
        product_id: product_id.value,
        product_img: JSON.stringify(product_img.value),
        product_icon: JSON.stringify(product_img.value[0])
      }).then(() => {
        router.go(0)
      })
    }
    onBeforeRouteLeave((to, from, next) => {
      console.log(to,from,next)
      if (isChangecontent.value) {
         Modal.confirm({
          title: '提示',
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode('div', {
            style: 'color:red;',
          }, '内容已修改，是否保存？'),
           onOk() {
            axios.post('productAddImg', {
              product_id: product_id.value,
              product_img: JSON.stringify(product_img.value),
              product_icon: JSON.stringify(product_img.value[0])
            }).then((res) => {
              if (res.status == 200) {
                next(true)
              } else {
                next(false)
              }
            })
          },
          onCancel() {
            next(true)
          },
          class: 'test',
        });
      } else {
        next(true)
      }
    })
    return {
      previewVisible,
      previewImage,
      fileList,
      handleCancel,
      handlePreview,
      previewTitle,
      handleChange,
      product_icon,
      saveMessage,
      SaveButton
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


.saveButton {
  width: 100px;
  font-size: 14px;
  line-height: 40px;
  height: 40px;
  border-radius: 8px;
  border: 0;
  background: #222;
  color: #fff;
  position: absolute;
  bottom: 12px;
  right: 12px;
}
.saveButton:disabled {
    background: #ccc;
}
</style>