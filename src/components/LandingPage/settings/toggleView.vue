<template>
<div class="componentHolder">
    <div class="settingsItem">
        <h2>Hide columns</h2>
        <ul>
            <div class="colHolder left">
                <li v-for="(item, index) in computedObj" :key="item.symbol">
                    <label class="switch">
                        <input class="hideCol" type="checkbox" :checked="item.view" @change="changeView(index, $event.target.checked)">
                        <span class="slider round"></span>
                    </label>
                    <p>{{ item.name }}</p>
                </li>
            </div>
            <div class="colHolder right">
                <li v-for="(item, index) in computedObjLast" :key="item.symbol">
                    <label class="switch">
                        <input class="hideCol" type="checkbox" :checked="item.view" @change="changeView(index+7, $event.target.checked)">
                        <span class="slider round"></span>
                    </label>
                    <p>{{ item.name }}</p>
                </li>
            </div>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: 'toggleView',
    data() {
        return {
            settings: this.$parent.$parent.$parent.$parent.$settings,
            limit: 7
        }
    },
    computed: {
        computedObj() {
            return this.limit ? this.$root._data.settings.view.slice(0, this.limit) : this.$root._data.settings.view;
        },
        computedObjLast() {
            return this.limit ? this.$root._data.settings.view.slice(this.limit, this.$root._data.settings.view.length) : this.$root._data.settings.view
        },
    },
    methods: {
        changeView(index, status) {
            this.$root._data.settings['view'][index]['view'] = status;
            this.saveLocal('settings', this.$root._data.settings);
            let el = document.querySelectorAll('#coinListTable tr td:nth-child(' + (index + 1) + ')');
            let elHead = document.querySelectorAll('#coinListTable tr th:nth-child(' + (index + 1) + ')')[0];
            if (status) {
                Array.from(el).forEach(function(val) {
                    val.classList.remove('hide');
                    val.classList.add('show');
                });
                elHead.classList.remove('hide');
                elHead.classList.add('show');
            } else {
                Array.from(el).forEach(function(val) {
                    val.classList.remove('show');
                    val.classList.add('hide');
                });
                elHead.classList.remove('show');
                elHead.classList.add('hide');
            }            
            this.$parent.$parent.forceRerender()
        }
    }
}
</script>

<style lang="scss" scoped>
ul {
    list-style: none;
    display: flex;
}

li {
    margin: 10px;
}

label {
    color: var(--listTextColor);
    padding-left: 5px;
}

input {
    transform: scale(1.5);
    filter: var(--inputActiveFilter);
    background-color: var(--inputActiveBGR);
}

li p {
    color: var(--textColorSettings);
    display: inline-block;
    margin-left: 5px;
    top: 3px;
    position: relative;
}

.colHolder {
    display: inline-block;
}

.left,
.right {
    width: 200px;
}

.right {
    float: left;
}
</style>
