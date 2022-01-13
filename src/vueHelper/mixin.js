import Vue from 'vue';
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const ipcRenderer = window.require('electron').ipcRenderer;
Vue.mixin({
    methods: {
        array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
        },
        saveLocal(name, data) {                                                     // save and load data to local json file
            ipcRenderer.send('request-saveLocal', [name, data]);
        },
        loadLocal(name) {
            ipcRenderer.send('request-loadLocal', name);
        },
        /*saveLocal(name, string, data) {                   // save and load data to browser
            if (data) {
                localStorage.setItem(name, data);
            }
            if (string) {
                localStorage.setItem(name, JSON.stringify(string));
            }
        },
        loadLocal(name) {
            return JSON.parse(localStorage.getItem(name));
        },*/
        updateBTCprice() {
            var get_btcPrice = async () => {
                let data = await CoinGeckoClient.simple.price({ //for coin/btc price calculation
                    ids: ['bitcoin'],
                    vs_currencies: [this.$root._data.settings.fiat],
                });
                this.$root._data.apiCallsPerMinute += 1;
                this.$root._data.btcPrice = Object.values(data.data.bitcoin)[0];
            }
            get_btcPrice();
        }
    }
})
