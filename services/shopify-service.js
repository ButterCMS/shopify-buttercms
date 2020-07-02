const ShopifyAuthAPI = require("shopify-node-api");
const ShopifyAPI = require("shopify-api-node");

class ShopifyService {
  constructor() {
    this.shops = {};
  }

  install(shopOptions) {
    let shop = this.shops[shopOptions.shop];

    if (!shop) {
      shop = new ShopifyAuthAPI({
        shop: shopOptions.shop,
        shopify_api_key: shopOptions.shopify_api_key,
        shopify_shared_secret: shopOptions.shopify_shared_secret,
        shopify_scope: shopOptions.shopify_scope,
        redirect_uri: shopOptions.redirect_uri,
        nonce: shopOptions.nonce,
        verbose: false
      });
      this.shops[shopOptions.shop] = shop;
    }

    return shop;
  }

  uninstall(shopName) {
    delete this.shops[shopName];
  }

  getShop(shopName) {
    return this.shops[shopName];
  }

  static exchangeTemporaryToken(shop, query) {
    return new Promise((resolve, reject) => {
      shop.exchange_temporary_token(query, (err, data) => {
        if (err) {
          return reject(Error(err));
        }
        return resolve(data);
      });
    });
  }

  static subscribeToProductUpdateWebhook(shop, address) {
    const params = {
      topic: "products/update",
      address,
      format: "json"
    };

    const shopify = new ShopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token
    });
    return shopify.webhook.create(params);
  }

  static subscribeToUninstallWebHook(shop, address) {
    const params = {
      topic: "app/uninstalled",
      address,
      format: "json"
    };
    const shopify = new ShopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token
    });
    return shopify.webhook.create(params);
  }

  static createPage(shop, pageOptions) {
    const shopify = new ShopifyAPI({
      shopName: shop.config.shop,
      accessToken: shop.config.access_token
    });
    return shopify.page.create(pageOptions);
  }
}

module.exports = { ShopifyService };
