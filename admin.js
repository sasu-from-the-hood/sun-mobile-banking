import { accounts } from './accounts.js';
// Bank admin
const admin1 = {
  owner: 'Abel Redwan',
  adminUserName: 'ar',
  pin: 1122,
  movements: JSON.parse(localStorage.getItem('adminCash')) || [],
};
// Selecting Elements
///////////////////////////////////////
// Selecting The Text Show Up Elements
const message = document.querySelector('.welcome');
const textPopup = document.querySelector('.js-text-popup');
// Selecting The Button Elements
const btnAdminLogin = document.querySelector('.login__admin-btn');
const btnAdminTransfer = document.querySelector('.form__btn--admin-transfer');
// Selecting The Input Elements
const inputLoginAdminName = document.querySelector('.login__input--admin');
const inputLoginAdminPin = document.querySelector('.login__input--admin-pin');
const inputAdminTransferTo = document.querySelector('.form__input--admin-to');
const inputAdminTransferAmount = document.querySelector(
  '.form__input--admin-amount'
);
// Selecting Some Main Functionalities
const containerApp = document.querySelector('.app');
const balanceContainer = document.querySelector('.balance-row');

const containerMovements = document.querySelector('.movements');

btnAdminLogin.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputLoginAdminName.value === admin1.adminUserName &&
    +inputLoginAdminPin.value === admin1.pin
  ) {
    containerApp.style.opacity = '1';
    balanceContainer.style.opacity = '1';
    message.innerHTML = 'Welcome Sir, ABEL';
  }
  inputLoginAdminName.value = inputLoginAdminPin.value = '';
  displayMovements(admin1);
});

btnAdminTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = +inputAdminTransferAmount.value;
  const accountNo = +inputAdminTransferTo.value;
  const accountOwner = accounts.find(acc => acc.accountNo === accountNo);
  if (accountOwner && transferAmount > 0) {
    accountOwner.movements.push(transferAmount);
    admin1.movements.push(transferAmount);
    localStorage.setItem(
      `userCash${accountOwner.accountNo}`,
      JSON.stringify(accountOwner.movements)
    );
    localStorage.setItem('adminCash', JSON.stringify(admin1.movements));
  } else {
    textPopup.style.color = 'red';
    textPopup.style.fontSize = '20px';
    setTimeout(() => {
      textPopup.innerHTML = 'The account number you enterd does not exist';
    }, 1000);
    setTimeout(() => {
      textPopup.innerHTML = '';
    }, 5000);
  }
  inputAdminTransferAmount.value = inputAdminTransferTo.value = '';
  inputAdminTransferAmount.blur();

  displayMovements(admin1);
});

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  const movs = acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movments__date">Today</div>
        <div class="movements__value">${mov}ETB</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
