const { ipcRenderer } = require("electron");

// DOM nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url')

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