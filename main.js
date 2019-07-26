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
}

function handleSideBarInputs(e) {
  e.preventDefault();
  if (e.target.id === 'input-title') {
    console.log(document.querySelector('#input-title').value);
  }
  else if (e.target.id === 'input-item') {
    console.log(document.querySelector('#input-item').value);
  }
}

function handleSideBarButtons(e) {
  e.preventDefault();
  if (e.target.id === 'button-add') {
    console.log(e);
  }
  else if (e.target.id === 'button-create') {
    console.log(e);
  }
  else if (e.target.id === 'button-clear') {
    console.log(e);
  }
  else if (e.target.id === 'button-filter') {
    console.log(e);
  }
}
