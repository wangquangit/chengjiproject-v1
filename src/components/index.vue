<template>
    <el-row :gutter="10">
        <el-col :xs="0" :sm="manuwidth">
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group> -->
            <!-- 左侧菜单栏 -->
            
            <el-menu 
                default-active="1-4-1" 
                class="el-menu-vertical-demo" 
                :collapse="isCollapse"
            >
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
        </el-col>
        <el-col :xs="24" :sm="mainwidth">
            <el-container>
                <el-header class="header">
                    <!-- <i class="hidden-sm-and-up el-icon-arrow-down" @click="changewidth()"></i> -->

                    <!-- <el-dropdown trigger="click" size="medium" class="hidden-sm-and-up">
                        <span class="el-dropdown-link">
                            <el-button
                                :circle=true
                                size="medium"
                                class="el-icon-arrow-down el-icon--right"
                            ></el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item 
                                v-for="(item, indexs) in this.$store.state.jsondata" 
                                :key="indexs"
                            >  
                                <li @click="gotourl(item.manuinfo.url)">
                                    {{item.manuinfo.manuname}}
                                </li>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                    头部组件

                </el-header>
                <el-main class="main">
                    <keep-alive>
                        <router-view>
                        </router-view>
                    </keep-alive>
                </el-main>
            </el-container>
        </el-col>
    </el-row>
</template>

<script>
    import { mapState } from 'vuex';
    import config from './config.js'
    export default{
        data() {
            return {
                msg: 'this is index views',
                isCollapse: false,
                manubuttonicon: 'el-icon-d-arrow-left',
            }
        },
        methods: {
            gotourl(listButtons,url) {
                this.$store.state.nowButtons = listButtons
                console.log('listButtons:',this.$store.state.nowButtons)
                this.$router.push(url)
            },
            changewidth() {
                // 触发点击事件修改菜单栏宽度
                if(!this.isCollapse){
                    this.isCollapse = true
                    this.$store.state.mainwidth = 23,
                    this.$store.state.manuwidth = 1
                }else{
                    this.isCollapse = false
                    this.$store.state.mainwidth = 18,
                    this.$store.state.manuwidth = 6
                }
            },
            getUserMenuInfo() {
                this.$axios({
                    method: 'post',
                    url: config.serverurl+'/login/getUserPermission',
                    headers: {
                        authorization: sessionStorage.getItem('token')
                    },
                }).then((res) => {
                    console.log('菜单栏:',res)
                    this.$store.state.userMenuInfo = res.data
                }).catch((err) => {
                    console.log('请求失败')
                })
            }
        },
        computed: {
            ...mapState(['manuwidth','mainwidth','userMenuInfo'])
        },
        created() {
            this.getUserMenuInfo()
        }
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
</style>
