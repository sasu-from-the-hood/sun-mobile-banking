import { accounts } from './accounts.js';
console.log(accounts);

const signInBtn = document.querySelector('.signin__btn');
const popupText = document.querySelector('.js-text-popup');
signInBtn.addEventListener('click', e => {
  e.preventDefault();
  const username = document.querySelector('.username').value;
  const pin = +document.querySelector('.password').value;
  const firstName = document.querySelector('.first_name').value;
  const lastName = document.querySelector('.last_name').value;

  let accountNo;

  let accountNumber = accounts[accounts.length - 1].accountNo + 1;
  if (accountNumber) {
    accountNo = accountNumber;
    if (isAccountAvailable(username)) {
      const newAccount = {
        owner: `${firstName} ${lastName}`,
        username,
        pin,
        accountNo,
        movements:
          JSON.parse(localStorage.getItem(`userCash${accountNumber}`)) || [],
        loan:
          JSON.parse(localStorage.getItem(`userLoans${accountNumber}`)) || [],
      };

      accounts.push(newAccount);
      localStorage.setItem('signin', JSON.stringify(accounts));
      document.querySelector('.username').value =
        document.querySelector('.password').value =
        document.querySelector('.first_name').value =
        document.querySelector('.last_name').value =
          '';
      document.querySelector('.password').blur();
      let x = 20;

      setTimeout(() => {
        const countdownInterval = setInterval(() => {
          if (x > 0) {
            popupText.innerHTML = `Your account has been successfully created <br>
                             here is your Account number ${newAccount.accountNo} <br>
                             Message will vanish in ${x} sec so take note of your account number`;
            popupText.style.color = 'green';
            x--;
          } else {
            clearInterval(countdownInterval);
            popupText.innerHTML = '';
          }
        }, 1000);
      }, 1000);

      console.log('yea it worked');
      console.log(accountNo);
    } else {
      alert(
        'The Username you enterd is occupied by another user, Plase choose another one'
      );
    }
  }
});
function isAccountAvailable(username) {
  return !accounts.some(acc => acc.username === username);
}
