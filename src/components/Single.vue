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
import 'whatwg-fetch';

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
        fetch('http://coincap.io/page/' + this.$route.params.id)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                this.isLoading = false;
                this.coin = data;
            })
            .catch(function(error) {
                this.isLoading = false;
                console.log('Error fetching data: ', error.message);
            });

        fetch('http://coincap.io/history/7day/' + this.$route.params.id)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                this.market_cap = data;
            })
            .catch(function(error) {
                console.log('Error fetching data: ', error.message);
            });
        this.isDisplayed = 'block';
        // this.$nextTick(function() {
        //   Auto show chart
        // });
    },
    methods: {
        showChart: function() {
            let timelineArray = [];
            const priceData = this.market_cap.price;
            // 1. remove latest data point to prevent gap
            // 2. convert data to fit chart
            for (let i = 0; i + 1 < priceData.length; i++) {
                timelineArray.push({ x: priceData[i][0], y: priceData[i][1] });
            }
            let myChart = new Chart(this.$refs.chart, {
                responsive: true,
                type: 'line',
                data: {
                    datasets: [
                        {
                            data: timelineArray,
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