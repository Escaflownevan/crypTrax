<template>
<div class="news">
    <div class="quickMenu" >
        <v-dialog  v-model="manageFeeds" width="550">
          <template v-slot:activator="{ on, attrs }">
                 <i v-bind="attrs" v-on="on" class="fas fa-plus-circle"></i>

          </template>
          <v-card>
              <h1>News Feeds</h1>
              <div class="newsAdd">
                <v-autocomplete v-model="favNews" :items="allUrls" filled label="News" chips deletable-chips small-chips multiple item-text="name" return-object class="newsSources">
                  <template v-slot:item="{ item }">
                    {{item.name}}
                  </template>
                </v-autocomplete>

              </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="manageFeeds = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

    </div>
  <div v-for="(item, index) in favNews" :key="index" class="feedHolder settingsHolderExtra" :id="'rss-'+item.name">
    <VueRssFeed :id="item.name" :feedUrl="item.url" :name="item.name" :limit="item.limit" />
    <v-btn @click="increaseLimit(item.name)">More</v-btn>
  </div>
  <div v-if="favNews.length == 0" class="widthFull">
 <h1>Please add News Feeds <br><i @click="manageFeeds = true" class="fas fa-plus-circle"></i></h1>
  </div>

</div>
</template>

<script>
import VueRssFeed from "vue-rss-feed";
export default {
  name: 'newsPage',
  components: {
    VueRssFeed
  },
  data() {
    return {
    manageFeeds: false,
      favUrls: [],
      allUrls: [{
        url: 'https://cointelegraph.com/rss',
        name: 'Cointelegraph.com',
        limit: 4
      }, {
        url: 'https://www.newsbtc.com/feed/',
        name: 'Newsbtc.com',
        limit: 4
      }, {
        url: 'https://news.bitcoin.com/feed/',
        name: 'Bitcoin.com',
        limit: 4
      }, {
        url: 'https://coincodecap.com/category/news/feed/gn',
        name: 'Coincodecap.com',
        limit: 4
      }, {
        url: 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml',
        name: 'Coindesk.com',
        limit: 4
      },
      {
        url: 'https://cryptopotato.com/feed',
        name: 'CryptoPotato.com',
        limit: 4
      },
      {
        url: 'https://u.today/rss',
        name: 'U.Today.com',
        limit: 4
      },
      {
        url: 'https://cryptoslate.com/feed/',
        name: 'Cryptoslate.com',
        limit: 4
      },
      {
        url: 'https://bitcoinik.com/feed/',
        name: 'Bitcoinik.com',
        limit: 4
      },
      {
        url: 'https://thenewscrypto.com/feed/',
        name: 'Thenewscrypto.com',
        limit: 4
      },
      {
        url: 'https://cryptoadventure.com/feed/',
        name: 'Cryptoadventure.com',
        limit: 4
      },
      {
        url: 'https://crypto-economy.com/feed/',
        name: 'Crypto-economy.com',
        limit: 4
      },
      {
        url: 'https://cryptonews.com.au/feed/',
        name: 'Cryptonews.au',
        limit: 4
      },
      {
        url: 'https://coinpedia.org/feed/',
        name: 'Coinpedia.org',
        limit: 4
      },
      {
        url: 'https://bitcoinist.com/feed/',
        name: 'Bitcoinist.net',
        limit: 4
      },
       {
        url: 'https://coinjournal.net/news/feed/',
        name: 'Coinjournal.net',
        limit: 4
      }, {
        url: 'https://de.cointelegraph.com/rss',
        name: 'Cointelegraph.de',
        limit: 4
      }, {
        url: 'https://www.btc-echo.de/feed/',
        name: 'BTC-Echo.de',
        limit: 4
      }, {
        url: 'https://coin-hero.de/news/feed/',
        name: 'Coin-hero.de',
        limit: 4
      }, {
        url: 'https://www.bitcoinmag.de/news/feed',
        name: 'Bitcoinmag.de',
        limit: 4
      }]
    }
  },
  mounted() {
    this.$store.dispatch('resetFavNewsLimit')
  },
  computed: {
    favNews: {
      get() {
        return this.$store.state.favNews
      },
      set(value) {
        this.$store.dispatch('updateFavNews', value)
      }
    }
  },
  methods: {
    increaseLimit(name) {
      this.$store.dispatch('updateFavNewsLimit', name)
    }

  }
}
</script>

<style lang="scss">
.feedHolder {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
    margin-bottom: 20px;
    text-align: center;
}
.articles-container {
    display: inline-flex;
    flex-wrap: wrap;
}
.articles-container .article:nth-child(odd){
    margin-right: 10px;
}
.articles-container .article{
    width: 49%;
}
.articles-container .content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
}
.articles-container img {
    height: 50px;
    width: auto;
    float: left;
    margin-right: 5px;

}
.articles-container .title a {
    color: var(--primaryColor);
}
.articles-container .content a {
    pointer-events: none;
    color: black;
    text-decoration: none;
}
.articles-container .content a:hover {
    cursor: default;
}
.news h3 {
    color: black;
}

.newsSources{
    width: 80%;
    max-width: 800px;
    margin: 0 auto!important;
}
.news .theme--light.v-label{
    top: 10px!important;
}
.newsAdd .v-input__slot{
    background-color: var(--settingsBGR)!important
}
</style>
