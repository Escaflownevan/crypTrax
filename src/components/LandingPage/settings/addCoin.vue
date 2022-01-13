<template>
<div id="addCoinsWrapper" class="componentHolder">
    <div class="settingsItem">
        <h2>Find your Cryptocurrencies</h2>
        <multiselect v-model="selectedCoins" id="ajax" label="name" track-by="name" placeholder="Search like 'bitcoin' or 'btc'" open-direction="bottom" :options="allCoinsTemp" :multiple="true" :searchable="true" :loading="isLoading"
            :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="3000" @search-change="asyncFind">
            <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">{{ option.name }} <span class="custom__remove" @click="remove(option)"><i class="fas fa-times-circle"></i></span></span>
            </template>
            <template slot="option" slot-scope="props"><img class="option__image" :src="''+props.option.logo_url">
                <div class="option__desc"><span class="option__small">#{{ props.option.rank }} - </span><span class="option__title">{{ props.option.name }}</span></div>
            </template><span slot="noResult">Oops! No Coins found</span>
        </multiselect>
        <button @click="actData()">Add Coins <i v-show="loadingStart" class="fas fa-spinner fa-pulse"></i><i v-show="loadingEnd" class="fas fa-check"></i></button>
        <div class="quickAdd">
            <h2>Quick add Top Coins</h2>
            <div class="holder">
                <button @click="actData(3)">Top #3</button>
                <button @click="actData(5)">Top #5</button>
                <button @click="actData(10)">Top #10</button>
            </div>
        </div>
    </div>
    <div class="settingsItem actCoins" :key="this.updateCoin">
        <h2>Your added Coins</h2>
        <ul>
            <li v-if="this.$root._data.myCoins.length == 0">
                <p> Please add Coin(s) first </p>
            </li>
            <li v-else v-for="coin in this.$root._data.myCoins" :key="coin.symbol">
                <img :src="''+coin.logo_url" height="20px" />
                <p>{{ coin.name }}</p>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect';
var vex = require('vex-js')
export default {
    name: 'addCoin',
    components: {
        Multiselect
    },
    data() {
        return {
            allCoins: this.$root._data.coins,
            allCoinsTemp: this.$root._data.coins,
            boughtCoins: this.$root._data.boughtCoins,
            loadingEnd: false,
            loadingStart: false,
            updateCoin: 0,
            selectedCoins: [],
            isLoading: false
        }
    },
    methods: {
        asyncFind(query) {
            this.isLoading = true
            var newArray = this.allCoins.filter(function(el) {
                if (el.name.toLowerCase().indexOf(query.toLowerCase()) > -1 || el.symbol.toLowerCase().indexOf(query.toLowerCase()) > -1 || el.id.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    return el;
                }
            });
            this.allCoinsTemp = newArray;
            this.isLoading = false;
        },
        updateActCoin() {
            this.updateCoin += 1;
        },
        actData(top) {
            this.loadingStart = true;
            let flagDuplicateMsg = true;
            let newCoins
            if (top) {
                let topArr = [];
                for (var i = 0; i < top; i++) {
                    topArr.push(this.$root._data.coins[i])
                }
                newCoins = topArr;
                flagDuplicateMsg = false;
            } else {
                newCoins = JSON.parse(JSON.stringify(this.selectedCoins));
            }
            newCoins.forEach((item) => {
                let flag = true;
                if (this.$root._data.myCoins != null) {
                    this.$root._data.myCoins.forEach((item2) => {
                        if (item.id == item2.id) {
                            if (flagDuplicateMsg) {
                                vex.dialog.alert({
                                    unsafeMessage: '<div style="text-align:center"><h4>Duplication</h4><img src="' + item.logo_url +
                                        '" height="80px" style="display: block; margin: 0 auto; margin-top:20px;margin-bottom:20px;" /><span>This Coin already added: ' + item.name + '</span></div>'
                                })
                            }
                            flag = false;
                        }
                    });
                } else {
                    this.$root._data.myCoins = [];
                }
                if (flag) {
                    this.$root._data.myCoins.push(item);
                    let boughtCoins = {
                        id: item.id,
                        name: item.name,
                        logo: item.logo_url,
                        purchases: [
                            [0, 0, ""]
                        ]
                    };
                    let alerts = {
                        id: item.id,
                        name: item.name,
                        logo: item.logo_url,
                        alerts: [{
                            "price": "0",
                            "active": false,
                            "direction": ""
                        }]
                    };
                    this.$root._data.boughtCoins.push(boughtCoins);
                    this.$root._data.alerts.push(alerts)
                    this.saveLocal('boughtCoins', this.$root._data.boughtCoins);
                    this.saveLocal('alerts', this.$root._data.alerts);
                }
            });
            this.saveLocal('myCoinsLocal', this.$root._data.myCoins);
            this.selectedCoins = [];
            let obj = this.$parent.$parent.$children.find(child => {
                return child.$options._componentTag === "countDown";
            });
            clearInterval(obj.timerInterval);
            obj.timePassed = 0;
            obj.onTimesUp();
            this.loadingStart = false;
            if (flagDuplicateMsg) {
                this.loadingEnd = true;
            }
            setTimeout(() => {
                this.loadingEnd = false;
                this.$parent.$parent.forceRerender();
            }, 2000);
        }
    },
    mounted() {
        if (this.$root._data.myCoins) {
            this.triggerFlag = false;
        }
    }
}
</script>


<style scoped>
.actCoins {
    margin-top: 60px;
    color: white
}

.actCoins ul {
    list-style: none;
    margin-top: 5px;
}

.actCoins li {
    padding: 5px 10px;
}

.actCoins li p {
    display: inline;
    top: -3.3px;
    position: relative;
    color: var(--textColorSettings);
}

.actCoins li img {
    margin-right: 5px;
}

.option__image {
    width: 50px;
    height: 50px;
}

.multiselect {
    margin-top: 10px;
    margin-bottom: 20px;
}

.option__desc {
    position: absolute;
    left: 70px;
    top: 30px;
}

.custom__tag {
    background-color: #ff9400fc;
    padding: 5px 5px;
    margin: 2px;
    display: inline-block;
    border-radius: 15px;
}

.custom__tag:last-child {
    margin-bottom: 8px;
}

.custom__tag:hover {
    cursor: default;
}

.custom__remove:hover {
    cursor: pointer;
}

.option__title {
    white-space: normal;
}

.custom__tag>span {
    font-weight: 700
}

#addCoinsWrapper {
    width: 100%;
}

.quickAdd {
    margin-top: 30px;
}

.quickAdd .holder {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>
