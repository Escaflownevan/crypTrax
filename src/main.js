import Vue from 'vue';
import App from './App.vue';
import Sparkline from 'vue-sparklines';
import Vuetify from 'vuetify';
import VueApexCharts from 'vue-apexcharts';
import '@/vueHelper/mixin';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import "vuetify/dist/vuetify.min.css";
import "./assets/css/global.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const ipcRenderer = window.require('electron').ipcRenderer;

Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);
Vue.use(Sparkline);
Vue.use(Vuetify);

//load files by data folder
ipcRenderer.send('request-loadLocal');
//start vue if files loaded
ipcRenderer.on('action-response-loadLocal', (event, arg) => {
    new Vue({
        data: {
            alerts: arg[0],
            coins: arg[1],
            myCoins: arg[2],
            boughtCoins: arg[3],
            settings: arg[4],
            allCoinsDate: arg[5],
            btcPrice: 0,
            apiCallsPerMinute: 0
        },
        watch: {
            //API calls tracker. Count every request to coingecko.
            apiCallsPerMinute() {
                if (this.apiCallsPerMinute == 1) {
                    setTimeout(this.timedOut, 60000);
                }
                if (this.apiCallsPerMinute > 40) {
                    console.log(this.apiCallsPerMinute + " / 50 calls per Minute. API Limit CoinGecko")
                }                
            }
        },
        methods: {
            //Reset API calls tracker. Every 60 seconds
            timedOut() {
                this.apiCallsPerMinute = 0;
            }
        },
        render: h => h(App)
    }).$mount('#app');
    //set theme mode css dark or light
    if (arg[4].darkModeOn) {
        document.getElementsByTagName('html')[0].setAttribute('class', 'dark')
    }
});
