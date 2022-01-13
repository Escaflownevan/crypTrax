<template>
<div>
    <div class="electronWindow">
        <ul id="electronMenu">
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <i style="-webkit-app-region: drag" class="fas fa-expand-arrows-alt" v-bind="attrs" v-on="on"></i>
                    </template>
                    <span class="tooltipText">Move</span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <i class="fas fa-window-minimize" @click="miniWindow" v-bind="attrs" v-on="on"></i>
                    </template>
                    <span class="tooltipText">Minimize</span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <i class="fas fa-expand" @click="maxiWindow" v-bind="attrs" v-on="on"></i>
                    </template>
                    <span class="tooltipText">Maximize</span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <i class="far fa-times-circle" @click="closeWindow" v-bind="attrs" v-on="on"></i>
                    </template>
                    <span class="tooltipText">Close</span>
                </v-tooltip>
            </li>
        </ul>
    </div>
    <div id="openSet" v-on:click="openSettings()">
        <v-tooltip bottom content-class='custom-tooltip headtip'>
            <template v-slot:activator="{ on, attrs }">
                <div class="menuIcon" v-bind="attrs" v-on="on">
                    <img :src="require(`../../assets/settings.svg`)" height="40px" width="40px" />
                </div>
            </template>
            <span class="tooltipText">crypTrax Settings</span>
        </v-tooltip>
    </div>
    <div v-bind:class="{ active: menuShow }" class="menu">
        <ul id="settingsMenu">
            <li v-on:click="hideOthers('isHiddenAddcoin')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div  class="card isHiddenAddcoin activeMenu menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/magnifier.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>Coins</h5>
                        </div>
                    </template>
                    <span class="tooltipText">Search your Cryptocurrencies</span>
                </v-tooltip>
            </li>
            <li v-on:click=" hideOthers('isHiddenSettings')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="card isHiddenSettings menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/generalSettings.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>General</h5>
                        </div>
                    </template>
                    <span class="tooltipText">crypTrax Settings</span>
                </v-tooltip>
            </li>
            <li v-on:click=" hideOthers('isHiddenAlerts')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="card isHiddenAlerts menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/bell.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>Alerts</h5>
                        </div>
                    </template>
                    <span class="tooltipText">Set Price Alert(s) to your Crypto</span>
                </v-tooltip>
            </li>
            <li v-on:click=" hideOthers('isHiddenBoughtCoins')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="card isHiddenBoughtCoins menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/dollar.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>Portfolio</h5>
                        </div>
                    </template>
                    <span class="tooltipText">Enter your Holdings</span>
                </v-tooltip>
            </li>
            <li v-on:click=" hideOthers('isHiddenToggleView')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="card isHiddenToggleView menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/columns.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>Column's</h5>
                        </div>
                    </template>
                    <span class="tooltipText">Show | Hide Categories in List View</span>
                </v-tooltip>
            </li>
            <li v-on:click=" hideOthers('isHiddenTradingView')">
                <v-tooltip bottom content-class='custom-tooltip headtip'>
                    <template v-slot:activator="{ on, attrs }">
                        <div class="card isHiddenTradingView menuIcon" v-bind="attrs" v-on="on">
                            <img :src="require(`../../assets/folder.svg`)" class="settingsIcon" width="40px" height="40px" />
                        </div>
                        <div class="containerCard">
                            <h5>Tradingview</h5>
                        </div>
                    </template>
                    <span class="tooltipText">Show Crypto | Stocks | ETF by Tradingview.com</span>
                </v-tooltip>
            </li>
        </ul>
        <div class="settingHolder fixedMenu">
            <addCoin v-if="!settingsCat.isHiddenAddcoin" ref="addCoin"></addCoin>
            <div v-if="!settingsCat.isHiddenSettings" class="componentHolder">
                <div class="generalSettings settingsItem">
                    <h2>System</h2>
                    <ul class="generalList first">
                        <li>
                            <label class="switch">
                                <input id="autoStart" type="checkbox" name="autoStartPanel" :checked="this.$root._data.settings.autostart" @change="autoStartChange" />
                                <span class="slider round"></span>
                            </label>
                            <span>Start at system boot <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Set crypTrax to your system startup.</span>
                                </v-tooltip>
                            </span>
                        </li>
                        <li>
                            <label class="switch">
                                <input id="minimizeWindow" @change="minimizeWindowChange" type="checkbox" :checked="this.$root._data.settings.minimizewindow" />
                                <span class="slider round"></span>
                            </label>
                            <span>Minimize window on close <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Don't close crypTrax on Exit icon, just minimize to tray.</span>
                                </v-tooltip>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="generalSettings settingsItem">
                    <h2>Widget Bar</h2>
                    <ul class="generalList first">
                        <li>
                            <label class="switch">
                                <input id="taskbarOn" type="checkbox" :checked="this.$root._data.settings.taskbarOn" @change="taskbarOnChange" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show Widget Bar <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">A seperate bar showing your coins informations. Position on top or bottom of screen.</span>
                                </v-tooltip>
                            </span>
                        </li>
                        <li v-show="this.$root._data.settings.taskbarOn">
                            <label class="switch">
                                <input id="taskbarOnTop" type="checkbox" :checked="this.$root._data.settings.taskbarOnTop" @change="taskbarOnTopChange" />
                                <span class="slider round"></span>
                            </label>
                            <span>Widget Bar always on top <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Taskbar Widget always in front of any application windows</span>
                                </v-tooltip>
                            </span>
                        </li>
                        <li class="specialHeight" v-show="this.$root._data.settings.taskbarOn">
                            <span>Widget Bar Position <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Choose your widget bar position. Choose between top or bottom of your screen.</span>
                                </v-tooltip>
                            </span>
                            <div class="arrows">
                                <v-tooltip bottom content-class='custom-tooltip'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="menuIcon" v-bind="attrs" v-on="on">
                                            <img @click="taskbarTop(false)" :src="require(`../../assets/arrowBottom.svg`)" height="30px" width="30px" />
                                        </div>
                                    </template>
                                    <span class="tooltipText">Widget Bar to bottom of Screen</span>
                                </v-tooltip>
                                <v-tooltip bottom content-class='custom-tooltip'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div class="menuIcon" v-bind="attrs" v-on="on">
                                            <img @click="taskbarTop(true)" :src="require(`../../assets/arrowTop.svg`)" height="30px" width="30px" />
                                        </div>
                                    </template>
                                    <span class="tooltipText">Widget Bar to top of Screen</span>
                                </v-tooltip>
                            </div>
                        </li>
                        <li v-show="this.$root._data.settings.taskbarOn">
                            <label class="switch">
                                <input id="taskbarOnly" type="checkbox" :checked="this.$root._data.settings.taskbarOnly" @change="taskbarOnly" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show Widget Bar only at start <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">If you just want to see the Widget Bar, activate this. Everytime you start crypTrax the main window is hidden. On task icon you could open main window again.</span>
                                </v-tooltip>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="generalSettings settingsItem">
                    <h2>Choose your base currency <v-tooltip bottom content-class='custom-tooltip success'>
                            <template v-slot:activator="{ on, attrs }">
                                <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                            </template>
                            <span class="tooltipText">Choose your fiat currency, to calculate coin prices. <br><br>If you already set Portfolio entrys, pay attention:<br>Check your portfolio as the prices for purchased coins are not automatically
                                converted to the new fiat currency.</span>
                        </v-tooltip>
                    </h2>
                    <multiselect class="bwInput" @close="newFiat" v-model="value" :options="fiat" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select others"></multiselect>
                </div>
                <div class="generalSettings colorSettings settingsItem">
                    <h2>Customize Theme Colors</h2>
                    <div class="darkSwitcher">
                        <span>Light Mode</span>
                        <div>
                            <label class="switch">
                                <input ref="dmActive" type="checkbox" :checked="this.$root._data.settings.darkModeOn" @change="dmChange" />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <span>Dark Mode</span>
                    </div>
                </div>
                <div class="generalSettings settingsItem">
                    <h2>Timer & Information</h2>
                    <ul class="generalList first">
                        <li>
                            <label class="switch">
                                <input id="showTimer" class="sonstigesInput" @change="timerChange" type="checkbox" name="showTimer" :checked="this.$root._data.settings.timer" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show update countdown <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Countdown timer in right hand side to see next update. Data updates every 1 Minute.</span>
                                </v-tooltip>
                            </span>
                        </li>
                        <li>
                            <label class="switch">
                                <input class="sonstigesInput" @change="infoPanelChange" type="checkbox" name="showInfoPanel" :checked="this.$root._data.settings.info_panel" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show Global Market, Total and Profit/Loss <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Show | Hide Global Market Cap, your total value bought coins and profit / loss calculation.</span>
                                </v-tooltip>
                            </span>
                        </li>
                        <li>
                            <label class="switch">
                                <input class="sonstigesInput" @change="cmcChange" type="checkbox" name="showCMCIcon" :checked="this.$root._data.settings.cg_logo" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show the Coingecko.com logo next to currency<br> name <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">To visit coin details page on coingecko.com, toggle icons visibility.</span>
                                </v-tooltip>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="generalSettings settingsItem">
                    <h2>Bookmark</h2>
                    <ul class="generalList first">
                        <li class="specialHeight2">
                            <label class="switch">
                                <input class="sonstigesInput" @change="BTCEChange" type="checkbox" :checked="this.$root._data.settings.favLinkActive" />
                                <span class="slider round"></span>
                            </label>
                            <span>Show bookmark link <v-tooltip bottom content-class='custom-tooltip success'>
                                    <template v-slot:activator="{ on, attrs }">
                                        <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                    </template>
                                    <span class="tooltipText">Bookmark a link as favourite. In main menu a shortcut icon appears.</span>
                                </v-tooltip>
                            </span>
                            <div class="inputUrl">
                                <input id="url" @change="saveFavLink" v-on:keyup.enter="saveFavLink" class="form__field" type="url" name="url" placeholder="Enter an https:// URL" pattern="https://.*" v-bind:value="valueURL" />
                                <div v-show="favLinkSaved" class="favLinkSaved">
                                    <i class="fas fa-check"></i>
                                    <span> Saved</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <alertsCoins v-if="!settingsCat.isHiddenAlerts" :key="updateAlerts"></alertsCoins>
            <boughtCoins v-if="!settingsCat.isHiddenBoughtCoins" :key="update"></boughtCoins>
            <toggleView v-if="!settingsCat.isHiddenToggleView"></toggleView>
            <tradingView v-if="!settingsCat.isHiddenTradingView"></tradingView>
        </div>
        <div class="menuExit" v-on:click="openSettings()">
            <v-tooltip bottom content-class='custom-tooltip headtip'>
                <template v-slot:activator="{ on, attrs }">
                    <div class="menuIcon" v-bind="attrs" v-on="on">
                        <img :src="require(`../../assets/exit.svg`)" height="20px" width="20px" />
                    </div>
                </template>
                <span class="tooltipText">Exit Settings</span>
            </v-tooltip>
        </div>
    </div>
</div>
</template>

<script>
import addCoin from './settings/addCoin';
import boughtCoins from './settings/boughtCoins';
import toggleView from './settings/toggleView';
import tradingView from './settings/tradingView';
import alertsCoins from './settings/alertsCoins';
import Multiselect from 'vue-multiselect';
var vex = require('vex-js')
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    name: 'settingsMain',
    data() {
        return {
            cg_logo: this.$root._data.settings.cg_logo,
            menuShow: false,
            fiat: ['EUR', 'USD', 'AUD'],
            value: this.$root._data.settings.fiat,
            timer: this.$root._data.settings.timer,
            favLinkActive: this.$root._data.settings.favLinkActive,
            infoPanel: this.$root._data.settings.info_panel,
            minimizeWindow: this.$root._data.settings.minimizewindow,
            taskbarOn: this.$root._data.settings.taskbarOn,
            taskbarOnlyOn: this.$root._data.settings.taskbarOnly,
            update: 0,
            updateAlerts: 0,
            autostart: this.$root._data.settings.autostart,
            settings: this.$root._data.settings,
            favLinkSaved: false,
            settingsCat: {
                isHiddenAddcoin: false,
                isHiddenAlerts: true,
                isHiddenBoughtCoins: true,
                isHiddenSettings: true,
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
        toggleView,
        alertsCoins
    },
    computed: {
        valueURL: function() {
            return this.$root._data.settings.favlink;
        }
    },
    methods: {
        openSettings() {
            this.$parent.$refs.portfolio.updateData()
            this.menuShow = !this.menuShow;
            this.$parent.checkSettingsOpen();
        },
        taskbarTop(show) {
            this.$root._data.settings.taskbarTop = show;
            ipcRenderer.send('request-toggleTaskbarPosition', show);
            this.saveLocal('settings', this.$root._data.settings);
        },
        taskbarOnChange() {
            let status = document.getElementById('taskbarOn').checked;
            this.$root._data.settings.taskbarOn = status;
            ipcRenderer.send('request-toggleTaskbar', status);
            if (!status) {
                this.$root._data.settings.taskbarOnly = false;
            }
            this.saveLocal('settings', this.$root._data.settings);
        },
        taskbarOnTopChange() {
            let status = document.getElementById('taskbarOnTop').checked;
            this.$root._data.settings.taskbarOnTop = status;
            ipcRenderer.send('request-taskbarReload', status);
            this.saveLocal('settings', this.$root._data.settings);
        },
        taskbarOnly() {
            this.$root._data.settings.taskbarOnly = document.getElementById('taskbarOnly').checked;
            this.saveLocal('settings', this.$root._data.settings);
        },
        miniWindow() {
            ipcRenderer.send('request-action-minimizewindow');
        },
        maxiWindow() {
            ipcRenderer.send('request-action-maximizewindow');
        },
        closeWindow() {
            ipcRenderer.send('request-action-closewindow');
        },
        dmChange() {
            if (this.$refs.dmActive.checked) {
                document.getElementsByTagName('html')[0].setAttribute('class', 'dark');
            } else {
                document.getElementsByTagName('html')[0].classList.remove("dark");
            }
            this.$parent.$refs.portfolio.updateData()
            this.$root._data.settings.darkModeOn = this.$refs.dmActive.checked;
            this.saveLocal('settings', this.$root._data.settings);
        },
        isValidHttpUrl(string) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(string);
        },
        saveFavLink() {
            let link = document.getElementById('url').value;
            if (this.isValidHttpUrl(link)) {
                this.$root._data.settings.favlink = link;
                this.saveLocal('settings', this.$root._data.settings);
                this.favLinkSaved = true;
                this.$parent.updateFavIcon();
                setTimeout(() => {
                    this.favLinkSaved = false;
                }, 2000);
            } else {
                document.getElementById('url').value = this.$root._data.settings.favlink;
                vex.dialog.alert({
                    unsafeMessage: '<div style="text-align:center"><h4>URL Error</h4><span>Please check valid URL. Beginn with "http://" or "https://"</span></div>'
                });
            }
        },
        minimizeWindowChange() {
            this.$root._data.settings.minimizewindow = document.getElementById('minimizeWindow').checked;
            this.saveLocal('settings', this.$root._data.settings);
            ipcRenderer.send('request-update-minimizewindow', this.$root._data.settings.minimizewindow);
        },
        autoStartChange() {
            this.$root._data.settings.autostart = document.getElementById('autoStart').checked;
            this.saveLocal('settings', this.$root._data.settings);
            ipcRenderer.send('request-update-autostart', this.$root._data.settings.autostart);
        },
        hideOthers(notHide) {
            Object.keys(this.settingsCat).forEach((item) => {
                if (item !== notHide) {
                    this.settingsCat[item] = true;
                } else {
                    this.settingsCat[item] = false;
                }
            });
            document.querySelectorAll("#settingsMenu .card").forEach((item) => {
                if (item.classList.contains(notHide)) {
                    item.classList.add("activeMenu")
                } else {
                    try {
                        item.classList.remove("activeMenu")
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
        },
        forceRerenderBought() {
            this.update += 1;
        },
        forceRerenderAlert() {
            this.updateAlerts += 1;
        },
        newFiat() {
            this.$root._data.settings.fiat = this.value;
            this.saveLocal('settings', this.$root._data.settings);
            this.$parent.$refs.countDown.onTimesUp();
        },
        BTCEChange() {
            if (this.$root._data.settings.favLinkActive) {
                this.$root._data.settings.favLinkActive = false;
            } else {
                this.$parent.updateFavIcon();
                this.$root._data.settings.favLinkActive = true;
            }
            this.saveLocal('settings', this.$root._data.settings);
        },
        infoPanelChange() {
            if (this.$root._data.settings.info_panel) {
                this.$root._data.settings.info_panel = false;
            } else {
                this.$root._data.settings.info_panel = true;
            }
            this.saveLocal('settings', this.$root._data.settings);
        },
        cmcChange() {
            if (this.$root._data.settings.cg_logo) {
                this.$root._data.settings.cg_logo = false;
            } else {
                this.$root._data.settings.cg_logo = true;
            }
            this.saveLocal('settings', this.$root._data.settings);
        },
        timerChange() {
            if (this.$root._data.settings.timer) {
                this.$root._data.settings.timer = false;
            } else {
                this.$root._data.settings.timer = true;
            }
            this.saveLocal('settings', this.$root._data.settings);
        }
    },
    mounted() {
        ipcRenderer.on('action-activeToggleTaskbar', (event, arg) => {
            let status = !arg;
            this.$root._data.settings.taskbarOn = status;
            this.saveLocal('settings', this.$root._data.settings);
            try {
                document.getElementById('taskbarOn').checked = status;
            } catch (e) {
                //console.log(e)
            }
        });
    }
}
</script>

<style lang="scss" scoped>
@import '~vex-js/dist/css/vex.css';
@import '~vex-js/dist/css/vex-theme-os.css';

.menu {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: var(--settingsBGR);
    padding: 0 50px 25px;
    z-index: 10;
    height: 100vh;
    overflow-y: hidden;
}

.active {
    display: block !important;
}

.settingHolder {
    display: block;
    margin: 10px auto 80px;
    padding: 0 10px;
    width: 500px;
    height: 100%;
}

#settingsMenu {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 700px;
    margin: 0 auto;
}

#settingsMenu > li {
    list-style: none;
    margin: 10px 5px;
    flex: 1 1 0;
    width: 0;
    text-align: center;
}

.card ~ .containerCard {
    color: var(--settingsMenuTextColor);
    position: relative;
}

#settingsMenu > li:hover .containerCard {
    color: var(--settingsMenuTextActiveColor)!important;
    cursor: pointer;
}

#settingsMenu .activeMenu ~ .containerCard {
    color: var(--settingsMenuTextActiveColor);
}

.containerCard {
    padding: 5px 3px;
    height: 100%;
}

#settingsMenu i {
    font-size: 26px;
}

#settingsMenu > li > div.menuIcon {
    margin: 0 auto;
}

.sonstigesInput {
    transform: scale(1.5);
    margin-right: 5px;
}

.card i {
    float: left;
}

.generalList {
    list-style: none;
    width: 100%;
    max-width: none;
}
.generalList li {
    height: 40px;
}
.generalSettings {
    display: grid;
    color: var(--textColorSettings);
}

.generalSettings h3 {
    margin-bottom: 10px;
}

.inputUrl button {
    left: 30px;
    position: relative;
    top: 18px;
}

.inputUrl button i {
    font-size: initial !important;
}

#url {
    filter: none;
    position: relative;
    top: 15px;
    left: 6px;
    width: 300px;
    color: var(--textColorSettings);
}

.darkSwitcher {
    display: flex;
}
.darkSwitcher > span {
    position: relative;
    top: 3px;
}
.darkSwitcher label {
    margin-left: 10px;
}

.darkSwitcher > span:not(:first-child) {
    left: 10px;
}
.generalList.first li > span {
    position: relative;
    top: 3px;
    left: 5px;
}

.electronWindow {
    position: fixed;
    top: 0;
    right: 0;
}

#electronMenu i:hover {
    transform: scale(1.2);
    cursor: pointer;
}

#electronMenu i {
    font-size: 18px;
}

#electronMenu li {
    color: #6d6e6f;
    min-width: unset;
    padding: 10px 7px;
    list-style: none;
}

#electronMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;
    padding: 0;
    width: auto;
    -webkit-app-region: none;
    height: 40px;
}

.menuExit {
    position: fixed;
    top: 12px;
    right: 12px;
}

.menuExit .menuIcon {
    width: 40px;
    height: 40px;
}

.switch {
    float: right;
}

.swtich+span {
    float: left;
}

.switch.leftRightLabel {
    float: none;
}

.specialHeight {
    height: 60px!important;
}

.specialHeight2 {
    height: 100px!important;
}

.arrows {
    display: flex;
    float: right;
}

.arrows .menuIcon {
    width: 50px;
    height: 46px;
}

.arrows .menuIcon:first-child {
    margin-right: 10px;
}

.tooltipText {
    white-space: normal;
}

.favLinkSaved {
    position: relative;
    top: -10px;
    right: -315px;
}
</style>
