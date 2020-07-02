require("dotenv").config();
const nonce = require("nonce")();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hmacValidity = require("shopify-hmac-validation");
const mustache = require("mustache");

const { ShopifyService } = require("./services/shopify-service");
const { ButterCMSService } = require("./services/butter-cms-service");

const shopifyService = new ShopifyService();
const butterCMSService = new ButterCMSService();

const forwardingAddress = process.env.APP_URL;
const appConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: "read_products,read_product_listings,write_content"
};

function verifyRequest(req, res, next) {
  try {
    if (!hmacValidity.checkHmacValidity(appConfig.apiSecret, req.query)) {
      throw Error("Unauthorized");
    }

    const shop = shopifyService.getShop(req.query.shop);
    if (!shop) {
      throw new Error("Shop not found");
    }
    res.locals.shop = shop;
    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function verifyWebhookRequest(req, res, next) {
  try {
    if (
      !hmacValidity.checkWebhookHmacValidity(
        appConfig.apiSecret,
        req.rawBody,
        req.headers["x-shopify-hmac-sha256"]
      )
    ) {
      throw Error("Unauthorized");
    }
    return next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function rawBodySaver(req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
}

const app = express();

app.use(
  "/app/webhooks/product-update",
  bodyParser.json({ verify: rawBodySaver })
);

app.use(
  "/app/webhooks/app-uninstalled",
  bodyParser.json({ verify: rawBodySaver })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/shopify", async (req, res) => {
  try {
    const shop = shopifyService.install({
      shop: req.query.shop,
      shopify_api_key: appConfig.apiKey,
      shopify_shared_secret: appConfig.apiSecret,
      shopify_scope: appConfig.scopes,
      redirect_uri: `${forwardingAddress}/shopify/callback`,
      nonce: nonce().toString()
    });

    const authURL = shop.buildAuthURL();
    return res.redirect(authURL);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/shopify/callback", async (req, res) => {
  try {
    const shop = shopifyService.getShop(req.query.shop);
    if (!shop) {
      throw new Error("No shop provided");
    }
    await ShopifyService.exchangeTemporaryToken(shop, req.query);
    await Promise.all([
      ShopifyService.subscribeToProductUpdateWebhook(
        shop,
        `${forwardingAddress}/app/webhooks/product-update`
      ),
      ShopifyService.subscribeToUninstallWebHook(
        shop,
        `${forwardingAddress}/app/webhooks/app-uninstalled`
      )
    ]);
    return res.redirect(
      `https://${shop.config.shop}/admin/apps/${appConfig.apiKey}`
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/app/butter-cms/config", verifyRequest, (req, res) => {
  try {
    const writeToken = req.body.config.butterCMSWriteToken;

    if (!writeToken) {
      return res
        .status(404)
        .json({ message: "butterCMSWriteToken is missing" });
    }
    butterCMSService.connect(res.locals.shop.config.shop, {
      writeToken
    });
    return res
      .status(200)
      .json({ message: "Configurations have been successfully saved" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.get(
  "/app/butter-cms/promotional-pages/page/:page",
  verifyRequest,
  async (req, res) => {
    try {
      const { shop } = res.locals;
      const shopName = shop.config.shop;
      const pages = await butterCMSService.getPromotionalPages(
        shopName,
        req.params.page || 1
      );
      return res.status(200).json(pages.data);
    } catch (e) {
      console.log("catch error here", e);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

app.post(
  "/app/butter-cms/promotional-page",
  verifyRequest,
  async (req, res) => {
    try {
      const { slug, template } = req.body;
      if (!slug) {
        return res.status(400).json({ message: "slug is missing" });
      }
      if (!template) {
        return res.status(400).json({ message: "template is missing" });
      }
      const { shop } = res.locals;
      const shopName = shop.config.shop;
      const response = await butterCMSService.getPromotionalPage(
        shopName,
        slug
      );
      const page = response.data;
      const pageHtml = mustache.render(template, page.data);
      await ShopifyService.createPage(shop, {
        title: page.data.fields.seo.title,
        body_html: pageHtml,
        slug: page.data.slug
      });
      return res.status(200).json({ message: "Page has been successfully created" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

app.post("/app/webhooks/product-update", verifyWebhookRequest, async (req, res) => {
  try {
    console.log("Subscription fired!!!", req.body, req.headers);

    const shopName = req.headers["x-shopify-shop-domain"];
    await butterCMSService
      .addItemToCollection(shopName, "products", {
        name: req.body.title,
        image: req.body.image.src,
        description: req.body.body_html
      });
    return res
      .status(200)
      .json({ message: "Product has been added to collection" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Server error" });
  }
});

app.post("/app/webhooks/app-uninstalled", verifyWebhookRequest, (req, res) => {
  try {
    const shopName = req.headers["x-shopify-shop-domain"];
    shopifyService.uninstall(shopName);
    butterCMSService.disconnect(shopName);
    console.log("Successfully deleted all shop data", shopName);
    return res.status(200).json({ message: "Successfully deleted all shop data" });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server error");
  }
});

app.use(express.static(path.join(__dirname, "/dist/app-ui")));

app.get("/*", verifyRequest, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/app-ui/index.html"));
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
