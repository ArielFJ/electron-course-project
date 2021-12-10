let items = document.getElementById('items');

// Track items
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Persist storage 
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

// Add new item
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let node = document.createElement('div');
  node.setAttribute('class', 'read-item');
  node.setAttribute('data-url', item.url);

  node.innerHTML = `
    <img src="${item.screenshot}" alt="">
    <h2>${item.title}</h2>
  `;

  items.appendChild(node);

  // Attach click handler to select
  node.addEventListener('click', this.select);

  // Attach doubleClick handler to open
  node.addEventListener('dblclick', this.open);

  // Select the first item
  if (document.getElementsByClassName('read-item').length === 1) {
    node.classList.add('selected');
  }

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
}

// Open selected item
exports.open = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;

  // Get selected item
  let selectedItem = document.getElementsByClassName('read-item selected')[0];

  // Get item's url
  let contentUrl = selectedItem.dataset.url;

  console.log('Opening item: ', contentUrl);
}

// Move to newly selected item
exports.changeSelection = direction => {
  // Get selected item
  let currentItem = document.getElementsByClassName('read-item selected')[0];

  // Handle up/down
  if (direction === 'ArrowUp' && currentItem.previousElementSibling){
    currentItem.classList.remove('selected');
    currentItem.previousElementSibling.classList.add('selected');
  } 
  else if (direction === 'ArrowDown' && currentItem.nextElementSibling){
    currentItem.classList.remove('selected');
    currentItem.nextElementSibling.classList.add('selected');
  }
}

// Set item as selected
exports.select = e => {
  // Remove currently selected item class
  document.getElementsByClassName('read-item selected')[0].classList.remove('selected');

  // Add to clicked item
  e.currentTarget.classList.add('selected');
}

// Add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item);
});
