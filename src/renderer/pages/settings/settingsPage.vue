<template>
<div>
  <h1>Settings</h1>
  <div class="settingsHolder">
    <div>
      <span>Fiat</span>
      <p class="settingsInfo">Select your Fiat Currency</p>
    </div>
    <v-select v-model="valueSettingsFiat" :items="fiatCurrencies" item-text="name" class="fiatSelect" :menu-props="{closeOnClick:true}">
      <template v-slot:item="{ item }">
        {{ item.currency }} - {{ item.symbol }}
      </template>
      <template v-slot:selection="{ item, index }">
        {{ item.currency }} - {{ item.symbol }}
      </template>
    </v-select>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Calculate Fees | Taxes</span>
      <p class="settingsInfo">Set a percentage value to calculate Profit | Loss</p>
    </div>
    <div>
      <v-text-field class="inField" label="Percentage" v-model="feesAndTaxes">
        <template v-slot:append-outer>
          <label class="switch">
            <input type="checkbox" v-model="feesAndTaxesActive">
            <span class="slider round"></span>
          </label>
        </template>
      </v-text-field>
    </div>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Autostart</span>
      <p class="settingsInfo">crypTrax starts with system boot</p>
    </div>
    <label class="switch">
      <input type="checkbox" v-model="valueSettingsAutostart">
      <span class="slider round"></span>
    </label>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Dark Mode</span>
      <p class="settingsInfo">Change the theme color</p>
    </div>
    <label class="switch">
      <input type="checkbox" v-model="valueSettingsDarkModeOn">
      <span class="slider round"></span>
    </label>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Minimize on close</span>
      <p class="settingsInfo">Don't exit crypTrax just minimize</p>
    </div>
    <label class="switch">
      <input type="checkbox" v-model="minimizeWindow">
      <span class="slider round"></span>
    </label>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Show Info Panel</span>
      <p class="settingsInfo">Toggle show Global Cap/Total/Profit Loss</p>
    </div>
    <label class="switch">
      <input type="checkbox" v-model="infoPanel">
      <span class="slider round"></span>
    </label>
  </div>
  <div class="settingsHolder">
    <div>
      <span>Show Coingecko Icon</span>
      <p class="settingsInfo">Coingecko icons next to coin names for open details</p>
    </div>
    <label class="switch">
      <input type="checkbox" v-model="cgLogo">
      <span class="slider round"></span>
    </label>
  </div>
  <div class="settingsHolderExtra">
    <h2>Widget Bar</h2>
    <div class="settingsHolder">
      <div>
        <span>Active</span>
        <p class="settingsInfo">On / Off Widget Bar</p>
      </div>
      <span class="textColorSettings" v-show="startBar">Starting Widget Bar... <i class="fas fa-spinner fa-pulse"></i></span>
      <label class="switch">
        <input type="checkbox" v-model="widgetBarOn">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="settingsHolder">
      <div>
        <span>Always on Top</span>
        <p class="settingsInfo">Widget Bar always visible</p>
      </div>
      <label class="switch">
        <input type="checkbox" v-model="widgetBarOnTop">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="settingsHolder">
      <div>
        <span>Show only at start</span>
        <p class="settingsInfo">Hide main window at start</p>
      </div>
      <label class="switch">
        <input type="checkbox" v-model="widgetBarOnly">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="settingsHolder">
      <div>
        <span>Set Bar Position</span>
        <p class="settingsInfo">Top or Bottom of Screen</p>
      </div>
      <div class="barPosition">
        <img src="~/assets/svg/arrowBottom.svg" @click="widgetBarTop(false)" />
        <img src="~/assets/svg/arrowTop.svg" @click="widgetBarTop(true)" />
      </div>
    </div>
    <div class="settingsHolder">
      <div>
        <span>Set Bar Height</span>
        <p class="settingsInfo">Between 40 - 100 px</p>
      </div>
      <div class="barPosition">
        <v-text-field type="number" class="inField inField2 inHeight" :value="widgetBarHeight" @change="value => setWidgetBarHeight(value)">

        </v-text-field>
      </div>
    </div>
    <div class="settingsHolder">
      <div>
        <span>Set Bar Correction</span>
        <p class="settingsInfo">Manually adjust position. Positive value move down, negtive up.</p>
      </div>
      <div class="barPosition">
        <v-text-field type="number" class="inField inField2" :value="widgetBarCorrection" @change="value => setWidgetBarCorrection(value)">

        </v-text-field>
      </div>
    </div>
  </div>
  <v-dialog v-model="modalHeight" width="600">
    <v-card>
      <h1>Error</h1>
      <p class="center">Please set height between 40 - 100 px</p>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="modalHeight = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>


<script>
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
  name: 'SettingsPage',
  layout: 'settings',
  data() {
    return {
      startBar: false,
      modalHeight: false,
      fiatCurrencies: [{
        name: 'usd',
        symbol: '$',
        currency: 'US Dollar'
      }, {
        name: 'eur',
        symbol: '€',
        currency: 'Euro'
      }, {
        name: 'idr',
        symbol: 'Rp',
        currency: 'Indonesian Rupiah'
      }, {
        name: 'krw',
        symbol: '₩',
        currency: 'South Korean Won'
      }, {
        name: 'cny',
        symbol: '¥',
        currency: 'Chinese Yuan'
      }, {
        name: 'twd',
        symbol: 'NT$',
        currency: 'New Taiwan Dollar'
      }, {
        name: 'jpy',
        symbol: '¥',
        currency: 'Japanese Yen'
      }, {
        name: 'aed',
        symbol: 'د.إ',
        currency: 'United Arab Emirates Dirham'
      }, {
        name: 'ars',
        symbol: '$',
        currency: 'Argentine Peso'
      }, {
        name: 'aud',
        symbol: '$',
        currency: 'Australian Dollar'
      }, {
        name: 'bdt',
        symbol: '৳',
        currency: 'Bangladeshi Taka'
      }, {
        name: 'bhd',
        symbol: '.د.ب',
        currency: 'Bahraini Dinar'
      }, {
        name: 'bmd',
        symbol: '$',
        currency: 'Bermudian Dollar'
      }, {
        name: 'brl',
        symbol: 'R$',
        currency: 'Brazil Real'
      }, {
        name: 'cad',
        symbol: '$',
        currency: 'Canadian Dollar'
      }, {
        name: 'chf',
        symbol: 'CHf',
        currency: 'Swiss Franc'
      }, {
        name: 'clp',
        symbol: '$',
        currency: 'Chilean Peso'
      }, {
        name: 'czk',
        symbol: 'Kč',
        currency: 'Czech Koruna'
      }, {
        name: 'dkk',
        symbol: 'Kr.',
        currency: 'Danish Krone'
      }, {
        name: 'gbp',
        symbol: '£',
        currency: 'British Pound Sterling'
      }, {
        name: 'hkd',
        symbol: '$',
        currency: 'Hong Kong Dollar'
      }, {
        name: 'huf',
        symbol: 'Ft',
        currency: 'Hungarian Forint'
      }, {
        name: 'ils',
        symbol: '₪',
        currency: 'Israeli New Shekel'
      }, {
        name: 'inr',
        symbol: '₹',
        currency: 'Indian Rupee'
      }, {
        name: 'kwd',
        symbol: 'KD',
        currency: 'Kuwaiti Dinar'
      }, {
        name: 'lkr',
        symbol: 'Rs',
        currency: 'Sri Lankan Rupee'
      }, {
        name: 'mmk',
        symbol: 'K',
        currency: 'Burmese Kyat'
      }, {
        name: 'mxn',
        symbol: '$',
        currency: 'Mexican Peso'
      }, {
        name: 'myr',
        symbol: 'RM',
        currency: 'Malaysian Ringgit'
      }, {
        name: 'ngn',
        symbol: '₦',
        currency: 'Nigerian Naira'
      }, {
        name: 'nok',
        symbol: 'kr',
        currency: 'Norwegian Krone'
      }, {
        name: 'nzd',
        symbol: '$',
        currency: 'New Zealand Dollar'
      }, {
        name: 'php',
        symbol: '₱',
        currency: 'Philippine Peso'
      }, {
        name: 'pkr',
        symbol: '₨',
        currency: 'Pakistani Rupee'
      }, {
        name: 'pln',
        symbol: 'zł',
        currency: 'Polish Zloty'
      }, {
        name: 'sar',
        symbol: 'SR',
        currency: 'Saudi Riyal'
      }, {
        name: 'sek',
        symbol: 'kr',
        currency: 'Swedish Krona'
      }, {
        name: 'sgd',
        symbol: '$',
        currency: 'Singapore Dollar'
      }, {
        name: 'thb',
        symbol: '฿',
        currency: 'Thai Baht'
      }, {
        name: 'try',
        symbol: '₺',
        currency: 'Turkish Lira'
      }, {
        name: 'uah',
        symbol: '₴',
        currency: 'Ukrainian hryvnia'
      }, {
        name: 'vef',
        symbol: 'Bs',
        currency: 'Venezuelan bolívar fuerte'
      }, {
        name: 'vnd',
        symbol: '₫',
        currency: 'Vietnamese đồng'
      }, {
        name: 'zar',
        symbol: 'R',
        currency: 'South African Rand'
      }, {
        name: 'rub',
        symbol: '₽',
        currency: 'Russian Ruble'
      }]
    }
  },
  computed: {
    valueSettingsAutostart: {
      get() {
        return this.$store.state.settings.autostart
      },
      set(value) {
        this.$store.dispatch('setSettingsAutostart', value)
        ipcRenderer.send('request-action-autostart', value);
      }
    },
    valueSettingsDarkModeOn: {
      get() {
        return this.$store.state.settings.darkModeOn
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'darkModeOn',
          value: value
        })
      }
    },
    valueSettingsFiat: {
      get() {
        return this.$store.state.settings.fiat
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'fiat',
          value: JSON.stringify(this.fiatCurrencies.filter(el => el.name == value)[0])
        })
      }
    },
    feesAndTaxes: {
      get() {
        return this.$store.state.settings.taxes.percentage
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'taxes',
          value: value
        })
      }
    },
    feesAndTaxesActive: {
      get() {
        return this.$store.state.settings.taxes.active
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'taxes',
          value: value
        })
      }
    },
    minimizeWindow: {
      get() {
        return this.$store.state.settings.minimizeWindow
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'minimizeWindow',
          value: value
        })
      }
    },
    infoPanel: {
      get() {
        return this.$store.state.settings.infoPanel
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'infoPanel',
          value: value
        })
      }
    },
    cgLogo: {
      get() {
        return this.$store.state.settings.cgLogo
      },
      set(value) {
        this.$store.dispatch('updateSettingsTrueData', {
          key: 'cgLogo',
          value: value
        })
      }
    },
    widgetBarOn: {
      get() {
        return this.$store.state.settings.widgetBar.on
      },
      set(value) {
        if (value) {
          this.startBar = true;
          setTimeout(() => {
            this.startBar = false
          }, 3000)
        }
        this.$store.dispatch('setSettingsWidgetBarOn', value)
        ipcRenderer.send('request-action-widgetBar', value);
        this.updateDataWidgetBar()
      }
    },
    widgetBarOnTop: {
      get() {
        return this.$store.state.settings.widgetBar.onTop
      },
      set(value) {
        this.$store.dispatch('setSettingsWidgetBarOnTop', value)
      }
    },
    widgetBarOnly: {
      get() {
        return this.$store.state.settings.widgetBar.only
      },
      set(value) {
        this.$store.dispatch('setSettingsWidgetBarOnly', value)
      }
    },
    widgetBarHeight() {
      return this.$store.state.settings.widgetBar.height
    },
    widgetBarCorrection() {
      return this.$store.state.settings.widgetBar.correction
    }
  },
  methods: {
    updateDataWidgetBar() {
      setTimeout(() => {
        this.$store.dispatch('triggerDataToWidgetBar')
      }, 2000)
      setTimeout(() => {
        this.$store.dispatch('triggerDataToWidgetBar')
    }, 6000)
    },
    updateHeight() {
      this.$store.dispatch('setSettingsWidgetBarHeight', this.widgetBarHeightStatic)
    },
    widgetBarTop(value) {
      this.$store.dispatch('setSettingsWidgetBarTop', value)
    },
    setWidgetBarHeight(value) {
      if (value > 100 || value < 40) {
        this.modalHeight = true
        return
      }
      this.$store.dispatch('setSettingsWidgetBarHeight', value)
      this.updateDataWidgetBar()
    },
    setWidgetBarCorrection(value) {
      this.$store.dispatch('setSettingsWidgetBarCorrection', value)
      this.updateDataWidgetBar()
    }
  }
}
</script>


<style scoped>
.barPosition img {
  background: var(--menuBarBGR);
  border-radius: 15px;
  padding: 10px;
  width: 45px;
  height: 45px;
}

.barPosition img:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.inField {
  width: 150px;
}
.inField2 {
  width: 100px;
}

.inField>>>input {
  text-align: center
}

.inField button {
  margin-left: 5px;
  margin-top: 8px;
}

.fiatSelect.v-input {
  flex: unset;
}

.fiatSelect>>>.v-select__selections input {
  display: none
}

</style>
