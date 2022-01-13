<template>
<div class="base-timer">
    <svg id="hourglassSVG" class="svgShadow" width="20px" height="30px" viewBox="0 0 73 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="hourglass">
            <path
                d="M63.8761664,86 C63.9491436,84.74063 64,83.4707791 64,82.1818182 C64,65.2090455 57.5148507,50.6237818 48.20041,44 C57.5148507,37.3762182 64,22.7909545 64,5.81818182 C64,4.52922091 63.9491436,3.25937 63.8761664,2 L10.1238336,2 C10.0508564,3.25937 10,4.52922091 10,5.81818182 C10,22.7909545 16.4851493,37.3762182 25.79959,44 C16.4851493,50.6237818 10,65.2090455 10,82.1818182 C10,83.4707791 10.0508564,84.74063 10.1238336,86 L63.8761664,86 Z"
                id="glass" fill="#ECF1F6"></path>
            <rect id="top-plate" class="svgShadow" fill="#484d50 " x="0" y="0" width="74" height="8" rx="2"></rect>
            <rect id="bottom-plate" class="svgShadow" fill="#484d50 " x="0" y="80" width="74" height="8" rx="2"></rect>
            <g id="top-sand" class="active" transform="translate(18, 21)">
                <clipPath id="top-clip-path" fill="white">
                    <rect x="0" y="0" width="38" height="21"></rect>
                </clipPath>
                <path fill="#ff9400fc" clip-path="url(#top-clip-path)" d="M38,0 C36.218769,7.51704545 24.818769,21 19,21 C13.418769,21 1.9,7.63636364 0,0 L38,0 Z"></path>
            </g>
            <g id="bottom-sand" class="active" transform="translate(18, 55)">
                <clipPath id="bottom-clip-path" fill="white">
                    <rect x="0" y="0" width="38" height="21"></rect>
                </clipPath>
                <g clip-path="url(#bottom-clip-path)">
                    <path fill="#ce571d" d="M0,21 L38,21 C36.1,13.3636364 24.581231,0 19,0 C13.181231,0 1.781231,13.4829545 0,21 Z"></path>
                </g>
            </g>
        </g>
    </svg>
    <span id="circleTimer" class="base-timer__label">{{ formattedTimeLeft }}</span>
</div>
</template>

<script>
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const ipcRenderer = window.require('electron').ipcRenderer;
var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'
const TIME_LIMIT = 60; //set countdown time in seconds
export default {
    data() {
        return {
            timePassed: 0,
            timerInterval: null,
            myCoins: this.$root._data.myCoins,
            settings: this.$root._data.settings
        }
    },
    computed: {
        formattedTimeLeft() {
            const timeLeft = this.timeLeft;
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            return `${minutes}:${seconds}`;
        },
        timeLeft() {
            return TIME_LIMIT - this.timePassed;
        }
    },
    watch: {
        timeLeft(newValue) {
            if (newValue === 0) {
                document.getElementById("top-sand").classList.remove("active");
                document.getElementById("bottom-sand").classList.remove("active");
                this.onTimesUp();
            }
        }
    },
    mounted() {
        this.onTimesUp();
    },
    methods: {
        checkAlertTriggers() {
            this.$root._data.alerts.forEach((item2, i) => {
                item2.alerts.forEach((item) => {
                    let direction = item.direction;
                    let coins = this.$root._data.myCoins;
                    let coinPrice = parseFloat(this.$root._data.myCoins[i].price.replace(/,/g, "."));
                    let alertPrice = parseFloat(item.price.replace(/,/g, "."));
                    if (item.active && this.$root._data.myCoins[i].price > 0) {
                        if (direction == "bigger") {
                            if (coinPrice >= alertPrice) {
                                item.active = false;
                                vex.dialog.alert({
                                    unsafeMessage: '<div style="text-align:center"><h4>ALERT</h4><img src="' + coins[i].logo_url + '" height="80px" style="display: block; margin: 0 auto;" /><span>' + coins[i].name +
                                        ' price is now ' + coins[i].price + ' alert was ' + item.price + '<br><br>Alert disabled</div>'
                                });
                            }
                        } else {
                            if (coinPrice <= alertPrice) {
                                item.active = false;
                                vex.dialog.alert({
                                    unsafeMessage: '<div style="text-align:center"><h4>ALERT</h4><img src="' + coins[i].logo_url + '" height="80px" style="display: block; margin: 0 auto;" /><span>' + coins[i].name +
                                        ' price is now ' + coins[i].price + ' alert was ' + item.price + '<br><br>Alert disabled</div>'
                                });
                            }
                        }
                        this.saveLocal('alerts', this.$root._data.alerts);
                    }
                });
            });
        },
        update(target, src) {
            const res = {};
            Object.keys(target).forEach(k => res[k] = (k in src ? src[k] : target[k]));
            return res;
        },
        onTimesUp() {
            if (this.$root._data.myCoins.length == 0) {
                clearInterval(this.timerInterval);
                this.timePassed = 0;
                console.log("Update Stop - No Coins");
                return;
            }
            let idsCoins = '';
            let temparr = [];
            if (this.$root._data.myCoins.length != 0) {
                clearInterval(this.timerInterval);
                this.$root._data.myCoins.forEach((item, i) => {
                    idsCoins += item.id.toLowerCase();
                    temparr.push(item.symbol);
                    if (i !== this.$root._data.myCoins.length - 1) {
                        idsCoins += ',';
                    }
                })
                var update_list = async () => {
                    let data;
                    try {
                        data = await CoinGeckoClient.coins.markets({
                            ids: idsCoins,
                            per_page: 250,
                            localization: false,
                            vs_currency: this.$root._data.settings.fiat,
                            price_change_percentage: "1h,24h,7d"
                        });
                        this.$root._data.apiCallsPerMinute += 1;
                        for (let i = 0; i < temparr.length; i++) {
                            for (let o = 0; o < data.data.length; o++) {
                                if (temparr[i] == data.data[o].symbol.toUpperCase()) {
                                    this.array_move(data.data, o, i);
                                }
                            }
                        }
                        data.data.forEach((item, i) => {
                            Object.assign(this.$root._data.myCoins[i], {
                                "id": item.id,
                                "name": item.name,
                                "symbol": item.symbol.toUpperCase(),
                                "logo_url": item.image,
                                "rank": item.market_cap_rank.toString(),
                                "price": item.current_price.toString(),
                                "market_cap": item.market_cap.toString(),
                                "high": item.ath.toString(),
                                "time1h": item.price_change_percentage_1h_in_currency ? item.price_change_percentage_1h_in_currency.toString() : "0",
                                "time1d": item.price_change_percentage_24h_in_currency ? item.price_change_percentage_24h_in_currency.toString() : "0",
                                "time7d": item.price_change_percentage_7d_in_currency ? item.price_change_percentage_7d_in_currency.toString() : "0"
                            });
                        })
                        this.saveLocal('myCoinsLocal', this.$root._data.myCoins);
                        ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]); //send "myCoins" to tray window
                        this.$parent.$parent._data.showLoader = false;
                        this.timePassed = 0;
                        this.startTimer();
                        temparr = [];
                        this.$parent.get30Days();
                        this.checkAlertTriggers();
                        document.getElementById("top-sand").classList.add("active");
                        document.getElementById("bottom-sand").classList.add("active");
                        this.$parent.forceRerender()
                        console.log("Update loaded complete");
                    } catch (e) {
                        let this2 = this;
                        setTimeout(function() {
                            console.log(e);
                            clearInterval(this2.timerInterval);
                            this2.timePassed = 0;
                            this2.startTimer();
                            console.log("ERROR RESTART COUNTDOWN");
                        }, 1000)
                    }
                };
                update_list()
            } else {
                clearInterval(this.timerInterval);
                this.timePassed = 0;
            }
        },
        startTimer() {
            if (this.timePassed == 0) {
                this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
            } else {
                console.log("Countdown already running!!!")
            }
        }
    }
}
</script>

<style scoped lang="scss">
.base-timer {
    width: 70px;
    color: var(--countdownColor);
    position: absolute;
    top: 70px;
    right: 10px;

    &__label {
        position: absolute;
        width: 70px;
        height: 70px;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }
}

.svgShadow {
    -webkit-filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, .7));
    filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, .7));
}

#hourglassSVG {
    position: relative;
    left: -17px;
    top: 19px;
}
</style>
