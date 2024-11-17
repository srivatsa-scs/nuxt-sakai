import { useFetch } from "nuxt/app";

function delay() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default defineEventHandler(async () => {
    const products = await useFetch('https://dummyjson.com/products?limit=5');
    await delay();
    return {
        data: products
    };
})