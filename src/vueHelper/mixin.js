import Vue from 'vue'
Vue.mixin({
    methods: {
        sortData(key, data, type) {
            let ordered = {}
            let compareFunction = function(a, b) {
                return data[b][key] - data[a][key]
            }
            if (type === 'asc') {
                compareFunction = function(a, b) {
                    return data[a][key] - data[b][key]
                }
            }
            Object.keys(data).sort(compareFunction).forEach(function(key) {
                ordered[key] = data[key]
            })
            return ordered
        },
        saveLocal(name, string, data) {
            if (data) {
                localStorage.setItem(name, data)
            }
            if (string) {
                localStorage.setItem(name, JSON.stringify(string))
            }
        },
        loadLocal(name) {
            return JSON.parse(localStorage.getItem(name))
        }
    }
})
