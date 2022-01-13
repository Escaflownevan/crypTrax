<template>
<div class="componentHolder">
    <div class="settingsItem">
        <h2>Tradingview Multi Window <v-tooltip bottom content-class='custom-tooltip success'>
                <template v-slot:activator="{ on, attrs }">
                    <i @click="show = !show" class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                </template>
                <span class="tooltipText wrap">Name of the currency as in Tradingview.com to add currencies. Most cryptocurrencies "XXXUSD" e.g. "BTCUSD". Stocks and ETFs are also possible. <br><br>
                    <img class="tvTooltippImage" :src="require(`../../../assets/tradingView.jpg`)" width="550px" /><br><br> If you are not sure, go to "tradingview.com/chart" and look for the name. Please be sure the name is correct, there's no
                    validity check.<br><br>
                </span>
            </v-tooltip>
        </h2>
        <input id="insert" class="form__field" type="text" name="" value="" v-on:keyup.enter="save()" onkeyup="this.value = this.value.toUpperCase();" @change="save()">
        <div v-show="this.$root._data.settings.tv.length == 0" class="tradingviewInfo">
            <p>Please enter a Tradingview.com currency name</p>
            <p>Try for example "BTCUSD" | "ETHUSD" | "AAPL" | "MSFT"</p>
        </div>
        <ul>
            <li v-for="(item, index) in this.$root._data.settings.tv" :key="item">
                <img class="trashSVG" @click="deleteSymbol(index)" :src="require(`../../../assets/delete.svg`)" height="26px" width="26px" />
                <p class="noHover tvNames"> {{ item }}</p>
            </li>
        </ul>
    </div>
    <div class="settingsItem">
        <h2>Candle time <v-tooltip bottom content-class='custom-tooltip success'>
                <template v-slot:activator="{ on, attrs }">
                    <i @click="show = !show" class="fas fa-question-circle" v-bind="attrs" v-on="on"></i>
                </template>
                <span class="tooltipText wrap">Choose a candle time for all Tradingview charts. </span>
            </v-tooltip>
        </h2>
        <ul>
            <li v-for="(item, index) in times" :key="index" @change="onChange(item.value)" class="radioListItem">
                <label :for="item.value">
                    <input class="candleTimes" type="radio" name="candleTimes" :value="item.value">
                    <p>{{ item.name }}</p>
                </label>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: 'tradingView',
    data() {
        return {
            settings: this.$root._data.settings,
            symbols: [],
            times: [{
                "name": "1 Minute",
                "value": "1"
            }, {
                "name": "2 Hour",
                "value": "120"
            }, {
                "name": "3 Minutes",
                "value": "3"
            }, {
                "name": "3 Hour",
                "value": "180"
            }, {
                "name": "5 Minutes",
                "value": "5"
            }, {
                "name": "4 Hour",
                "value": "240"
            }, {
                "name": "15 Minutes",
                "value": "15"
            }, {
                "name": "1 Day",
                "value": "D"
            }, {
                "name": "30 Minutes",
                "value": "30"
            }, {
                "name": "1 Week",
                "value": "W"
            }, {
                "name": "45 Minutes",
                "value": "45"
            }, {
                "name": "1 Month",
                "value": "M"
            }, {
                "name": "1 Hour",
                "value": "60"
            }],
            selected: null,
            show: false
        }
    },
    created() {
        if (this.$root._data.settings.tv) {
            this.symbols = this.$root._data.settings.tv;
        }
    },
    mounted() {
        this.selected = null;
        this.times.forEach((item, index) => {
            if (item.value == this.$root._data.settings.tv_candle_time) {
                document.getElementsByClassName("candleTimes")[index].checked = true;
            }
        });
    },
    methods: {
        onChange(obj) {
            this.$root._data.settings.tv_candle_time = obj;
            this.saveLocal('settings', this.$root._data.settings);

        },
        changeView(index, status) {
            this.$root._data.settings['view'][index]['view'] = status;
            this.saveLocal('settings', this.$root._data.settings);
            let el = document.querySelectorAll('#coinListTable tr td:nth-child(' + (index + 1) + ')');
            let elHead = document.querySelectorAll('#coinListTable tr th:nth-child(' + (index + 1) + ')')[0];
            if (status) {
                Array.from(el).forEach(function(val) {
                    val.classList.remove('hide');
                    val.classList.add('show');
                })
                elHead.classList.remove('hide');
                elHead.classList.add('show');
            } else {
                Array.from(el).forEach(function(val) {
                    val.classList.remove('show');
                    val.classList.add('hide');
                })
                elHead.classList.remove('show');
                elHead.classList.add('hide');
            }
        },
        save() {
            let val = document.getElementById("insert").value;
            let check = false;
            this.$root._data.settings.tv.forEach((item) => {
                if (item == val) {
                    check = true;
                }
            });
            if (val == '' || check) {
                document.getElementById("insert").value = '';
                return;
            } else {
                this.symbols.push(val);
                document.getElementById("insert").value = '';
                this.$root._data.settings.tv = this.symbols;
                this.saveLocal('settings', this.$root._data.settings);

            }
        },
        deleteSymbol(index) {
            if (this.symbols.length == 0) {
                this.symbols;
            }
            this.symbols.splice(index, 1);
            this.$root._data.settings.tv = this.symbols;
            this.saveLocal('settings', this.$root._data.settings);
            
        }
    }
}
</script>

<style lang="css" scoped>

ul{
    margin-top: 15px;
  list-style: none;
}

li{
  padding: 12px;
  width: 50%;
  display: inline-block;
}

button{
  display: block!important;
  margin-top: 10px;
  margin-left: 5px;
}

li p{
  display: inline-block;
  margin-left: 15px;
  color: var(--textColorSettings);
  position: relative;
  top: -2px;
}

.tvNames{
    top: -7px;
}

.fa-trash-alt:hover{
    color: red;
    transform: scale(1.05);
    cursor: pointer;
}

input[type='radio']:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: #d1d3d1;
    content: '';
    display: inline-block;
    visibility: visible;
}

input[type='radio']:checked:after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: var(--iActive);
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid var(--iActive);
}
input[type='radio']:hover{
    cursor: pointer;
}

.tradingviewInfo{
    margin-top: 20px;

}

.tvTooltippImage{
    display: block;
    margin: 0 auto;
}
</style>
