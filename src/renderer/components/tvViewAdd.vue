<template>
<div class="componentHolder">
  <div class="settingsHolder single">
    <h2>Tradingview Multi Window </h2>
    <div class="tradingviewInfo center">
      <p>Please enter a Tradingview.com currency name</p>
      <p>Try for example "BTCUSD" | "ETHUSD" | "AAPL" | "MSFT"</p>
    </div>
    <v-text-field id="insert" class="form__field" type="text" v-model="value" v-on:keyup.enter="addTvEntry(value)">
      <template v-slot:append-outer>
        <v-btn @click="addTvEntry(value)">Add</v-btn>
      </template>
    </v-text-field>
    <ul v-show="tv.length != 0" class="tvItems">
      <li v-for="(item, index) in tv" :key="index">
        <p class="noHover">{{ index+1 }}. {{ item }}</p>
        <i class="fa fa-times deleteItem" @click="deleteTvEntry(index)"></i>
        <div class="upDown">
          <i v-show="index != 0" class="fa fa-arrow-up" @click="moveItem(index,'up')"></i>
          <i v-show="index != tv.length-1" class="fa fa-arrow-down" @click="moveItem(index,'down')"></i>
        </div>
      </li>
    </ul>
  </div>
  <div class="settingsHolder single">
    <h2 class="candleTimeHead">Candle time</h2>
    <ul class="times">
      <li v-for="(item, index) in times" :key="index" @change="onChange(item.value)" class="radioListItem">
        <label>
          <input class="candleTimes" type="radio" name="candleTimes" :checked="tvCandleTime == item.value" />
          <p>{{ item.name }}</p>
        </label>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'tvViewAdd',
  data() {
    return {
      tv: this.$store.state.settings.tv,
      value: null,
      tvCandleTime: this.$store.state.settings.tvCandleTime,
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
    }
  },
  methods: {
    moveItem(index, direction) {
      this.$store.commit('setTVitemPosition', {
        index: index,
        direction: direction
      })
    },
    onChange(value) {
      this.$store.dispatch('updateSettingsTrueData', {
        key: 'tvCandleTime',
        value: value
      })
    },
    addTvEntry(input) {
      this.$store.dispatch('updateSettingsTrueData', {
        key: 'tvAdd',
        value: input.toUpperCase()
      })
      this.value = null
    },
    deleteTvEntry(index) {
      this.$store.dispatch('updateSettingsTrueData', {
        key: 'tvRemove',
        value: index
      })
    }
  }
}
</script>

<style lang="css" scoped>

ul{
    margin-top: 15px;
  list-style: none;
  margin: 0 auto;
}

.tvItems{
    max-width: 400px;
    margin: 20px 0px;
}

.times li{
  width: 50%;
  display: inline-block;
}

.tvItems li{
    padding: 5px 10px;
    background-color: var(--listBGR1);
}

.tvItems li:nth-child(2n+1) {
background-color: var(--listBGR2);
}

.tvItems li p{
    margin-bottom: 0px;
}

.tvItems .deleteItem{
    margin-right: 40px;
}

button{
  display: block!important;

}

li p{
  display: inline-block;
  color: var(--listTextColor);
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
    color: var(--textColorSettings)
}
.upDown{
    float: right;
}
.tvItems{
    padding-right: 24px;
}

.candleTimeHead{
    margin-bottom: 20px;
}
</style>
