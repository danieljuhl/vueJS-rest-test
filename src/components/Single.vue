<template>
    <div>
      <div>
        <div v-if="!isLoading && Object.keys(coin).length !== 0">
          <div class="card-content">
            <p class="title">{{ coin.display_name }}</p>
            <p class="subtitle">{{ coin.id }} (Rank: {{ coin.rank }})</p>
          </div>
          <p class="subtitle">
            <strong>Price:</strong> {{coin.price | toCurrency}}
          </p>
          <p class="subtitle">
            <strong>Supply:</strong> {{coin.supply | toCurrency}}
          </p>
          <p class="subtitle">
            <strong>Market Cap:</strong> {{coin.market_cap | toCurrency}}
          </p>
          <p class="subtitle">
            <strong>24 Hour Volume:</strong> {{coin.volume | toCurrency}}
          </p>
          <button @click="showChart" class="button is-primary chart-button">Show Chart</button>
          <canvas id="chartBox" ref="chart"></canvas>
        </div>
        <div v-else-if="isLoading">
          <div class="card-content">
            <object data="static/spinner.svg" type="image/svg+xml">
              <img src="static/spinner.gif">
            </object>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Single',
    data: function() {
        return {
            coin: {},
            isDisplayed: 'none',
            isLoading: true,
            market_cap: [],
        };
    },
    mounted: function() {
        axios
            .get('http://coincap.io/page/' + this.$route.params.id)
            .then(res => {
                this.isLoading = false;
                this.coin = res.data;
            })
            .catch(err => {
                this.isLoading = false;
                console.log(err);
            });
        axios
            .get('http://coincap.io/history/1day/' + this.$route.params.id)
            .then(res => {
                this.market_cap = res.data;
            })
            .catch(err => {
                console.log(err);
            });
        this.isDisplayed = 'block';
        // this.$nextTick(function() {
        //   Auto show chart
        // });
    },
    methods: {
        showChart: function() {
            let ar = [];
            const priceData = this.market_cap.price;
            for (let i = 0; i + 1 < priceData.length; i++) {
                priceData[i][0];
                ar.push({ x: priceData[i][0], y: priceData[i][1] });
            }
            var data = ar;
            let myChart = new Chart(this.$refs.chart, {
                responsive: true,
                type: 'line',
                data: {
                    datasets: [
                        {
                            data: data,
                            borderColor: '#9795f0',
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        xAxes: [
                            {
                                type: 'time',
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                            },
                        ],
                    },
                    legend: false,
                },
            });
        },
    },
    filters: {
        toCurrency: function(value) {
            if (typeof value !== 'number') {
                return value;
            }
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
            });
            return formatter.format(value);
        },
    },
};
</script>

<style scoped>
.chart-button {
    margin: 0 auto;
    display: block;
}
</style>