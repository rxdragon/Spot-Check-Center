<template>
  <div class="error-page">
    <div class="errPage-container">
      <el-row>
        <el-col :span="12">
          <h1 class="text-jumbo text-ginormous">
            Oops!
          </h1>
          <div class="antialiased text-box bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            <h2>你没有权限</h2>
            <h6>请联系互联网中心添加权限</h6>
          </div>
          <el-button
            class="mt-8"
            icon="arrow-left"
            type="primary"
            @click="logout"
          >
            退出登录
          </el-button>
        </el-col>
        <el-col :span="12">
          <img
            :src="errGif"
            width="313"
            height="428"
            alt="Girl has dropped her ice cream."
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import errGifPath from '@/assets/images/401_images/401.gif'

import * as SessionTool from '@/utils/sessionTool'
import * as UserApi from '@/api/userApi'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: '401',
  setup () {
    const router = useRouter()
    const errGif = ref(`${errGifPath}?${+new Date()}`)

    // 登出
    const logout = () => {
      UserApi.logout()
      SessionTool.removeSession()
      const base = router.options.base
      router.push(`${base}/login`)
    }

    return {
      errGif,
      logout
    }
  }
})
</script>

<style lang="less" scoped>
  .error-page {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }

  .errPage-container {
    width: 800px;
    max-width: 100%;
    padding: 100px 0;
    margin: 0 auto;
    background-color: #fff;
    -webkit-app-region: drag;

    .pan-gif {
      display: block;
      margin: 0 auto;
    }

    .pan-img {
      display: block;
      width: 100%;
      margin: 0 auto;
    }

    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }

    .list-unstyled {
      font-size: 14px;

      li {
        padding-bottom: 5px;
      }

      a {
        color: #008489;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
