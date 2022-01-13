<template>
<div v-show="!$root._data.settings.blockView" class="tableContainer fixedMenu">
    <table id="coinListTable" class="table table-striped">
        <thead class="thead-dark noHover">
            <tr class="lastVisibleHead">
                <th :class="{hide: !view[0].view, lastVisibleHead: checkLastItem == 0}" class="mColor" scope="col">Logo</th>
                <th :class="{hide: !view[1].view, lastVisibleHead: checkLastItem == 1}" scope="col">Name</th>
                <th :class="{hide: !view[2].view, lastVisibleHead: checkLastItem == 2}" scope="col">Rank</th>
                <th :class="{hide: !view[3].view, lastVisibleHead: checkLastItem == 3}" scope="col">Price</th>
                <th :class="{hide: !view[4].view, lastVisibleHead: checkLastItem == 4}" scope="col">1h</th>
                <th :class="{hide: !view[5].view, lastVisibleHead: checkLastItem == 5}" scope="col">24 h</th>
                <th :class="{hide: !view[6].view, lastVisibleHead: checkLastItem == 6}" scope="col">7 Days</th>
                <th :class="{hide: !view[7].view, lastVisibleHead: checkLastItem == 7}" scope="col">BTC-Price</th>
                <th :class="{hide: !view[8].view, lastVisibleHead: checkLastItem == 8}" scope="col">Cap</th>
                <th :class="{hide: !view[9].view, lastVisibleHead: checkLastItem == 9}" scope="col">Value</th>
                <th :class="{hide: !view[10].view, lastVisibleHead: checkLastItem == 10}" scope="col">Profit/Loss</th>
                <th :class="{hide: !view[11].view, lastVisibleHead: checkLastItem == 11}" scope="col">ATH</th>
                <th :class="{hide: !view[12].view, lastVisibleHead: checkLastItem == 12}" scope="col">30 Days</th>
                <th :class="{hide: !view[13].view, lastVisibleHead: checkLastItem == 13}" scope="col">Delete</th>
            </tr>
        </thead>
        <h1 class="noList" v-if="list.length == 0">Please add Coins<br><i class="fas fa-plus-circle" @click="openSettings"></i></h1>
        <draggable v-if="list.length != 0" v-model="list" tag="tbody" @end="checkMove">
            <tr v-for="item in list" :key="item.symbol">
                <td :class="{hide: !view[0].view, lastVisibleBody: checkLastBody(item.symbol) == 0}"><img :title="item.name" :src="'' + item.logo_url" height="30px" /></td>
                <td :class="{hide: !view[1].view, lastVisibleBody: checkLastBody(item.symbol) == 1}" class="nameCol"><a :title="item.name+' open on Tradingview.com'" target="_blank" :href="'https://www.tradingview.com/chart/?symbol=' + item.symbol + 'USD'">
                        {{ item.name }}</a><a v-show="$root._data.settings.cg_logo" class="coingecko-icon" :title="item.name+' open on Coingeko.com'" target="_blank" :href="'https://www.coingecko.com/en/coins/'+item.id"><img
                            :src="require(`../../assets/gecko.webp`)" height="20px" width="20px" /></a></td>
                <td :class="{hide: !view[2].view, lastVisibleBody: checkLastBody(item.symbol) == 2}" class="noHover">{{ item.rank }}</td>
                <td :class="{hide: !view[3].view, lastVisibleBody: checkLastBody(item.symbol) == 3}" class="noHover" v-if="item.price">{{ formatPrice(item.price) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="item.time1h" :class="{positive: item.time1h > 0, negative: item.time1h < 0, hide: !view[4].view, lastVisibleBody: checkLastBody(item.symbol) == 4}" class="noHover">{{ formatProzent(item.time1h) }}<span> %</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="item.time1d" :class="{positive: item.time1d > 0, negative: item.time1d < 0,hide: !view[5].view, lastVisibleBody: checkLastBody(item.symbol) == 5}" class="noHover">{{ formatProzent(item.time1d) }}<span> %</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="item.time7d" :class="{positive: item.time7d > 0, negative: item.time7d < 0, hide: !view[6].view, lastVisibleBody: checkLastBody(item.symbol) == 6}" class="noHover">{{ formatProzent(item.time7d) }}<span> %</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="$root._data.btcPrice != 0 && typeof $root._data.btcPrice == 'number'" :class="{hide: !view[7].view, lastVisibleBody: checkLastBody(item.symbol) == 7}" class="noHover">{{ formatBTC(item.price, item.name) }}<span> BTC</span></td>
                <td v-else :class="{hide: !view[7].view}"><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="formatCap(item.market_cap)" :class="{hide: !view[8].view, lastVisibleBody: checkLastBody(item.symbol) == 8}" class="noHover">{{ formatCap(item.market_cap) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="maxValue(item)" :class="{positive: maxValues > 0, negative: maxValues < 0, hide: !view[9].view, lastVisibleBody: checkLastBody(item.symbol) == 9}" class="noHover">{{ (maxValues=="NaN") ? 'Loading': maxValues }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td v-if="compEqRef(item)" :class="{positive: profitLoss > 0, negative: profitLoss < 0, hide: !view[10].view, lastVisibleBody: checkLastBody(item.symbol) == 10}" class="noHover">{{ (profitLoss=="NaN") ? 'Loading': profitLoss }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span>
                </td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td :class="{hide: !view[11].view, lastVisibleBody: checkLastBody(item.symbol) == 11}" v-if="item.high" class="noHover">{{ formatPrice(item.high) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
                <td :class="{hide: !view[12].view, lastVisibleBody: checkLastBody(item.symbol) == 12}" :key="sparkUpdate">
                    <sparkline v-if="item.days30!=undefined" width="100" height="30" :indicatorStyles="spIndicatorStyles3" :tooltipProps="spTooltipProps3">
                        <sparklineCurve :data="item.days30.prices" :limit="item.days30.prices.length" :styles="spCurveStyles3" :spotStyles="spSpotStyles3" :spotProps="spSpotProps3" :refLineType="spRefLineType3" :refLineStyles="spRefLineStyles3" />
                    </sparkline>
                    <p v-else><i class="fas fa-spinner fa-pulse"></i></p>
                </td>
                <td :class="{hide: !view[13].view, lastVisibleBody: checkLastBody(item.symbol) == 13}"><button :title="item.name+' delete'" @click="delCoin(item.id)" class="del"><img class="trashSVG" :src="require(`../../assets/delete.svg`)" height="26px" width="26px" /></button></td>
            </tr>
        </draggable>
    </table>
</div>
</template>

<script>
import draggable from 'vuedraggable';
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
    name: 'coinsList',
    display: 'Table',
    order: 8,
    components: {
        draggable
    },
    data() {
        return {
            list: this.$root._data.myCoins,
            view: this.$root._data.settings.view,
            cmcView: this.$root._data.settings.cg_logo,
            btcp: this.$root._data.btcPrice,
            dragging: false,
            activeColor: '',
            boughtCoins: this.$root._data.boughtCoins,
            fiat: this.$root._data.settings.fiat,
            checkLastBody: function(symbol){
                let lastSymbol = this.$root._data.myCoins[this.$root._data.myCoins.length-1].symbol
                if (symbol == lastSymbol) {
                    return this.checkLastItem
                }
            },
            sparkUpdate: 0,
            spCurveStyles3: {
                stroke: '#54a5ff',
                fill: '#000'
            },
            spSpotStyles3: {
                fill: '#54a5ff'
            },
            spSpotProps3: {
                size: 2
            },
            spRefLineType3: 'false',
            spRefLineStyles3: {
                strokeOpacity: 0
            },
            spIndex3: -1,
            spTextStyles3: {
                fill: '#d14',
                fontSize: '12'
            },
            spIndicatorStyles3: {
                stroke: '#000'
            },
            spTooltipProps3: {
                formatter(val) {
                    var dt = new Date();
                    dt.setDate(dt.getDate() - (30 - val.index));
                    const year = dt.getFullYear();
                    const date1 = dt.getDate();
                    const monthIndex = dt.getMonth() + 1;
                    const date = `${date1}.${monthIndex}.${year}`;
                    return `<span style="color:${val.color}">&bull;</span>&nbsp;Price: ${val.value} | ${date}<br />`;
                }
            }
        }
    },
    computed: {
        checkLastItem(){
            let head = document.querySelectorAll('#coinListTable thead th');
            let lastVisible
            head.forEach((item, i) => {
                if (!item.classList.contains("hide")) {
                    lastVisible = i
                }
            });
            if (lastVisible == undefined) {
                return 13
            }else{
                return lastVisible
            }

        }
    },
    methods: {
        openSettings(){
            document.getElementById('openSet').click()
            document.querySelector('#settingsMenu li:first-child').click()
        },
        renderSparklines() {
            this.sparkUpdate++
        },
        renderSettings() {
            this.$parent.$refs.settings.forceRerenderBought();
            this.$parent.$refs.settings.forceRerenderAlert();
            try {
                this.$parent.$refs.settings.$refs.addCoin.updateActCoin()
            } catch (e) {
                //console.log(e)
            }
        },
        formatBTC(itemPrice, coin) {
            if (coin == "Bitcoin") {
                return 1;
            }
            let price = (itemPrice / this.$root._data.btcPrice);
            if (price > 1) {
                return price.toFixed(2);
            }
            price = price.toString()
            if (price.indexOf("e-") > -1) {
                let zeros = price.slice(price.indexOf('e-') + 2, price.length)
                return "0. " + zeros + "x0 " + price.charAt(0);
            }
            let a = price.slice(price.indexOf('.') + 1, price.length);
            for (let i = 0; i < a.length; i++) {
                if (a.charAt(i) !== '0') {
                    return price.slice(0, price.indexOf('.') + i + 3);
                }
            }
        },
        formatPrice(price) {
            if (price.indexOf('.') > -1) {
                let a = price.slice(price.indexOf('.') + 1, price.length);
                for (let i = 0; i < a.length; i++) {
                    if (a.charAt(i) !== '0') {
                        return price.slice(0, price.indexOf('.') + i + 3);
                    }
                }
            } else {
                return price;
            }
        },
        formatProzent(item) {
            return (Math.round(item * 100) / 100).toFixed(2);
        },
        formatCap(labelValue) {
            if (labelValue == undefined) {
                return 0;
            }
            return Math.abs(Number(labelValue)) >= 1.0e+12 ? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + ((this.fiat == "EUR") ? " Bil" : " Tril") : Math.abs(Number(labelValue)) >= 1.0e+9 ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(
                1) + ((this.fiat == "EUR") ? " Mil" : " Bil") : Math.abs(Number(labelValue)) >= 1.0e+6 ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + ((this.fiat == "EUR") ? " Mio" : " Mil") : Math.abs(Number(labelValue)) >= 1.0e+3 ? (Math
                    .abs(Number(labelValue)) / 1.0e+3).toFixed(1) + " T" : Math.abs(Number(labelValue));
        },
        checkMove: function() {
            this.$root._data.myCoins = this.list;
            this.$root._data.myCoins.forEach((item, i) => {
                this.$root._data.alerts.forEach((item2, p) => {
                    if (item.symbol == item2.symbol) {
                        this.array_move(this.$root._data.alerts, p, i)
                    }
                });
                this.$root._data.boughtCoins.forEach((item2, p) => {
                    if (item.id == item2.id) {
                        this.array_move(this.$root._data.boughtCoins, p, i)
                    }
                });
                this.$root._data.alerts.forEach((item2, p) => {
                    if (item.id == item2.id) {
                        this.array_move(this.$root._data.alerts, p, i)
                    }
                });
            });
            this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
            this.saveLocal('alerts', this.$root._data.alerts);
            this.saveLocal('myCoinsLocal', this.$root._data.myCoins);
            this.renderSettings();
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]);
        },
        delCoin(id) {
            this.$root._data.myCoins.forEach((item, i) => {
                if (item.id === id) {
                    this.$root._data.myCoins.splice(i, 1);
                    this.saveLocal('myCoinsLocal', this.$root._data.myCoins);
                }
            })
            this.$root._data.alerts.forEach((item, i) => {
                if (item.id === id) {
                    this.$root._data.alerts.splice(i, 1);
                    this.saveLocal('alerts', this.$root._data.alerts);
                }
            })
            this.$root._data.boughtCoins.forEach((item2, i) => {
                if (item2.id === id) {
                    this.$root._data.boughtCoins.splice(i, 1);
                    this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
                }
            })
            this.$parent.forceRerenderInfoPanel()
            ipcRenderer.send('request-update-label-in-second-window', [this.$root._data.myCoins, this.$root._data.settings.fiat, this.$root._data.boughtCoins, this.$root._data.settings]);
            this.renderSettings();
        },
        maxValue(item) {
            if (this.$root._data.boughtCoins.length != 0) {
                let obj = this.$root._data.boughtCoins.filter(o => o.id === item.id);
                let allPrices = 0;
                obj[0].purchases.forEach((item2) => {
                    allPrices += parseFloat(item2[0]) * parseFloat(item.price);
                });
                this.maxValues = allPrices.toFixed(2)
                return true;
            } else {
                this.maxValues = 0;
                return true;
            }
        },
        compEqRef(item) {
            if (this.$root._data.boughtCoins.length != 0) {
                let obj = this.$root._data.boughtCoins.filter(o => o.id === item.id);
                let obj2 = this.$root._data.myCoins.filter(o => o.id === item.id);
                let allProfitLoss = 0;
                obj[0].purchases.forEach((item2) => {
                    let ammount = item2[0];
                    let boughtPrice = item2[1];
                    if (ammount > 0) {
                        if (boughtPrice == 0) {
                            let total = ammount * obj2[0].price;
                            if (this.$root._data.settings.taxes.active && total > 0) {
                                allProfitLoss += total - (this.$root._data.settings.taxes.percentage / 100) * total;
                            } else {
                                allProfitLoss += total
                            }
                        } else {
                            let a = ammount * boughtPrice;
                            let b = ammount * obj2[0].price;
                            let pl = b - a;
                            if (this.$root._data.settings.taxes.active && pl > 0) {
                                allProfitLoss += pl - (this.$root._data.settings.taxes.percentage / 100) * pl;
                            } else {
                                allProfitLoss += pl;
                            }
                        }
                    }
                });
                this.profitLoss = allProfitLoss.toFixed(2)
                return true;
            } else {
                this.profitLoss = 0;
                return true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
a,
a:active,
a:hover,
a:visited {
    color: inherit;
}

.nameCol {
    padding-right: 26px;
}

.coingecko-icon {
    margin-left: 8px;
    position: absolute;
    top: 16px;

}

.del {
    border: none;
    background-color: transparent;
    i {
        font-size: 18px;
    }
}

.mColor {
    color: var(--coinListHead)!important;
}

.tableContainer {
    margin: 20px;

}

table {
    border-spacing: 0;
    border-radius: 15px;
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.75);
    margin: 0 auto;

    td,
    th {
        color: var(--listTextColor);
        padding: 10px;
        text-align: center;
    }

    td {
        vertical-align: middle;
        white-space: nowrap;
        position: relative;
    }

    th {
        background-color: var(--coinListHead);
        border-bottom: solid 0.5px black;

    }

    tr {
        &:nth-child(2n+1) {
            background-color: var(--listBGR1);
        }

        &:nth-child(2n) {
            background-color: var(--listBGR2);
        }
    }
}

table thead tr, table thead tr th:first-child{
    border-top-left-radius: 15px;
}
table thead tr, .lastVisibleHead{
    border-top-right-radius: 15px;
}
table tbody tr:last-child, table tbody tr:last-child td:first-child{
    border-bottom-left-radius: 15px;
}
table tbody tr:last-child, .lastVisibleBody{
    border-bottom-right-radius: 15px;
}

.noList {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 215px;
}

.noList i{
    color: var(--primaryColor);
    font-size: 50px;
    margin-top: 30px;
}

.noList i:hover{
    transform: scale(1.1);
    cursor: pointer;
}

.show {
    display: block;
}
</style>
