<template>
<div>
    <h2>Purchased coins</h2>
    <table class="table table-striped">
        <thead class="thead-dark">
            <tr>
                <th scope="col">Logo</th>
                <th scope="col">Name</th>
                <th scope="col">Purchased coins</th>
                <th scope="col"><span v-if="fiat==='EUR'"> €</span><span v-else> $</span> Price @ Buy</th>
            </tr>
        </thead>
        <tr class="allBoughtCoins" v-for="item in myCoins" :key="item.symbol">
            <td><img :src="''+item.logo_url" height="20px" /></td>
            <td class="symbol">{{ item.symbol }}</td>
            <td class="ammount"><input ref="numberCoins" type="number" value="" /></td>
            <td class="boughtPrice"><input ref="priceBought" type="number" value="" /></td>
        </tr>
        <button @click="save" class="save">Save</button>
    </table>
</div>
</template>

<script>
export default {
    name: 'boughtCoins',
    data() {
        return {
            myCoins: this.$root.$myCoins,
            tempBoughtCoins: [],
            fiat: this.$root.$settings.fiat,
            boughtCoins: this.$root.$boughtCoins
        }
    },
    methods: {
        save() {
            this.tempBoughtCoins = [];
            this.$root.$myCoins.forEach((item, i) => {
                let tempObj = {};
                tempObj.symbol = item.symbol;
                tempObj.ammount = this.$refs.numberCoins[i].value;
                tempObj.boughtPrice = this.$refs.priceBought[i].value;
                this.tempBoughtCoins.push(tempObj);
            })
            this.$parent.$parent.forceRerender();
            this.$root.$boughtCoins = this.tempBoughtCoins;
            this.saveLocal('boughtCoins', this.tempBoughtCoins);
        }
    },
    mounted() {
        let this2 = this;
        document.querySelectorAll('.allBoughtCoins').forEach(function(item) {
            this2.$root.$boughtCoins.forEach((item2) => {
                if (item.querySelectorAll('.symbol')[0].innerHTML === item2.symbol) {
                    item.querySelectorAll('.ammount')[0].children[0].value = item2.ammount;
                    item.querySelectorAll('.boughtPrice')[0].children[0].value = item2.boughtPrice;
                }
            });
        });
        this.save();
    }
}
</script>

<style lang="scss" scoped>

$baseColor: #565753;
$borderRadius: 10px;
$imageBig: 100px;
$imageSmall: 60px;
$padding: 10px;

table {
    width: 100%;
    border-spacing: 0;
    border-radius: $borderRadius;
    margin: 10px 0;
    max-width: 740px;

    input {
        width: 100px;
        text-align: center;
    }

    button {
        margin-top: 10px;
    }
    
    td,
    th {
        color: darken($baseColor, 10%);
        padding: $padding;
        text-align: center;
    }

    td {
        vertical-align: middle;

    }

    th {
        background-color: lighten($baseColor, 50%);
        font-weight: 300;
    }

    tr {
        &:nth-child(2n) {
            background-color: white;
        }
        &:nth-child(2n+1) {
            background-color: lighten($baseColor, 55%);
        }
    }
}
</style>
