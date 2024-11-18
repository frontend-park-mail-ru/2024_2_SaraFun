import Navbar from '../../../widgets/Navbar/navbar';
import template from './feed.pug';
import { getUsers } from '../api/getUsers';
import { putLikeOrDislike } from '../api/putLikeOrDislike';
//import { showImage, scrollLeft, scrollRight } from '../../../shared/lib/carousel';
import { User } from '../../../entities/User/User'
import { Router } from '../../../app/Router';
import { initCards } from '../lib/initCards';
import { addCarousel } from '../lib/addCarousel';


/**
 * Class representing the Feed Page.
 */
export class FeedPage {
	private parent: Router;
  	private navbar: Navbar | undefined;
	/**
     * Creates an instance of FeedPage.
     * @param {Object} parent - The parent object containing the root element.
     */
	constructor(parent: Router) {
		this.parent = parent;
		this.parent.root.innerHTML = '';
		this.render().then(() => {;
			this.navbar = new Navbar(document.querySelector('navbar') as HTMLElement, parent);
		});
	}

	/**
     * Renders the feed page by fetching users and initializing cards.
     * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
     */
	async render(): Promise<void> {
		let users: User[] = await getUsers();

		this.parent.root.innerHTML = template({ users });
		if (users === null) {
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

		/*allCards.forEach((card, index) => {
			const user = users[index];
			if (user) {
				card.setAttribute('data-item-id', `${user.user}`);
			}

			if (user.images != null && user.images.length > 1) {
				const carousel = card.querySelector('.carousel') as HTMLElement;
				if (carousel) {
					carousel.setAttribute('data-current-index', `${0}`);
					showImage(carousel, 0);

					const leftButton = card.querySelector('.carousel__button_left');
					const rightButton = card.querySelector('.carousel__button_right');

					leftButton.addEventListener('click', (event) => {
						scrollLeft(carousel);
					});
					rightButton.addEventListener('click', (event) => {
						scrollRight(carousel);
					});
				}
			}
		});*/
		initCards(tinderContainer);
		
		/**
         * Creates a button listener for the like or dislike buttons.
         * @param {boolean} love - Indicates if the button is for liking (true) or disliking (false).
         * @returns {Function} - The event listener function.
         */
		function createButtonListener(love: boolean) {
			return async function (event: Event) {
				let cards = document.querySelectorAll('.tinder__card:not(.removed)') as NodeListOf<HTMLElement>;
				let moveOutWidth = document.body.clientWidth * 1.5;
			
				if (!cards.length) {
					return false;
				}
			
				let card = cards[0];
				let userId = card.getAttribute('data-item-id');

				await putLikeOrDislike(love, parseInt(userId));
			
				card.classList.add('removed');
			
				if (love) {
					card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
				} else {
					card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
				}
			
				initCards(tinderContainer);
			
				event.preventDefault();
			};
		}
  
		let nopeListener = createButtonListener(false);
		let loveListener = createButtonListener(true);
		
		nope.addEventListener('click', nopeListener);
		love.addEventListener('click', loveListener);
	}
}