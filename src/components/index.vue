<template>
    <el-container :style="'height:'+winHeight">
        <el-menu
            class="el-menu-vertical-demo leftmenu" 
            :collapse="isCollapse"
        >
            <h3 class="logo">
                <router-link to="/">
                    <span>
                        logo
                    </span>
                </router-link>
            </h3>
            <h3 v-if="loading">
                加载中...
            </h3>
            <el-submenu 
                :index="String(menuindex)"
                v-for="(menu, menuindex) in userMenuInfo"
                :key="menuindex"
            >
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{menu.name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item
                        v-for="(item, itemindex) in menu.children"
                        :key="itemindex"
                        :index="String(menuindex+'-'+itemindex)"
                        @click="gotourl(item.listButton,item.url)"
                    >
                        {{item.name}}
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>

        <el-container>
            <el-header>
                <el-button @click="changewidth">click me</el-button>
            </el-header>

            <el-main>
                <keep-alive>
                    <!-- transition: 过渡效果 -->
                    <router-view></router-view>
                </keep-alive>
            </el-main>

        </el-container>

    </el-container>
</template>

<script>
    import { mapState } from 'vuex';
    import config from './config.js'
    import request from './user_authority.js'
    export default{
        data() {
            return {
                msg: 'this is index views',
                isCollapse: false,
                winHeight: window.innerHeight+'px', // 获取窗口高度
                manubuttonicon: 'el-icon-d-arrow-left',
                loading: true, // 左侧菜单栏加载状态
            }
        },
        methods: {
            gotourl(listButtons,url) {
                this.$router.push(url)
            },
            getUserMenuInfo() {
                request.postRquest(
                    [
                        '/login/getUserPermission',
                        'post',
                        {},
                        (response) => {
                            this.$store.state.userMenuInfo = response.data
                            this.setMainButtons(response.data) // 获取按钮后添加到全局 // ???
                            this.loading = false // 加载状态消失
                        },
                        false
                    ]
                )
            },
            setMainButtons(response) {
                // 将按钮对象组织后添加到全局

                for(var index in response){
                    for(var item in response[index].children) {
                        this.$store.state.mainButtonInfo[response[index].children[item].url]
                            = response[index].children[item].listButton
                    }
                }
            },
            changewidth() {
                this.isCollapse = !this.isCollapse
            }
        },
        computed: {
            ...mapState(['manuwidth','mainwidth','userMenuInfo'])
        },
        created() {
            this.getUserMenuInfo()
        },
    }
</script>

<style scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .header{
      background: #eee
  }
  .main{
      background: #ccc
  }
  .indexright{
      float: right;
  }
  .logo{
      margin: 1rem 0;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 300px;
    min-height: 706px;
  }
</style>
