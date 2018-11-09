<template>
  <div class="avue-tags"
       v-if="showTag">
    <!-- tag盒子 -->
    <div class="tags-box"
         ref="tagBox">
      <el-tabs v-model="active"
               type="card"
               :closable="tagLen!==1"
               @tab-click="openTag"
               @edit="menuTag">
        <el-tab-pane :key="item.value"
                     v-for="item in tagList"
                     :label="item.label"
                     :name="item.value">
        </el-tab-pane>
      </el-tabs>
      <el-dropdown class="tags-menu pull-right">
        <el-button type="primary"
                   size="mini">
          更多
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data() {
        return {
            showTag: true,
            active: '',
            tagLen: 2,
        }
    },
    methods: {
        openTag() {

            console.log('aaa')
        },
        menuTag() {
            console.log('bbb')
        },
        closeOthersTags() {
            console.log('ccc')
        },
        closeAllTags() {
            console.log('ddd')
        }
    },
    computed: {
        ...mapState(['tagList'])
    }
}
</script>

<style scoped>
.tags-menu {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px 15px;
    box-sizing: border-box;
}
.pull-right {
    float: right !important;
}
</style>