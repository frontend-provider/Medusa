import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.productTags.list()
.then(({ product_tags }) => {
  console.log(product_tags.length);
});
