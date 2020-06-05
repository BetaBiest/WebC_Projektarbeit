function addPlayer (liItem_lastChild) {
  let numOfListItems = liItem_lastChild.parentElement.childElementCount;
  if(numOfListItems <= 4) {
    let new_liItem = document.createElement('li');
    new_liItem.innerHTML = '<li><input type="text" name="" id="" placeholder="Player ' + (numOfListItems - 1) + '"/></li>';
    liItem_lastChild.parentElement.insertBefore(new_liItem, liItem_lastChild);
  }
}

function remPlayer (liItem_lastChild) {
  let list = liItem_lastChild.parentElement;
  if(liItem_lastChild.parentElement.childElementCount > 2) {
    list.removeChild(liItem_lastChild.previousElementSibling);
  }
}