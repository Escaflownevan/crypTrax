<template>
<div id="portfolioHolder">
    <div class="chartHolder">
        <div id="apex-chart-total"></div>
        <div id="apex-chart-pl"></div>
        <div id="apex-chart-roi"></div>
    </div>
</div>
</template>

<script>
import ApexCharts from 'apexcharts'
export default {
    data: function() {
        return {
            fiat: this.$root._data.settings.fiat,
            chartTotal: {},
            chartPL: {},
            chartROI: {},
            optionsTotal: {
                series: this.calcPercentageTotal(),
                chart: {
                    type: 'donut',
                    id: 'apex-chart-total',
                    width: '100%'
                },
                noData: {
                    text: 'Please add holdings via Settings -> Portfolio',
                    align: 'center',
                    verticalAlign: 'top',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
                        fontSize: '30px'
                    }
                },
                labels: this.findLabels(),
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        colors: ["#000"]
                    },
                    dropShadow: {
                        enabled: false
                    }
                },
                fill: {
                    type: 'gradient'
                },
                legend: {
                    position: 'top',
                    onItemClick: {
                        toggleDataSeries: true
                    },
                    labels: {
                        colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                    },
                    itemMargin: {
                        vertical: 20
                    }
                },
                title: {
                    text: 'Total Value',
                    align: 'center',
                    style: {
                        fontSize: '26px',
                        fontWeight: 'bold',
                        color: '#999'
                    }
                },
                tooltip: {
                    custom: function({
                        series,
                        seriesIndex,
                        w
                    }) {
                        let fiat
                        if (w.config.subtitle.text == "EUR") {
                            fiat = "€"
                        } else {
                            fiat = "$"
                        }
                        return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
                            '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' ' + fiat + '</span></div></div>'
                    }
                },
                plotOptions: {
                    pie: {
                        startAngle: -90,
                        endAngle: 270,
                         expandOnClick: false,
                        donut: {
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    offsetY: -10
                                },
                                value: {
                                    show: true,
                                    fontSize: '22px',
                                    color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
                                    offsetY: 16,
                                    formatter: function(val, w) {
                                        let fiat
                                        if (w.config.subtitle.text == "EUR") {
                                            fiat = "€"
                                        } else {
                                            fiat = "$"
                                        }
                                        return val + " " + fiat
                                    }
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    fontSize: '22px',
                                    color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
                                    formatter: function(w) {
                                        let fiat
                                        if (w.config.subtitle.text == "EUR") {
                                            fiat = "€"
                                        } else {
                                            fiat = "$"
                                        }
                                        return w.globals.seriesTotals.reduce((a, b) => {
                                            let one = parseFloat(a).toFixed(2)
                                            let two = parseFloat(b).toFixed(2)
                                            let res = parseFloat(one) + parseFloat(two)
                                            return parseFloat(res).toFixed(2) + " " + fiat
                                        }, 0)
                                    }
                                }
                            }
                        }
                    }
                },
                subtitle: {
                    text: this.$root._data.settings.fiat,
                    style: {
                        fontSize: '0px'
                    }
                }
            },
            optionsPL: {
                series: this.calcPercentagePL(),
                chart: {
                    type: 'bar',
                    id: 'apex-chart-pl',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '100%'
                    }
                },
                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                    custom: function({
                        series,
                        seriesIndex,
                        w
                    }) {
                        let fiat
                        if (w.config.subtitle.text == "EUR") {
                            fiat = "€"
                        } else {
                            fiat = "$"
                        }
                        return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
                            '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' ' + fiat + '</span></div></div>'
                    }
                },
                yaxis: {
                    title: {
                        text: this.$root._data.settings.fiat,
                        style: {
                            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    },
                    labels: {
                        formatter: function(y) {
                            return y.toFixed(0);
                        },
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                },
                xaxis: {
                    type: 'text',
                    categories: this.findLabels(),
                    labels: {
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                },
                legend: {
                    position: 'top',
                    offsetY: -15,
                    labels: {
                        colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                    },
                },
                title: {
                    text: 'Profit | Loss',
                    align: 'center',
                    style: {
                        fontSize: '26px',
                        fontWeight: 'bold',
                        color: '#999'
                    }
                },
                subtitle: {
                    text: this.$root._data.settings.fiat,
                    style: {
                        fontSize: '0px'
                    }
                }
            },
            optionsROI: {
                series: this.calcPercentageROI(),
                chart: {
                    type: 'bar',
                    id: 'apex-chart-roi',
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '100%'
                    }
                },
                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                    custom: function({
                        series,
                        seriesIndex,
                        w
                    }) {
                        return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
                            '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' %</span></div></div>'
                    }
                },
                yaxis: {
                    title: {
                        text: '%',
                        style: {
                            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    },
                    labels: {
                        formatter: function(y) {
                            return y.toFixed(0);
                        },
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                },
                xaxis: {
                    type: 'text',
                    categories: this.findLabels(),
                    labels: {
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                },
                legend: {
                    position: 'top',
                    offsetY: -15,
                    labels: {
                        colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                    },
                },
                title: {
                    text: 'Return on Investment (ROI)',
                    align: 'center',
                    style: {
                        fontSize: '26px',
                        fontWeight: 'bold',
                        color: '#999'
                    }
                },
                subtitle: {
                    text: this.$root._data.settings.fiat,
                    style: {
                        fontSize: '0px'
                    }
                }
            }
        }
    },
    mounted() {
        this.chartTotal = new ApexCharts(document.querySelector("#apex-chart-total"), this.optionsTotal);
        this.chartTotal.render()
        this.chartPL = new ApexCharts(document.querySelector("#apex-chart-pl"), this.optionsPL);
        this.chartPL.render()
        this.chartROI = new ApexCharts(document.querySelector("#apex-chart-roi"), this.optionsROI);
        this.chartROI.render()
    },
    methods: {
        updateData() {
            let newOptions = {
                labels: this.findLabels(),
                legend: {
                    labels: {
                        colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                value: {
                                    color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                                },
                                total: {
                                    color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                                }
                            }
                        }
                    }
                },
                subtitle: {
                    text: this.$root._data.settings.fiat
                },
                yaxis: {
                    title: {
                        text: this.$root._data.settings.fiat,
                        style: {
                            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    },
                    labels: {
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                },
                xaxis: {
                    categories: this.findLabels(),
                    labels: {
                        style: {
                            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
                        }
                    }
                }
            }
            newOptions.series = this.calcPercentageTotal();
            this.chartTotal.updateOptions(newOptions, true);
            newOptions.series = this.calcPercentagePL();
            this.chartPL.updateOptions(newOptions, true);
            newOptions.series = this.calcPercentageROI();
            newOptions.yaxis[0].title.text = "%";
            this.chartROI.updateOptions(newOptions, true);
        },
        findLabels() {
            let obj = this.$root._data.boughtCoins;
            let temp = []
            obj.forEach((item) => {
                item.purchases.forEach((item2) => {
                    if (item2[0] != 0) {
                        if (!temp.includes(item.name)) {
                            temp.push(item.name)
                        }
                    }
                });
            })
            return temp
        },
        calcPercentageTotal() {
            let obj = this.$root._data.boughtCoins;
            let temp = []
            obj.forEach((item, i) => {
                let res = 0
                item.purchases.forEach((item2) => {
                    if (item2[0] != 0) {
                        let price = item2[0] * this.$root._data.myCoins[i].price;
                        res += price
                    }
                });
                if (res != 0) {
                    temp.push(parseFloat(res.toFixed(2)))
                }
            });
            return temp
        },
        calcPercentagePL() {
            let obj = this.$root._data.boughtCoins
            let temp = [];
            obj.forEach((item, i) => {
                let resAll = 0
                item.purchases.forEach((item2) => {
                    let ammount = item2[0];
                    let boughtPrice = item2[1];
                    if (ammount > 0) {
                        if (boughtPrice == 0) {
                            let res = ammount * this.$root._data.myCoins[i].price
                            if (this.$root._data.settings.taxes.active && res > 0) {
                                res = res - (this.$root._data.settings.taxes.percentage / 100) * res;
                                resAll += res
                            } else {
                                resAll += res
                            }
                        } else {
                            let a = ammount * boughtPrice;
                            let b = ammount * this.$root._data.myCoins[i].price;
                            let res = b - a
                            if (this.$root._data.settings.taxes.active && res > 0) {
                                res = res - (this.$root._data.settings.taxes.percentage / 100) * res;
                                resAll += res
                            } else {
                                resAll += res
                            }
                        }
                    }
                });
                if (resAll != 0) {
                    let obj = {
                        name: item.name,
                        data: [parseFloat(resAll.toFixed(2))]
                    }
                    temp.push(obj);
                }
            });
            return temp;
        },
        calcPercentageROI() {
            let obj = this.$root._data.boughtCoins
            let temp = [];
            obj.forEach((item, i) => {
                let resAll = 0
                item.purchases.forEach((item2) => {
                    let ammount = item2[0];
                    let boughtPrice = item2[1];
                    if (ammount > 0) {
                        if (boughtPrice == 0) {
                            let res = (ammount * this.$root._data.myCoins[i].price) * 100
                            if (this.$root._data.settings.taxes.active && res > 0) {
                                res += res - (this.$root._data.settings.taxes.percentage / 100) * res;
                                resAll += res
                            } else {
                                res += res;
                                resAll += res
                            }
                        } else {
                            let a = ammount * boughtPrice;
                            let b = ammount * this.$root._data.myCoins[i].price;
                            let netto = b - a
                            if (this.$root._data.settings.taxes.active && netto > 0) {
                                netto = netto - (this.$root._data.settings.taxes.percentage / 100) * netto;
                            }
                            let res = (netto / a) * 100
                            resAll += res
                        }
                    }
                });
                if (resAll != 0) {
                    let obj = {
                        name: item.name,
                        data: [parseFloat(resAll.toFixed(2))]
                    }
                    temp.push(obj);
                }
            });
            return temp;
        }
    }
};
</script>

<style lang="scss" scoped>
h2 {
    text-align: center;
}
#portfolioHolder {
    width: 100%;
    height: 100%;
    padding: 0 14%;
    z-index: 5;
    position: absolute;
    top: 85px;
    background-color: var(--bodyBGR);
    overflow-y: auto;
    padding-bottom: 120px;
}

.chartHolder {
    margin: 0 auto;
}

.chartHolder {
    max-width: 600px;
}
.apexcharts-tooltip.apexcharts-theme-dark {
    background: #f3f3f3;
    color: orange;
}
.chartHolder > div:last-child {
    margin-top: 80px;
}
</style>
