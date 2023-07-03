<template>
  <div id="login">
      <a-form :model="formState" name="normal_login" class="login-form" @submit="goToLogin(formState.username)">
      <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="formState.username" @change="getUserName(formState.username)" :userName = "formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.password" @change="getPassWord(formState.password)" :passWord = "formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">Forgot password</a>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit"  class="login-form-button">
          Log in
        </a-button>
        Or
        <a href="">register now!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'login_',
  components: {
    UserOutlined,
    LockOutlined,
  },
   data() {
    return {
      userName: '',
      passWord: ''
    }
  },
  setup() {
    // const $axios = inject("$axios")
    // const postInfo = async () => {
    //   const { data: res } = await $axios.post('userList')
    //   return res.data
    // }
    const formState = reactive({
      username: '',
      password: '',
      remember: true,
    });
    
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    return {
      formState,
      disabled,
    };
  },
  methods: {
    goToLogin() { 
      const activeRoute = window.sessionStorage.getItem('activeRoute') ?? '/home.html'
      console.log(activeRoute)
      const postInfo = async () => {
        const { data: res } = await this.$axios.post('login', { username: this.userName, password: this.passWord })
        if (res.status == '400') {
            window.alert('用户名不存在')
        } else if (res.status == '202') {
            window.alert('密码错误')
        } else if (res.status == '200') {
          let token = res.token
          if (token) {
            window.localStorage.setItem('userLoginToken', token)
            }
          window.localStorage.setItem('userName', this.userName)
          this.$router.push(`${activeRoute}`)
          }
      }
      postInfo()
    },
    getPassWord(str) {
      this.passWord = str
    },
    getUserName(str) {
      this.userName = str
    }
  },
});
</script>
<style lang="less" scoped>
#login{
  width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  box-sizing: border-box;

   .login-form-forgot {
    float: right;
  }

  .login-form-button {
    width: 100%;
  }
}


</style>