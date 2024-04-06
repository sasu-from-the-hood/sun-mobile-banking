'use strict';
import { accounts } from './accounts.js';
import { acc } from './account.js';
// Selecting Elements
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');

const lableDept = document.querySelector('.summary__value--debt');
const labelTimer = document.querySelector('.timer');

const lableTransfer = document.querySelector('.js-transfer');
const lableLoan = document.querySelector('.js-loan');
const lableWithdrwal = document.querySelector('.js-withdrwal');

const containerApp = document.querySelector('.app');
const balanceContainer = document.querySelector('.balance-row');
const summaryContainer = document.querySelector('.footer');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');

const payLoanBtn = document.querySelector('.form__btn--pay-loan');
const withdrawBtn = document.querySelector('.form__btn--Withdraw');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');

const inputPayLoan = document.querySelector('.form__input--pay-loan');
const inputWithdraw = document.querySelector('.form__input--Withdraw');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

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

const calcDisplayBalance = function (acc) {
  acc.balance =
    acc.movements.reduce((acc, mov) => acc + mov, 0) + currentAccount.loan[0];

  labelBalance.textContent = `${acc.balance}ETB`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}ETB`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out}ETB`;

  lableDept.textContent = acc.loan[0];
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //IN each call, print the remaining time to UI
    labelTimer.innerHTML = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = ` Log In Into Your Account `;
      containerApp.style.opacity = 0;
      balanceContainer.style.opacity = 0;
      summaryContainer.style.opacity = 0;
    }
    time--;
  };
  // set time to 5 minutes
  let time = 300;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

currentAccount = acc[0];
if (currentAccount) {
  // Display UI and message
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  containerApp.style.opacity = 1;
  balanceContainer.style.opacity = 1;
  summaryContainer.style.opacity = 1;

  //Timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  // Update UI
  updateUI(currentAccount);
}

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.accountNo === +inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (!receiverAcc) {
    lableTransfer.textContent = "The username you entered doesn't exist";
  }
  if (currentAccount.balance < amount) {
    lableTransfer.textContent = "You're broke to send that kinda money";
  }
  clearText(lableTransfer);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    localStorage.setItem(
      `userCash${currentAccount.accountNo}`,
      JSON.stringify(currentAccount.movements)
    );
    localStorage.setItem(
      `userCash${receiverAcc.accountNo}`,
      JSON.stringify(receiverAcc.movements)
    );
    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
withdrawBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputWithdraw.value;

  inputWithdraw.value = '';
  if (currentAccount.balance < amount) {
    lableWithdrwal.textContent =
      "My nigga you're broke to withdraw that kinda money";
  }
  clearText(lableWithdrwal);
  if (amount > 0 && currentAccount.balance >= amount) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    if (currentAccount.username === 'ba') {
      localStorage.setItem(
        'userCash1',
        JSON.stringify(currentAccount.movements)
      );
    }
    if (currentAccount.username === 'fa') {
      localStorage.setItem(
        'userCash2',
        JSON.stringify(currentAccount.movements)
      );
    }
    const min = 100000;
    const max = 999999;
    setTimeout(() => {
      lableWithdrwal.innerHTML = `Take this code ${
        Math.floor(Math.random() * (max - min + 1)) + min
      } and go to your nearest Sun bank ATM`;
    }, 0);
    setTimeout(() => {
      lableWithdrwal.innerHTML = ``;
    }, 10000);
    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    lableLoan.textContent = `In order to get loan atleast one of your deposit must be greater than 10% of what you asked`;
  }
  clearText(lableLoan);
  if (currentAccount.loan[0] > 0) {
    lableLoan.innerHTML = 'you need to pay the last money you took';
  }
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1) &&
    currentAccount.loan[0] === 0
  ) {
    setTimeout(function () {
      // Adding to Loan
      currentAccount.loan.unshift(amount);
      // Add movement
      currentAccount.movements.push(amount);

      // Update Loan
      if (currentAccount.username === 'ba') {
        localStorage.setItem(
          'usersLoans1',
          JSON.stringify(currentAccount.loan)
        );
        localStorage.setItem(
          'userCash1',
          JSON.stringify(currentAccount.movements)
        );
      }
      if (currentAccount.username === 'fa') {
        localStorage.setItem(
          'usersLoans2',
          JSON.stringify(currentAccount.loan)
        );
        localStorage.setItem(
          'userCash2',
          JSON.stringify(currentAccount.movements)
        );
      }

      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});
payLoanBtn.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(+inputPayLoan.value);
  if (amount > 0 && amount === currentAccount.loan[0]) {
    currentAccount.loan.splice(0, 1);
    localStorage.setItem('usersLoans', JSON.stringify(currentAccount.loan));
    currentAccount.balance -= amount;
    currentAccount.movements.push(-amount);

    localStorage.setItem('userCash', JSON.stringify(currentAccount.movements));
  }
  inputPayLoan.value = '';
  inputPayLoan.blur();
  updateUI(currentAccount);
  clearInterval(timer);
  timer = startLogOutTimer();
});

function clearText(text) {
  setTimeout(() => {
    text.textContent = '';
  }, 4000);
}
acc.splice(0, 1);
localStorage.setItem('account', JSON.stringify(acc));
