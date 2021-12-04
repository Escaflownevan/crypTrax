<template>
<div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path :stroke-dasharray="circleDasharray" class="base-timer__path-remaining" :class="remainingPathColor" d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "></path>
        </g>
    </svg>
    <span id="circleTimer" class="base-timer__label">{{ formattedTimeLeft }}</span>
</div>
</template>

<script>
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const TIME_LIMIT = 60;                  //set countdown time in seconds
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
    info: {
        color: 'green'
    },
    warning: {
        color: 'orange',
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: 'red',
        threshold: ALERT_THRESHOLD
    }
};
export default {
    data() {
        return {
            timePassed: 0,
            timerInterval: null,
            myCoins: this.$root.$myCoins,
            settings: this.$root.$settings
        }
    },
    computed: {
        circleDasharray() {
            return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
        },

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
        },

        timeFraction() {
            const rawTimeFraction = this.timeLeft / TIME_LIMIT;
            return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        },

        remainingPathColor() {
            const {
                alert,
                warning,
                info
            } = COLOR_CODES

            if (this.timeLeft <= alert.threshold) {
                return alert.color;
            } else if (this.timeLeft <= warning.threshold) {
                return warning.color;
            } else {
                return info.color;
            }
        }
    },
    watch: {
        timeLeft(newValue) {
            if (newValue === 0) {
                this.onTimesUp();
            }
        }
    },
    mounted() {
        this.onTimesUp();
    },
    methods: {
        update(target, src) {
            const res = {};
            Object.keys(target)
                .forEach(k => res[k] = (k in src ? src[k] : target[k]));
            return res;
        },
        onTimesUp() {
            if (this.$root.$myCoins.length == 0) {
                clearInterval(this.timerInterval);
                this.timePassed = 0;
                console.log("Update Stop - No Coins");
                return;
            }
            function array_move(arr, old_index, new_index) {
                if (new_index >= arr.length) {
                    var k = new_index - arr.length + 1;
                    while (k--) {
                        arr.push(undefined);
                    }
                }
                arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
                return arr;
            }
            let idsCoins = '';
            let temparr = [];
            this.$root.$myCoins = this.loadLocal('myCoinsLocal');
            if (this.$root.$myCoins.length != 0) {
                clearInterval(this.timerInterval);
                this.$root.$myCoins.forEach((item, i) => {
                    idsCoins += item.id.toLowerCase();
                    temparr.push(item.symbol);
                    if (i !== this.$root.$myCoins.length - 1) {
                        idsCoins += ',';
                    }
                })

                var update_list = async() => {
                    let data;
                    try {
                         data = await CoinGeckoClient.coins.markets({ids: idsCoins,per_page: 250, localization: false, vs_currency: this.$root.$settings.fiat, price_change_percentage: "1h,24h,7d"});
                         for (let i = 0; i < temparr.length; i++) {
                             for (let o = 0; o < data.data.length; o++) {
                                 if (temparr[i] == data.data[o].symbol.toUpperCase()) {
                                     array_move(data.data, o, i);
                                 }
                             }
                         }

                         data.data.forEach((item, i) => {
                             Object.assign(this.$root.$myCoins[i], {
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

                         this.saveLocal('myCoinsLocal', this.$root.$myCoins);
                         this.$parent.$parent._data.showLoader = false;
                         this.timePassed = 0;
                         this.startTimer();
                         temparr = [];
                         this.$parent.get30Days();
                         console.log("Update loaded complete");
                    } catch (e) {
                        if (e == "TypeError: Cannot read property 'toString' of null") {
                            this.$root.$myCoins.forEach((item) => {
                                if (item.rank > 2999) {
                                    console.log("This coin rank over 3000: "+item.id+" | Rank: "+item.rank)
                                }
                            });
                        }
                        let this2 = this;
                        setTimeout(function(){
                            console.log(e);
                            clearInterval(this2.timerInterval);
                            this2.timePassed = 0;
                            this2.startTimer();
                            console.log("ERROR RESTART COUNTDOWN");
                        },1000)
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
            }else{
                console.log("Countdown already running!!!")
            }


        }
    }
}
</script>

<style scoped lang="scss">
.base-timer {
    width: 70px;
    top: -10px;
    position: relative;

    &__svg {
        transform: scaleX(-1);
    }

    &__circle {
        fill: none;
        stroke: none;
    }

    &__path-elapsed {
        stroke-width: 7px;
        stroke: grey;
    }

    &__path-remaining {
        stroke-width: 7px;
        stroke-linecap: round;
        transform: rotate(90deg);
        transform-origin: center;
        transition: 1s linear all;
        fill-rule: nonzero;
        stroke: currentColor;

        &.green {
            color: rgb(65, 184, 131);
        }

        &.orange {
            color: orange;
        }

        &.red {
            color: red;
        }
    }

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
</style>
