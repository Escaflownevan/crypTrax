<template>
<div class="row">
    <div class="col-8">
        <table id="coinListTable" class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th :class="{hide: !view[0].view}" class="mColor" scope="col">Logo</th>
                    <th :class="{hide: !view[1].view}" scope="col">Name</th>
                    <th :class="{hide: !view[2].view}" scope="col">Rank</th>
                    <th :class="{hide: !view[3].view}" scope="col">Price</th>
                    <th :class="{hide: !view[4].view}" scope="col">1h</th>
                    <th :class="{hide: !view[5].view}" scope="col">24 h</th>
                    <th :class="{hide: !view[6].view}" scope="col">7 Days</th>
                    <th :class="{hide: !view[7].view}" scope="col">Cap</th>
                    <th :class="{hide: !view[8].view}" scope="col">Value</th>
                    <th :class="{hide: !view[9].view}" scope="col">Profit/Loss</th>
                    <th :class="{hide: !view[10].view}" scope="col">ATH</th>
                    <th :class="{hide: !view[11].view}" scope="col">30 Days</th>
                    <th :class="{hide: !view[12].view}" scope="col">Delete</th>

                </tr>
            </thead>
            <h1 class="noList" v-if="list.length == 0">Please add currency via menu -> Coins</h1>
            <i v-if="list.length == 0" class="fa fa-arrow-right noListArrow"></i>
            <draggable v-if="list.length != 0" v-model="list" tag="tbody" @end="checkMove">
                <tr v-for="item in list" :key="item.symbol">
                    <td :class="{hide: !view[0].view}"><img :title="item.name" :src="'' + item.logo_url" height="30px" /></td>
                    <td :class="{hide: !view[1].view}" class="nameCol"><a :title="item.name+' open on Tradingview.com'" target="_blank" :href="'https://www.tradingview.com/chart/?symbol=' + item.symbol + 'USDT'"><strong>{{ item.name }}</strong></a>
                        <a v-show="cmcView" class="cmc-icon" :title="item.name+' open on Coingeko.com'" target="_blank" :href="'https://www.coingecko.com/en/coins/'+item.id"><img :src="require(`../../assets/gecko.png`)" height="20px" width="20px" /></a></td>
                    <td :class="{hide: !view[2].view}">{{ item.rank }}</td>
                    <td :class="{hide: !view[3].view}" v-if="item.price"><strong>{{ formatPrice(item.price) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></strong></td>
                    <td v-else>Loading</td>
                    <td v-if="item.time1h" :class="{positive: item.time1h > 0, negative: item.time1h < 0, hide: !view[4].view}">{{ formatProzent(item.time1h) }}<span> %</span></td>
                    <td v-else>No Data</td>
                    <td v-if="item.time1d" :class="{positive: item.time1d > 0, negative: item.time1d < 0,hide: !view[5].view}">{{ formatProzent(item.time1d) }}<span> %</span></td>
                    <td v-else>No Data</td>
                    <td v-if="item.time7d" :class="{positive: item.time7d > 0, negative: item.time7d < 0, hide: !view[6].view}">{{ formatProzent(item.time7d) }}<span> %</span></td>
                    <td v-else>No Data</td>
                    <td :class="{hide: !view[7].view}">{{ formatCap(item.market_cap) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                    <td v-if="maxValue(item)" :class="{positive: maxValues > 0, negative: maxValues < 0, hide: !view[8].view}">{{ maxValues }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                    <td v-else>Loading</td>
                    <td v-if="compEqRef(item)" :class="{positive: profitLoss > 0, negative: profitLoss < 0, hide: !view[9].view}">{{ profitLoss }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                    <td v-else>Loading</td>
                    <td :class="{hide: !view[10].view}" v-if="item.high">{{ formatPrice(item.high) }} <span v-if="fiat==='EUR'"> €</span><span v-else> $</span></td>
                    <td v-else>Loading</td>
                    <td :class="{hide: !view[11].view}">
                        <p v-if="item.days30==undefined">Loading</p>
                        <sparkline v-if="item.days30!=undefined" width="100" height="30" :indicatorStyles="spIndicatorStyles3">
                            <sparklineCurve :data="item.days30.prices" :limit="item.days30.prices.length" :styles="spCurveStyles3" :spotStyles="spSpotStyles3" :spotProps="spSpotProps3" :refLineType="spRefLineType3" :refLineStyles="spRefLineStyles3" />
                        </sparkline>
                    </td>
                    <td :class="{hide: !view[12].view}"><button :title="item.name+' delete'" @click="delCoin(item.symbol)" class="del">x</button></td>
                </tr>
            </draggable>
        </table>
    </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: 'coinsList',
    display: 'Table',
    order: 8,
    components: {
        draggable
    },
    data() {
        return {
            list: this.$root.$myCoins,
            view: this.$root.$settings.view,
            cmcView: this.$root.$settings.cg_logo,
            dragging: false,
            activeColor: '',
            boughtCoins: this.$root.$boughtCoins,
            fiat: this.$root.$settings.fiat,
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
            //'max', 'min', 'mean', 'avg', 'median', 'custom' or false
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
            }
        }
    },
    methods: {
        formatPrice(price) {
            if(price.indexOf('.')>-1){
                let a = price.slice(price.indexOf('.') + 1, price.length)
                for (let i = 0; i < a.length; i++) {
                    if (a.charAt(i) !== '0') {

                        return price.slice(0, price.indexOf('.') + i + 3)
                    }
                }
            }else{

                return price
            }

        },
        formatProzent(item) {

            return (Math.round(item * 100) / 100).toFixed(2);
        },
        formatCap(labelValue) {
            if (labelValue == undefined) {
                return 0
            }
            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e+12 ?
                (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(2) + ((this.fiat == "EUR") ? " Bil" : " Tril")

                :
                Math.abs(Number(labelValue)) >= 1.0e+9 ?
                (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + ((this.fiat == "EUR") ? " Mil" : " Bil")
                // Six Zeroes for Millions
                :
                Math.abs(Number(labelValue)) >= 1.0e+6

                ?
                (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + ((this.fiat == "EUR") ? " Mio" : " Mil")
                // Three Zeroes for Thousands
                :
                Math.abs(Number(labelValue)) >= 1.0e+3

                ?
                (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + " T"

                :
                Math.abs(Number(labelValue));
        },
        checkMove: function() {

            this.$root.$myCoins = this.list
            this.saveLocal('myCoinsLocal', this.$root.$myCoins)

        },
        delCoin(id) {
            this.$root.$myCoins.forEach((item, i) => {
                if (item.symbol === id) {
                    this.$root.$myCoins.splice(i, 1)
                    this.saveLocal('myCoinsLocal', this.$root.$myCoins)
                }
            })
            this.$root.$boughtCoins.forEach((item2, i) => {
                if (item2.symbol === id) {
                    this.$root.$boughtCoins.splice(i, 1)
                    this.saveLocal('boughtCoins', this.$root.$boughtCoins)
                }
            })

        },
        maxValue(item) {
            if (this.$root.$boughtCoins !== null) {
                let obj = this.$root.$boughtCoins.filter(o => o.symbol === item.symbol)
                let c = String(obj[0].ammount * item.price)
                if (c.indexOf('.')>-1) {
                    this.maxValues = c.slice(0, c.indexOf('.') + 3)
                    return true
                }else{
                    this.maxValues = c
                    return true
                }

            } else {
                this.maxValues = '0'
                return true
            }
        },
        compEqRef(item) {
            if (this.$root.$boughtCoins !== null) {
                let obj = this.$root.$boughtCoins.filter(o => o.symbol === item.symbol)
                let a = obj[0].ammount * obj[0].boughtPrice
                let b = obj[0].ammount * item.price
                let c = String(b - a)
                if (c.indexOf('.')>-1) {
                    this.profitLoss = c.slice(0, c.indexOf('.') + 3)
                    return true
                }else{
                    this.profitLoss = c
                    return true
                }

            } else {
                this.profitLoss = '0'
                return true
            }
        }
    },
    mounted() {

        this.$parent.colorCheck()
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
.cmc-icon {
    margin-left: 8px;
    position: absolute;
    top: 16px;

}
.del {
    background-color: red;
    border-radius: 50px;
    width: 25px;
    height: 25px;
}

$baseColor: #565753;
$borderRadius: 10px;
$imageBig: 100px;
$imageSmall: 60px;
$padding: 10px;
.mColor {
    color: #ff9400fc!important;
}
table {
    border-spacing: 0;
    border-radius: $borderRadius;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.75);

    margin: 10px auto 0;
    td,
    th {
        color: darken($baseColor, 10%);
        padding: $padding;
        text-align: center;
    }

    td {
        vertical-align: middle;
        white-space: nowrap;
        position: relative;
    }

    th {
        background-color: #ff9400fc;
        border-bottom: solid 0.5px black;

    }

    tr {
        &:nth-child(2n) {
            background-color: white;
        }
        &:nth-child(2n+1) {
            background-color: lighten($baseColor, 60%);
        }
    }
}
.positive {
    color: green!important;
}
.negative {
    color: red!important;
}

.noList {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 120px;
}
.noListArrow {
    position: absolute;
    top: 20px;
    right: 100px;
    color: #ff9400fc;
    font-size: 40px;
}
@keyframes bounceRight {
    0%,
    100%,
    20%,
    50%,
    80% {
        -ms-transform: translateX(0);
        transform: translateX(0);
    }
    40% {
        -ms-transform: translateX(-30px);
        transform: translateX(-30px);
    }
    60% {
        -ms-transform: translateX(-15px);
        transform: translateX(-15px);
    }
}
/* /right bounce */

/* assign bounce */
.fa-arrow-right {
    -webkit-animation: bounceRight 2s infinite;
    animation: bounceRight 2s infinite;
    float: right;
}
$variable: value 2;
.sparkline-tooltip {
  left: $variable;
}

</style>
