import template from './matches.pug';
import { getMatches } from '../api/getMatches';
import { Router } from '../../../app/Router';
import { User } from '../../../entities/User/User';
import { addCarousel } from '../../../shared/lib/carousel/addCarousel';
import templateCard from './card.pug';
import { openReportModal } from '../../../features/report';
import { notificationManager } from '../../../widgets/Notification/notification';
import { WsMessage } from '../../../entities/WsMessage/WsMessage';

export class MatchesPage {
	private parent: Router;
	private matches: NodeListOf<HTMLElement>;

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

	async render(): Promise<void> {
		let users: User[] = await getMatches();
		this.parent.root.innerHTML = template({ users });
		this.matches = document.querySelectorAll('.match-card') as NodeListOf<HTMLElement>;
		const messageForm = document.querySelector('.form.message-form.message-form--matches') as HTMLElement;
		if (this.matches.length === 0) {
			const messageForm = document.querySelector('.form.message-form.message-form--matches') as HTMLElement;
			messageForm.style.display = 'flex';
		} else {
			messageForm.style.display = 'none';
		}

		if (this.matches) {
			addCarousel(this.matches, users);
			this.addCardClickListeners(users);
		}
	}

	addCardClickListeners(users: User[]): void {
		this.matches.forEach((card, index) => {
		  	card.addEventListener('click', (event) => {
				if (event.target instanceof HTMLElement && event.target.tagName === 'BUTTON') {
					return;
				}
				this.openProfileModal(users[index], card);
		  	});

			const button = card.querySelector('.match-card__button') as HTMLButtonElement;
			if (button) {
				button.addEventListener('click', () => {
					this.parent.navigateTo(`/chats/${users[index].user}`);
				});
			}
		});
	}

	openProfileModal(user: User, card: HTMLElement): void {
		const modal = document.createElement('div');
		modal.classList.add('profile-modal');
		modal.innerHTML = templateCard({user});
		addCarousel(modal.querySelectorAll('.tinder__card'), [user]);
		this.parent.root.appendChild(modal);
		
		modal.classList.add('opening');
		modal.addEventListener('animationend', () => {
			modal.classList.add('open');
			modal.classList.remove('opening');
		}, { once: true });
		
		if (user) {
			const reportButton = modal.querySelector('.report') as HTMLButtonElement;
			reportButton.addEventListener('click', () => {
				openReportModal(user.user);
				const reportForm = document.getElementById('reportForm') as HTMLFormElement;
				reportForm.addEventListener('submit', async (event) => {
					event.preventDefault();
					setTimeout(() => {
						closeModal();
					}, 500);
					setTimeout(() => {
						card.remove();
						this.matches = document.querySelectorAll('.match-card') as NodeListOf<HTMLElement>;
						if (!this.matches || this.matches.length === 0) {
							const messageForm = document.querySelector('.form.message-form.message-form--matches') as HTMLElement;
							const matchesContainer = document.querySelector('.matches') as HTMLElement;
							matchesContainer.style.display = 'none';
							messageForm.style.display = 'flex';
						}
					}, 500);
				});
				
			});
		}
	
		const closeModal = () => {
			modal.classList.add('closing');
			modal.addEventListener('animationend', () => {
				modal.style.display = 'none';
				modal.classList.remove('closing');
			}, { once: true });
		};
	
		modal.addEventListener('click', (event) => {
			if ((event.target as HTMLElement).classList.contains('profile-modal')) {
				closeModal();
			}
		});
	}
}