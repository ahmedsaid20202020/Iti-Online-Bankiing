// ITI BANK

'use strict';

/////////////////////////////////////////////////
// check you logout or still in login

if (!localStorage.getItem('accUser')) {
  location.assign('../index.html');
}

/////////////////////////////////////////////////
// Elements in all page

let accounts = JSON.parse(localStorage.getItem('localAccs')); // to get accounts from local storage

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogout = document.querySelector('.logout__btn');

const inputLoginuserName = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseuserName = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions

//1 movements

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMoveDate(date);

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//2 balancs

// use reduce to return value of balanc

const displayBalancs = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

//3 summary  for incomes , outcomes , interest

const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100) // based on interestRate account
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//4 update localStorage

const updateLocalstorage = function () {
  localStorage.setItem('localAccs', JSON.stringify(accounts));
};

//5 update : (mov,summary,balance,localStorage)

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  displayBalancs(acc);

  // Display summary
  displaySummary(acc);
  // update local
  updateLocalstorage();
};

// 6 date for any mov

const formatMoveDate = function (date) {
  //emplement function to calc difference in two days from milliseconds to days

  const calcDays = (day1, day2) =>
    Math.round(Math.abs((day2 - day1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDays(date, new Date());

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0); // display day
  const month = `${date.getMonth() + 1}`.padStart(2, 0); //  display month
  const year = date.getFullYear(); // display year
  return `${day}/${month}/${year}`;
};

//////////////////////////////////////////////

// Event handlers

// on load

let currentAccount = 0;

window.addEventListener('load', function () {
  currentAccount = accounts.find(
    acc => acc.userName === localStorage.getItem('accUser')
  );

  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;

  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  updateUI(currentAccount);
});

///////////////////////////////////

// buttons

// 1 transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    receiverAccount &&
    amount > 0 &&
    receiverAccount?.userName !== currentAccount.userName &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());

    updateUI(currentAccount);
  }
});

//2 loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//3 close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseuserName.value === currentAccount.userName ||
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);

    localStorage.removeItem('accUser');

    updateLocalstorage();

    location.assign('../index.html');
  } else {
    inputCloseuserName.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

//4 logout

btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  updateLocalstorage();
  localStorage.removeItem('accUser');
  location.assign('../index.html');
});

//5 sort

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////////
