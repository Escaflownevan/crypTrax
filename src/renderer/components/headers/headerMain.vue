<template>
<div class="navBar"> 
  <div class="mainMenu">
    <div class="menuItem">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/"><img v-on="on" :src="require(`~/assets/svg/listView.svg`)" height="40" width="40" /></NuxtLink>
        </template>
        <span>List</span>
      </v-tooltip>
    </div>
    <div class="menuItem">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/tvMultiPage"><img v-on="on" :src="require(`~/assets/svg/blockView.svg`)" height="40" width="40" /></NuxtLink>
        </template>
        <span>Tradingview</span>
      </v-tooltip>
    </div>
    <div class="menuItem">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/comparisonPage"><img v-on="on" :src="require(`~/assets/svg/portfolio.svg`)" height="40" width="40" /></NuxtLink>
        </template>
        <span>Comparison</span>
      </v-tooltip>
    </div>
    <div class="menuItem">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/newsPage"> <img v-on="on" :src="require(`~/assets/svg/news.svg`)" height="40" width="40" /></NuxtLink>
        </template>
        <span>News</span>
      </v-tooltip>
    </div>
    <div class="menuItem">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/settings/settingsPage"> <img v-on="on" :src="require(`~/assets/svg/settings.svg`)" height="40" width="40" /></NuxtLink>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </div>
  </div>
  <div class="windowControl">
    <div class="windowControlItem" @click="miniWindow">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <i v-on="on" class="fas fa-window-minimize"></i>
        </template>
        <span>Minimize</span>
      </v-tooltip>
    </div>
    <div class="windowControlItem" @click="maxiWindow">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <i v-on="on" class="fas fa-expand"></i>
        </template>
        <span>Maximize</span>
      </v-tooltip>
    </div>
    <div class="windowControlItem" @click="closeWindow">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <i v-on="on" class="far fa-times-circle"></i>
        </template>
        <span>Exit</span>
      </v-tooltip>
    </div>
  </div>
</div>
</template>


<script>
const ipcRenderer = window.require('electron').ipcRenderer;
export default {
  name: 'headerMain',
  data() {
    return {}
  },
  computed: {
    apiCallsCounter() {
      return this.$store.state.apiLimitCheck.apiCallsCounter
    },
    apiSlots() {
      return this.$store.state.apiLimitCheck.apiSlots
    },
  },
  methods: {
    miniWindow() {
      ipcRenderer.send('request-action-minimizewindow');
    },
    maxiWindow() {
      ipcRenderer.send('request-action-maximizewindow');
    },
    closeWindow() {
      this.$store.state.settings.minimizeWindow ? ipcRenderer.send('request-action-minimizewindow') : ipcRenderer.send('request-action-closewindow')
    },
  }
}
</script>


<style lang="scss">
.navBar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 200;
    -webkit-app-region: drag;
    background: var(--bodyBGR);

}
.windowControl {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
}
.mainMenu {
    display: flex;
    justify-content: center;
    align-items: center;
}

.menuItem,
.windowControlItem {
    padding: 10px;
    -webkit-app-region: no-drag;
    -webkit-user-select: none;
}
.active {
    color: green;
}
.menuIcon {
    width: 40px;
    height: 38px;
    border: solid 1px black;
    border-radius: 15px;
    background: var(--menuBarBGR);
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 0 15px 0 rgba(0,0,0,0.75);
}
.menuIcon.nuxt-link-exact-active,
.nuxt-link-exact-active .menuIcon {
    box-shadow: 0 0 15px 0 var(--menuActiveShadow);
}

.menuIcon:hover {
    transform: scale(1.1);
    cursor: pointer;
}
.windowControlItem:hover {
    cursor: pointer;
}

</style>
