var tasksArray = [];
var navBar = document.querySelector('nav');
var sideBar = document.querySelector('aside');

navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('keyup', handleSideBarInputs);
sideBar.addEventListener('click', handleSideBarButtons);

function handleNav(e) {
  e.preventDefault(e);
  if (e.target.id === 'input-search') {
    console.log(document.querySelector('#input-search').value);
  }
};

function handleSideBarInputs(e) {
  e.preventDefault();
  if (e.target.id === 'input-title') {
    console.log(document.querySelector('#input-title').value);
  }
  else if (e.target.id === 'input-item') {
    enableButton();
    console.log(document.querySelector('#input-item').value);
  }
};

function handleSideBarButtons(e) {
  e.preventDefault();
  if (e.target.id === 'button-add') {
    console.log("add item!");
    addTask();
  }
  else if (e.target.id === 'button-create') {
    console.log('create!');
  }
  else if (e.target.id === 'button-clear') {
    console.log('clear!');
  }
  else if (e.target.id === 'button-filter') {
    console.log('filter!');
  }
};


function addTask() {
  var taskItem = document.querySelector('#input-item').value;
  var listItems = document.querySelector('#list-items');
  listItems.insertAdjacentHTML('afterbegin', `
    <li>${taskItem}</li>`);
  document.querySelector('#input-item').value = '';
  enableButton();
};

function enableButton() {
  document.querySelector('#button-add').disabled = !document.querySelector('#input-item').value
  console.log("hi");
}