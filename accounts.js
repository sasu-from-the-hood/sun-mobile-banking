const account1 = {
  owner: 'Biruk Amanuel',
  username: 'ba',
  accountNo: 1,
  movements: JSON.parse(localStorage.getItem(`userCash${1}`)) || [],
  pin: 1245,
  loan: JSON.parse(localStorage.getItem(`userLoan${1}`)) || [0],
};

const account2 = {
  owner: 'Fasil Alelegn',
  username: 'fa',
  accountNo: 2,
  movements: JSON.parse(localStorage.getItem(`userCash${2}`)) || [],
  pin: 2222,
  loan: JSON.parse(localStorage.getItem(`userLoan${2}`)) || [0],
};
export let accounts = JSON.parse(localStorage.getItem('signin')) || [
  (account1, account2),
];
