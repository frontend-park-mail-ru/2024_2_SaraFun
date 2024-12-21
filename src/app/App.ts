import { checkAuth } from '../features/checkAuth';
import { ROUTES, ROUTES_NAME } from '../shared/constants/routes';
import { Router } from './Router';
import Navbar from '../widgets/Navbar/navbar';
import template from './layouts/baseLayout.pug';
import { WebSocketManager } from '../features/WebSocket';
import { BASE_URL } from "../shared/constants/baseURL";

/**
 * Class representing the main application.
 */
export default class App {
	private state: { isAuthenticated: boolean, currentRoute: any, currentView: any } = { isAuthenticated: false, currentRoute: null, currentView: null };
	private root: HTMLElement;
	private contentRoot: HTMLElement;
	private navbarRoot: HTMLElement;
	private router: Router;
	private navbar: Navbar;
	private webSocketManager: WebSocketManager | null = null;

	/**
     * Creates an instance of App.
     * @param {HTMLElement} root - The root element for rendering the application.
     */
	constructor(root: HTMLElement) {
		this.root = root;
		this.root.innerHTML = template();
		this.navbarRoot = this.root.querySelector('.navbarRoot') as HTMLElement;
		this.contentRoot = this.root.querySelector('.contentRoot') as HTMLElement;
		this.router = new Router(this, this.contentRoot);
		this.navbar = new Navbar(this.router);
	}

	/**
     * Initializes the application by checking authentication and rendering the appropriate page.
     * @returns {Promise<void>} - A promise that resolves after initialization.
     */
	async init(): Promise<void> {
		try {
			this.registerServiceWorker();
	
			this.state.isAuthenticated = await checkAuth();

			if (this.state.isAuthenticated) {
				this.openWebSocket();
			}

			ROUTES.forEach(({ path, view, isPublic, useParams, params })=> {
				this.router.register(path, view, isPublic, useParams, params);
			});

			this.router.setAuth(this.state.isAuthenticated);
			this.router.start();

			this.navbarRoot.innerHTML = this.navbar.render();
			this.navbar.componentDidMount();

		} catch (error) {
			this.router.navigateTo(ROUTES.get(ROUTES_NAME.LOGIN).path);
		}
	}

	setAuth(isAuth: boolean): void {
		this.state.isAuthenticated = isAuth;
		this.navbar.setAuth(isAuth);
		this.navbarRoot.innerHTML = '';
		this.navbarRoot.innerHTML = this.navbar.render();
		this.navbar.componentDidUpdate();
		if (isAuth) {
			this.openWebSocket();
		} else {
			this.closeWebSocket();
		}
	}

	setCurRoute(route: string, view: any): void {
		this.state.currentRoute = route;
		this.state.currentView = view;
		if (this.webSocketManager) {
			this.webSocketManager.handler = view;
		}
		this.navbar.setCurRoute(route);
		this.navbar.componentDidUpdateActiveLink();
	}

	getAuth(): boolean {	
		return this.state.isAuthenticated;
	}

	getCurRoute(): string {
		return this.state.currentRoute;
	}

	registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
			  navigator.serviceWorker.register('/sw.js')
				.catch(error => {
				  //console.error('Service Worker registration failed:', error);
				});
			});
		} else {
			//console.warn('Service workers are not supported in this browser.');
		}
	}

	openWebSocket() {
		const wsUrl = `${BASE_URL.replace(/^https/, 'wss')}/api/ws`;
		this.webSocketManager = new WebSocketManager(wsUrl);
	}

	closeWebSocket() {
        this.webSocketManager.close();
        this.webSocketManager = null;
    }
}