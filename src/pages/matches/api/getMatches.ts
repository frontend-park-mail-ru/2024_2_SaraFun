import {get} from '../../../shared/api/api';
import {User} from '../../../entities/User/User';

/**
 * Fetches the list of users.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to an array of user objects.
 */
export async function getMatches(): Promise<User[]> {
	try {
		const response = await get('/api/communications/matches');
		const data = await response.json();
		if (data.Cards === null)
			return null;
		const matches: User[] = data.Cards.map((response: any) => response as User);
		return matches;

	} catch (error) {
		//console.error(error);
		return [];
	}
}