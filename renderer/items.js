let items = document.getElementById('items');

// Track items
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Persist storage 
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

// Add new item
exports.addItem = (newItem, isNew = false) => {
  // Create a new DOM node
  let node = document.createElement('div');
  node.setAttribute('class', 'read-item');

  node.innerHTML = `
    <img src="${newItem.screenshot}" alt="">
    <h2>${newItem.title}</h2>
  `;

  items.appendChild(node);

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(newItem);
    this.save();
  }
}

// Add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item);
});