<template>
<div id="wrapper" v-if="childDataLoaded">
    <div class="menuBar">
        <ul class="menuBarMain dragWindow">
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="menuIcon" :class="{active: !$root._data.settings.blockView && !portfolioShow}" @click="changeView(true)" v-bind="attrs" v-on="on">
                            <img :src="require(`../assets/listView.svg`)" height="40px" width="40px" />
                        </div>
                    </template>
                    <span class="tooltipText">List View</span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="menuIcon" @click="changeView(false)" :class="{active: $root._data.settings.blockView && !portfolioShow}" v-bind="attrs" v-on="on">
                            <img :src="require(`../assets/blockView.svg`)" height="40px" width="40px" />
                        </div>
                    </template>
                    <span class="tooltipText">Tradingview Multi Window</span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="menuIcon" @click="portfolioShow = !portfolioShow; $refs.portfolio.updateData();" :class="{active: portfolioShow}" v-bind="attrs" v-on="on">
                            <img :src="require(`../assets/portfolio.svg`)" height="40px" width="40px" />
                        </div>
                    </template>
                    <span class="tooltipText">Show your Portfolio details</span>
                </v-tooltip>
            </li>
            <li v-show="this.$root._data.settings.favLinkActive" :key="componentKey3">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="menuIcon" v-bind="attrs" v-on="on">
                            <a class="echo-icon" target="_blank" :href="getFavLink()">
                                <img :src="require(`../assets/fav.svg`)" height="40px" width="40px" />
                                <img class="imgFavIcon" :src="getFavLink()+'/favicon.ico'" height="20px" width="20px" onerror="this.style.display='none'" />
                            </a>
                        </div>
                    </template>
                    <span class="tooltipText">Your Bookmark: {{getFavLink()}} </span>
                </v-tooltip>
            </li>
            <li>
                <settings ref="settings"></settings>
            </li>
        </ul>
    </div>
    <div id="infoBar" class="noHover" v-show="(this.$root._data.settings.info_panel || this.$root._data.settings.timer) && this.$root._data.myCoins.length > 0">
        <ul v-show="this.$root._data.settings.info_panel" :key="componentKey4">
            <li class="infoBarItem">
                <div class="infoCard">
                    <p class="infoCardTitle">Global Cap</p>
                    <p v-if="!this.globLoader">{{ this.globMarket }}<span v-if="this.$root._data.settings.fiat==='EUR'"> €</span><span v-else> $</span></p><i v-else class="fas fa-spinner fa-pulse"></i>
                </div>
            </li>
            <li class="infoBarItem" v-if="this.totalValue() != 0 || this.totalProfLoss() != 0">
                <div class="infoCard">
                    <div>
                        <p class="infoCardTitle">Total</p>
                        <p :class="{positive: this.totalValue() > 0, negative: this.totalValue() < 0}">{{ this.totalValue() }} <span v-if="this.$root._data.settings.fiat==='EUR'"> €</span><span v-else> $</span></p>
                    </div>
                </div>
            </li>
            <li class="infoBarItem" v-if="this.totalValue() != 0 || this.totalProfLoss() != 0">
                <div class="infoCard">
                    <div>
                        <p class="infoCardTitle">Profit/Loss</p>
                        <p :class="{positive: this.totalProfLoss() > 0, negative: this.totalProfLoss() < 0}">{{ this.totalProfLoss() }} <span v-if="this.$root._data.settings.fiat==='EUR'"> €</span><span v-else> $</span></p>
                    </div>
                </div>
            </li>
        </ul>
        <countDown v-show="this.$root._data.settings.timer" class="infoBarItem" ref="countDown"></countDown>
    </div>
    <coinsList :key="componentKey" ref="coinsList"></coinsList>
    <blockList></blockList>
    <portfolio :class="{visibilityHidden: !this.portfolioShow, visibilityShow: this.portfolioShow}" ref="portfolio"></portfolio>
</div>
</template>

<script>
import coinsList from './LandingPage/coinsList';
import countDown from './LandingPage/countDown';
import settings from './LandingPage/settingsMain';
import blockList from './LandingPage/blockList';
import portfolio from './LandingPage/portfolio';
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
export default {
    name: 'landingPage',
    components: {
        coinsList,
        countDown,
        settings,
        blockList,
        portfolio
    },
    data() {
        return {
            portfolioShow: false,
            childDataLoaded: false,
            allCoinsShort: [],
            componentKey: 0,
            componentKey2: 0,
            componentKey3: 0,
            componentKey4: 0,
            splitArray: [],
            countCircle: 1,
            maxCoins: 12, // 12 * 250 = 3000 Top of Cryptocurrencies
            coinsCounter: 0,
            globMarket: "",
            globLoader: true,
            blockViewCheck: this.$root._data.settings.blockView,
            totalValue: () => {
                let obj = this.$root._data.boughtCoins;
                let all = 0;
                obj.forEach((item, i) => {
                    item.purchases.forEach((item2) => {
                        all += item2[0] * this.$root._data.myCoins[i].price;
                    });
                });
                return all.toFixed(2);
            },
            totalProfLoss() {
                let obj = this.$root._data.boughtCoins;
                let all = 0;
                obj.forEach((item, i) => {
                    item.purchases.forEach((item2) => {
                        let ammount = item2[0];
                        let boughtPrice = item2[1];
                        if (ammount > 0) {
                            if (boughtPrice == 0) {
                                let total = ammount * this.$root._data.myCoins[i].price;
                                if (this.$root._data.settings.taxes.active && total > 0) {
                                    all += total - (this.$root._data.settings.taxes.percentage / 100) * total;
                                } else {
                                    all += total;
                                }
                            } else {
                                let a = ammount * boughtPrice;
                                let b = ammount * this.$root._data.myCoins[i].price;
                                let pl = b - a;
                                if (this.$root._data.settings.taxes.active && pl > 0) {
                                    all += pl - (this.$root._data.settings.taxes.percentage / 100) * pl;
                                } else {
                                    all += pl;
                                }
                            }
                        }
                    });
                });
                return all.toFixed(2);
            }
        }
    },
    methods: {
        checkSettingsOpen() {
            try {
                if (!document.querySelector('.menu').classList.contains('active')) {
                    if (document.querySelector('.menuBarMain').classList.contains('dragWindow')) {
                        document.querySelector('.menuBarMain').classList.remove('dragWindow');
                    }
                } else {
                    if (!document.querySelector('.menuBarMain').classList.contains('dragWindow')) {
                        document.querySelector('.menuBarMain').classList.add('dragWindow');
                    }
                }
            } catch (e) {
                if (!document.querySelector('.menuBarMain').classList.contains('dragWindow')) {
                    document.querySelector('.menuBarMain').classList.add('dragWindow');
                }
            }
        },
        getFavLink() {
            return this.$root._data.settings.favlink;
        },
        get30Days() {
            var get_30 = async () => {
                let temparr = [];
                let timeIn;
                if (this.$root._data.myCoins[this.coinsCounter].days30 == undefined) {
                    timeIn = 0;
                } else {
                    timeIn = this.$root._data.myCoins[this.coinsCounter].days30.timestamp;
                }
                if (timeIn < (Date.now() - 86400000)) { //Update 30 Days prices for sparklines only every 24 hours
                    let data;
                    try {
                        data = await CoinGeckoClient.coins.fetchMarketChart(this.$root._data.myCoins[this.coinsCounter].id, {
                            vs_currency: this.$root._data.settings.fiat,
                            days: "30",
                            interval: "daily"
                        });
                        this.$root._data.apiCallsPerMinute += 1;
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
                        Object.assign(this.$root._data.myCoins[this.coinsCounter], {
                            "days30": {
                                "prices": temparr,
                                "timestamp": Date.now()
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (this.coinsCounter == this.$root._data.myCoins.length - 1) {
                    this.saveLocal('myCoinsLocal', this.$root._data.myCoins);
                    this.coinsCounter = 0;
                    let this2 = this
                    setTimeout(() => {
                        this2.loadGlobal();
                        this2.$refs.coinsList.renderSparklines();
                    }, 1000);
                } else {
                    let this2 = this
                    setTimeout(() => {
                        this2.$refs.coinsList.renderSparklines();
                        this.coinsCounter++;
                        get_30();
                    }, 1000);
                }
            }
            get_30();
        },
        loadGlobal() {
            let this2 = this
            var load_global = async () => {
                let data;
                try {
                    data = await CoinGeckoClient.global();
                    this.$root._data.apiCallsPerMinute += 1;
                    let obj = data.data.data;
                    Object.keys(obj.total_market_cap).map(function(k) {
                        if (k == this2.$root._data.settings.fiat.toLowerCase()) {
                            let num = obj.total_market_cap[k];
                            if (Math.abs(Number(num)) >= 1.0e+12) {
                                num = (Math.abs(Number(num)) / 1.0e+12).toFixed(2) + ((this2.$root._data.settings.fiat == "EUR") ? " Bil" : " Tril");
                            }
                            if (Math.abs(Number(num)) >= 1.0e+9) {
                                num = (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + ((this2.$root._data.settings.fiat == "EUR") ? " Mil" : " Bil");
                            }
                            this2.globMarket = num;
                            this2.globLoader = false;
                        }
                    })
                    this2.updateBTCprice();
                } catch (e) {
                    console.log(e);
                }
            }
            load_global();
        },
        updateFavIcon() {
            this.componentKey3 += 1;
        },
        forceRerender() {
            this.componentKey += 1;
        },
        forceRerenderInfoPanel() {
            this.componentKey4 += 1;
        },
        changeView(view) {
            this.portfolioShow = false;
            this.$root._data.settings.blockView = !view;
            this.saveLocal('settings', this.$root._data.settings);
        },                
        getApiData() {
            if (this.$root._data.allCoinsDate < (Date.now() - 864000000)) { //check ever 10 Days for new Coins
                this.$root._data.coins = [];
                this.$parent._data.totalCounter = this.maxCoins;
                var load_list = async () => {
                    console.log("Runs: " + this.countCircle + " / " + this.maxCoins);
                    this.$parent._data.counter = this.countCircle - 1;
                    try {
                        let data = await CoinGeckoClient.coins.markets({
                            per_page: 250,
                            page: this.countCircle,
                            localization: false,
                            vs_currency: this.$root._data.settings.fiat
                        });
                        this.$root._data.apiCallsPerMinute += 1;
                        data.data.forEach((item) => {
                            let d = {
                                "id": item.id,
                                "name": item.name,
                                "symbol": item.symbol.toUpperCase(),
                                "logo_url": item.image,
                                "rank": item.market_cap_rank.toString()
                            }
                            this.$root._data.coins.push(d);
                        });
                        if (this.maxCoins == this.countCircle) {
                            this.$root._data.coins.sort((a, b) => (parseInt(a.rank) > parseInt(b.rank)) ? 1 : ((parseInt(b.rank) > parseInt(a.rank)) ? -1 : 0));
                            this.childDataLoaded = true;
                            this.$parent._data.showLoader = false;
                            this.saveLocal('allCoinsDate', Date.now());
                            this.countCircle = 0;
                            this.saveLocal('allCoinsLocal', this.$root._data.coins);
                        } else {
                            let this2 = this;
                            setTimeout(function() {
                                this2.countCircle++;
                                this2.forceRerender();
                                load_list();
                            }, 1000)
                        }
                    } catch (e) {
                        console.log(e);
                        let this2 = this;
                        setTimeout(() => {
                            this2.getApiData();
                            console.log("Restart loading Top3000");
                        }, 1000);
                    }
                };
                load_list()
            } else {
                this.childDataLoaded = true;
                this.$parent._data.showLoader = false;
                console.log('Old coins loaded by data folder');
            }
        }
    }
}
</script>

<style lang="scss">
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
    border-radius: 10px;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--scrollbarColor);
}

html {
    overflow-y: hidden!important;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    background: var(--bodyBGR);
    overflow-x: hidden;
    min-width: 600px;
}

h2 {
    margin-bottom: 20px;
    color: var(--h2color);
}

.tooltipText {
    white-space: nowrap;
}

.tooltipText.wrap {
    white-space: initial;
}

button:not(.del) {
    border-radius: 15px;
}

input {
    padding-left: 5px;
}

input:focus {
    outline: none;
}

input:disabled+span {
    background: black!important;
}

.fa-spinner {
    color: var(--iActive)!important;
}

.fa-check {
    color: green!important;
}

.ansichtAktiv {
    color: var(--iActive) !important;
}

.multiselect__spinner:after,
.multiselect__spinner:before {
    border-top-color: var(--iActive) !important;
}

.ansichtListe,
.ansichtTV {
    color: var(--iInActive);
}

.settingsItem {
    padding: 15px;
    background: var(--menuBarBGR);
    border-radius: 15px;
    width: 100%;
}

button:not(.del) {
    display: inline-block;
    padding: 0.5em 1em;
    text-decoration: none;
    background: #f7f7f7;
    border-left: solid 6px #ce571d;
    color: #000;
    font-weight: bold;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.29);
}

button:hover {
    transform: scale(1.05);
}

#wrapper {
    height: 100vh;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 90px;
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

main > div {
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
    font-size: 0.8em;
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
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked:not(.listBlockSwitcher)+.slider {
    filter: var(--inputActiveFilter);
    background-color: var(--inputActiveBGR);
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

.vex-dialog-buttons {
    text-align: center;
}

.vex.vex-theme-os .vex-dialog-button.vex-dialog-button-primary {
    background-color: var(--primaryColor)!important;
    float: none;
    margin: 0 auto;
}

.shadow {
    box-shadow: 5px 5px 5px 0 rgb(0 0 0 / 75%);
}

.imgFavIcon {
    position: absolute;
    margin-top: 22px;
    margin-left: -20px;
    border-radius: 50%;
}

.base-timer {
    top: 5px;
    position: relative;
}

.dragWindow {
    -webkit-app-region: drag;
}

.menuBar {
    position: relative;
    margin-bottom: -25px;
    min-height: 100px;

}

.menuBarMain {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
}

.menuBarMain > li {
    margin: 20px 10px;
    -webkit-app-region: none;
}

.menuIcon {
    width: 58px;
    height: 54px;
    border: solid 1px black;
    border-radius: 15px;
    background: var(--menuBarBGR);
    padding: 5px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px 0 rgba(0,0,0,0.75);
}
.menuIcon.active,
.menuIcon.activeMenu {
    box-shadow: 0 0 15px 0 var(--menuActiveShadow);
}

.menuIcon:hover {
    transform: scale(1.1);
    cursor: pointer;
}

.infoCard {
    color: var(--infoBarValueColor);
    width: fit-content;
    text-align: center;

    display: inline-block;

    margin: 0 10px;
}

.infoCard p:first-child {
    margin-bottom: 3px;
}

.infoCardTitle {
    color: var(--infoBarTitleColor);
    font-weight: 700;
}

#infoBar {
    height: 60px;
}

#infoBar ul {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    justify-content: center;
}

#infoBar li {
    margin: 10px 20px;
}

span.v-tooltip {
    position: relative;
    z-index: 999;
}

.custom-tooltip {
    opacity: 1 !important;
    background: var(--questionmark) !important;
    color: var(--questionmarkText) !important;
}

.custom-tooltip.success {
    background: var(--questionmark)!important;
    color: var(--questionmarkText) !important;
}

.headtip {
    background-color: var(--headTooltipBGR)!important;
    color: var(--headTooltipText) !important;
    font-weight: 700;
}

.plus-tooltip {
    background-color: var(--plusButton)!important;
    color: var(--headTooltipText) !important;
}

.form__group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 50%;
}

.form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid var(--primaryColor);
    outline: 0;
    font-size: 1.3rem;
    color: #000;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
        color: transparent;
    }

    &:placeholder-shown ~ .form__label {
        font-size: 1.3rem;
        cursor: text;
        top: 20px;
    }
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    display: none;
}

.form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: var(--primaryColor);
}

.form__field:focus {
    ~ .form__label {
        position: absolute;
        top: 0;
        display: block;
        transition: 0.2s;
        font-size: 1rem;
        color: var(--primaryColor);
        font-weight: 700;
    }
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-color: var(--inputBorderBottomFocus);
    border-image-slice: 1;
}

.form__field {
    &:invalid,
    &:required {
        box-shadow: none;
    }
}

.leaderboard {
    max-width: 500px;
    width: 100%;
    border-radius: 15px;

    header {
        --start: 85%;

        height: 100px;
        background-image: repeating-radial-gradient(circle at var(--start), transparent 0%, transparent 10%, rgba(255, 148, 0, .33) 10%, rgba(255, 148, 0, .33) 17%), linear-gradient(to right, var(--primaryColor), var(--secondaryColor));
        color: #fff;
        position: relative;
        border-radius: 12px 12px 0 0;
        overflow: hidden;

        .leaderboard__title {
            position: absolute;
            z-index: 2;
            top: 50%;
            left: 40px;
            transform: translateY(-50%);

            text-transform: uppercase;
            margin: 0;

            span {
                display: block;
            }

            &--top {
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 6.5px;
            }

            &--bottom {
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 3.55px;
                opacity: 0.65;
                transform: translateY(-2px);
            }
        }

        .leaderboard__icon {
            fill: #fff;
            opacity: 0.35;
            width: 50px;
            position: absolute;
            top: 50%;
            left: var(--start);
            transform: translate(-50%, -50%);
        }
    }

    &__profiles {
        background-color: #fff;
        border-radius: 0 0 12px 12px;
        padding: 15px 15px 20px;
        display: flex;

    }

    &__profile {
        padding: 10px 20px;
        overflow: hidden;
        border-radius: 10px;
        transition: transform 0.25s cubic-bezier(.7,.98,.86,.98), box-shadow 0.25s cubic-bezier(.7,.98,.86,.98);
        background-color: #fff;

    }

    &__picture {
        max-width: 100%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 0 0 0 10px #ebeef3, 0 0 0 22px #f3f4f6;
    }

    &__name {
        color: #333;
        font-weight: 600;
        font-size: 20px;
        letter-spacing: 0.64px;
        left: 25px;
        position: relative;
        top: -6px;
    }

    &__value {
        color: #333;
        font-weight: 700;
        font-size: 34px;
        text-align: right;
        position: relative;
        top: 8px;
        float: right;

        & > span {
            opacity: 0.8;
            font-weight: 600;
            font-size: 13px;
            margin-left: 3px;
        }
    }
    .loading,
    .save {
        display: none;
        position: absolute;
        right: 0;

    }
    .add {
        margin: 0 auto;
        color: var(--plusButton);
        display: table;
        font-size: 26px;
    }
    .add:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
    .fa-trash-alt:hover {
        color: red;
        transform: scale(1.05);
        cursor: pointer;
    }
    .allAlertsList {
        width: 100%;
    }
    .allAlertsList li {
        padding: 10px 20px;
        width: 100%;
        float: left;
        list-style: none;
        span {

            font-size: 18px;
        }

    }
    .leaderboard__contents:hover {
        cursor: pointer;
    }

    .singleHolder {
        display: none;
        position: relative;
    }

    .insideAlertSingle {
        width: 100%;
        border-spacing: 0;
        border-radius: 15px;
        margin: 10px 0;
        max-width: 740px;

        input {
            width: 100px;
            text-align: center;
        }

        button {
            margin-top: 10px;
        }

        td,
        th {
            color: darken(#565753, 10%);
            padding: 10px;
            text-align: center;
        }

        td {
            vertical-align: middle;

        }

    }
}

.leaderboard__profiles {
    background: var(--backgroundPL);
}

.settingsItem:not(:first-of-type) {
    margin-top: 30px;
}

.componentHolder {
    padding-bottom: 40px;
}

.noHover:hover {
    cursor: default;
}

.fixedMenu {
    height: 100vh;
    max-height: calc(100% - 80px);
    overflow: auto;
}

.visibilityHidden {
    visibility: hidden;
}

.visibilityShow {
    visibility: visible;
}

.positive {
    color: #359435!important;
}

.negative {
    color: #d03b3b!important;
}

.fa-question-circle {
    font-size: 16px;
    color: var(--questionmark);
}
.trashSVG:hover {
    cursor: pointer;
    transform: scale(1.1);
}
</style>
