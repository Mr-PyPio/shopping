<template>
  <div class="productSize">

    <button v-if="!sizeDatas.sizes" type="button" @click="addSizeTable">增加尺码表</button>
    <template v-if="sizeDatas && sizeDatas.sizes">
      <div style="display: flex">
        <button type="button" class="addLine" @click="addLine"><span>增加行</span></button>
        <button type="button" class="addColumn" @click="addColumn"><span>增加列</span></button>
      </div>
      <ul>
        <li v-for="item,key in sizeDatas.sizes" :key="'sizeName'+ key">
          <h2>
            <input type="text" name="sizeFirstName" id="" v-model="sizeDatas.sizes[key].first_name" >
            <input type="text" name="sizeTransName" id="" v-model="sizeDatas.sizes[key].trans_name" >
          </h2>
            <p v-for="item2,key2 in item.values" :key="'sizeItem' + key2">
              <input type="text" v-model="sizeDatas.sizes[key].values[key2]" name="">
            </p>
            <button type="button" @click="delColumn(key)">删除</button>
        </li>
        <li style="padding-top: 67px;width: 60px;" v-if="sizesLen2">
          <p style="border: 0" v-for="item,key2 in sizesLen2" :key="item">
            <button type="button" @click="delLine(key2)">删除</button>
          </p>
        </li>
      </ul>
    </template>
    <p style="padding: 20px"></p>
    <button v-if="!sizeDatas.size_group" type="button" @click="addSizeGroupTable">增加分类尺码表</button>
    <template v-if="sizeDatas && sizeDatas.size_group">
      <div v-for="group, groupKey in sizeDatas.size_group" :key="'size_group' + groupKey">
        <h2>{{ group.size.name }}</h2>
        <div style="display: flex">
          <button type="button" class="addLine addGroupLine" @click="addGroupLine(groupKey)"><span>增加行</span></button>
          <button type="button" class="addColumn addGroupColumn" @click="addGroupColumn(groupKey)"><span>增加列</span></button>
        </div>
        <ul>
          <li v-for="item, key in group.size_value" :key="'size_group_name' + key">
            <h2>
              <input type="text" name="sizeFirstName" id="" v-model="sizeDatas.size_group[groupKey].size_value[key].first_name" >
              <input type="text" name="sizeTransName" id="" v-model="sizeDatas.size_group[groupKey].size_value[key].trans_name" >
            </h2>
              <p v-for="item2, key2 in item.values" :key="'size_group_item' + key2">
                <input type="text" v-model="sizeDatas.size_group[groupKey].size_value[key].values[key2]" name="">
              </p>
              <button type="button" @click="delGroupColumn(key, groupKey)">删除</button>
          </li>
          <li style="padding-top: 67px;width: 60px;" v-if="sizesLenGroup2">
            <p style="border: 0" v-for="item, key2 in sizesLenGroup2" :key="item">
              <button type="button" @click="delGroupLine(key2, groupKey)">删除</button>
            </p>
          </li>
        </ul>
      </div>
    </template>

    <button type="button" @click="saleSizeData" class="saleSizeData">保存</button>
  </div>
</template>

<script>
import { defineComponent,ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  props: {
    id: Array
  },
  setup(props) {
    const sizesGroup = ref([])
    const sizeDatas = ref({})
    const sizesBody = ref([])
    const sizesLen2 = ref(0)
    const sizesLen1 = ref(0)
    const sizesLenGroup2 = ref(0)
    const sizesLenGroup1 = ref(0)
    const sizesIds = ref('')
    const sizesGroupIds = ref('')
    const sizesGroupValueIds = ref('')
    const hasAddSize = ref(0)
    const hasAddSizeGroup = ref(0)
    const isAddSize = ref(0)
    const addLine = function () {
      sizesLen2.value += 1
      for (let i = 0; i < sizesLen1.value; i++) {
        sizeDatas.value.sizes[i].values[sizesLen2.value - 1] = ''
      }
    }
    const addColumn = function () {
      sizesLen1.value += 1
      sizesIds.value = Number(sizesIds.value) + 1
      sizeDatas.value.sizes.push({
        first_name: '尺码',
        id: sizesIds.value,
        trans_name: '单位',
        values: []
      })
      for (let i = 0; i < sizesLen2.value; i++) {
        sizeDatas.value.sizes[sizesLen1.value -1].values[i] = ''
      }
    }
    const addGroupColumn = function (groupKey) {
      sizesLenGroup1.value += 1
      sizesGroupValueIds.value = Number(sizesGroupValueIds.value) + 1
      sizeDatas.value.size_group[groupKey].size_value.push({
          first_name: '尺码',
          id: sizesGroupValueIds.value,
          trans_name: '单位',
          values: []
      })
      for (let i = 0; i < sizesLenGroup2.value; i++) {
        sizeDatas.value.size_group[groupKey].size_value[sizesLenGroup1.value - 1].values[i] = ''
      }
    }
    const addGroupLine = function (groupKey) {
      sizesLenGroup2.value += 1
      for (let i = 0; i < sizesLenGroup1.value; i++) {
        sizeDatas.value.size_group[groupKey].size_value[i].values[sizesLenGroup2.value - 1] = ''
      }
     }
    const delLine = function (index) {
      sizesLen2.value -= 1
      for (let i = 0; i < sizesLen1.value; i++) {
        sizeDatas.value.sizes[i].values.splice(index,1)
      }
      console.log(index)
    }
    const delColumn = function (index) {
      sizesLen1.value -= 1
      sizeDatas.value.sizes.splice(index ,1)
      console.log(index)
    }
    const delGroupColumn = function (index, groupKey) {
      sizesLenGroup1.value -= 1
      sizeDatas.value.size_group[groupKey].size_value.splice(index, 1)
       console.log(index)
    }
    const delGroupLine = function (index, groupKey) {
      sizesLenGroup2.value -= 1
      for (let i = 0; i < sizeDatas.value.size_group[groupKey].size_value.length; i++) {
        sizeDatas.value.size_group[groupKey].size_value[i].values.splice(index, 1)
      }
      console.log(index) 
    }
    const addSizeTable = function () {
      isAddSize.value = 1
      sizesLen2.value = 1
      sizesLen1.value = 1
      hasAddSize.value = 1
      sizeDatas.value.sizes = []
      sizeDatas.value.sizes[0] =
        {
          first_name: '尺码',
          id: sizesIds.value,
          trans_name: '单位',
          values: ['']
        }
    }
    const addSizeGroupTable = function () {
      isAddSize.value = 1
      hasAddSizeGroup.value = 1
      sizesLenGroup2.value =1
      sizesLenGroup1.value = 1
      sizeDatas.value.size_group = []
      sizeDatas.value.size_group[0] = {
        size: {
            id: sizesGroupIds.value,
            name: "分类尺码表",
            sort: "1",
            title: "",
        },
        size_value: [
          {
              first_name: "尺码",
              id: sizesGroupValueIds.value,
              trans_name: "单位",
              values: ['']
            }
          ]
        }
    }
    const saleSizeData = function () {
      let content = []
      let type = ['sizes']
      if (sizeDatas.value.sizes) {
        content.push(JSON.stringify(sizeDatas.value.sizes))
      } else {
        content.push('')
      }
      if (sizeDatas.value.size_group) {
        content.push(JSON.stringify(sizeDatas.value.size_group))
        type.push('group')
      } else {
        content.push('')
      }
      console.log([sizeDatas.value.sizes, sizeDatas.value.size_group])
      axios.post('saleProductSizes', {
        id: props.id,
        type: type,
        content: content,
        add: isAddSize.value
      }).then(res => {
        if (res.status == 200) {
          this.$router.go(0)
        }
      })
    }
    const getProductSize = function () {
      axios.post('productSizes', { id: props.id })
        .then(res => {
          const data = res.data
          if (data.status == 200) {
            console.log(data)
            if (data.data.length > 0) {
              const upDatas = data.data[0]
              console.log(upDatas)
              let sizes = ''
              if (upDatas.sizes) {
                sizes = JSON.parse(upDatas.sizes)
                for (let i = 0; i < sizes.length; i++) {
                  sizesBody[i] = []
                }
              }

              if (upDatas.size_group) {
                sizesGroup.value = JSON.parse(upDatas.size_group)
              }
              sizeDatas.value = {
                id: upDatas.id,
                product_id: upDatas.product_id,
                size_group: sizesGroup.value,
                sizes: sizes
              }
              sizesLen1.value = sizeDatas.value.sizes.length
              sizesLen2.value = sizeDatas.value.sizes[0].values.length
              sizesIds.value = sizeDatas.value.sizes[sizesLen1.value - 1].id
              sizesLenGroup1.value = sizeDatas.value.size_group[0].size_value.length
              sizesLenGroup2.value = sizeDatas.value.size_group[0].size_value[0].values.length
              sizesGroupValueIds.value = sizeDatas.value.size_group[0].size_value[sizesLenGroup1.value - 1].id
              sizesGroupIds.value = sizeDatas.value.size_group[sizeDatas.value.size_group.length - 1].size.id
            }else {
              sizesIds.value = props.id + '0000'
              sizesGroupValueIds.value = props.id + '00001'
              isAddSize.value = 1
              sizesGroupIds.value = props.id + '10001'
            }
          } 
        })
    }
    getProductSize()
    return {
      getProductSize,
      sizeDatas,
      sizesLen2,
      addColumn,
      addLine,
      sizesLen1,
      sizesIds,
      delLine,
      delColumn,
      saleSizeData,
      addSizeTable,
      addSizeGroupTable,
      sizesLenGroup2,
      sizesLenGroup1,
      delGroupColumn,
      delGroupLine,
      addGroupLine,
      addGroupColumn,
      sizesGroupValueIds,
      sizesGroupIds
    }
  },
})
</script>

<style lang="less" scoped>
.productSize{
  .addLine,.addColumn{
    width:auto;
    border-radius: 8px;
    border: 1px solid rgb(140, 185, 245);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 8px;
    color: #fff;
    background: rgb(140, 185, 245);
    margin-right: 5px;
    margin-bottom: 20px;
  }

  ul{
    display: flex;
    overflow-y: auto;

    li{
      font-size: 14px;
      text-align: center;
      margin-right: 5px;

      h2{
        font-weight: bold;
        padding: 8px;
        border: 1px solid #ddd;
        margin-bottom: 5px;
        border-radius: 8px;
      }

      input{
        width: 100px;
        display: block;
        padding: 0;
      } 

      p{
        font-size: 13px;
        padding: 8px;
        border: 1px solid #ddd;
        margin-bottom: 5px;
        border-radius: 8px;
      }
    }
  }

  .saleSizeData{
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 8px 12px;
    font-size: 14px;
    color: #fff;
    border: 0;
    border-radius: 8px;
    background: #333;
  }
}
</style>
