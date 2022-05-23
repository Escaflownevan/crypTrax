<template>
<div>
  <div class="window-content">
    <div class="myIcon">

            <img title="Show/Hide crypTrax" src="~/assets/logo/icon.svg" height="28" @click="toggleMain" />


      <div v-if="Object.keys(storeClone).length !== 0" v-show="storeClone.total != 0" class="totalAll">
        <p>Total: {{storeClone.total}} {{fiat}}</p>
      </div>
      <div v-if="Object.keys(storeClone).length !== 0" v-show="storeClone.total != 0" class="totalAll">
        <p>P/L: {{storeClone.profitLoss}} {{fiat}}</p>
      </div>
    </div>
    <p v-if="Object.keys(storeClone).length === 0">Loading...</p>
    <section v-if="Object.keys(storeClone).length !== 0" class="sectionAllCoins">
      <button v-show="overflowActive" @click="scrollLeft" id="scrollLeft" type="button" name="button" :stlye="'left:'+distanceLeft"><i class="fas fa-chevron-left"></i></button>
      <ul id="coinList" class="list">
        <li v-for="(item, index) in storeClone.myCoins" :key="index" class="listItemHolder">
          <ul @click="showTooltip(item.id)" class="list">
            <li class="listItem">
              <img :src="item.logo_url" width="24" height="24" />
              <span class="coinName"> {{item.name}} </span>
              <span class="coinPrice"> {{item.price}} {{fiat}} </span>
            </li>
            <li :id="'tool-'+item.id" class="tooltip hidden">
              <div class="menuIcon"><span class="detailsHeader">Rank</span><span class="detailsValue">{{item.rank}}</span></div>
              <div class="menuIcon"><span class="detailsHeader">1H</span><span class="detailsValue"> {{item.time1h}} %</span></div>
              <div class="menuIcon"><span class="detailsHeader">24H</span><span class="detailsValue">{{item.time1d}} %</span></div>
              <div class="menuIcon"><span class="detailsHeader">7D</span><span class="detailsValue">{{item.time7d}} %</span></div>
              <div class="menuIcon"><span class="detailsHeader">BTC</span><span class="detailsValue">{{isNaN(item.btc_price) ? 0 : callTwoDecimals(item.btc_price)}} BTC</span></div>
              <div class="menuIcon"><span class="detailsHeader">Cap</span><span class="detailsValue">{{item.market_cap == 'N/A' ? item.market_cap : capFormated(item.market_cap)}} <p class="inlineCap" v-show="item.market_cap != 'N/A' && capFormated(item.market_cap) != 'N/A'">{{ fiat }}</p></span></div>
              <div class="menuIcon" :class="{hidden: storeClone.total == 0}"><span class="detailsHeader">Total</span><span class="detailsValue"> {{item.total}} {{fiat}} </span></div>
              <div class="menuIcon" :class="{hidden: storeClone.total == 0}"><span class="detailsHeader">P/L</span><span class="detailsValue"> {{item.profitLoss}} {{fiat}}</span></div>
              <div class="menuIcon"><span class="detailsHeader">ATH</span><span class="detailsValue">{{item.high}} {{fiat}}</span></div>
            </li>
          </ul>
        </li>
      </ul>
      <button v-show="overflowActive" @click="scrollRight" id="scrollRight" type="button" name="button"><i class="fas fa-chevron-right"></i></button>
    </section>
  </div>
</div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;
import mixin from '~/mixin/mixinGlobal.js';
export default {
  name: 'barPage',
  layout: 'bar',
  components: {},
  data() {
    return {
      storeClone: {},
      overflowActive: false
    }
  },
  created() {
    ipcRenderer.on('VUEX_MUTATION', (event, arg) => {
      this.storeClone = {
        myCoins: JSON.parse(arg[1]),
        profitLoss: JSON.parse(arg[4]),
        total: JSON.parse(arg[3]),
        settings: JSON.parse(arg[2])
      }
      setTimeout(() => {
        this.checkOverflow()
      }, 500)
      if (this.storeClone.settings.darkModeOn) {
        document.getElementsByTagName('html')[0].setAttribute('class', 'dark')
    }else{
        document.getElementsByTagName('html')[0].removeAttribute('class', 'dark')
    }
    })
  },
  mounted() {},
  methods: {
      callTwoDecimals(item) {
        return mixin.twoDecimals(item)
      },
      capFormated(cap) {
        return mixin.bigMoneyName(cap)
      },
    scrollLeft() {
      document.querySelector('.sectionAllCoins').scrollBy({
        left: -800,
        behavior: 'smooth'
      })
    },
    scrollRight() {
      document.querySelector('.sectionAllCoins').scrollBy({
        left: +800,
        behavior: 'smooth'
      })
    },
    toggleMain() {
      ipcRenderer.send('request-widgetBar-toggleMainWindow');
    },
    showTooltip(id) {
      document.querySelector('#tool-' + id).classList.toggle('hidden')
      this.checkOverflow()
    },
    checkOverflow() {
      if (document.querySelector(".myIcon")) {
        if (document.querySelector(".sectionAllCoins").offsetWidth >= document.querySelector("body").offsetWidth - document.querySelector(".myIcon").offsetWidth) {
          this.overflowActive = true
        } else {
          this.overflowActive = false
        }
      }
      document.querySelector(".listItemHolder:last-child").addEventListener("click", () => {
        this.scrollRight()
      })
  }
  },
  computed: {
    fiat() {
      return this.storeClone.settings.fiat.symbol
    },
    distanceLeft() {
      return document.querySelector(".myIcon").width
  }
  }
}
</script>

<style lang="scss" scoped>
.menuIcon:hover {
    transform: unset;
    cursor: default;
}
.menuIcon span {
    display: block;
    width: 100%;
}
.sectionAllCoins {
    overflow-x: hidden;
}
.window-content {
    background-color: var(--bodyBGR);
    width: 100vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    height: 100vh;
}
.list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}
.listItem {
    color: var(--listTextColor);
    display: flex;
    align-items: center;
    padding: 0 20px;
    white-space: nowrap;
    height: 100vh;
}
.listItemHolder:nth-child(2n) {
    background-color: var(--listBGR1);
}
.listItemHolder {
    background-color: var(--listBGR2);
}
.listItem:hover {
    cursor: pointer;
}
.plAll:hover,
.tooltip:hover,
.totalAll:hover {
    cursor: default;
}
.coinName {
    float: left;
    text-align: left;
    letter-spacing: 0.3px;
}
.coinPrice {
    float: right;
    text-align: right;
    font-weight: 700;
    letter-spacing: 0.9px;
}
.coinName {
    margin-left: 10px;
}
.coinPrice {
    margin-left: 25px;
}
section {
    display: inline-block;
}
.myIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
}
.myIcon img {
    margin: 0 15px;
    width: 36px;

}
.myIcon img:hover {
    cursor: pointer;
}
.myIcon.showAll {
    width: fit-content;
    margin-right: 30px;
}
.tooltip {
    background-color: #ce571d;
    padding: 0 20px;
    align-items: center;
    justify-content: center;
    display: flex;
}
.menuIcon {
    width: fit-content;
    border: solid 0.5px black;
    background: linear-gradient(130deg, rgba(72, 77, 80, 1) 0%, rgba(31, 35, 38, 1) 100%);
    padding: 2px 6px;
    text-align: center;
    margin: 0 2px;

    color: #000;
    font-size: 14px;
    display: unset;
}
.detailsHeader {
    color: #000;
    font-weight: 100;
    display: block;
}
.detailsValue {
    color: #fff;
    font-weight: 100;
    display: block;
    white-space: nowrap;
}
.hidden {
    display: none;
}
#scrollLeft {
    position: fixed;
    top: 0;
}
#scrollRight {
    position: fixed;
    right: 0;
    top: 0;
}
button {
    outline: none;
    background: #61A77D;
    color: white;
    font-weight: 700;
    width: 22px;
    display: none;
    height: 100vh;
}
body:hover button {
    display: block;
}
.plAll p,
.totalAll p {
    margin: 0;
    white-space: nowrap;
}
.plAll,
.totalAll {
    text-align: center;
    color: var(--listTextColor);
    display: inherit;
}
.totalAll:not(:last-child) {
    border-right: solid 0.5px #333;
    padding-right: 5px;
    margin-right: 5px;
}
.plAll {
    margin-left: 5px;
}
.inlineCap{
    display: inline;
}

</style>
