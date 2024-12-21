import { post } from "../../../shared/api/api";

export const buyBoostApi = async (productName: string, productPrice: number): Promise<string> => {
    try {
        const body = {
            title: productName,
            price: productPrice
        };
        const response = await post('/api/payments/buy', body);
        return 'true';
    } catch (error) {
        //console.error('Ошибка при создании платежа:', error);
        if (error instanceof Error) {
            const errorMessage = error.message.split(', ').pop();
            return errorMessage;
        }
        return 'false';
    }
}