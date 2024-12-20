import { putLikeOrDislike } from "../api/putLikeOrDislike";
import { initCards } from "./initCards";
import { openNotificationModal } from './modal';

export function createButtonListener(love: boolean, tinderContainer: HTMLElement, parent: any) {
    return async function (event: Event) {
        let cards = document.querySelectorAll('.tinder__card:not(.removed)') as NodeListOf<HTMLElement>;
        let moveOutWidth = document.body.clientWidth * 1.5;
    
        if (!cards.length) {
            return false;
        }
    
        let card = cards[0];
        let userId = card.getAttribute('data-item-id');

        let response = await putLikeOrDislike(love, parseInt(userId));
        if ((response as string).trim() === 'у вас нет лайков') {
            openNotificationModal(parent);
            return;
        }

        card.classList.add('removed');
    
        if (love) {
            card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
        } else {
            card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
        }
    
        initCards(tinderContainer, parent);
    
        event.preventDefault();
    };
}