<template>
  <div class="container has-text-centered">
    <div>
      <h1 class="title big-title">Top Cryptocurrency By Price</h1>
      <p class="has-text-grey-light">Amount of cryptocurrencies to show:</p>
      <input type="number" class="input column is-one-fifth input-number" v-model="top" v-on:input="sliceCoins(coins, top)" placeholder="Example: 5">
    </div>
    <div class="card bitcoin-card">
      <div class="card-content has-text-centered" >
        <p class="title">Search</p>
          <input class="input" type="text" v-model="input" v-on:keydown.enter="fetchSingleCoin()" placeholder="Example: BTC">
          <button class="button is-primary" v-on:click="fetchSingleCoin()">See price</button>
          <div>
            <p class="subtitle" v-if="specificCoin.id">{{specificCoin.id}}: ${{specificCoin.price}}</p>
            <p class="subtitle" v-else-if="Object.keys(specificCoin).length === 0">Currency not found</p>
          </div>
        </div>
      </div>
    <div class="card bitcoin-card" v-for="coin in coinsSlices" :key="coin.short">
      <div class="card-content">
        <p class="title">{{coin.long}} ({{coin.short}})</p>
        <p class="subtitle">{{coin.price | toCurrency}}</p>
      </div>
      <p class="subtitle">24 hour change:
        <span v-if="coin.cap24hrChange >= 0" class="growth-plus">{{coin.cap24hrChange}}</span>
        <span v-else class="growth-minus">{{coin.cap24hrChange}}</span>
      </p>
      <router-link :to="{ name: 'Single', params: {id: coin.short} }" class="button">See more</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Single from '../components/Single.vue';

export default {
    name: 'Homepage',
    data: function() {
        return {
            err: '',
            stories: [],
            coins: [],
            coinsSlices: [],
            specificCoin: { init: false },
            input: '',
            top: 5,
        };
    },
    methods: {
        getCoins: function() {
            axios
                .get('http://coincap.io/front')
                .then(result => {
                    result.data.sort(function(a, b) {
                        if (a.price == b.price) return 0;
                        if (a.price > b.price) return -1;
                        if (a.price < b.price) return 1;
                    });
                    this.coins = result.data;
                    this.sliceCoins(this.coins, this.top);
                })
                .catch(err => {
                    this.err = err;
                });
        },
        sliceCoins: function(data, top) {
            this.coinsSlices = data.slice(0, parseInt(top));
        },
        fetchSingleCoin: function() {
            let coinSymbol = this.input.toUpperCase().replace(/ /g, '');
            fetch('http://coincap.io/page/' + coinSymbol)
                .then(response => response.json())
                .then(data => {
                    this.specificCoin = data;
                });
        },
    },
    created: function() {
        this.getCoins();
    },
    components: {
        appSingle: Single,
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

</style>
