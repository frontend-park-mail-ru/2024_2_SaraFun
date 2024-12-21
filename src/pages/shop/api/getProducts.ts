import { get } from "../../../shared/api/api";
import { Product } from "../lib/product";

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await get('/api/payments/products');
        const data = await response.json();

        const products: Product[] = data.responses.map((item: any) => ({
            name: item.title,
            price: item.price,
            imageURL: item.image_link,
            description: item.description,
        }));

        return products;
    } catch (error) {
        //console.error("Error fetching products:", error);
        return null; 
    }
};