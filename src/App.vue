<template>
<div id="app" data-app>
    <div v-if="showLoader" class="dragWindowLoading" >
        <div  id="loaderFrame">
            <h1 class="main">crypTrax</h1>
            <span>- Track your Cryptocurrencies -</span>
            <div class="logo">
                <img :src="require(`./assets/logo/icon.svg`)" width="250px" />
            </div>
            <h2 class="info"><i class="fas fa-spinner fa-pulse"></i> {{showPercent()}} %</h2>
        </div>
    </div>

    <landingPage ref="landingPage"></landingPage>
</div>
</template>
<script>
import landingPage from './components/LandingPage';
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    components: {
        landingPage
    },
    data() {
        return {
            counter: 0,
            totalCounter: 0,
            showLoader: true,
            categories: ['Logo', 'Name', 'Rank', 'Price', '1 h', '24 h', '7 Days', 'BTC-Price', 'Cap', 'Value', 'Profit/Loss', 'ATH', '30 Days', 'Delete']
        };
    },
    created() {
        //load or create settings object
        if (this.$root._data.settings.tv_candle_time != undefined) {
            ipcRenderer.send('request-update-minimizewindow', this.$root._data.settings.minimizewindow);
        } else {
            this.$root._data.settings = {
                alerts: [],
                autostart: false,
                blockView: false,
                cg_logo: true,
                darkModeOn: true,
                favlink: "https://coingecko.com",
                favLinkActive: false,
                fiat: 'USD',
                info_panel: true,
                minimizewindow: false,
                taskbarOn: false,
                taskbarOnly: false,
                taskbarTop: false,
                taskbarOnTop: false,
                taxes: {
                    percentage: 0,
                    active: false
                },
                timer: true,
                tv: [],
                tv_candle_time: '30',
                "view": [{
                    "name": "Logo",
                    "view": true
                }, {
                    "name": "Name",
                    "view": true
                }, {
                    "name": "Rank",
                    "view": true
                }, {
                    "name": "Price",
                    "view": true
                }, {
                    "name": "1 h",
                    "view": true
                }, {
                    "name": "24 h",
                    "view": true
                }, {
                    "name": "7 Days",
                    "view": true
                }, {
                    "name": "BTC-Price",
                    "view": true
                }, {
                    "name": "Cap",
                    "view": true
                }, {
                    "name": "Value",
                    "view": true
                }, {
                    "name": "Profit/Loss",
                    "view": true
                }, {
                    "name": "ATH",
                    "view": true
                }, {
                    "name": "30 Days",
                    "view": true
                }, {
                    "name": "Delete",
                    "view": true
                }]
            }
            this.saveLocal('settings', this.$root._data.settings);
            ipcRenderer.send('request-update-minimizewindow', this.$root._data.settings.minimizewindow);
        }
        if (!this.$root._data.settings.darkModeOn) {
            document.getElementsByTagName('html')[0].setAttribute('class', '')
        }
        const plugin = document.createElement("script");
        plugin.setAttribute("src", "https://s3.tradingview.com/tv.js");
        plugin.async = true;
        document.head.appendChild(plugin);
    },
    mounted() {
        //initialization complete. Start updating coins
        this.$refs.landingPage.getApiData();
    },
    methods: {
        //calculate progress for loading top 3000 coins
        showPercent() {
            if (this.counter == 0) {
                return 0;
            } else {
                return parseFloat((((this.counter * 500) / (this.totalCounter * 500)) * 100)).toFixed(0);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
h1.main {
    margin-top: 40px;
    margin-bottom: 20px;
}

#loaderFrame {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.logo {
    margin: 3vw auto;
}

.info,
span {
    color: var(--textColorSettings);
}

.dragWindowLoading{
    width: 100%;
    height: 100vh;
    -webkit-app-region: drag;
}
</style>
