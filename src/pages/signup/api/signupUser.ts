import { post } from '../../../shared/api/api';

/**
 * Registers a new user.
 * 
 * @param {string} login - The username of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} gender - The gender of the new user.
 * @param {string} age - The date of birth of the new user in YYYY-MM-DD format.
 * @returns {Promise<boolean>} - A promise that resolves to true 
 *         if registration is successful, otherwise false.
 */
export async function signupUser(login: string, password: string, first_name: string, gender: string, birth_date: string): Promise<boolean> {
  try {
    const body = {
      'username': login,
      'password': password,
      'first_name': first_name,
      'gender': gender, 
      'birth_date': birth_date, 
    };
    await post('/api/auth/signup', body);
    return true;

  } catch (error) {
    //console.error(error);
    return false;
  }
}