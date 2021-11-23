<template>
<div id="app">
    <div v-if="showLoader" id="loaderFrame">

        <h1>Top 3000 Cryptocurrencies are loading by coingeko.com</h1>
        <span>This can take a few minutes...</span>
        <div class="loader">


            <div class="chart">
                <div class="bar bar-0 red">
                    <div class="face top">
                        <div class="growing-bar"></div>
                    </div>
                    <div class="face side-0">
                        <div class="growing-bar"></div>
                    </div>
                    <div class="face floor">
                        <div class="growing-bar"></div>
                    </div>
                    <div class="face side-a"></div>
                    <div class="face side-b"></div>
                    <div class="face side-1">
                        <div class="growing-bar"></div>
                    </div>
                </div>
            </div>


        </div>
        <h2><strong>{{showPercent()}} %</strong></h2>

    </div>

    <LandingPage></LandingPage>
</div>
</template>

<script>
import LandingPage from './components/LandingPage'

export default {
    name: 'coinsMain',
    components: {
        LandingPage
    },
    data() {
        return {
            counter: 0,
            totalCounter: 0,
            showLoader: true,
            categories: ['Logo', 'Name', 'Rank', 'Price', '1 h', '24 h', '7 Days', 'Cap', 'Value', 'Profit/Loss', 'ATH', '30 Days', 'Delete']
        }
    },
    created() {
        

        if (this.loadLocal('settings')) {
            this.$root.$settings = this.loadLocal('settings')

        } else {
            this.$root.$settings = {
                blockView: false,
                timer: false,
                btcecho: false,
                cg_logo: true,
                table_sort: '',
                fiat: 'USD',
                tv: [],
                tv_candle_time: '30',
                "view": [{
                        "name": "Logo",
                        "view": true
                    },
                    {
                        "name": "Name",
                        "view": true
                    },
                    {
                        "name": "Rank",
                        "view": true
                    },
                    {
                        "name": "Price",
                        "view": true
                    },
                    {
                        "name": "1 h",
                        "view": true
                    },
                    {
                        "name": "24 h",
                        "view": true
                    },
                    {
                        "name": "7 Days",
                        "view": true
                    },
                    {
                        "name": "Cap",
                        "view": true
                    },
                    {
                        "name": "Value",
                        "view": true
                    },
                    {
                        "name": "Profit/Loss",
                        "view": true
                    },
                    {
                        "name": "ATH",
                        "view": true
                    },
                    {
                        "name": "30 Days",
                        "view": true
                    },
                    {
                        "name": "Delete",
                        "view": true
                    }
                ]
            }
        }

        const plugin = document.createElement("script");
        plugin.setAttribute(
            "src",
            "https://s3.tradingview.com/tv.js"
        );
        plugin.async = true;
        document.head.appendChild(plugin);



        if (this.loadLocal('boughtCoins')) {
            this.$root.$boughtCoins = this.loadLocal('boughtCoins')
        } else {
            this.$root.$boughtCoins = []
        }


        if (this.loadLocal('myCoinsLocal')) {
            this.$root.$myCoins = this.loadLocal('myCoinsLocal')
        } else {
            this.$root.$myCoins = []
        }
        if (this.loadLocal('allCoinsLocal')) {
            this.$root.$coins = this.loadLocal('allCoinsLocal')
        } else {
            this.$root.$coins = []
        }

    },
    mounted() {

            this.$children[0].getApiData()

    },
    methods: {
        showPercent() {
            if (this.counter == 0) {
                return 0
            } else {
                return parseFloat((((this.counter * 500) / (this.totalCounter * 500)) * 100)).toFixed(0)
            }

        }
    },
    watch: {
        counter: {
            handler() {
                let percent = (this.counter / this.totalCounter).toFixed(2)
                let bar = document.querySelector(".chart .bar")
                bar.classList.forEach((item) => {
                    if (item.indexOf("bar-") > -1) {
                        bar.classList.remove(item)
                    }
                })

                if (percent.slice(2, 4) < 10) {

                    bar.classList.add("bar-" + percent.slice(3, 4))
                }
                bar.classList.add("bar-" + percent.slice(2, 4))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import url('../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
h2 {
    color: black;
}

#loaderFrame {

    text-align: center;

}

.loader {

    width: 50%;
    height: 120px;
    /*animation: spin 2s linear infinite;*/
    margin: 20px auto 100px;
}

$yellow: #f1c40f;
$lime: #76c900;
$navy: #0a4069;
$cyan: #57caf4;
$red: #ff9400fc;
$white: #fefefe;
$gray: #444;
$lightGray: lighten($gray, 30);

$transitionDuration: 0.3s;
$transition: all $transitionDuration ease-in-out;

body {
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 300;
    line-height: 1em;

    text-align: center;

    color: $gray;
    background: #d0d0d0;
}
h1:not(.extra) {
    font-size: 4vw;
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 4vw;
}
h2 {
    margin-bottom: 3em;
}
em,
strong {
    font-weight: 700;
}
input {
    display: none;
}
header p {
    margin-bottom: 0;
}
section {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 2em;
    padding: 0;
    &:last-of-type {
        margin-bottom: 0;
    }
    article {
        align-self: center;
        width: 20em;
        margin-bottom: 2em;
        &:last-of-type,
        p {
            margin-bottom: 0;
        }
    }
}
p {
    margin: auto;

    span {
        display: block;
    }
}
.container {
    z-index: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    justify-content: center;

    margin-bottom: 4em;
}

/*
*
*
START // CHART'S RULES
 -> "if you're picking code, don't forget the variables :)"
*/

.chart {
    font-size: 1em;

    perspective: 1000px;
    perspective-origin: 50% 50%;
    backface-visibility: visible;
}

$faceColor: rgba($white, .3);
$growColor: rgba($red, .6);

.bar {
    font-size: 1em;

    position: relative;

    height: 10em;

    transition: $transition;
    transform: rotateX(60deg) rotateY(0deg);

    transform-style: preserve-3d;

    .face {
        font-size: 2em;

        position: relative;

        width: 100%;
        height: 2em;

        background-color: $faceColor;

        &.side-a,
        &.side-b {
            width: 2em;
        }
    }
    .side-a {
        transform: rotateX(90deg) rotateY(-90deg) translateX(2em) translateY(1em) translateZ(1em);
    }
    .side-b {
        transform: rotateX(90deg) rotateY(-90deg) translateX(4em) translateY(1em) translateZ(-1em);
        position: absolute;
        right: 0;
    }
    .side-0 {
        transform: rotateX(90deg) rotateY(0) translateX(0) translateY(1em) translateZ(-1em);
    }
    .side-1 {
        transform: rotateX(90deg) rotateY(0) translateX(0) translateY(1em) translateZ(3em);
    }
    .top {
        transform: rotateX(0deg) rotateY(0) translateX(0em) translateY(4em) translateZ(2em);
    }
    .floor {
        box-shadow: 0 0.1em 0.6em rgba(0,0,0,.3), 0.6em -0.5em 3em rgba(0,0,0,.3), 1em -1em 8em $white;
    }
}

.growing-bar {
    transition: $transition;
    background-color: $growColor;
    width: 100%;
    height: 2em;
}

@mixin drawSkin($color, $name) {
    .bar.#{$name} {
        .side-a,
        // &.bar-100 .side-b,
        .growing-bar {
            background-color: rgba($color, .6);
        }
        .side-0 .growing-bar {
            box-shadow: -0.5em -1.5em 4em $color;
        }
        .floor .growing-bar {
            box-shadow: 0 0 2em $color;
        }
    }
}

@mixin drawFaces($color, $name) {
    .chart .bar.#{$name} .face {
        background-color: rgba($color, .2);
    }
}

@include drawSkin(rgba($yellow, .8), 'yellow');
@include drawSkin(rgba($red, .8), 'red');
@include drawSkin($cyan, 'cyan');
@include drawSkin(rgba($navy, .8), 'navy');
@include drawSkin($lime, 'lime');
@include drawSkin($white, 'white');
@include drawSkin($gray, 'gray');

@include drawFaces(rgba($yellow, .6), 'yellow-face');
@include drawFaces($lime, 'lime-face');
@include drawFaces(rgba($red, .6), 'red-face');
@include drawFaces(rgba($navy, .6), 'navy-face');
@include drawFaces($cyan, 'cyan-face');
@include drawFaces($gray, 'gray-face');
@include drawFaces($lightGray, 'lightGray-face');

@for $i from 0 to 101 {
    .bar-#{$i} {
        .growing-bar {
            width: percentage(math.div($i, 100));
        }
    }
}

/*
END // CHART'S RULES
*
*
*/

.chart.grid {
    display: flex;
    flex-direction: row;
    .exercise {

        flex: 0 0 100%;
        display: flex;
        .bar {
            flex: 1;
            margin: 0 0.5em;
            &:nth-child(2) {
                z-index: 8;
                flex: 1 0 40%;
            }
            &:first-child {
                z-index: 10;
                margin-left: 0;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}

.actions {
    display: flex;

    justify-content: center;

    margin-bottom: 0;
    padding-bottom: 2em;
    border-bottom: 1px dotted rgba($gray, .4);
}
label {
    box-sizing: border-box;
    padding: 1em;
    margin: 0 0.2em;

    cursor: pointer;
    transition: all 0.15s ease-in-out;

    color: $navy;
    border: 1px solid rgba($white, .6);
    border-radius: 0;

    flex: 1;
    &:first-child {
        margin-left: 0;

        border-radius: 0.2em 0 0 0.2em;
    }
    &:last-child {
        margin-right: 0;

        border-radius: 0 0.2em 0.2em 0;
    }
}

input[id='exercise-1']:checked ~ .actions label[for='exercise-1'],
input[id='exercise-2']:checked ~ .actions label[for='exercise-2'],
input[id='exercise-3']:checked ~ .actions label[for='exercise-3'],
input[id='exercise-4']:checked ~ .actions label[for='exercise-4'],
input[id='pos-0']:checked ~ .actions label[for='pos-0'],
input[id='pos-1']:checked ~ .actions label[for='pos-1'],
input[id='pos-2']:checked ~ .actions label[for='pos-2'],
input[id='pos-3']:checked ~ .actions label[for='pos-3'],
input[id='red']:checked ~ .actions label[for='red'],
input[id='cyan']:checked ~ .actions label[for='cyan'],
input[id='lime']:checked ~ .actions label[for='lime'] {
    color: $lime;
    border: 1px solid darken($navy, 15);
    background-color: $navy;
}

input[id='red']:checked ~ .chart {
    @extend .red;
}
input[id='cyan']:checked ~ .chart {
    @extend .cyan;
}
input[id='lime']:checked ~ .chart {
    @extend .lime;
}

input[id='pos-0']:checked ~ .chart {
    @extend .bar-25;
}
input[id='pos-1']:checked ~ .chart {
    @extend .bar-50;
}
input[id='pos-2']:checked ~ .chart {
    @extend .bar-75;
}
input[id='pos-3']:checked ~ .chart {
    @extend .bar-100;
}
input[id='exercise-2']:checked ~ .chart.grid {
    .exercise .bar {
        &:nth-child(1) {
            flex: 1 0 0;
            @extend .bar-20;
        }
        &:nth-child(2) {
            flex: 1;
            @extend .bar-50;
        }
        &:nth-child(3) {
            flex: 1 0 30%;
            @extend .bar-80;
        }
    }
}
input[id='exercise-3']:checked ~ .chart.grid {
    .exercise .bar {
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
            flex: 1;
            @extend .bar-70;
        }
    }
}
input[id='exercise-4']:checked ~ .chart.grid {
    .exercise .bar {
        &:nth-child(1),
        &:nth-child(2) {
            flex: 1 0 30%;
            @extend .bar-50;
        }
        &:nth-child(3) {
            flex: 1;
            @extend .bar-100;
        }
    }
}

#nomicsInput {
    z-index: 9999;
    margin-bottom: 100px;

    background-color: #454552;
    text-align: center;
}
#nomicsInput button {
    margin-top: 20px!important;
    display: block;
    margin: 0 auto;
}

#nomicsInput p {
    color: white;
    margin-bottom: 10px;
}
#nomicsInput a {
    color: #ff9400fc;
}
#nomicsInput input {
    display: block;
    line-height: 30px;
    border: solid white;
    border-radius: 5px;
    background: #fff;
    width: 50%;
    margin: 0 auto;
    text-align: center;
}
.apiTutorial {
    width: 80vw;
    margin: 40px auto 0;
}
.apiTutorial img {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
}
.apiTutorial p {
    color: black!important;
}
.apiTutorial span {
    color: white;
}
.infoP {
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 40px!important;
}
.extra {
    color: #ff9400fc;
    margin-bottom: 80px;
}
.extra2 {
    margin-bottom: 20px!important;
}
</style>
