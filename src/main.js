import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import '@/vueHelper/mixin'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Sparkline from 'vue-sparklines'

Vue.prototype.$axios = axios

Vue.use(Sparkline)

new Vue({
    data: {
        $coins: [],
        $myCoins: [],
        $boughtCoins: [],
        $settings: []
    },
    render: h => h(App)
}).$mount('#app')
