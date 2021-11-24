<template>
<div>
    <div id="burgerMenu" class="container" @click="myFunction" v-on:click="menuShow = !menuShow">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
    </div>
    <div v-bind:class="{ active: menuShow }" class="menu">
        <ul>
            <li>
                <div v-on:click=" hideOthers('isHiddenAddcoin')" class="card">
                    <i class="fab fa-bitcoin"></i>
                    <div class="containerCard">
                        <h5>Coins</h5>
                    </div>
                </div>
            </li>
            <li>
                <div v-on:click=" hideOthers('isHiddenTimer')" class="card">
                    <i class="fas fa-clock"></i>
                    <div class="containerCard">
                        <h5>Timer & Co.</h5>
                    </div>
                </div>
            </li>
            <li>
                <div v-on:click=" hideOthers('isHiddenBoughtCoins')" class="card">
                    <i class="fas fa-hand-holding-usd"></i>
                    <div class="containerCard">
                        <h5>Profit/Loss</h5>
                    </div>
                </div>
            </li>
            <li>
                <div v-on:click=" hideOthers('isHiddenFiat')" class="card">
                    <i class="fas fa-euro-sign"></i>
                    <div class="containerCard">
                        <h5>Base currency</h5>
                    </div>
                </div>
            </li>
            <li>
                <div v-on:click=" hideOthers('isHiddenToggleView')" class="card">
                    <i class="fas fa-tv"></i>
                    <div class="containerCard">
                        <h5>View</h5>
                    </div>
                </div>
            </li>
            <li>
                <div v-on:click=" hideOthers('isHiddenTradingView')" class="card">
                    <i class="far fa-chart-bar"></i>
                    <div class="containerCard">
                        <h5>Tradingview</h5>
                    </div>
                </div>
            </li>
        </ul>
        <div class="settingHolder">
            <addCoin v-if="!settingsCat.isHiddenAddcoin"></addCoin>
            <div v-if="!settingsCat.isHiddenTimer">
                <h2>Timer & Co</h2>
                <div class="spacerCard">
                    <input id="showTimer" class="sonstigesInput" @change="timerChange" type="checkbox" name="showTimer" :checked="timer" /><label v-if="!settingsCat.isHiddenTimer" for="showTimer"> Show update countdown</label>
                </div>
                <div class="spacerCard">
                    <input class="sonstigesInput" @change="BTCEChange" type="checkbox" name="showBTCEcho" :checked="btcecho" /><label v-if="!settingsCat.isHiddenTimer" for="showBTCEcho"> Show BTC-Echo.de link</label>
                </div>
                <div class="spacerCard">
                    <input class="sonstigesInput" @change="cmcChange" type="checkbox" name="showCMCIcon" :checked="cg_logo" /><label v-if="!settingsCat.isHiddenTimer" for="showCMCIcon"> Show the Coingecko.com logo next to the currency name</label>
                </div>
            </div>
            <boughtCoins v-if="!settingsCat.isHiddenBoughtCoins" :key="update"></boughtCoins>
            <div v-if="!settingsCat.isHiddenFiat">
                <h2>Choose your base currency</h2>
                <multiselect class="bwInput" @close="newFiat" v-model="value" :options="fiat" :searchable="true" :close-on-select="true" :show-labels="false" placeholder="Select others"></multiselect>
            </div>
            <toggleView v-if="!settingsCat.isHiddenToggleView"></toggleView>
            <tradingView v-if="!settingsCat.isHiddenTradingView"></tradingView>
        </div>
    </div>
</div>
</template>

<script>
import addCoin from './settings/addCoin';
import boughtCoins from './settings/boughtCoins';
import toggleView from './settings/toggleView';
import tradingView from './settings/tradingView';
import Multiselect from 'vue-multiselect';
export default {
    name: 'settingsMain',
    data() {
        return {
            cg_logo: this.$root.$settings.cg_logo,
            menuShow: false,
            fiat: ['EUR', 'USD', 'AUD'],
            value: this.$root.$settings.fiat,
            timer: this.$root.$settings.timer,
            btcecho: this.$root.$settings.btcecho,
            update: 0,
            settings: this.$root.$settings,
            settingsCat: {
                isHiddenAddcoin: false,
                isHiddenTimer: true,
                isHiddenBoughtCoins: true,
                isHiddenFiat: true,
                isHiddenToggleView: true,
                isHiddenTradingView: true
            }
        }
    },
    components: {
        addCoin,
        boughtCoins,
        Multiselect,
        tradingView,
        toggleView
    },
    methods: {
        timerCheck() {
            if (this.timer) {
                return true;
            } else {
                return false;
            }
        },
        hideOthers(notHide) {
            Object.keys(this.settingsCat).forEach((item) => {
                if (item !== notHide) {
                    this.settingsCat[item] = true;
                } else {
                    this.settingsCat[item] = false;
                }
            });

        },
        forceRerender() {
            this.update += 1;
        },
        myFunction() {
            document.getElementById('burgerMenu').classList.toggle('change');
        },
        newFiat() {
            this.$root.$settings.fiat = this.value;
            this.saveLocal('settings', this.$root.$settings);
            this.$parent.$children[0].onTimesUp();
        },
        BTCEChange() {
            var yourUl = document.getElementById('BTCEchoIcon');
            yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
            if (this.$root.$settings.btcecho) {
                this.$root.$settings.btcecho = false;
            } else {
                this.$root.$settings.btcecho = true;
            }
            this.saveLocal('settings', this.$root.$settings);
        },
        cmcChange() {
            document.querySelectorAll(".cmc-icon").forEach(yourUl => {
                yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
            });
            if (this.$root.$settings.cg_logo) {
                this.$root.$settings.cg_logo = false;
            } else {
                this.$root.$settings.cg_logo = true;
            }
            this.saveLocal('settings', this.$root.$settings);
        },
        timerChange() {
            var yourUl = document.querySelector(".base-timer");
            yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
            if (this.$root.$settings.timer) {
                this.$root.$settings.timer = false;
            } else {
                this.$root.$settings.timer = true;
            }
            this.saveLocal('settings', this.$root.$settings);
        }
    },
    mounted() {
        if (this.timer) {
            this.$parent.$children[0].$el.style.display = 'block';
        } else {
            this.$parent.$children[0].$el.style.display = 'none';
        }
    }
}
</script>

<style scoped>
.container {
    position: absolute;
    top: 20px;
    right: 20px;
    display: inline-block;
    cursor: pointer;
}

.bar1,
.bar2,
.bar3 {
    width: 35px;
    height: 5px;
    background-color: #000;
    margin: 6px 0;
    transition: 0.4s;
}

.change .bar1 {
    -webkit-transform: rotate(-45deg) translate(-9px, 6px);
    transform: rotate(-45deg) translate(-9px, 6px);
    background-color: red;
}

.change .bar2 {
    opacity: 0;
}

.change .bar3 {
    -webkit-transform: rotate(45deg) translate(-8px, -8px);
    transform: rotate(45deg) translate(-8px, -8px);
    background-color: red;
}

.menu {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(69, 69, 82, 0.97);
    padding: 50px 25px;
    border: solid 0.5px grey;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.75);
    z-index: 10;
}

#burgerMenu {
    z-index: 999
}

.active {
    display: block !important;
}

.settingHolder {
    float: left;
    width: 70%;
}

ul {
    float: left;
    width: 30%;
    padding-right: 50px;
    max-width: 300px;
}

li {
    list-style: none;
    padding-top: 10px;
    padding-bottom: 10px;
}

.card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    background-color: #fff;
    border-radius: 5px;
    position: relative;
    padding: 10px;
    text-align: center;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(255, 255, 255, 0.2);
    cursor: pointer;
}

.containerCard {
    padding: 5px 3px;
    height: 100%;
}

i {
    font-size: 26px;
}

.sonstigesInput {
    transform: scale(1.5);
    margin-right: 5px;
}

.card i {
    float: left
}

.spacerCard {
    background-color: #ff9400fc;
    border: solid black 1px;
    border-radius: 10px;
    padding: 30px;
    margin-bottom: 20px;
    width: 90%;
    max-width: 740px;
}

.bwInput {
    max-width: 270px;
}
</style>
