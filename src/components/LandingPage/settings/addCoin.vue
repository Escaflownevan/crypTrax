<template>
<div id="addCoinsWrapper">
    <h2>Add cryptocurrencys</h2>
    <multiselect v-model="value" :options="options" :options-limit="3000" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Search cryptocurrencies names" label="name" track-by="name">
        <template slot="selection" slot-scope="{ values, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} Coins selected</span></template>
        <template slot="option" slot-scope="props"><img class="option__image" :src="''+props.option.logo_url">
            <div class="option__desc"><span class="option__small">#{{ props.option.rank }} - </span><span class="option__title">{{ props.option.name }}</span></div>
        </template>
    </multiselect>
    <button @click="actData">Add Coins <i v-show="loadingStart" class="fas fa-spinner fa-pulse"></i><i v-show="loadingEnd" class="fas fa-check"></i></button>
    <div v-show="this.$root.$myCoins != 0" class="actCoins">
        <h2>Actual cryptocurrencies</h2>
        <ul :key="this.updateCoin">
            <li v-for="coin in this.$root.$myCoins" :key="coin.symbol">
                <img :src="''+coin.logo_url" height="20px" /><p>{{ coin.name }}</p></li>
        </ul>
    </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: 'addCoin',
    components: {
        Multiselect
    },
    data() {
        return {
            options: this.$root.$coins,
            value: [],
            boughtCoins: this.$root.$boughtCoins,
            loadingEnd: false,
            loadingStart: false,
            updateCoin: 0
        }
    },
    methods: {
        updateActCoin () {
                this.updateCoin += 1;
        },
        actData() {
            this.loadingStart = true;
            let el = JSON.parse(JSON.stringify(this.value));
            el.forEach((item) => {
                let flag = true;
                if (this.$root.$myCoins != null) {
                    this.$root.$myCoins.forEach((item2) => {
                        if (item.rank == item2.rank) {
                            flag = false;
                        }
                    });
                } else {
                    this.$root.$myCoins = [];
                }

                if (flag) {
                    this.$root.$myCoins.push(item);
                    let obj = {
                        symbol: item.symbol,
                        ammount: 0,
                        boughtPrice: 0
                    };
                    this.$root.$boughtCoins.push(obj);
                    this.saveLocal('boughtCoins', this.$root.$boughtCoins);
                }
            });
            this.saveLocal('myCoinsLocal', this.$root.$myCoins);
            this.value = [];
            for (var i = 0; i < 3; i++) {
                try {
                    clearInterval(this.$parent.$parent.$children[i].timerInterval);
                    this.$parent.$parent.$children[i].timePassed = 0;
                    this.$parent.$parent.$children[i].onTimesUp();
                } catch (e) {
                    //console.log(e);
                }
            }

            this.loadingStart = false;
            this.loadingEnd = true;
            setTimeout(() => {
                this.loadingEnd = false;
                this.$parent.$parent.forceRerender();
            }, 2000);
        }
    },
    mounted() {
        if (this.$root.$myCoins) {
            this.triggerFlag = false;
        }
    }
}
</script>


<style scoped>
.actCoins{
    margin-top: 20px;
}
.actCoins ul{
    list-style: none;
    margin-top: 5px;

}
.actCoins li{
    padding: 5px 10px;
}

.actCoins li p{
    display: inline;
    top: -3.3px;
    position: relative;
}


.actCoins li img{
    margin-right: 5px;
}

.actCoins li:nth-child(2n) {
        background-color: white;
    }

.actCoins li:nth-child(2n+1) {
        background-color: lightgrey;
    }
#addCoinsWrapper {
    width: 400px;
    max-width: 400px;
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
</style>
