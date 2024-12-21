import {get} from '../../../shared/api/api';

/**
 * Logs out the user.
 * 
 * @returns {Promise<boolean>} - A promise that resolves to true 
 * 								if logout is successful, otherwise false.
 */
export async function logout(): Promise<boolean> {
	try {
		await get('/api/auth/logout');
		return true;

	} catch (error) {
		//console.error(error);
		return false;
	}
}