import {get} from '../shared/api/api';

/**
 * Checks if the user is authenticated.
 * 
 * @returns {Promise<boolean>} - A promise that resolves to true
 * 								if the user is authenticated, otherwise false.
 */
export async function checkAuth(): Promise<boolean> {
	try {
		await get('/api/auth/checkauth');
		return true;

	} catch (error) {
		//console.error(error);
		return false;
	}
}