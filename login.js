import { accounts } from './accounts.js';
import { acc } from './account.js';
const loginBtn = document.querySelector('.login-btn');
loginBtn.addEventListener('click', e => {
  e.preventDefault();
  const username = document.querySelector('.username').value;
  const password = +document.querySelector('.password').value;
  let account = accounts.find(
    a => a.username === username && a.pin === password
  );

  if (account) {
    acc.push(account);
    localStorage.setItem('account', JSON.stringify(acc));
    window.location.href = '../main.html';
  } else {
    alert('Invalid username or password. Please try again.');
  }
});
