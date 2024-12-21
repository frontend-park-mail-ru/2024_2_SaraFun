import { putLikeOrDislike } from '../api/putLikeOrDislike';
import { openReportModal } from '../../../features/report';
import { openNotificationModal } from './modal';
import Navbar from '../../../widgets/Navbar/navbar';

export function initCards(tinderContainer: HTMLElement, parent: any): void { 
    let newCards = document.querySelectorAll('.tinder__card:not(.removed)') as NodeListOf<HTMLElement>;

    const messageForm = document.querySelector('.form.message-form.message-form--feed') as HTMLElement;
    if (newCards.length === 0) {
        setTimeout(() => {
            tinderContainer.style.display = 'none';
            messageForm.style.display = 'flex';
        }, 500);
        return;
    } else {
        messageForm.style.display = 'none';
    }

    const maxOffsetIndex = 10;

    const navbar = new Navbar(parent);

    newCards.forEach(function (card, index) {
        const limitedIndex = Math.min(index, maxOffsetIndex); 
        card.style.zIndex = `${newCards.length - index}`;
        card.style.transform = 
            'scale(' + (20 - limitedIndex) / 20 + ') ' + 
            'translateY(-' + 30 * limitedIndex + 'px)';
        card.style.opacity = `${(10 - index) / 10}`;
    });

    const firstCard = newCards[0];
    let startX: number, startY: number, currentX: number, currentY: number, initialX: number, initialY: number;
    let isDragging = false;
    let isSwiping = false;

    function startDrag(event: MouseEvent | TouchEvent): void {
        const targetElement = event.target as HTMLElement;

        if (targetElement.tagName === 'BUTTON' || targetElement.closest('button')) {
            return;
        }

        isDragging = true;
        startX = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        startY = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
        if (firstCard.style.transform && firstCard.style.transform.includes('translate')) {
            let transformValues = firstCard.style.transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (transformValues) {
                initialX = parseFloat(transformValues[1]);
                initialY = parseFloat(transformValues[2]);
            } else {
                initialX = 0;
                initialY = 0;
            }
          } else {
            initialX = 0;
            initialY = 0;
          }
          firstCard.classList.add('moving');
    }

    function drag(event: MouseEvent | TouchEvent): void {
        if (!isDragging) {return;}
        isSwiping = true;
    
        currentX = event.type === 'touchmove' ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        currentY = event.type === 'touchmove' ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
    
        let deltaX = currentX - startX;
        let deltaY = currentY - startY;
    
        tinderContainer.classList.toggle('tinder_love', deltaX > 0);
        tinderContainer.classList.toggle('tinder_nope', deltaX < 0);
    
        let xMulti = deltaX * 0.03;
        let yMulti = deltaY / 80;
        let rotate = xMulti * yMulti;
    
        firstCard.style.transform = 
            'translate(' + (initialX + deltaX) + 'px, ' + 
            (initialY + deltaY) + 'px) rotate(' + rotate + 'deg)';
    }

    async function endDrag(): Promise<void> {
        if (!isSwiping) {
            return;
        }
        isSwiping = false;
        isDragging = false;
    
        firstCard.classList.remove('moving');
        tinderContainer.classList.remove('tinder_love');
        tinderContainer.classList.remove('tinder_nope');
        let deltaX = currentX - startX;
        let deltaY = currentY - startY;
        let moveOutWidth = document.body.clientWidth;
        let keep = Math.abs(deltaX) < 80;
        //firstCard.classList.toggle('removed', !keep);
    
        if (keep) {
            firstCard.style.transform = '';
          } else {
            let toX = deltaX > 0 ? moveOutWidth : -moveOutWidth;
            let toY = deltaY;
            let xMulti = deltaX * 0.03;
            let yMulti = deltaY / 80;
            let rotate = xMulti * yMulti;

            firstCard.style.transform = 'translate(' + toX + 'px, ' + toY + 'px) rotate(' + rotate + 'deg)';

            let love = deltaX > 0;
            let username = firstCard.getAttribute('data-item-id');

            let response = await putLikeOrDislike(love, username);
            if ((response as string).trim() === 'у вас нет лайков') {
                openNotificationModal(parent);
                firstCard.style.transform = '';
                await navbar.getUserInfo();
                return;
            }

            firstCard.classList.toggle('removed', !keep);

            initCards(tinderContainer, parent);
        }
    }

    firstCard.addEventListener('mousedown', startDrag);
    firstCard.addEventListener('mousemove', drag);
    firstCard.addEventListener('mouseup', endDrag);
    firstCard.addEventListener('mouseleave', endDrag);

    firstCard.addEventListener('touchstart', startDrag);
    firstCard.addEventListener('touchmove', drag);
    firstCard.addEventListener('touchend', endDrag);
    firstCard.addEventListener('touchcancel', endDrag);

    const reportButton = firstCard.querySelector('.report') as HTMLButtonElement;

    reportButton.addEventListener('click', () => openReportModal(parseInt(firstCard.getAttribute('data-item-id'))));

    const reportForm = document.getElementById('reportForm') as HTMLFormElement;
    reportForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let moveOutWidth = document.body.clientWidth * 1.5;
        firstCard.classList.add('removed');

        setTimeout(() => {
            firstCard.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
            initCards(tinderContainer, parent);
        }, 500);
        reportForm.remove();
    });
        
    tinderContainer.classList.add('loaded');
}