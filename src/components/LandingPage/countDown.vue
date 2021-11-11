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
const FULL_DASH_ARRAY = 283
const WARNING_THRESHOLD = 10
const ALERT_THRESHOLD = 5

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
}

const TIME_LIMIT = 60
import axios from 'axios'
import axiosRetry from 'axios-retry'

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
            return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`
        },

        formattedTimeLeft() {
            const timeLeft = this.timeLeft
            const minutes = Math.floor(timeLeft / 60)
            let seconds = timeLeft % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        },

        timeLeft() {
            return TIME_LIMIT - this.timePassed
        },

        timeFraction() {
            const rawTimeFraction = this.timeLeft / TIME_LIMIT
            return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction)
        },

        remainingPathColor() {
            const {
                alert,
                warning,
                info
            } = COLOR_CODES

            if (this.timeLeft <= alert.threshold) {
                return alert.color
            } else if (this.timeLeft <= warning.threshold) {
                return warning.color
            } else {
                return info.color
            }
        }
    },

    watch: {
        timeLeft(newValue) {
            if (newValue === 0) {
                this.onTimesUp()
            }
        }
    },

    mounted() {
        this.onTimesUp()
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
                this.timePassed = 0
                this.timerInterval = null
                console.log("Update Stop - No Coins")
                return
            }

            function array_move(arr, old_index, new_index) {
                if (new_index >= arr.length) {
                    var k = new_index - arr.length + 1;
                    while (k--) {
                        arr.push(undefined);
                    }
                }
                arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
                return arr; // for testing
            }
            let ids = '';
            let temparr = []
            this.$root.$myCoins = this.loadLocal('myCoinsLocal')
            if (this.$root.$myCoins != null) {
                clearInterval(this.timerInterval)

                this.$root.$myCoins.forEach((item, i) => {
                    ids += item.id
                    temparr.push(item.id)
                    if (i !== this.$root.$myCoins.length - 1) {
                        ids += ','
                    }

                })

                axiosRetry(axios, {
                    retries: Infinity,
                    retryDelay: (retryCount) => {
                        console.log(`retry attempt: ${retryCount}`);
                        return retryCount * 4000; // time interval between retries
                    }
                });

                this.$axios
                    .get('https://api.nomics.com/v1/currencies/ticker?key=' + this.$root.$settings.nomics_api + '&ids=' + ids + '&interval=1h,1d,7d&convert=' + this.$root.$settings.fiat)
                    .then(response => {

                        for (let i = 0; i < temparr.length; i++) {
                            for (let o = 0; o < response.data.length; o++) {
                                if (temparr[i] == response.data[o].id) {
                                    array_move(response.data, o, i)
                                }
                            }
                        }

                        response.data.forEach((item, i) => {
                            Object.assign(this.$root.$myCoins[i], {
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
                            });

                        });
                        this.saveLocal('myCoinsLocal', this.$root.$myCoins)
                        let this2 = this
                        setTimeout(function() {
                            this2.$parent.get30Days()
                        }, 1000)


                        this.$parent.$parent._data.showLoader = false

                        this.timePassed = 0
                        this.startTimer()
                        temparr = []
                        this.$parent.forceRerender()
                        console.log("Update loaded complete")

                    })
                    .catch(error => {
                        console.log(error)
                        this.timePassed = 0
                        this.startTimer()
                        temparr = []
                        if (error.response.status == 429) {
                            this.onTimesUp()
                        }
                    })



            } else {
                clearInterval(this.timerInterval)
                this.timePassed = 0
            }
        },
        startTimer() {
            this.timerInterval = setInterval(() => (this.timePassed += 1), 1000)
        }
    }
}
</script>

<style scoped lang="scss">
.base-timer {
    position: absolute;
    top: 10px;
    left: 175px;
    width: 70px;
    height: 70px;

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
