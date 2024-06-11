'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

// Users login selected
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentaccount;

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov >= 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  const debits = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((sum, int) => sum + int, 0);

  labelSumIn.textContent = `${incomes} EUR`;
  labelSumOut.textContent = `${Math.abs(debits)} EUR`;
  labelSumInterest.textContent = `${interest} EUR`;
};

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from refreshing
  e.preventDefault();

  currentaccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentaccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Display movements
    displayMovements(currentaccount.movements);

    // Display balance
    calcDisplayBalance(currentaccount);

    // Display summary
    calcDisplaySummary(currentaccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    receiver &&
    currentaccount.balance >= amount &&
    receiver.username !== currentaccount.username
  ) {
    currentaccount.movements.push(-amount);
    receiver.movements.push(amount);

    // Update UI
    displayMovements(currentaccount.movements);
    calcDisplayBalance(currentaccount);
    calcDisplaySummary(currentaccount);
  }

  // Clear input fields
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentaccount.username === inputCloseUsername.value &&
    currentaccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentaccount.username
    );
    console.log(index);
    //delete account

    accounts.splice(index, 1);

    //hide ui

    containerApp.style.opacity = 0;
  }
});

//loan granted if one deposit is 10% of requested loan amount

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentaccount.movements.some(mov => mov >= amount * 0.1)) {
    currentaccount.movements.push(amount);
    displayMovements(currentaccount.movements);
    calcDisplayBalance(currentaccount);
    calcDisplaySummary(currentaccount);

    inputLoanAmount.value = '';
  } else {
    alert('Loan not granted ,Thank you');
  }
});

//const euroToUsd = 1.1;
//const movementsUSD = movements.map(mov => mov * euroToUsd);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//create max value

//accumulator is like a snowball
/*
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`iteration no ${i} : ${acc}`);
  return acc + cur;
}, 0);

console.log(balance);
const maxnumber = function () {
  const max = movements.reduce(function (acc, mov, i, arr) {
    if (acc < mov) {
      return mov;
    } else {
      return acc;
    }
  }, 0);
  console.log(max);
};
maxnumber(movements);
//Pipeline

const totalDepositinUSD = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * 1.1;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

console.log(totalDepositinUSD);
*/

//EVERY
