import { post } from "../../../shared/api/api";
import { notificationManager } from "../../../widgets/Notification/notification";

export async function saveNewPassword(oldPassword: string, newPassword: string) {
  try {
    const body = {'current_password': oldPassword, 'new_password': newPassword };
    const response = await post('/api/auth/changepassword', body);
    
    if (!response.ok) {
      return false
    }

    notificationManager.addNotification('Пароль успешно изменен.', 'success');
    return true; 
  } catch (error) {
    //console.error('Ошибка при смене пароля:', error);
    return false;
  }
}