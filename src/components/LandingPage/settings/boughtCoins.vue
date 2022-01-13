<template>
<div class="componentHolder">
    <article class="leaderboard">
        <header>
            <h2 class="leaderboard__title">Your Portfolio</h2>
        </header>
        <main class="leaderboard__profiles">
            <ul class="allAlertsList allBoughtCoinsList">
                <li id="firstTaxes">
                    <article class="leaderboard__profile shadow">
                        <div @click.stop="toggle()" class="leaderboard__contents">
                            <i class="fas fa-money-bill-wave leaderboard__picture"></i>
                            <span class="leaderboard__name">Taxes and Fees</span>
                        </div>
                        <div id="taxes" class="singleHolder">
                            <table class="table table-striped insideAlertSingle">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">All fees as percentage <v-tooltip bottom content-class='custom-tooltip success'>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                                </template>
                                                <span class="tooltipText">Add a optional filter for profit loss calculation. <br><br>Enter the whole ammount of all types of taxes and fees do you need for your payout. <br><br>The fees are only
                                                    deducted if the coin is in plus. <br><br>The total value are not affected.</span>
                                            </v-tooltip>
                                        </th>
                                        <th scope="col">Active</th>
                                    </tr>
                                </thead>
                                <tbody class="allBoughtCoins">
                                    <tr>
                                        <td class="ammount"><input id="taxPercent" @change="savePercent()" v-on:keyup.enter="savePercent()" class="form__field" type="number" :value="this.$root._data.settings.taxes.percentage" /></td>
                                        <td class="dateHolder">
                                            <label class="switch">
                                                <input id="taxesActive" class="sliderActive" type="checkbox" :checked="this.$root._data.settings.taxes.active" @change="saveTaxesActive()" />
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="save savePercent">
                                <i class="fas fa-check"></i>
                                <span> Saved</span>
                            </div>
                        </div>
                    </article>
                </li>
                <li v-for="item, index2 in this.$root._data.boughtCoins" :key="item.symbol">
                    <article class="leaderboard__profile shadow">
                        <div @click.stop="toggle2(item.id)" class="leaderboard__contents">
                            <img class="leaderboard__picture" :src="''+item.logo" height="20px" />
                            <span class="leaderboard__name">{{ item.name }}</span>
                        </div>
                        <div :class="'singleHolder singleHolder-'+item.id">
                            <table class="table table-striped insideAlertSingle">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">Purchased coins <v-tooltip bottom content-class='custom-tooltip success'>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                                </template>
                                                <span class="tooltipText">Enter the ammount of this coin you bought.</span>
                                            </v-tooltip>
                                        </th>
                                        <th scope="col">Price@Buy <v-tooltip bottom content-class='custom-tooltip success'>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                                </template>
                                                <span class="tooltipText">Please enter the <span v-if="fiat==='EUR'"> EUR </span><span v-else> USD </span> price at the time of purchase</span>
                                            </v-tooltip>
                                        </th>
                                        <th scope="col">Price Finder<v-tooltip bottom content-class='custom-tooltip success'>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <i class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                                                </template>
                                                <span class="tooltipText">Import the <span v-if="fiat==='EUR'"> EUR </span><span v-else> USD </span> price of a coin from a past date. Overwrites actual Price@Buy.</span>
                                            </v-tooltip>
                                        </th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody :class="'allBoughtCoins allBoughtCoins-'+item.id">
                                    <tr v-for="(item2, index) in item.purchases" :key="item2.purchases">
                                        <td class="ammount"><input @change="save(item.id, index2)" v-on:keyup.enter="save(item.id, index2)" :class="'form__field ammount-'+item.id" type="number" :value="item2[0]" /></td>
                                        <td class="boughtPrice"><input @change="save(item.id, index2)" v-on:keyup.enter="save(item.id, index2)" :class="'form__field boughtPrice-'+item.id" type="number" :value="item2[1]" /></td>
                                        <td class="dateHolder">
                                            <datepicker :disabled-dates="state.disabledDates" format="dd.MM.yy" :ref="'PickerIndex-'+index2+index" @selected="loadHistoryDate(item.id, index2, index)"
                                                :calendar-class="'datePicker PickerIndex-'+index2+index" :input-class="'dates-'+item.id" :value="item2[2]" placeholder="optional"></datepicker>
                                        </td>
                                        <td class="delSinglePurchase">
                                            <v-tooltip bottom content-class='custom-tooltip plus-tooltip'>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <img v-bind="attrs" v-on="on" class="trashSVG" @click.stop="delSinglePurchase(item.id, index)" :src="require(`../../../assets/delete.svg`)" height="20px" width="20px" />
                                                </template>
                                                <span class="tooltipText">Delete this entry</span>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="save saveBought">
                                <i class="fas fa-check"></i>
                                <span> Saved</span>
                            </div>
                            <div class="loading">
                                <i class="fas fa-spinner fa-pulse"></i>
                                <span>...Loading</span>
                            </div>
                            <v-tooltip bottom content-class='custom-tooltip plus-tooltip'>
                                <template v-slot:activator="{ on, attrs }">
                                    <i class="fas fa-plus-circle add" @click="add(item.id)" v-bind="attrs" v-on="on"></i>
                                </template>
                                <span class="tooltipText">Add a new Purchase</span>
                            </v-tooltip>
                        </div>
                    </article>
                </li>
            </ul>
        </main>
    </article>
</div>
</template>

<script>
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
import Datepicker from 'vuejs-datepicker';
var vex = require('vex-js')
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    name: 'boughtCoins',
    components: {
        Datepicker
    },
    data() {
        return {
            tempBoughtCoins: [],
            fiat: this.$root._data.settings.fiat,
            boughtCoins: this.$root._data.boughtCoins,
            loadingEnd: false,
            loadingStart: false,
            firstLoad: false,
            state: {
                disabledDates: {
                    from: new Date() // Disable all dates after specific date
                }
            }
        }
    },
    methods: {
        loadHistoryDate(id, index, subIndex) {
            document.getElementsByClassName("loading")[index].style.display = 'block';
            let string = 'PickerIndex-' + index + subIndex
            let dateUnformatted = Date.parse(this.$refs[string][0].selectedDate)
            let date = new Date(dateUnformatted).toLocaleDateString().split(".").join("-");
            var loadHistoryPrice = async () => {
                let data;
                try {
                    data = await CoinGeckoClient.coins.fetchHistory(id, {
                        date: date
                    });
                    this.$root._data.apiCallsPerMinute += 1;
                    let oldPrice
                    if (this.$root._data.settings.fiat == "USD") {
                        oldPrice = data.data.market_data.current_price.usd
                    }
                    if (this.$root._data.settings.fiat == "EUR") {
                        oldPrice = data.data.market_data.current_price.eur
                    }
                    if (this.$root._data.settings.fiat == "AUD") {
                        oldPrice = data.data.market_data.current_price.aud
                    }
                    let holder = document.querySelectorAll(".boughtPrice-" + id)
                    oldPrice = oldPrice.toString()
                    if (oldPrice.indexOf('.') > -1) {
                        let a = oldPrice.slice(oldPrice.indexOf('.') + 1, oldPrice.length);
                        for (let i = 0; i < a.length; i++) {
                            if (a.charAt(i) !== '0') {
                                oldPrice = oldPrice.slice(0, oldPrice.indexOf('.') + i + 3);
                            }
                        }
                    }
                    holder[subIndex].value = oldPrice
                    document.getElementsByClassName("loading")[index].style.display = 'none';
                    this.save(id, index)
                } catch (e) {
                    this.$refs[string][0].value = "";
                    document.getElementsByClassName("loading")[index].style.display = 'none';
                    let err = e.toString();
                    if (err.indexOf("'current_price' of undefined") > -1) {
                        vex.dialog.alert({
                            unsafeMessage: '<div style="text-align:center"><h4>Sorry</h4>Could not read history coin price. Did the coin already exist at your choosen date? Check your date or enter price manually</div>'
                        });
                    }
                    if (e.code == 429) {
                        vex.dialog.alert({
                            unsafeMessage: '<div style="text-align:center"><h4>Error</h4>API-Limit reached. Please wait 1 minute, then you can try again</div>'
                        });
                    }
                    console.log(e);
                }
            }
            loadHistoryPrice();
        },
        openPicker(index, subIndex) {
            let string = 'PickerIndex-' + index + subIndex
            this.$refs[string][0].showCalendar();
            this.$refs[string][0].$el.querySelector('input').focus()
        },
        delSinglePurchase(id, index) {
            let obj = this.$root._data.boughtCoins.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            if (obj[0].purchases.length == 1) {
                obj[0].purchases = [
                    [0, 0, ""]
                ]
            } else {
                obj[0].purchases.splice(index, 1)
            }
            this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]); //send "myCoins" to tray window
        },
        add(id) {
            let obj = this.$root._data.boughtCoins.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            obj[0].purchases.push([0, 0, ""]);
            this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
        },
        toggle() {
            let holder = document.getElementById('taxes').style.display
            if (holder == 'block') {
                document.getElementById('taxes').style.display = 'none';
            } else {
                document.getElementById('taxes').style.display = 'block';
            }
        },
        toggle2(id) {
            let holder
            if (id == "taxes") {
                holder = document.getElementById('taxes').style.display
            } else {
                holder = document.querySelector('.singleHolder-' + id).style.display
            }
            if (holder == 'block') {
                document.querySelector('.singleHolder-' + id).style.display = 'none';
            } else {
                document.querySelector('.singleHolder-' + id).style.display = 'block';
            }
        },
        save(id, index) {
            let obj = this.$root._data.boughtCoins.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            let allAmmount = document.querySelectorAll(".ammount-" + id);
            let allBoughtPrice = document.querySelectorAll(".boughtPrice-" + id);
            let allDates = document.querySelectorAll(".dates-" + id);
            let tempArr = []
            allAmmount.forEach((item, i) => {
                let saveDate
                if (allDates[i].value != "") {
                    let temp = allDates[i].value.split(".")
                    saveDate = new Date(parseInt("20" + temp[2]), parseInt(temp[1]) - 1, parseInt(temp[0]))
                } else {
                    saveDate = ""
                }
                let fin = [item.value == "" ? 0 : item.value, allBoughtPrice[i].value == "" ? 0 : allBoughtPrice[i].value, saveDate]
                tempArr.push(fin)
            });
            obj[0].purchases = tempArr
            this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]); //send "myCoins" to tray window
            document.getElementsByClassName("saveBought")[index].style.display = 'block';
            setTimeout(() => {
                document.getElementsByClassName("saveBought")[index].style.display = 'none';
            }, 1500)
        },
        savePercent() {
            let obj = document.getElementById('taxPercent')
            this.$root._data.settings.taxes.percentage = obj.value
            this.saveLocal('settings', this.$root._data.settings);
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]); //send "myCoins" to tray window
            document.getElementsByClassName("savePercent")[0].style.display = 'block';
            setTimeout(() => {
                document.getElementsByClassName("savePercent")[0].style.display = 'none';
            }, 1500)
        },
        saveTaxesActive() {
            let obj = document.getElementById('taxesActive')
            this.$root._data.settings.taxes.active = obj.checked
            this.saveLocal('settings', this.$root._data.settings);
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]); //send "myCoins" to tray window
            document.getElementsByClassName("savePercent")[0].style.display = 'block';
            setTimeout(() => {
                document.getElementsByClassName("savePercent")[0].style.display = 'none';
            }, 1500)
        }
    }
}
</script>

<style lang="css">
#firstTaxes .leaderboard__name{
    top: -3px;
}
.fa-calendar-alt:hover{
    cursor: pointer;
    transform: scale(1.1)
}

.dateHolder input{
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
}

.dateHolder .leaderboard .insideAlertSingle input {
    width: 80px;
}


.dateHolder i{
    position: relative;
    top: 8px;
    font-size: 24px;
}
.datePicker{
    position: relative!important;
    top: -140px;
    left: -160px;
    border: unset!important
}
.datePicker>div{
    background-color: #dedede;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
}
.datePicker>span{
    background-color: #dedede;
}

.fa-money-bill-wave{
    font-size: 26px;
    color: green;
}
#taxes{
    margin-bottom: 26px;
}
.vdp-datepicker__calendar header .up:not(.disabled):hover{
    background-color: #333!important
}
.allBoughtCoinsList li{
    padding: 10px 10px!important;
}
.allBoughtCoins td {
     padding:2px!important;
}
</style>
