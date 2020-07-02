export interface PromotionalPage {
  slug: string;
  page_type: 'promotional_page';
  fields: {
    seo: { title: string; meta_description: string };
    twitter_card: {
      title: string;
      Description: string;
      image: string;
    };
    products: [
      {
        product_name: string;
        product_image: string;
        product_description: string;
      }
    ];
  };
}
