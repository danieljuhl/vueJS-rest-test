<template>
    <div class="modal" :style="{display: isDisplayed}">
      <div class="modal-content">
        <div v-if="!isLoading">
          <div class="card-content">
            <p class="title">{{ coin.display_name }}</p>
            <p class="subtitle">{{ coin.id }}</p>
          </div>
          <p class="subtitle">
            Market Cap: {{coin.market_cap | toCurrency}}
          </p>
          <p class="subtitle">
            Supply: {{coin.supply | toCurrency}}
          </p>
          <p class="subtitle">
            24 Hour Volume: {{coin.volume | toCurrency}}
          </p>
          <button class="button is-primary" @click="$router.go(-1)">Close</button>
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
        };
    },
    created: function() {
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
        this.isDisplayed = 'block';
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
.modal {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 400px;
}
</style>