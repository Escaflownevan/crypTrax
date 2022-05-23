<template >
<div>
  <v-app>
    <headerSettings />
  </v-app>
  <div class="content">
    <nuxt />
  </div>
</div>
</template>

<script>
import headerSettings from '~/components/headers/headerSettings'
export default {
  name: 'settingsLayout',
  components: {
    headerSettings
  },
}
</script>

<style>
.content {
  margin: 0 auto;
  max-width: 600px;
  margin-top: 106px;
}

.settingsHolder {
  min-height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--settingsBGR);
  padding: 10px 20px;
  border-radius: 15px;
  margin: 10px;
  color: #fff;
}

.settingsHolder.single {
  flex-direction: column;
}

.settingsInfo {
  margin-top: 5px;
  font-size: 14px;
  color: var(--settingsMenuTextColor);
}

.settingsHolderExtra {
  margin: 10px 0px;
  padding: 10px 20px;
  border-radius: 15px;
  background-color: var(--headTooltipBGR);
  color: var(--headTooltipText);
}

.singleHoldingTable th,
.singleHoldingTable td {
  color: var(--listTextColor);
  max-width: 50%;
}

.singleHoldingTable>tbody>tr,
.accountsCards.wallets {
  background-color: var(--listBGR1);
}

.singleHoldingTable>tbody>tr:nth-child(2n),
.accountsCards.exchanges {
  background-color: var(--listBGR2);
}

.singleHoldingTable td {
  padding: 5px;
}

.singleHoldingTable input {
  text-align: center;
  margin-top: 0px !important;
}

.singleHoldingTable .v-input {
  padding-top: 0px;
}

.singleHoldingTable .v-input__slot {
  margin-bottom: 0px;
}

.singleHoldingTable>thead th {
  background-color: var(--coinListHead);
}

.singleHoldingTable {
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.singleHoldingTable th,
.singleHoldingTable td {
  padding: 5px !important;
  text-align: center;
  white-space: nowrap;
  font-size: 15px;
}

.settingsHolder>div>span,
.settingsHolder h3,
.settingsHolder .infoHead,
.settingsHolder h4,
.settingsHolder .titleHoldings {
  color: var(--settingsMenuTextActiveColor);
}
</style>
