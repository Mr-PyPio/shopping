<template>
  <div id="product_detail">
    <template v-for="item in product_detail" :key="item.id">
      <div class="layoutTop">
        <div class="img">
          <template v-if="product_icon">
              <img :src="product_icon.url" alt="">
          </template>
          <template v-if="!item.product_icon">
            <img :src="require('@/assets/images/defaultImg.gif')" alt="">
          </template>

        </div>
        <div class="price" style="margin-right: 15px">
          <p class="name">名称：{{ item.name }}</p>
          <p class="id">产品id: {{ item.id }}</p>
          <p class="list_price">市场价：{{ item.list_price }}</p>
          <p class="src_price">售卖价：{{ item.price }}</p>
          <p class="slaed">销量：{{ item.saled }}</p>
        </div>
        <div class="message">
          <p class="created_time">创建时间：{{ item.created_at }}</p>
          <p class="created_time">更新时间：{{ item.updated_at }}</p>
          <p class="status">状态：{{productStatus(item.status) }}</p>
        </div>
      </div>
      <div class="layoutBottom">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="信息">
               <div>
                  <upload-img ref="uploadImgRef" :id="id" :productImgList = "productImgList"></upload-img>
               </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="内容" force-render>
              <div v-html="item.content" class="product_content"></div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="尺码表">
              <product-size :id="id"></product-size>
            </a-tab-pane>
          </a-tabs>
      </div>
    </template>
    
  </div>
</template>

<script>
import UploadImg from 'components/product/uploadImg.vue'
import ProductSize from 'components/product/productSize.vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
export default defineComponent({
  components: {
    UploadImg,
    ProductSize
  },
  setup() {
    const uploadImgRef = ref(null)
    const activeKey = ref('1')
    const router = useRouter()
    const id = ref(router.currentRoute.value.params.ids)
    const product_detail = ref({})
    const product_icon = ref('')
    const product_img = ref([])
    const productImgList = ref([])
    const productStatus = function (value) {
      if (value == 'instock') {
          return '在库'
      } else if(value == 'stockout') {
        return '不在库'
      }
    }

    axios.post('productDetail', { id: id.value }).then(res => {
      if (res.status == '200') {
        product_detail.value = res.data.data
        console.log(product_detail.value)
        if (product_detail.value[0].product_icon) {
          product_icon.value = JSON.parse(product_detail.value[0].product_icon)
        }
        if (product_detail.value[0].product_img) {
          productImgList.value = JSON.parse(product_detail.value[0].product_img)
        }
      }
    })
    
    return {
      activeKey,
      productStatus,
      product_detail,
      product_icon,
      product_img,
      productImgList,
      uploadImgRef,
      id
    };
  },
})
</script>

<style lang="less" scoped>
#product_detail{
  position: relative;
  min-height: 100%;
  .layoutTop{
    display: flex;
    margin-bottom: 40px;

    .img img{
      width: 180px;
      height: auto;
      border-radius: 6px;
      border: 1px solid #ddd;
      margin-right: 15px;
    }

    .price{
      margin-right: 15px;

      p{
        font-size: 16px;
        color: #333;
        margin-top: 10px;
        line-height: 1.5em;
      }
    }
    .message{
      width: 350px;
      p{
        font-size: 16px;
        color: #333;
        margin-top: 10px;
      }
    }
  }
  ::v-deep .product_content p img{
    width: 100%;
  }
}
</style>