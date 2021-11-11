<template>
<div id="wrapper" v-if="childDataLoaded">

    <countDown></countDown>
    <div class="switchHolder">
        <i title="Listen Ansicht" class="fas fa-th-list ansichtListe"></i>
        <label class="switch" @click="changeView(isToggled)">

            <input type="checkbox" v-model="isToggled" :checked="isToggled">
            <span class="slider round"></span>

        </label>
        <i title="Tradingview Ansicht" class="fas fa-th-large ansichtTV"></i>
    </div>
    <coinsList v-if="!isToggled" :key="componentKey"></coinsList>

    <blockList v-if="isToggled"></blockList>
    <settings></settings>
    <a v-show="this.$root.$settings.btcecho" id="BTCEchoIcon" class="echo-icon" target="_blank" title="News: BTC-ECHO.de" href="https://www.btc-echo.de/"><img src="https://www.btc-echo.de/favicon.ico" height="40px" width="40px" /></a>



</div>
</template>

<script>
import coinsList from './LandingPage/coinsList'
import countDown from './LandingPage/countDown'
import settings from './LandingPage/settings'
import blockList from './LandingPage/blockList'
import axios from 'axios'
import axiosRetry from 'axios-retry'


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
            tempArray: [],
            splitArray: [],
            countCircle: 0
        }
    },

    methods: {
        get30Days() {

            let pattern = this.$root.$myCoins
            let cash = this.$root.$settings.fiat
            let current = new Date();
            let startDate = new Date(new Date().setDate(current.getDate() - 30)).toISOString().split('T')[0]
            let endDate = new Date().toISOString().split('T')[0]
            if (pattern.length != 0) {




                let ids = ""
                pattern.forEach((item, i) => {
                    ids += item.id
                    if (i !== pattern.length - 1) {
                        ids += ','
                    }
                })

                let link = 'https://api.nomics.com/v1/currencies/sparkline?key=' + this.$root.$settings.nomics_api + '&ids=' + ids + '&start=' + startDate + 'T00%3A00%3A00Z&end=' + endDate + 'T00%3A00%3A00Z&convert=' + cash

                axiosRetry(axios, {
                    retries: Infinity,
                    retryDelay: (retryCount) => {
                        console.log(`retry attempt: ${retryCount}`);
                        this.$parent._data.restartTimer = retryCount * 4000 / 1000
                        return retryCount * 4000; // time interval between retries
                    }
                });

                this.$axios.get(link).then(response2 => {

                        pattern.forEach((item) => {
                            response2.data.forEach((item2) => {
                                if (item.id == item2.currency) {
                                    item["days30"] = item2.prices
                                }
                            })
                        })

                        this.saveLocal('myCoinsLocal', pattern)
                        this.$root.$myCoins = pattern
                        this.forceRerender()
                    })
                    .catch(error => {
                        console.log(error)

                        this.forceRerender()
                    })



            }

        },
        forceRerender() {
            this.componentKey += 1
        },
        changeView(view) {
            this.$root.$settings.blockView = !view
            this.colorCheck()
            this.saveLocal('settings', this.$root.$settings)

        },
        colorCheck() {
            if (this.$root.$settings.blockView) {
                document.querySelector(".ansichtTV").classList.add("ansichtAktiv")
                document.querySelector(".ansichtListe").classList.remove("ansichtAktiv")
            } else {
                document.querySelector(".ansichtListe").classList.add("ansichtAktiv")
                document.querySelector(".ansichtTV").classList.remove("ansichtAktiv")
            }
        },
        loadTV() {
            if (this.$root.$settings.tv.length != 0) {
                document.getElementById("holderIframes").innerHTML = ''
                this.$root.$settings.tv.forEach((item) => {
                    let frame = '<div class="col span_1_of_3"><iframe src="https://s.tradingview.com/widgetembed/?symbol=' + item + '&interval=' + this.$root.$settings.tv_candle_time +
                        '&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Europe/Berlin%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=de_DE&utm_source=localhost&utm_medium=widget&utm_campaign=chart" /></div>'
                    document.getElementById("holderIframes").innerHTML += frame
                });
            } else {
                document.getElementById("holderIframes").innerHTML = ''
                document.getElementById("holderIframes").innerHTML = '<h1>Please add currency via menu -> Tradingview</h1> <i  class="fa fa-arrow-right noListArrow"></i>'

            }
            console.log("TV loaded")
        },
        getApiData() {

            if (this.loadLocal('allCoinsDate') < (Date.now() - 864000000)) { //check ever 10 Days for new Coins

                axiosRetry(axios, {
                    retries: Infinity,
                    retryDelay: (retryCount) => {
                        console.log(`retry attempt: ${retryCount}`);
                        this.$parent._data.restartTimer = retryCount * 4000 / 1000
                        return retryCount * 4000; // time interval between retries
                    }
                });

                this.$root.$coins = []
                this.$axios
                    .get('https://api.nomics.com/v1/prices?key=' + this.$root.$settings.nomics_api)
                    .then(response => {
                        response.data.forEach((element) => {
                            this.tempArray.push(element.currency)
                        })

                        let chuckSize = 500
                        let tempLength = Math.ceil(this.tempArray.length / chuckSize)
                        /* eslint-disable-next-line */
                        this.splitArray = new Array(tempLength).fill().map(_ => this.tempArray.splice(0, chuckSize))
                        let this2 = this
                        setTimeout(function() {
                            this2.getCoinsDetails()
                        }, 1000);

                    })
                    .catch(error => {
                        console.log(error)
                        if (error.response.status == 429) {
                            this.getApiData()
                        }

                    })
            } else {
                this.$root.$coins = this.loadLocal('allCoinsLocal')
                this.childDataLoaded = true
                this.$parent._data.showLoader = false

                console.log('Old all $coins wurden geladen von cookie')
            }
        },
        getCoinsDetails() {

            console.log("Durchläufe: " + this.countCircle + " / " + this.splitArray.length)
            this.$parent._data.counter = this.countCircle
            this.$parent._data.totalCounter = this.splitArray.length
            axiosRetry(axios, {
                retries: Infinity,

                retryDelay: (retryCount) => {
                    console.log(`retry attempt: ${retryCount}`);
                    this.$parent._data.restartTimer = retryCount * 4000 / 1000
                    return retryCount * 4000; // time interval between retries
                }
            });
            let currencies = this.splitArray[this.countCircle].join()
            this.$axios
                .get('https://api.nomics.com/v1/currencies/ticker?key=' + this.$root.$settings.nomics_api + '&ids=' + currencies + '&convert=' + this.$root.$settings.fiat).then(response => {
                    response.data.forEach((item) => {

                        if (item.rank < 3000) {
                            let d = {
                                "id": item.id,
                                "name": item.name,
                                "logo_url": item.logo_url,
                                "rank": item.rank,
                                "price": item.price,
                                "market_cap": item.market_cap,
                                "high": item.high,
                                "1h": item["1h"],
                                "1d": item["1d"],
                                "7d": item["7d"]
                            }
                            this.$root.$coins.push(d)
                            //this.$root.$coins[i].push(item.logo_url)
                            //this.$root.$coins[i].push(item.name)
                        }

                    })
                    if (this.countCircle === (this.splitArray.length - 1)) {

                        this.$root.$coins.sort((a, b) => (parseInt(a.rank) > parseInt(b.rank)) ? 1 : ((parseInt(b.rank) > parseInt(a.rank)) ? -1 : 0))
                        this.childDataLoaded = true
                        this.$parent._data.showLoader = false
                        this.saveLocal('allCoinsDate', Date.now())
                        this.countCircle = 0
                        this.saveLocal('allCoinsLocal', this.$root.$coins)

                    } else {
                        let this2 = this;
                        setTimeout(function() {
                            this2.countCircle++
                            this2.getCoinsDetails()
                        }, 1000);

                    }

                })
                .catch(error => {
                    this.$parent._data.error = error
                    console.log(error)
                })

        }
    },
    mounted() {

        let this2 = this
        setTimeout(function() {

            this2.forceRerender()
            this2.colorCheck()
        }, 500)

    }
}
</script>

<style>
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
    position: absolute;
    top: 25px;
    left: 40px;
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

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.fa-th-list {
    position: absolute;
    top: 6px;
    font-size: 22px;
    left: -30px;
}

.fa-th-large {
    position: absolute;
    top: 6px;
    font-size: 22px;
    right: -30px;
}

.echo-icon {
    position: absolute;
    top: 23px;
    left: 125px;
}
</style>
