<template>
<div>
    <h2>Hide columns</h2>
    <ul>
        <li v-for="(item, index) in this.$root.$settings.view" :key="item.symbol">
            <input type="checkbox" :name="item.name" :checked="item.view" @change="changeView(index, $event.target.checked)" /><label :for="item.name"> {{ item.name }}</label>

        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'toggleView',
    data() {
        return {
            settings: this.$parent.$parent.$parent.$parent.$settings
        }
    },
    methods: {
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

        }
    }
}
</script>

<style lang="css" scoped>
ul{
  list-style: none;
}
li{
  margin: 10px;
}
label{
  color: white;
  padding-left: 5px;
}
input{
  transform: scale(1.5);
  filter: invert(100%);
}
</style>
