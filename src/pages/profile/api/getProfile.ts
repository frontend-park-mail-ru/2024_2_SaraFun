import { get } from '../../../shared/api/api';
import { UserProfile } from '../lib/profile';

/**
 * Fetches the profile of a user by ID.
 * 
 * @returns {Promise<UserProfile | null>} - A promise that resolves to the user profile object or null if not found.
 */
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const response = await get('/api/personalities/profile');
    
    if (!response.ok) {
      //console.error('Failed to fetch profile:', response.statusText);
      return null; 
    }

    const data = await response.json();
    const images = Array.isArray(data.images) ? data.images : [];

    const userProfile: UserProfile = {
      ID: data.profile.id,
      imagesIndexes: images.map((image: { id: string }) => image.id),
      first_name: data.profile.first_name,
      gender: data.profile.gender,
      birth_date: data.profile.birthday_date,
      target: data.profile.target,
      about: data.profile.about,
      imagesURLs: images.map((image: { link: string }) => {
        const fileName = image.link.substring(image.link.lastIndexOf('/') + 1);
        return `https://spark-it.site/${fileName}`;
      }),
      moneyBalance: data.money_balance,
      dailyLikes: data.daily_likes_balance,
      purchasedLikes: data.purchased_likes_balance,
    };
    return userProfile;
  } catch (error) {
    //console.error('Error fetching user profile:', error);
    return null; 
  }
}