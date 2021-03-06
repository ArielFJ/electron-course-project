const { ipcRenderer } = require("electron");
const items = require('./items');

// DOM nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search');

// Change text in search bar, depending on platform
if (process.platform === 'darwin') {
  search.setAttribute('placeholder', 'Search (Cmd + S)');
}
else {
  search.setAttribute('placeholder', 'Search (Ctrl + S)');
}


// Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
  showModal.click();
});

// Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
  items.open();
})

// Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
})

// Open item in native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
  items.openNative();
})

// Focus search input from the menu
ipcRenderer.on('menu-focus-search', () => {
  search.focus();
})

// Disable and enable modal buttons
const toggleModalButtons = () => {
  if (addItem.disabled) {
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.style.opacity = .5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
  addItem.disabled = !addItem.disabled;
}

// Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex';
  itemUrl.focus();
});

// Close modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none';
});

// Handle new item
addItem.addEventListener('click', e => {
  // Check a url exists
  if (itemUrl.value) {
    // Send new item url to main process
    ipcRenderer.send('new-item', itemUrl.value);
    toggleModalButtons();
  }
});

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // Add new item to "items" node
  items.addItem(newItem, isNew = true);

  toggleModalButtons();
  modal.style.display = 'none';
  itemUrl.value = '';
})

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
  if (e.key == 'Enter') {
    addItem.click();
  }
});

// Filter items with "search"
search.addEventListener('keyup', e => {

  // Loop items
  Array.from(document.getElementsByClassName('read-item'))
    .forEach(item => {
      let hasMatch = item.innerText.toLowerCase().includes(search.value);
      item.style.display = hasMatch ? 'flex' : 'none';
    });
})

// Navigate item selection with up or down arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
})