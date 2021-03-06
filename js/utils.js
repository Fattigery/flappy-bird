function createEle(eleName, classArr, styleObj) {
  let dom = document.createElement(eleName);
  for (let i = 0; i < classArr.length; i++) {
    dom.classList.add(classArr[i]);
  }
  for (let key in styleObj) {
    dom.style[key] = styleObj[key];
  }
  return dom;
}

function setLocal(key, value) {
  if (typeof value === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
}

function getLocal(key) {
  let value = localStorage.getItem(key);
  if (value === null) return value;
  if (value[0] === '[' || value[0] === '{') {
    return JSON.parse(value);
  }
  return value;
}

function formatNum(num) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}
