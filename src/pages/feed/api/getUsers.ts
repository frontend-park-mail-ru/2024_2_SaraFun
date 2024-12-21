import {get} from '../../../shared/api/api';
import { User } from '../../../entities/User/User'

/**
 * Fetches the list of users.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of user objects.
 */
export async function getUsers(): Promise<User[]> {
	try {
		const response = await get('/api/personalities/getusers');
		const data = await response.json();
		if (data.Responses === null)
			return null;
		const users: User[] = data.Responses.map((response: any) => response as User);
		return users;

	} catch (error) {
		//console.error(error);
		return null;
	}
}