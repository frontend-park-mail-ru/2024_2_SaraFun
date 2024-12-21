import {post} from '../../../shared/api/api';

export async function postMessage(receiverId: number, message: string): Promise<boolean> {
	try {
		const body = {
			'receiver': receiverId,
			'body': message,
		};
		await post('/api/message/message', body);
		return true;

	} catch (error) {
		//console.error(error);
		return false;
	}
}