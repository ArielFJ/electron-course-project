const fs = require('fs');

let items = document.getElementById('items');

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
})

// Track items
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Listen for "done" message from reader window
window.addEventListener('message', e => {

  // Check for correct message 
  if (e.data.action === 'delete-reader-item') {
    // Delete item at given index
    this.delete(e.data.itemIndex);

    // Close the reader window
    let browserWindowProxyInstance = e.source;
    browserWindowProxyInstance.close();
  }
});

// Get selected item index
exports.getSelectedItem = () => {
  let selectedItem = document.getElementsByClassName('read-item selected')[0];

  // Get item index
  let itemIndex = 0;
  let child = selectedItem;
  while ( (child = child.previousElementSibling) != null) itemIndex++;

  return {
    node: selectedItem,
    index: itemIndex
  }
};

// Delete item
exports.delete = itemIndex => {
  // Remove item from DOM
  items.removeChild(items.childNodes[itemIndex]);

  // Remove item from storage
  this.storage.splice(itemIndex, 1);
  this.save();

  // Select previous item or new top item
  if (this.storage.length) {
    // Get new selected item index
    let newSelectedIndex = itemIndex === 0 ? 0 : itemIndex - 1;
    
    // Select item at new index
    document.getElementsByClassName('read-item')[newSelectedIndex].classList.add('selected');
  }
}

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
  let selectedItem = this.getSelectedItem();

  // Get item's url
  let contentUrl = selectedItem.node.dataset.url;

  // Open item in proxy BrowserWindow
  let readerWin = window.open(contentUrl, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `);// We use 0 and 1 to represent true and false
  
  // Inject JavaScript
  // readerWin.eval(readerJS);

  // Inject JavaScript with specific item index 
  readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
}

// Move to newly selected item
exports.changeSelection = direction => {
  // Get selected item
  let currentItem = this.getSelectedItem().node;

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
  this.getSelectedItem().node.classList.remove('selected');

  // Add to clicked item
  e.currentTarget.classList.add('selected');
}

// Add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item);
});
