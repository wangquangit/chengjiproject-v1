/* eslint-disable no-console */
export default{
    serverurl: 'http://192.168.0.154:8888', 
    // serverurl: 'http://119.23.8.181:8888', // 云服务器

    formFunc: function (forms,key) {
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].prop == key) {
                return forms[i].value;
            }
        }
    },

    formJson: function (forms) {
        var obj = {};
        for (var i = 0; i < forms.length; i++) {
            obj[forms[i].prop] = forms[i].value;
        }
        return obj
    },

    setParams: function (params, page) {
        return {
            page: page.currentPage,
            limit: page.pageSize,
            orderByField: params.orderByField,
            isAsc: params.isAsc,
            where: params.where
        }
    },

    setPage: function (res) {
        let page = {};
        console.log(res)
        page.total = res.data.total
        if(res.data.records.length == 0){
            if(res.data.current > 1){
                page.currentPage = res.data.current - 1
                return false
            } else {
                page.currentPage = res.data.current
            }
        } else {
            page.currentPage = res.data.current
        }
        return page
    }
}