<template>
<div>
    <div class="left">
        <h2>Tradingview</h2>
        <input id="insert" type="text" name="" value="" v-on:keyup.enter="save()">
        <button @click="save()">Add</button>
        <ul>
            <li v-for="(item, index) in this.$root.$settings.tv" :key="item">
                <i class="fas fa-trash-alt" @click="deleteSymbol(index)"></i>
                <p> {{ item }}</p>

            </li>
        </ul>
    </div>
    <div class="right">
        <h2>Candle time</h2>
        <select @change="onChange($event)" v-model="selected">
            <option value="1">1 Minute</option>
            <option value="3">3 Minutes</option>
            <option value="5">5 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="120">2 Hour</option>
            <option value="180">3 Hour</option>
            <option value="240">4 Hour</option>
            <option value="D">1 Day</option>
            <option value="W">1 Week</option>
            <option value="M">1 Month</option>
        </select>
    </div>
    <div>
        <p class="info">Name of the currency as in Tradingview to add currencies. Most cryptocurrencies "XXXUSDT" e.g. "BTCUSDT". Stocks and ETFs are also possible.</p>
    </div>

</div>
</template>

<script>
export default {
    name: 'tradingView',
    data() {
        return {
            settings: this.$root.$settings,
            symbols: [],
            selected: this.$root.$settings.tv_candle_time
        }
    },
    created() {
        if (this.$root.$settings.tv) {
            this.symbols = this.$root.$settings.tv
        }
    },
    methods: {
        onChange(event) {
            this.$root.$settings.tv_candle_time = event.target.value
            this.saveLocal('settings', this.$root.$settings)
            this.$parent.$parent.loadTV()
        },
        changeView(index, status) {
            this.$root.$settings['view'][index]['view'] = status
            this.saveLocal('settings', this.$root.$settings)
            let el = document.querySelectorAll('#coinListTable tr td:nth-child(' + (index + 1) + ')')
            let elHead = document.querySelectorAll('#coinListTable tr th:nth-child(' + (index + 1) + ')')[0]
            if (status) {
                Array.from(el)
                    .forEach(function(val) {
                        val.classList.remove('hide')
                        val.classList.add('show')
                    })
                elHead.classList.remove('hide')
                elHead.classList.add('show')
            } else {
                Array.from(el)
                    .forEach(function(val) {
                        val.classList.remove('show')
                        val.classList.add('hide')
                    })
                elHead.classList.remove('show')
                elHead.classList.add('hide')
            }
        },
        save() {
            let val = document.getElementById("insert").value
            let check = false
            this.$root.$settings.tv.forEach((item) => {
                if (item == val) {
                    
                    check = true
                }
            });

            if (val == '' || check) {
                document.getElementById("insert").value = ''

                return
            } else {
                this.symbols.push(val)
                document.getElementById("insert").value = ''
                this.$root.$settings.tv = this.symbols
                this.saveLocal('settings', this.$root.$settings)
                this.$parent.$parent.loadTV()
            }

        },
        deleteSymbol(index) {
            if (this.symbols.length == 0) {
                this.symbols
            }
            this.symbols.splice(index, 1)
            this.$root.$settings.tv = this.symbols
            this.saveLocal('settings', this.$root.$settings)
            this.$parent.$parent.loadTV()

        }
    }
}
</script>

<style lang="css" scoped>
.info{
  width: 100%;
  display: inline-block;
  margin-top: 40px;
  color: white;
  font-size: 18px;

}
.left, .right{
  width: 50%;
}

ul{
    margin-top: 15px;
  list-style: none;
}
li{
  padding: 12px;

}
label{
  color: white;
  padding-left: 5px;
}
input{
  transform: scale(1.3);
  margin-left: 30px;
}
button{
  display: block!important;
  margin-top: 10px;
  margin-left: 5px;
}
li p{
  display: inline-block;
  margin-left: 15px;

}
li i{
  color: darkred
}
li i:hover{
  transform: scale(1.1);
  cursor: pointer;
  color: red
}
li:nth-child(2n){
background-color: white;
}
li:nth-child(2n+1){
background-color: #e2e2e1;
}
</style>
