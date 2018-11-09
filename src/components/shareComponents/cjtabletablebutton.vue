<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
                <div class="grid-content bg-purple">
                    <el-button type="primary" class="cjbutton" size="small" @click="addInfo">添加</el-button>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="添加区域" :visible.sync="addWindow">
            <el-form >
                <el-form-item
                    v-for="(item, index) of info.forms"
                    :key="index"
                    :label="item.label"
                    :label-width="formLabelWidth"
                >
                    <el-input @focus="focus(item)" v-model="item.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="addSubmit">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择区域" :visible.sync="areaWindow">
            <!-- 区域选择弹窗 -->
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
            >
            </el-input>
            <el-tree
                :default-expand-all="false"
                :check-on-click-node="true"
                :data="data"
                :props="defaultProps"
                :filter-node-method="filterNode"
                class="filter-tree"
                ref="tree"
                @check="getnode"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="treecancel">取消</el-button>
                <el-button type="primary" @click="submitTree">确定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'this is tabel tree views',
            addWindow: false,
            areaWindow: false,
            formLabelWidth: '120px',
            filterText: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    methods: {
        getnode(value) {
            // 节点被选择时的回调,赋值选中的区域的值
            this.filterText = value.name
            this.filterId = value.id
            this.info.forms[0].name = value.name
            this.info.forms[0].value = value.id
            // console.log('修改后的表单:',this.info.forms)
        },
        filterNode(value, data) {
            // 树结构官方方法
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        addInfo() {
            // 添加
            this.restoreForms()
            this.data = this.info.getAreaCommon
            this.addWindow = true
        },
        addSubmit() {
            // console.log('forms:',this.info)
            this.$emit('addSubmit',this.info.forms)
            this.addWindow = false
            //提交添加
        },
        focus(item) {
            // 获取焦点
            if(item.prop == 'area_id') {
                this.areaWindow = true
            }
        },
        restoreForms() {
            // 还原状态
            for(var i in this.info.forms) {
                this.info.forms[i].value = ''
                this.info.forms[i].name = ''
            }
        },
        search() {
            // 搜索
            console.log('搜索')

        },
        cancel() {
            this.addWindow = false
        },
        treecancel() {
            // 取消区域选择弹窗
            this.areaWindow = false
        },
        submitTree() {
            this.areaWindow = false
        }
    },
    props: {
        info: Object
    }
}
</script>

<style scoped>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.cjbutton{
    margin: .3rem 0;
}
.bg-purple {
    background: #d3dce6;
}
.cjbutton{
    margin: .5rem;
}
</style>
