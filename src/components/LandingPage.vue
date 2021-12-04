<template>
<div id="wrapper" v-if="childDataLoaded">
    <div class="menuBar">
        <ul class="menuBarMain">
            <li>
                <div class="switchHolder">
                    <i title="Crypto list view" class="fas fa-th-list ansichtListe"></i>
                    <label class="switch" @click="changeView(isToggled)">
                        <input type="checkbox" v-model="isToggled" :checked="isToggled">
                        <span class="slider round"></span>
                    </label>
                    <i title="Tradingview multi window" class="fas fa-th-large ansichtTV"></i>
                </div>
            </li>
            <li>
                <a v-show="this.$root.$settings.btcecho" id="BTCEchoIcon" class="echo-icon" target="_blank" title="News: BTC-ECHO.de" href="https://www.btc-echo.de/"><img class="shadow" :src="require(`../assets/favicon_be.png`)" height="40px" width="40px" /></a>
            </li>
            <li>
                <countDown></countDown>
            </li>
            <li>
                <div id="infoPanel" v-show="this.$root.$settings.info_panel && this.$root.$myCoins.length != 0">
                        <div class="infoCard shadow"><p>Global Cap</p><strong v-if="!this.globLoader">{{ this.globMarket }}<span v-if="this.$root.$settings.fiat==='EUR'"> €</span><span v-else> $</span></strong><i v-else class="fas fa-spinner fa-pulse"></i></div>
                        <div class="infoCard shadow" v-show="this.totalValue() != 0 || this.totalProfLoss() != 0">
                            <div><p>Values</p><strong>{{ this.totalValue() }} <span v-if="this.$root.$settings.fiat==='EUR'"> €</span><span v-else> $</span></strong></div>
                        </div>
                        <div class="infoCard shadow" v-show="this.totalValue() != 0 || this.totalProfLoss() != 0">
                            <div><p>P/L</p><strong>{{ this.totalProfLoss() }} <span v-if="this.$root.$settings.fiat==='EUR'"> €</span><span v-else> $</span></strong></div>
                        </div>
                </div>
            </li>
            <li>
                <settings></settings>
            </li>
        </ul>
    </div>
    <coinsList v-if="!isToggled" :key="componentKey"></coinsList>
    <blockList v-if="isToggled"></blockList>
</div>
</template>

<script>
import coinsList from './LandingPage/coinsList';
import countDown from './LandingPage/countDown';
import settings from './LandingPage/settingsMain';
import blockList from './LandingPage/blockList';
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

export default {
    name: 'landing-page',
    components: {
        coinsList,
        countDown,
        settings,
        blockList
    },
    data() {
        return {
            childDataLoaded: false,
            allCoinsShort: [],
            componentKey: 0,
            componentKey2: 0,
            categories: ['Logo', 'Name', 'Rang', 'Preis', '1 Std', '1 Tag', '7 Tage', 'Cap', 'Wert', 'Profit/Loss', 'ATH', '30 Tage', 'Löschen'],
            isToggled: this.$root.$settings.blockView,
            splitArray: [],
            countCircle: 1,
            maxCoins: 12, // 12 * 250 = 3000 Top of Cryptocurrencies
            coinsCounter: 0,
            globMarket: "",
            globLoader: true,
            totalValue(){
                let all = 0;
                let obj = this.$root.$boughtCoins;
                obj.forEach((item, i) => {
                    if (obj[i].ammount>0) {
                        all += obj[i].ammount * this.$root.$myCoins[i].price;
                    }
                });
                return all.toFixed(2);
            },
            totalProfLoss(){
                let all = 0;
                let obj = this.$root.$boughtCoins;
                obj.forEach((item, i) => {
                    if (obj[i].ammount>0) {
                        let p = obj[i].boughtPrice;
                        if (p == 0) {
                            all += obj[i].ammount * this.$root.$myCoins[i].price;
                        }else{
                            let a = obj[i].ammount * p;
                            let b = obj[i].ammount * this.$root.$myCoins[i].price;
                            all += b - a;
                        }
                    }
                });
                return all.toFixed(2);
            }
        }
    },
    methods: {
        get30Days() {
            var get_30 = async () => {
                let temparr = [];
                let timeIn;
                if (this.$root.$myCoins[this.coinsCounter].days30 == undefined) {
                    timeIn = 0;
                } else {
                    timeIn = this.$root.$myCoins[this.coinsCounter].days30.timestamp;
                }

                if (timeIn < (Date.now() - 86400000)) {    //Update 30 Days prices for sparklines only every 24 hours
                    let data;
                    try {
                        data = await CoinGeckoClient.coins.fetchMarketChart(this.$root.$myCoins[this.coinsCounter].id, {
                            vs_currency: this.$root.$settings.fiat,
                            days: "30",
                            interval: "daily"
                        });


                    data.data.prices.forEach((item) => {
                        let flag = true;
                        let price = String(item[1]);
                        if (price.indexOf('.') > -1) {
                            let a = price.slice(price.indexOf('.') + 1, price.length);
                            for (let i = 0; i < a.length; i++) {
                                if (a.charAt(i) !== '0' && flag) {
                                    temparr.push(price.slice(0, price.indexOf('.') + i + 3));
                                    flag = false;
                                }
                            }
                        } else {
                            temparr.push(item[1]);
                        }
                    });
                    Object.assign(this.$root.$myCoins[this.coinsCounter], {
                        "days30": {
                            "prices": temparr,
                            "timestamp": Date.now()
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                }

                if (this.coinsCounter == this.$root.$myCoins.length - 1) {
                    this.saveLocal('myCoinsLocal', this.$root.$myCoins);
                    this.coinsCounter = 0;
                    setTimeout(()=>{
                        this.loadGlobal();
                        this.forceRerender();
                    },1000);
                } else {
                    setTimeout(()=>{
                        this.forceRerender();
                        this.coinsCounter++;
                        get_30();
                    },1000);
                }
            }
            get_30();
        },
        loadGlobal () {
            let this2 = this
            var load_global = async () => {
                let data;
                try {
                      data = await CoinGeckoClient.global();
                      let obj = data.data.data;
                      Object.keys(obj.total_market_cap).map(function(k) {
                          if (k == this2.$root.$settings.fiat.toLowerCase()) {
                              let num = obj.total_market_cap[k];
                              if (Math.abs(Number(num)) >= 1.0e+12) {
                                  num = (Math.abs(Number(num)) / 1.0e+12).toFixed(2) + ((this2.$root.$settings.fiat == "EUR") ? " Bil" : " Tril");
                              }
                              if (Math.abs(Number(num)) >= 1.0e+9) {
                                  num = (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + ((this2.$root.$settings.fiat == "EUR") ? " Mil" : " Bil");
                              }
                              this2.globMarket = num;
                              this2.globLoader = false;
                          }
                      })
                } catch (e) {
                    console.log(e);
                }
            }
            load_global();
        },
        forceRerender() {
            this.componentKey += 1;
        },
        changeView(view) {
            this.$root.$settings.blockView = !view;
            this.colorCheck();
            this.saveLocal('settings', this.$root.$settings);
        },
        colorCheck() {
            try {
                if (this.$root.$settings.blockView) {
                    document.querySelector(".ansichtTV").classList.add("ansichtAktiv");
                    document.querySelector(".ansichtListe").classList.remove("ansichtAktiv");
                } else {
                    document.querySelector(".ansichtListe").classList.add("ansichtAktiv");
                    document.querySelector(".ansichtTV").classList.remove("ansichtAktiv");
                }
            } catch (e) {
                //console.log(e);
            }
        },
        loadTV() {
            if (this.$root.$settings.tv.length != 0) {
                document.getElementById("holderIframes").innerHTML = '';
                this.$root.$settings.tv.forEach((item) => {
                    let frame = '<div class="col span_1_of_3"><iframe src="https://s.tradingview.com/widgetembed/?symbol=' + item + '&interval=' + this.$root.$settings.tv_candle_time +
                        '&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Europe/Berlin%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=de_DE&utm_source=localhost&utm_medium=widget&utm_campaign=chart" /></div>';
                    document.getElementById("holderIframes").innerHTML += frame;
                });
            } else {
                document.getElementById("holderIframes").innerHTML = '';
                document.getElementById("holderIframes").innerHTML = '<h1>Please add currency via menu -> Tradingview</h1> <i  class="fa fa-arrow-right noListArrow"></i>';
            }
        },
        getApiData() {
            if (this.loadLocal('allCoinsDate') < (Date.now() - 864000000)){ //check ever 10 Days for new Coins
                this.$root.$coins = [];
                this.$parent._data.totalCounter = this.maxCoins;
                var load_list = async () => {
                    console.log("Runs: " + this.countCircle + " / " + this.maxCoins);
                    this.$parent._data.counter = this.countCircle - 1;
                    try {
                        let data = await CoinGeckoClient.coins.markets({
                            per_page: 250,
                            page: this.countCircle,
                            localization: false,
                            vs_currency: this.$root.$settings.fiat
                        });

                        data.data.forEach((item) => {
                            let d = {
                                "id": item.id,
                                "name": item.name,
                                "symbol": item.symbol.toUpperCase(),
                                "logo_url": item.image,
                                "rank": item.market_cap_rank.toString()
                            }
                            this.$root.$coins.push(d);
                        });
                        if (this.maxCoins == this.countCircle) {
                            this.$root.$coins.sort((a, b) => (parseInt(a.rank) > parseInt(b.rank)) ? 1 : ((parseInt(b.rank) > parseInt(a.rank)) ? -1 : 0));
                            this.childDataLoaded = true;
                            this.$parent._data.showLoader = false;
                            this.saveLocal('allCoinsDate', Date.now());
                            this.countCircle = 0
                            this.saveLocal('allCoinsLocal', this.$root.$coins)
                        } else {
                            let this2 = this
                            setTimeout(function(){
                                this2.countCircle++;
                                this2.forceRerender();
                                load_list();
                            },1000)

                        }
                    } catch (e) {
                        console.log(e)
                        let this2 = this;
                        setTimeout(() => {
                            this2.getApiData();
                            console.log("Restart loading Top3000");
                        },1000);
                    }
                };
                load_list()
            } else {
                this.$root.$coins = this.loadLocal('allCoinsLocal');
                this.childDataLoaded = true;
                this.$parent._data.showLoader = false;
                console.log('Old all $coins wurden geladen von cookie');
            }
        }
    },
    mounted() {
        let this2 = this;
        setTimeout(function() {
            this2.forceRerender();
            this2.colorCheck();
        }, 500)
    }
}
</script>

<style>
.fa-spinner{
    color: #ff9400fc!important;
}

.fa-check{
    color: green!important;
}

.ansichtAktiv {
    color: #ff9400fc !important
}

.ansichtListe,
.ansichtTV {
    color: black
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    background: #454552;
    overflow-x: hidden;
}

h2 {
    margin-bottom: 20px;
    color: #dadada
}

button:not(.del) {
    display: inline-block;
    padding: 0.5em 1em;
    text-decoration: none;
    background: #f7f7f7;
    border-left: solid 6px #5e4f92;
    color: #5e4f92;
    font-weight: bold;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.29);
}

#wrapper {
    height: 100vh;
    padding: 80px 10px;
    padding-top: 0;
    margin: 0 auto;
}

#logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
}

main {
    display: flex;
    justify-content: space-between;
}

main>div {
    flex-basis: 50%;
}

.left {
    width: 50%;
    float: left;
}

.right {
    width: 50%;
    float: right;
}

.left-side {
    display: flex;
    flex-direction: column;
}

.welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
}

.title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
}

.title.alt {
    font-size: 18px;
    margin-bottom: 10px;
}

.doc p {
    color: black;
    margin-bottom: 10px;
}

.doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
}

.doc button.alt {
    color: #42b983;
    background-color: transparent;
}

.hide {
    display: none !important;
}

.show {
    display: block !important;
}

.switchHolder {
    min-width: 85px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
    margin-top: 5px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(16px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.fa-th-list {
    position: relative;
    top: 6px;
    font-size: 22px;
    left: -8px;
}

.fa-th-large {
    position: relative;
    top: 6px;
    font-size: 22px;
    right: -8px;
}

.shadow{
    box-shadow: 5px 5px 5px 0 rgb(0 0 0 / 75%);
}

#BTCEchoIcon img:hover{
    transform: scale(1.1);
}

.menuBar{
    position: relative;
    margin-bottom: -25px;
    min-height: 100px;
}

.menuBarMain {
list-style: none;
margin: 0;
padding: 0;
display: flex;
}

.menuBarMain>li {
margin: 20px 10px;
position: relative;
}

.menuBarMain>li:last-child{
    margin-left: auto;
 order: 2;
 position: initial;
}

.infoCard{
    background-color: lightgray;
    border: solid 1px rgb(255 148 0 / 60%);
    padding: 10px 10px;
    width: fit-content;
    text-align: center;
    border-radius: 15px;
    display: inline-block;
    vertical-align: top;
    margin: 0 10px;
}

.infoCard p:first-child{
    margin-bottom: 3px;
}
#infoPanel{
    margin-top: -7px;
}
</style>
