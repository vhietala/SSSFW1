'use strict';
const modal = document.getElementById('modal');
const span = document.getElementsByClassName('close')[0];
const closeButton = document.getElementById('close-button');
const prevButton = document.getElementById('previous-sort');
const nextButton = document.getElementById('next-sort');
let picArray = [];
const filteredArray = [];

const fillDiv = itemsArray => {
  for (const item of itemsArray) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('h1');
    const details = document.createElement('p');
    const button = document.createElement('button');
    const date = document.createElement('p');
    img.src = item.thumbnail;
    div.className = 'kitten';
    title.textContent = item.title;
    details.textContent = item.details;
    button.textContent = 'View';
    const imgDate = new Date(item.time);
    date.textContent = imgDate.toLocaleDateString();
    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(details);
    div.appendChild(date);
    div.appendChild(button);
    button.addEventListener('click', evt => {
      console.log(evt.target);
      document.querySelector(modalImage).setAttribute('src', item.image);
      document.getElementById('modal-header').innerHTML = item.title;
      modal.style.display = 'block';
      initMap(item);
      console.log(item.title);
    });
    document.querySelector(container).appendChild(div);
  }
};

const initMap = item => {
  const myLatLng = {lat: item.coordinates.lat, lng: item.coordinates.lng};

  const map = new google.maps.Map(document.getElementById('modal-map'), {
    center: myLatLng,
    zoom: 10,
  });
  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: item.title,
  });
};

const dynamicSort = property => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a, b) => {
    let result = (a[property] < b[property]) ?
        -1 :
        (a[property] > b[property]) ?
            1 :
            0;
    return result * sortOrder;
  };
};

const categoryButtonsDiv = '.category-buttons';

const addCategoryButtons = items => {
  const buttonAll = document.createElement('button');
  buttonAll.textContent = 'All';
  buttonAll.addEventListener('click', evt => {
    clearContainer();
    fillDiv(this.picArray);
    this.filteredArray = this.picArray;
  });
  document.querySelector(categoryButtonsDiv).appendChild(buttonAll);

  const itemCategories = items.map(item => item.category).
      sort().
      reduce((accumulator, current) => {
        const length = accumulator.length;
        if (length === 0 || accumulator[length - 1] !== current) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
  console.log(itemCategories);
  for (const item of itemCategories) {
    const button = document.createElement('button');
    button.textContent = item;
    button.addEventListener('click', evt => {
      console.log(evt.target);
      clearContainer();
      this.filteredArray = this.picArray.filter(c => c.category === item);
      fillDiv(this.filteredArray);
      console.log(item.title);
    });
    document.querySelector(categoryButtonsDiv).appendChild(button);
  }
};

fetch('pics.json').then(res => {
  return res.json();
}).then(data => {
  console.log(data);
  this.picArray = data;
  console.log(this.picArray);
  fillDiv(this.picArray);
  addCategoryButtons(this.picArray);
  this.filteredArray = this.picArray;
});

span.onclick = () => {
  modal.style.display = 'none';
};

closeButton.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }

};

let sortIndex = 0;
const sorter = ['id', 'category', 'time'];

document.getElementById('sort-text').innerHTML = sorter[sortIndex];

const container = '.container';
const modalImage = '#modal-image';

const length = sorter.length;

const clearContainer = () => {
  document.querySelector(container).innerHTML = '';
};

prevButton.addEventListener('click', () => {
  if (sortIndex === 0) {
    sortIndex = length - 1;
  } else {
    sortIndex -= 1;
  }
  const items = this.filteredArray.sort(dynamicSort(sorter[sortIndex]));
  clearContainer();
  document.getElementById('sort-text').innerHTML = sorter[sortIndex];
  fillDiv(items);
  console.log(items);
});

nextButton.addEventListener('click', () => {
  if (sortIndex === length - 1) {
    sortIndex = 0;
  } else {
    sortIndex += 1;
  }
  const items = this.filteredArray.sort(dynamicSort(sorter[sortIndex]));
  clearContainer();
  document.getElementById('sort-text').innerHTML = sorter[sortIndex];
  fillDiv(items);
  console.log(items);
});



