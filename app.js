const app = new Vue({
  el: "#app",
  data: {
    coins: [],
    coinsSlices: [],
    specificCoin: { init: false },
    input: "",
    refresh: "",
    top: 5
  },
  methods: {
    sliceCoins: function(data, top) {
      this.coinsSlices = data.slice(0, parseInt(top));
    },
    getCoins: function() {
      fetch("http://coincap.io/front")
        .then(response => response.json())
        .then(data => {
          data.sort(function(a, b) {
            if (a.price == b.price) return 0;
            if (a.price > b.price) return -1;
            if (a.price < b.price) return 1;
          });
          this.coins = data;
          this.sliceCoins(this.coins, this.top);
        });
    },
    fetchSingleCoin: function(input) {
      coinSymbol = input.toUpperCase().replace(/ /g, "");
      fetch("http://coincap.io/page/" + coinSymbol)
        .then(response => response.json())
        .then(data => {
          this.specificCoin = data;
        })
        .catch(error => {
          this.specificCoin = { error: true };
        });
    }
  },
  created: function() {
    this.getCoins();
    this.refresh = setInterval(
      function() {
        this.getCoins();
      }.bind(this),
      600000
    );
  },
  destroyed: function() {
    //clear interval if component is destroyed
    clearInterval(this.refresh);
  },
  template: `
  <div class="container has-text-centered">
    <div>
      <h1 class="title big-title">Top Cryptocurrency By Price</h1>
      <p class="has-text-grey-light">Amount of cryptocurrencies to show:</p>
      <input type="number" class="input column is-one-fifth input-number" v-model="top" v-on:input="sliceCoins(coins, top)" placeholder="Example: 5">
    </div>
    <div class="card bitcoin-card">
      <div class="card-content has-text-centered" >
        <p class="title">Search</p>
          <input class="input" type="text" v-model="input" v-on:keydown.enter="fetchSingleCoin(input)" placeholder="Example: BTC">
          <button class="button is-primary" v-on:click="fetchSingleCoin(input)">See price</button>
          <div>
            <p class="subtitle" v-if="specificCoin.id">{{specificCoin.id}}: $\{{specificCoin.price}}</p>
            <p class="subtitle" v-else-if="Object.keys(specificCoin).length === 0">Currency not found</p>
          </div>
        </div>
      </div>
    <div class="card bitcoin-card" v-for="coin in coinsSlices">
      <div class="card-content">
        <p class="title">{{coin.long}} ({{coin.short}})</p>
        <p class="subtitle">$\{{coin.price}}</p>
      </div>
      <p class="subtitle">24 hour change:
        <span v-if="coin.cap24hrChange >= 0" class="growth-plus">{{coin.cap24hrChange}}</span>
        <span v-else class="growth-minus">{{coin.cap24hrChange}}</span>
      </p>
    </div>
  </div>
`
});
