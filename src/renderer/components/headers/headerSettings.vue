<template>
<div class="navBar">
  <div class="mainMenu">
    <NuxtLink class="menuItem" to="/settings/settingsPage">
      <div class="menuIcon"><img :src="require(`~/assets/svg/generalSettings.svg`)" height="40" width="40" /></div>
      <span>Settings</span>
    </NuxtLink>
    <NuxtLink class="menuItem" to="/settings/AccountSettings">
      <div class="menuIcon"><img :src="require(`~/assets/svg/wallet.svg`)" height="40" width="40" /></div>
      <span>Accounts</span>
    </NuxtLink>
    <NuxtLink class="menuItem" to="/settings/ManageHoldings">
      <div class="menuIcon"><img :src="require(`~/assets/svg/dollar.svg`)" height="40" width="40" /></div>
      <span>Holdings</span>
    </NuxtLink>
    <div class="menuItem exit">
      <v-tooltip bottom content-class='custom-tooltip'>
        <template v-slot:activator="{ on }">
          <NuxtLink class="menuIcon" to="/"><img v-on="on" :src="require(`~/assets/svg/back.svg`)" height="20" width="20" /></NuxtLink>
        </template>
        <span>Back</span>
      </v-tooltip>
    </div>
  </div>
</div>
</div>
</template>


<script>
export default {
  name: 'headerSettings',
  data() {
    return {}
  }
}
</script>


<style scoped>
.exit {
  position: fixed;
  top: 2px;
  right: 2px;
}

.exit a {
  padding: 0;
}

.menuItem span {
  padding-top: 10px;
  display: block;
  text-align: center;
  color: var(--settingsMenuTextColor);
}

.menuItem:hover span {
  color: var(--settingsMenuTextActiveColor);
}

.nuxt-link-exact-active span {
  color: var(--settingsMenuTextActiveColor);
}

.menuItem:hover .menuIcon {
  transform: scale(1.1);
  cursor: pointer;
}

.menuItem {
  text-decoration: none;
}

.menuItem:not(.exit) {
  flex-basis: 0;
  flex-grow: 0.1;
}

.navBar {
  margin-bottom: 20px
}
</style>
