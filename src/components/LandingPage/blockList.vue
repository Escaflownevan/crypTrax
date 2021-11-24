<template>
<div id="holderIframes" class="section group">
</div>
</template>

<script>
export default {
    name: 'blockList',
    data() {
        return {
            settings: this.$root.$settings
        }
    },
    mounted() {
        this.$parent.loadTV();
    }
}
</script>

<style lang="css" >

h1{
    text-align: center;
    margin-top: 60px;
}

.noList{
    position: absolute;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 20%
}
.noListArrow{
    position: absolute;
    top: 20px;
    right: 100px;
    color: #ff9400fc;
    font-size: 40px;
}

@keyframes bounceRight {
  0%,
  20%,
  50%,
  80%,
  100% {
    -ms-transform: translateX(0);
    transform: translateX(0);
  }
  40% {
    -ms-transform: translateX(-30px);
    transform: translateX(-30px);
  }
  60% {
    -ms-transform: translateX(-15px);
    transform: translateX(-15px);
  }
}

.fa-arrow-right {
  -webkit-animation: bounceRight 2s infinite;
  animation: bounceRight 2s infinite;
  float:right;
}

iframe{
  width: 100%;
  height: 400px;
}

.section {
	clear: both;
	padding: 0px;
	margin: 0px;
}

.col {
	display: block;
	float:left;
	margin: 1% 0 1% 1.6%;
}

.col:nth-child(odd) {
    margin-left: 0;
}

.col:nth-child(even) {
    padding-right: 15px;
}

.group:before,
.group:after {
    content:"";
    display:table;
}
.group:after {
    clear:both;
}
.group {
zoom:1; /* For IE 6/7 */
}

.span_1_of_3 {
    width: 49%;
}

@media only screen and (max-width: 600px) {
	.col {
        margin: 1% 0 1% 0%;
    }

	.span_1_of_3 {
        width: 100%;
    }
}
</style>
