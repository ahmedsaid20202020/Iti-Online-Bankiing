// login js
//data for accounts

const accounts = [
  {
    owner: 'Ahmed Hesham',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    userName: 'ah',
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-07-26T17:01:17.194Z',
      '2020-07-28T23:36:17.929Z',
      '2020-08-01T10:51:36.790Z',
    ],
  },
  {
    owner: 'Ahmed Said',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    userName: 'as',
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
  },
  {
    owner: 'youmna Abdelbast',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    userName: 'ya',
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-07-26T17:01:17.194Z',
      '2020-07-28T23:36:17.929Z',
      '2020-08-01T10:51:36.790Z',
    ],
  },
  {
    owner: 'Gamal omar',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    userName: 'go',
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
    ],
  },
];

//////////////////////////////////

// storage data in localStorage

if (!localStorage.getItem('localAccs')) {
  localStorage.setItem('localAccs', JSON.stringify(accounts));
}

// display for you still login in not log out

if (localStorage.getItem('accUser')) {
  location.assign('html/dashboard.html');
}

/////////////////////////////////////////////////

// Element for login page

let userLogin = document.getElementById('uLogin');
let passLogin = document.getElementById('pLogin');
let loginBtn = document.getElementById('btn');
let card = document.getElementById('card');
let return0 = document.getElementById('return');

///////////////////////////////////////////

// login button

let currentAcc;

loginBtn.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.userName === userLogin.value);

  if (currentAcc?.pin === Number(passLogin.value)) {
    localStorage.setItem('accUser', currentAcc.userName);

    location.assign('html/dashboard.html');
  } else {
    card.classList.add('rotate');
  }
});

// return button

return0.addEventListener('click', function (e) {
  e.preventDefault();
  card.classList.remove('rotate');
});
