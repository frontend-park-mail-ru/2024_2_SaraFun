import { post } from '../shared/api/api';
import reportModalTemplate from '../widgets/Report/report.pug'
import { limitText } from './limitInput';
import { notificationManager } from '../widgets/Notification/notification';

export function openReportModal(userId: number): void {
  async function submitReport(userId: number, reason: string, comment: string): Promise<void> {
    try {
      const body = { 
        'receiver': userId, 
        'reason': reason,
        'body': comment
      };
      const response = await post('/api/message/report', body);

      if (!response.ok) {
        notificationManager.addNotification('Ошибка при отправке жалобы. Попробуйте позже.', 'fail');
      }
      notificationManager.addNotification('Жалоба успешно отправлена.', 'success');
    } catch (error) {
      console.error(error);
      notificationManager.addNotification('Ошибка при отправке жалобы. Попробуйте позже.', 'fail');
    }
  }
  
  //const modalHTML = reportModalTemplate();
  //document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('reportModal') as HTMLElement;
  modal.style.display = 'flex';
  const closeModalButton = modal.querySelector('.close-modal') as HTMLElement;
  
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    //modal.remove();
  });

  const commentTextarea = document.getElementById('comment') as HTMLTextAreaElement;
  
  limitText(commentTextarea, 5);

  const reportForm = document.getElementById('reportForm') as HTMLFormElement;
  
  
  reportForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const reason = (document.getElementById('reason') as HTMLSelectElement).value;
    const comment = (document.getElementById('comment') as HTMLTextAreaElement).value;

    await submitReport(userId, reason, comment);
    modal.style.display = 'none';
    //modal.remove(); 
  });
}