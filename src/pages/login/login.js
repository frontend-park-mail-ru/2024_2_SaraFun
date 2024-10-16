import template from '../../Compile/login.js';
import { loginUser } from '../../app/api.js';

export class LoginPage {
  constructor(parent) {
    this.parent = parent;
    this.parent.root.innerHTML = '';
    this.parent.root.innerHTML = this.render();
    this.addEventListeners();
  }

  render() {
    return template();
  }

  addEventListeners() {
    document.getElementById('link').addEventListener('click', (event) => {
      event.preventDefault();
      const url = new URL(event.target.href);
      const path = url.pathname;
      this.parent.goToPage(path);
    });

    document.querySelector('button').addEventListener('click', async () => {
      const login = document.getElementById('login').value;
      const password = document.getElementById('password').value;

      let valid = true;

      if (!login) {
        document.getElementById('login-error').style.display = 'block';
        valid = false;
      } else {
        document.getElementById('login-error').style.display = 'none';
      }

      if (!password) {
        document.getElementById('password-error').style.display = 'block';
        valid = false;
      } else {
        document.getElementById('password-error').style.display = 'none';
      }

      if (valid) {
        try {
          //const isLogedIn = await loginUser(login, password);
          const isLogedIn = true;
          if (!isLogedIn) {
            document.getElementById('login-password-error').style.display = 'block';            
          } else { 
            this.parent.goToPage('/feed');
          }
        } catch (error) {
          console.error('Ошибка при входе:', error);
        }
      } else {
        console.error('Ошибка: авторизации');
      }
    });
  }
}