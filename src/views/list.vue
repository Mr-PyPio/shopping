<template>
  <div id="userList">
    <a-layout>
      <a-layout-header class="header">
        <a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item v-for="item in topNavList" :key="item.id">
            <a :href="item.link">{{ item.name }}</a>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-sider width="200" style="background: #fff">
            <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline" style="height: 100%">
              <template v-for="items in leftMuneList" :key="items.id">
                <a-menu-item v-if="!items.children">
                    <template v-if="items.id == 11">
                      <router-link to="/user-list.html">
                          <span>
                            {{ items.name }}
                          </span>
                        </router-link>
                    </template>
                    <template v-if="items.id == 21">
                        <router-link to="/order-list.html">
                            <span>
                              {{ items.name }}
                            </span>
                          </router-link>
                    </template>
                </a-menu-item>
              </template>
            </a-menu>
          </a-layout-sider>
          <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
            <router-view ></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Mall Backstage Management System@2023 Created by PYPIO
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import {ref} from 'vue'
export default {
  name: '_list',
  setup() {
    const topNavList = ref({
      nav1: {
        id: '01',
        name: 'Catalog',
        link: '/home.html'
      },
      nav2: {
        id: '02',
        name: 'List',
        link: '/list.html'
      },
    })
     const leftMuneList = ref({
      '1': {
        id: '11',
        name: '用户列表',
        children: null
      },
      '2': {
        id: '21',
        name: '订单列表',
        children: null
      },
    })

    return {
      selectedKeys1: ref(['2']),
      selectedKeys2: ref(['1']),
      openKeys: ref(['sub1']),
      topNavList,
      leftMuneList
    }
  },
}
</script>

<style lang="less" scoped>

</style>