import { faker } from "@faker-js/faker";

const generateProducts = () => {
  const categories = ["seeds", "fertilizers", "tools", "pesticides", "equipment"];
  const products = [];

  const productNames = {
    seeds: [
      "Hybrid Tomato Seeds",
      "Organic Wheat Seeds",
      "Corn Seeds Premium",
      "Cucumber Seeds",
      "Carrot Seeds",
    ],
    fertilizers: [
      "NPK Fertilizer 20-20-20",
      "Organic Compost",
      "Phosphate Fertilizer",
      "Potash Fertilizer",
      "Bio Fertilizer",
    ],
    tools: [
      "Hand Cultivator",
      "Pruning Shears",
      "Garden Spade",
      "Watering Can",
      "Garden Hoe",
    ],
    pesticides: [
      "Organic Neem Oil",
      "Fungicide Spray",
      "Insecticide 500ml",
      "Weed Killer",
      "Plant Protection",
    ],
    equipment: [
      "Irrigation Pump",
      "Sprayer Machine",
      "Soil pH Meter",
      "Greenhouse Kit",
      "Drip Irrigation Set",
    ],
  };

  categories.forEach((category) => {
    productNames[category].forEach((name, index) => {
      const originalPrice = faker.number.int({ min: 50, max: 2000 });
      const discount = faker.number.int({ min: 5, max: 40 });
      const price = Math.round(originalPrice * (1 - discount / 100));
      const productNameSlug = name.split(" ").join("+");

      products.push({
        id: `${category}-${index}`,
        name,
        price,
        originalPrice,
        rating: Number(
          faker.number.float({ min: 3.5, max: 5.0 }).toFixed(1)
        ),
        reviews: faker.number.int({ min: 10, max: 500 }),
        images: [
          `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/e0e0e0/333?text=${productNameSlug}`,
          `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/f0f0f0/555?text=${productNameSlug}+View+2`,
          `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/d0d0d0/222?text=${productNameSlug}+View+3`,
          `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600/fafafa/777?text=${productNameSlug}+View+4`,
        ],
        category,
        brand: faker.company.name(),
        discount,
        inStock: faker.datatype.boolean(0.9),
        description: faker.lorem.paragraphs(2),
        features: [
          faker.lorem.sentence(5),
          faker.lorem.sentence(6),
          faker.lorem.sentence(4),
        ],
        specifications: {
          Material: faker.commerce.productMaterial(),
          Weight: `${faker.number.float({
            min: 0.5,
            max: 5,
            precision: 0.1,
          })} kg`,
          Dimensions: `${faker.number.int({
            min: 20,
            max: 50,
          })}cm x ${faker.number.int({
            min: 5,
            max: 15,
          })}cm x ${faker.number.int({ min: 2, max: 5 })}cm`,
          Origin: faker.location.country(),
        },
      });
    });
  });

  return products;
};

export const products = generateProducts();

export const getProductById = (id) => {
  return products.find((p) => p.id === id);
};

export const getRelatedProducts = (category, currentProductId) => {
  return products
    .filter(
      (p) => p.category === category && p.id !== currentProductId
    )
    .slice(0, 4);
};
