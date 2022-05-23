<template>
<div>
  <v-app>
    <app-header />
  </v-app>
  <nuxt class="marginTopNavBar" />
</div>
</template>

<script>
import appHeader from '~/components/headers/headerMain'
export default {
  name: 'defaultLayout',
  components: {
    appHeader
  }
}
</script>

<style lang="scss">
html {
    -webkit-app-region: no-drag;
    overflow-y: auto!important;
}
body:not(.extra) {
    background: var(--bodyBGR);
}

h1 {
    color: var(--h1color);
    text-align: center;
}
h2 {
    color: var(--h2color);
    text-align: center;
}
h3 {
    color: var(--h3color);
    text-align: center;
}
h4 {
    color: var(--h3color);
}
.marginTopNavBar {
    margin-top: 72px;
}
.v-application ol,
.v-application ul {
    padding-left: 0;
}
.v-btn:focus:before,
.v-btn:hover:before {
    background-color: var(--primaryColor);
}
.v-btn--active::before {
    opacity: 0!important;
}
.theme--light.v-card {
    background-color: var(--dialogBGR)!important;
}

.theme--light.v-input input,
.theme--light.v-input textarea,
.theme--light.v-label,
.theme--light.v-label,
.theme--light.v-select .v-select__selections,
input[type=number] {
    color: var(--textColorSettings)!important;
}
.theme--light.v-input,
.v-input__append-inner i {
    color: var(--primaryColor)!important;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border-color: rgb(206 87 29 / 42%);
}

.theme--light.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before {
    border-color: rgba(206, 87, 29, 0.87);
}
.v-select__selections > input,
.v-text-field__slot > input {
    margin-top: 8px!important;
}
.center {
    text-align: center;
}
.componentHolder {
    margin: 0 10px;
}
.v-application p {
    margin-bottom: 0;
}
.v-application--wrap {
    min-height: unset!important;
    position: unset!important;
}
.theme--light.v-application {
    background: unset!important;
}
i:not(.windowControlItem i, .deleteItem) {
    color: var(--primaryColor);
}

i:hover {
    transform: scale(1.1);
    cursor: pointer;
}
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;

}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked+.slider {
    filter: var(--inputActiveFilter);
    background-color: var(--primaryColor);
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(16px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
.theme--light.v-card {
    background-color: #424242;
}
.deleteItem {
    margin: 0 6px;
    padding: 3px 4.5px;
    background-color: white;
    border-radius: 50px;
    color: rgb(199 1 1);
    font-size: 10px;
}
.deleteItem:hover {
    transform: scale(1.1);
    cursor: pointer;
    color: red;
    transform-origin: 50%, 50%;
}
.quickMenu {
    margin-left: 20px;
    padding: 2px 0;
}
.custom-tooltip {
    background: rgba(97, 97, 97, 1)!important;
    opacity: 1!important;
}
</style>
