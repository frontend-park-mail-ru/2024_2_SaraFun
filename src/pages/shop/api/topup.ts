import { post } from "../../../shared/api/api";

export const topupApi = async (productPrice: number): Promise<boolean> => {
    try {
        const body = {
            price: productPrice.toFixed(2)
        };
        const response = await post('/api/payments/topup', body);
        const redirectURL = await response.json();
        if (redirectURL.redirect_link) {
          window.location.href = redirectURL.redirect_link;
        }
        return true;
    } catch (error) {
        //console.error('Ошибка при создании платежа:', error);
        return false;
    }
}