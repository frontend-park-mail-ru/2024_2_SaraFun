import Navbar from '../../widgets/Navbar/navbar.js';

import template from './ui/matches.pug';
import { getMatches } from './api/getMatches.js';

export class MatchesPage {
	constructor(parent) {
		this.parent = parent;
		this.parent.root.innerHTML = '';
		this.render().then(() => {;
			this.navbar = new Navbar(document.querySelector('navbar'), parent);
		});
	}

	async render() {
		let users = await getMatches();
		this.parent.root.innerHTML = template({ users });
	}
}