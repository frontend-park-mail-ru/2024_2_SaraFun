import {post} from '../../../shared/api/api';

/**
 * Logs in a user.
 * 
 * @param {string} login - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true 
 * 								if login is successful, otherwise false.
 */
export async function loginUser(login: string, password: string): Promise<boolean> {
	try {
		const body = {'username': login, 'password': password};
		await post('/api/auth/signin', body);
		return true;

	} catch (error) {
		//console.error(error);
		return false;
	}
}