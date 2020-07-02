// import Butter from "buttercms";
// import requestPromise from "request-promise";
const Butter = require("buttercms");
const requestPromise = require("request-promise");

class ButterCMSService {
  constructor() {
    this.configs = {};
  }

  connect(shopName, configs) {
    console.log("connect", shopName);
    this.configs[shopName] = configs;
    console.log(this.configs);
  }

  disconnect(shopName) {
    delete this.configs[shopName];
  }

  async addItemToCollection(shopName, collectionName, item) {
    if (!this.configs[shopName] || !this.configs[shopName].writeToken) {
      return Promise.reject(Error("No write-enabled token configured"));
    }
    const butter = Butter(this.configs[shopName].writeToken);
    const collectionData = await butter.content.retrieve([collectionName]);

    console.log("resp", collectionData.data);
    if (collectionData.data) {
      const body = {
        key: collectionName,
        status: "published",
        fields: [
          {
            en: item
          }
        ]
      };
      const options = {
        method: "POST",
        uri: "https://api.buttercms.com/v2/content/",
        body,
        json: true,
        headers: {
          authorization: `Token ${this.configs[shopName].writeToken}`
        }
      };
      return requestPromise(options);
    }
    return Promise.reject(Error(`Collection ${collectionName}was not found.`));
  }

  getPromotionalPages(shopName, pageNumber) {
    if (!this.configs[shopName] || !this.configs[shopName].writeToken) {
      console.log("not configured");
      return Promise.reject(Error("No write-enabled token configured"));
    }
    const butter = Butter(this.configs[shopName].writeToken);
    const params = {
      preview: 1,
      page: pageNumber,
      page_size: 10,
      locale: "en",
      levels: 2
    };

    return butter.page.list("promotional_page", params);
  }

  getPromotionalPage(shopName, slug) {
    if (!this.configs[shopName] || !this.configs[shopName].writeToken) {
      return Promise.reject(Error("No write-enabled token configured"));
    }
    const butter = Butter(this.configs[shopName].writeToken);
    return butter.page.retrieve("promotional_page", slug, {
      locale: "en",
      preview: 1
    });
  }
}

// export default { ButterCMSService };
module.exports = { ButterCMSService };
