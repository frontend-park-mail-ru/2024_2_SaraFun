import template from './feed.pug';
import { getUsers } from '../api/getUsers';
import { User } from '../../../entities/User/User'
import { Router } from '../../../app/Router';
import { initCards } from '../lib/initCards';
import { addCarousel } from '../../../shared/lib/carousel/addCarousel';
import { createButtonListener } from '../lib/createButtonListener';
import { notificationManager } from '../../../widgets/Notification/notification';
import { WsMessage } from '../../../entities/WsMessage/WsMessage';


/**
 * Class representing the Feed Page.
 */
export class FeedPage {
	private parent: Router;
	/**
     * Creates an instance of FeedPage.
     * @param {Object} parent - The parent object containing the root element.
     */
	constructor(parent: Router) {
		this.parent = parent;
		this.parent.root.innerHTML = '';
		this.render();
	}

	handleMessage(data: WsMessage) {
		if (data.type === "message") {
			notificationManager.addNotification(`Новое сообщение от ${data.username}: ${data.message}`, 'info');
		} else {
			notificationManager.addNotification(`У вас новый мэтч с пользователем ${data.username}`, 'info');
		}
	}

	/**
     * Renders the feed page by fetching users and initializing cards.
     * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
     */
	async render(): Promise<void> {
		let users: User[] = await getUsers();
		this.parent.root.innerHTML = template({ users });

		if (users === null || users.length == 0) {
			return;
		}

		let tinderContainer = document.querySelector('.tinder') as HTMLElement;
		let allCards = document.querySelectorAll('.tinder__card') as NodeListOf<HTMLElement>;
		let nope = document.getElementById('nope') as HTMLElement;
		let love = document.getElementById('love') as HTMLElement;

		allCards.forEach((card, index) => {
			const user = users[index];
			if (user) {
				card.setAttribute('data-item-id', `${user.user}`);
			}
		});

		addCarousel(allCards, users);
		initCards(tinderContainer);
  
		let nopeListener = createButtonListener(false, tinderContainer);
		let loveListener = createButtonListener(true, tinderContainer);
		
		nope.addEventListener('click', nopeListener);
		love.addEventListener('click', loveListener);
	}
}