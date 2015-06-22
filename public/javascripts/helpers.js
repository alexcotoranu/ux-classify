//function to create a GUID
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

//function to generate random HEX colour
function randomHexColour() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

//function to prevent enter key from submitting forms
function noenter() {
  return !(window.event && window.event.keyCode == 13); 
}