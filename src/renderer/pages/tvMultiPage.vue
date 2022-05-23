<template>
<div>
  <div class="quickMenu">
    <v-dialog v-model="showTVSettings" width="500">
      <template v-slot:activator="{ on, attrs }">
        <i v-bind="attrs" v-on="on" class="fas fa-plus-circle"></i>
      </template>
      <v-card>
        <h1>Menu Tradingview</h1>
        <tvViewAdd />
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showTVSettings = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showTVwindowSettings" width="600">
      <template v-slot:activator="{ on, attrs }">
        <i v-bind="attrs" v-on="on" class="fa fa-window-restore"></i>
      </template>
      <v-card>
        <h1>Choose how many windows in row</h1>
        <v-btn-toggle class="itemSelect">
          <v-btn v-for="item in tvWindowsOptions" :key="item" @click="changeTVwindowSettings(item)">{{ item }}</v-btn>
        </v-btn-toggle>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showTVwindowSettings = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div id="holderIframes">
    <div v-show="settingsTV.length != 0" v-for="item in settingsTV" :key="item" class="blockViewItem">
      <iframe :src="'https://s.tradingview.com/widgetembed/?symbol=' + item + '&interval=' + settings.tvCandleTime + '&theme='+style" />
    </div>
    <div v-show="settingsTV.length == 0" class="widthFull">
      <h1>Please add stock, etf crypto<br> could be found by Tradingview.com <br><i @click="showTVSettings = true" class="fas fa-plus-circle"></i></h1>
    </div>
  </div>
</div>
</template>

<script>
import tvViewAdd from '~/components/tvViewAdd'
export default {
  name: 'tvMultiPage',
  components: {
    tvViewAdd
  },
  data() {
    return {
      showTVSettings: false,
      showTVwindowSettings: false,
      tvWindowsOptions: ["1", "2", "3", "4", "5", "6", "auto"]
    }
  },
  mounted() {
    this.changeTVwindowSettings(this.$store.state.settings.tvWindowCol)
  },
  computed: {
    settingsTV() {
      return this.$store.state.settings.tv
    },
    settings() {
      return this.$store.state.settings
  },
  style(){
      if (this.$store.state.settings.darkModeOn) {
          return 'dark'
      }else{
          return 'light'
      }
  }
  },
  methods: {
    changeTVwindowSettings(item) {
      let res = ((item == "auto") ? "1 0 auto" : "0 0 " + String(100 / item) + "%");
      document.querySelectorAll(".blockViewItem").forEach((el) => {
        el.style.flex = res
      });
      this.$store.dispatch('updateSettingsTrueData', {
        key: 'tvWindowCol',
        value: item
      })
    }
  }
}
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 400px;
    border: 0;
}

#holderIframes {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 20px;
}

.blockViewItem {
    flex: 0 0 33%;
    padding: 2px;
}

.itemSelect {
    margin: 15px auto;
    display: table;
}
.widthFull {
    width: 100%;
}
</style>
