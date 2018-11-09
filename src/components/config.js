export default{
    serverurl: 'http://192.168.0.154:8888',
    // serverurl: 'http://119.23.8.181:8888',

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
    
}