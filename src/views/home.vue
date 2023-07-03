<template>
  <a-layout>
    <a-layout-header class="header">
      <a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item v-for="item in topNavList" :key="item.id">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item v-for="item in topNavList" :key="item.name">
          <a :href="item.link">{{ item.name }}</a>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline" style="height: 100%">
            <template v-for="items in leftMuneList" :key="items.id">
              <a-sub-menu v-if="items.children" :key="items.id">
                <template #title>
                  <span>
                    <user-outlined />
                    {{ items.name }}
                  </span>
                </template>
                  <a-menu-item v-for="item in items.children" :key="item.id">
                    <a :href="item.link">{{ item.name }}</a>
                  </a-menu-item>
              </a-sub-menu>
              <a-menu-item v-if="!items.children" :key="items.id">
                <template #icon>
                    <router-link to="/section.html">
                      <span>
                        <user-outlined />
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
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { UserOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'home_',
  components: {
    UserOutlined
  },
  setup() {
    const topNavList = ref({
      nav1: {
        id: '01',
        name: '11',
        link: '/nav1'
      },
      nav2: {
        id: '02',
        name: '22',
        link: '/nav21'
      },
      nav3: {
        id: '03',
        name: '33',
        link: '/nav3'
      }
    })
     const leftMuneList = ref({
      '1': {
        id: '11',
        name: '功能',
        children: {
          '21': {
            id: '21',
            name: '广告位',
            link: '/banner.html'
          },
          '22': {
            id: '22',
            name: '勾选位',
            link: '/catalog.html'
          }
        }

      },
      '2': {
        id: '12',
        name: '产品列表',
        children: null
      },
      '3': {
        id: '13',
        name: '功能1',
        children: {
          '31': {
            id: '31',
            name: '自定义页面',
            link: '/specialPage'
          },
          '32': {
            id: '32',
            name: '自定义页面',
            link: '/section'
          }
        }

      },
    })
    return {
      selectedKeys1: ref(['2']),
      selectedKeys2: ref(['1']),
      openKeys: ref(['sub1']),
      leftMuneList,
      topNavList
    };
  },
});
</script>

<style>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

.ant-layout.ant-layout-has-sider{
  min-height: calc(100vh - 188px);
  box-sizing: border-box;
}
</style>