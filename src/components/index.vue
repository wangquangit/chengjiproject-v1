<template>
    <el-container class="boos" :style="'height:'+winHeight">
        <el-scrollbar class="el-scrollbar__wrap">
            <el-menu
                class="el-menu-vertical-demo" 
                :collapse="isCollapse"
                v-loading="loading"
            >
                <h3 class="logo">
                    <router-link to="/">
                        <span>
                            logo
                        </span>
                    </router-link>
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
        </el-scrollbar>

        <el-container class="rightMain">
            <el-header>
                <el-button @click="changewidth">click me</el-button>
            </el-header>
            <el-scrollbar style="height:100%" class="el-scrollbar__wrap">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <cj-tags></cj-tags>
                        </div>
                    </el-col>
                </el-row>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-scrollbar>

        </el-container>

    </el-container>
</template>

<script>
    import { mapState } from 'vuex';
    import config from './config.js'
    import request from './user_authority.js'
    import cjTags from './shareComponents/cjtags.vue'
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
        components: {
            cjTags
        }
    }
</script>

<style scoped>
.grid-content {
    min-height: 36px;
}
.logo{
      margin: 1rem 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    min-height: 700px;
}
.el-scrollbar__wrap {
    height:100%;
    overflow-x: hidden;
}
el-container{
    border: none;
}
</style>
