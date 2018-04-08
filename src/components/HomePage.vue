<template>
  <div class="container has-text-centered">
    <div class="section">
        <h1 class="title big-title has-text-white gradient-title"><span>Top Cryptocurrency By {{selectedOutput}}</span></h1>
    </div>
    <div class="container box">
        <div class="columns">
            <div class="column">
                    <p class="title">Search</p>
                    <div class="field has-addons input-addon">
                        <div class="control">
                            <input class="input" type="text" v-model="input" v-on:keydown.enter="searchSingleCoin()" placeholder="Example: BTC">
                        </div>
                        <div class="control">
                            <button class="button is-primary" v-on:click="searchSingleCoin()">Search</button>
                        </div>
                    </div>
            </div>
            <div class="column">
                    <p class="title">Sort all by</p>
                    <div class="control input-center">
                        <div class="select">
                            <select
                            id="priority"
                            v-model="selectedSort"
                            @change="getCoins">
                                <option 
                                v-for="sort in sortOptions" 
                                :key="sort.value"
                                :value="sort.value">{{sort.output}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            <div class="column">
                <p class="title">Amount</p>
                <input type="number" class="input input-center input-reset" v-model="top" v-on:input="sliceCoins(coins, top)" placeholder="Example: 5">
            </div>
        </div>
        <div class="columns coin-container">
            <div class="column coin-list-container">
                <div v-for="coin in coinsSlices" :key="coin.short" class="bitcoin-card">
                    <router-link :to="{ name: 'Single', params: {id: coin.short} }">
                    <div >
                        <div class="card-content">
                            <p class="title">{{coin.long}} ({{coin.short}})</p>
                            <p class="subtitle">{{coin.price | toCurrency}}</p>
                        </div>
                        <p class="subtitle">24 hour change:
                            <span v-if="coin.cap24hrChange >= 0" class="growth-plus">{{coin.cap24hrChange | toCurrency}}</span>
                            <span v-else class="growth-minus">{{coin.cap24hrChange | toCurrency }}</span>
                        </p>
                        </div>
                    </router-link>
                </div>
            </div>
            <div class="column is-two-thirds">
                <router-view :key="$route.name + ($route.params.id || '')"/>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

import Single from '../components/Single.vue';
import router from '../router';

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
            top: 15,
            sortOptions: [
                {
                    value: 'price',
                    output: 'Price',
                },
                {
                    value: 'supply',
                    output: 'Supply',
                },
                {
                    value: 'volume',
                    output: 'Volume',
                },
                {
                    value: 'cap24hrChange',
                    output: '24 Hour Change',
                },
            ],
            selectedSort: 'volume',
            selectedOutput: 'Volume',
        };
    },
    methods: {
        getCoins: function() {
            var self = this;
            fetch('http://coincap.io/front/')
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(data => {
                    data.sort(function(a, b) {
                        if (a[self.selectedSort] == b[self.selectedSort])
                            return 0;
                        if (a[self.selectedSort] > b[self.selectedSort])
                            return -1;
                        if (a[self.selectedSort] < b[self.selectedSort])
                            return 1;
                    });
                    this.coins = data;
                    this.sliceCoins(this.coins, this.top);
                })
                .catch(function(error) {
                    console.log('Error fetching data: ', error.message);
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
        searchSingleCoin: function() {
            const coinSymbol = this.input.toUpperCase().replace(/ /g, '');
            if (coinSymbol.length === 0) return;
            router.push({ name: 'Single', params: { id: coinSymbol } });
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
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
            });
            return formatter.format(value);
        },
    },
    watch: {
        selectedSort: function() {
            for (let i = 0; i < this.sortOptions.length; i++) {
                if (this.sortOptions[i].value == this.selectedSort) {
                    this.selectedOutput = this.sortOptions[i].output;
                }
            }
        },
    },
};
</script>

<style scoped>
.coin-container {
    display: flex;
}

.coin-list-container {
    min-height: 400px;
    height: 100%;
    max-height: 800px;
}

@media (max-width: 600px) {
    .gradient-title {
        width: 80%;
        font-size: 2rem;
    }
    .coin-container {
        flex-direction: column;
        min-height: 600px;
        border-top: 1px solid #f7f7f7;
    }
    .coin-list-container {
        border-top: 1px solid #f7f7f7;
        order: 1;
    }
}
.coin-list-container {
    overflow-y: scroll;
}

.coin-list-container::-webkit-scrollbar {
    width: 0.25em;
}

.coin-list-container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.coin-list-container::-webkit-scrollbar-thumb {
    background-color: #9795f0;
    outline: 1px solid slategrey;
}
</style>
