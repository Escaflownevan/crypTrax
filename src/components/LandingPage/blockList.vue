<template>
<div v-if="settings.blockView" id="holderIframes" class="section group fixedMenu">
    <div v-show="settingsTV.length != 0" v-for="item in settingsTV" :key="item" class="blockViewItem">
        <iframe :src="'https://s.tradingview.com/widgetembed/?symbol=' + item + '&interval=' + settings.tv_candle_time +
        '&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1'" />
    </div>
    <div v-show="settingsTV.length == 0" class="center">
        <h1>Please add Currencies<br><i class="fas fa-plus-circle" @click="openTVsettings"></i></h1>
    </div>
</div>
</template>

<script>
export default {
    name: 'blockList',
    data() {
        return {

        }
    },
    computed: {
        settingsTV(){
            return this.$root._data.settings.tv
        },
        settings(){
            return this.$root._data.settings
        }
    },
    methods:{
        openTVsettings(){
            document.getElementById('openSet').click()
            document.querySelector('#settingsMenu li:nth-child(6)').click()
        }
    }
}
</script>

<style lang="scss" >
h1 {
    color: var(--h1color);
    text-align: center;
    margin: 0 auto;
}

.noList {
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 20%;
}

iframe {
    width: 100%;
    height: 400px;
}

#holderIframes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px 60px;
    margin-top: 20px;
}

.blockViewItem {
    flex: 1 auto;
    margin: 0 10px 10px;
}
.center{
    margin: 0 auto;
}
.center i{
    color: var(--primaryColor);
    font-size: 50px;
    margin-top: 30px;
}

.center i:hover{
    transform: scale(1.1);
    cursor: pointer;
}
</style>
