<template>
    <div>
        <el-button size="small" type="primary" @click="addInfo">
            增加
        </el-button>
        <el-button size="small" type="info" @click="editInfo">
            编辑
        </el-button>
        <el-button size="small" type="danger" @click="delInfo">
            删除
        </el-button>

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



        <el-dialog title="修改区域" :visible.sync="editWindow">
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
                <el-button type="primary" @click="editSubmit">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            addWindow: false,
            editWindow: false,
            delWindow: false,
            areaWindow: false,
            formLabelWidth: '120px',
            msg: 'this is select',
            filterText: '',
            filterId: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        filterNode(value, data) {
            // 树结构官方方法
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        getnode(value) {
            console.log('value:',value)
            // 节点被选择时的回调,赋值选中的区域的值
            this.filterText = value.name
            this.filterId = value.id
            this.info.forms[0].name = value.name
            this.info.forms[0].value = value.id
            console.log('修改后的表单:',this.info.forms)
        },
        submitTree() {
            // 选择区域后赋值ID,和name
            this.info.forms[0].name = this.filterText
            this.info.forms[0].value = this.filterId
            this.areaWindow = false
        },
        addInfo() {
            // 添加按钮被执行
            this.data = this.info.getAreaCommon
            this.addWindow = true
        },
        focus(item) {
            // 区域选择输入框获取焦点时激活弹窗
            if(item.prop == 'area_id') {
                this.areaWindow = true
            }
        },
        handleArea(item, obj) {
            // 将区域编码转换为中文字符
            for(var i in obj) {
                if(item == obj[i].id) {
                    this.info.forms[0].code = this.info.forms[0].value
                    this.info.forms[0].value = obj[i].name
                    console.log('aa')
                } else {
                    this.handleArea(item, obj[i].children)
                }
            }
        },
        addSubmit() {
            // 提交添加信息
            console.log('info.forms:',this.info)
            // this.info.forms[0].value = this.filterId
            this.$emit('addSubmit',this.info.forms, this.message)
            this.addWindow = false
            this.restoreForms()
        },
        restoreForms() {
            // 还原状态
            for(var i in this.info.forms) {
                this.info.forms[i].value = ''
                this.info.forms[i].name = ''
            }
        },
        editInfo() {
            this.data = this.info.getAreaCommon
            this.$emit('editInfo', this.message)
            this.handleArea(this.message.area_id, this.info.getAreaCommon)
            this.editWindow = true
        },
        editSubmit() {
            this.$emit('editSubmit', this.info, this.message)
            this.editWindow = false
        },
        delInfo() {
            // 提交删除信息
            this.$emit('delInfo', this.message)
        },
        cancel() {
            this.addWindow = false
        },
        treecancel() {
            this.areaWindow = false
        }
    },
    props: {
        message: Object,
        info: Object
    },
}
</script>

<style scoped>

</style>
