<template>
<div class="componentHolder">
    <article class="leaderboard">
        <header>
            <h2 class="leaderboard__title">Alerts</h2>
        </header>
        <main class="leaderboard__profiles">
            <ul class="allAlertsList">
                <li v-for="item, index2 in this.$root._data.alerts" :key="item.symbol">
                    <article class="leaderboard__profile shadow">
                        <div @click.stop="toggle2(item.id)" class="leaderboard__contents">
                            <img class="leaderboard__picture" :src="''+item.logo" height="20px" />
                            <span class="leaderboard__name">{{ item.name }}</span>
                            <span class="leaderboard__value" :class="'price-'+item.id">{{ checkPrice(index2) }}<span v-if="fiat==='EUR'">€</span><span v-else>$</span></span>
                        </div>
                        <div :class="'singleHolder singleHolder-'+item.id">
                            <table class="table table-striped insideAlertSingle">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">Alert Price</th>
                                        <th scope="col">Active</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody :class="'allAlerts allAlerts-'+item.id">
                                    <tr v-for="(item2, index) in item.alerts" :key="item2.id">
                                        <td class="alertPrice">
                                            <input @change="save(item.id, index2)" v-on:keyup.enter="save(item.id, index2)" type="number" :class="'form__field alertPrice-'+item.id" ref="alPrice" placeholder="Alert @ Price" :name="'name-'+item.id"
                                                :value="item2.price" /></td>
                                        <td class="alertActive">
                                            <label class="switch">
                                                <input :class="'sliderActive activeAlert-'+item.id" ref="alActive" type="checkbox" :checked="item2.active" @change="save(item.id, index2)" />
                                                <span class="slider round"></span>
                                            </label>
                                            <i v-show="loadingEnd" class="fas fa-check"></i>
                                        </td>
                                        <td class="delAlert"><img class="trashSVG" @click.stop="delSingleAlert(item.id, index)" :src="require(`../../../assets/delete.svg`)" height="26px" width="26px" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="save">
                                <i class="fas fa-check"></i>
                                <span> Saved</span>
                            </div>
                            <v-tooltip bottom content-class='custom-tooltip plus-tooltip'>
                                <template v-slot:activator="{ on, attrs }">
                                    <i class="fas fa-plus-circle add" @click="add(item.id)" v-bind="attrs" v-on="on"></i>
                                </template>
                                <span class="tooltipText">Add a new Alert</span>
                            </v-tooltip>
                        </div>
                    </article>
                </li>
            </ul>
        </main>
    </article>
</div>
</template>

<script>
export default {
    name: 'alertsCoins',
    data() {
        return {
            loadingEnd: false,
            fiat: this.$root._data.settings.fiat,
            alerts: this.$root._data.alerts
        }
    },
    methods: {
        checkPrice(index) {
            return this.$root._data.myCoins[index].price;
        },
        save(id, index) {
            let obj = this.$root._data.alerts.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            let alertPrice = document.querySelectorAll('.alertPrice-' + id);
            let activeAlert = document.querySelectorAll('.activeAlert-' + id);
            let price = document.querySelectorAll('.price-' + id);
            let tempArr = []
            alertPrice.forEach((item, i) => {
                let direction
                if (parseFloat(item.value.replace(/,/g, ".")) > parseFloat(price[0].innerHTML.replace(/,/g, "."))) {
                    direction = "bigger";
                } else {
                    direction = "smaller";
                }
                let fin = {
                    "price": item.value == "" ? 0 : item.value,
                    "active": activeAlert[i].checked,
                    "direction": direction
                }
                tempArr.push(fin);
            });
            obj[0].alerts = tempArr;
            this.saveLocal('alerts', this.$root._data.alerts);
            document.getElementsByClassName("save")[index].style.display = 'block';
            setTimeout(() => {
                document.getElementsByClassName("save")[index].style.display = 'none';
            }, 1500)
        },
        delSingleAlert(id, index) {
            let obj = this.$root._data.alerts.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            if (obj[0].alerts.length == 1) {
                obj[0].alerts = [{
                    "price": "0",
                    "active": false,
                    "direction": ""
                }]
            } else {
                obj[0].alerts.splice(index, 1);
            }
            this.saveLocal('alerts', this.$root._data.alerts);
        },
        add(id) {
            let obj = this.$root._data.alerts.filter(obj => Object.keys(obj).some(key => obj[key].includes(id)));
            obj[0].alerts.push({
                "price": "0",
                "active": false,
                "direction": ""
            });
        },
        toggle2(id) {
            let holder = document.querySelector('.singleHolder-' + id).style.display;
            if (holder == 'block') {
                document.querySelector('.singleHolder-' + id).style.display = 'none';
            } else {
                document.querySelector('.singleHolder-' + id).style.display = 'block';
            }
        },
        alertValue(index) {
            if (this.$root._data.alerts.length > 0) {
                return this.$root._data.alerts[index].price;
            } else {
                return "";
            }
        },
        alertsCheck(index) {
            if (this.$root._data.alerts.length > 0) {
                return this.$root._data.alerts[index].active;
            } else {
                return false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>



</style>
