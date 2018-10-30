<template>
    <el-row :gutter="10">
        <el-col :xs="0" :sm="manuwidth">
            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group> -->

            <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse">
                <el-button @click="changewidth()" size="small" :circle=true :icon="manubuttonicon"></el-button>
                <el-menu-item 
                    :index="index" 
                    v-for="(item, index) in this.$store.state.jsondata" 
                    :key="index"
                    @click="gotourl(item.manuinfo.url)"
                >
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.manuinfo.manuname}}</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :xs="24" :sm="mainwidth">
            <el-container>
                <el-header>
                    <!-- <i class="hidden-sm-and-up el-icon-arrow-down" @click="changewidth()"></i> -->

                    <el-dropdown trigger="click" size="medium" class="hidden-sm-and-up">
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
                    </el-dropdown>

                </el-header>
                <el-main>
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
    import jsondata from './get.js'
    import { mapState } from 'vuex';
    export default{
        data() {
            return {
                msg: 'this is index views',
                isCollapse: false,
                manubuttonicon: 'el-icon-d-arrow-left',
            }
        },
        mounted() {
            this.$store.state.jsondata = jsondata.data
        },
        methods: {
            gotourl(url) {
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
            }
        },
        computed: {
            ...mapState(['manuwidth','mainwidth'])
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
</style>
