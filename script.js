const WORDS = "https://raw.githubusercontent.com/CodeBrauer/1000-most-common-words/master/1000-common-english-words.txt";

window.data = {
  numpasswords: 10,
  numwords: 4,
  minwordlength: 3,
  maxwordlength: 5,
  maxlength: 26,
  easytype: false,
  numbersub: false,
}

const NUMBER_DICT = {
  "a": 4,
  "b": 6,
  "o": 0,
  "i": 1,
  "e": 3,
  "s": 5,
}

function numberSub(word) {
  const chars = word.toLowerCase().split("");

  return chars.map(function(cur) {
    if (cur in NUMBER_DICT) {
      return NUMBER_DICT[cur];
    }
    return cur;
  }).join("");
}

function doubleLetter(words) {
  return words.filter(function(word) {
    const chars = word.toLowerCase().split("");

    let prev = chars[0];
    for (let i = 1; i < chars.length; i = i + 1) {
      if (prev == chars[i]) {
      console.log("true");
        return true;
      }
      prev = chars[i];
    }
      console.log("false");
    return false;
  });
}

function getWords(words) {
  return fetch(words)
    .then(function (response) {
      return response.text();
    }).then(function (text) {
      return text.split("\n");
    });
}

function sum(list) {
  return list.reduce(function(a, b) {return a + b}, 0)
}

function pickRandWithIndex(index) {
  let newindex = index;
  if (index < minwordlength) {
    newindex = 0;
  }
  if (index > maxwordlength) {
    newindex = maxwordlength;
  }

  console.log(newindex);
  const list = window.dict[newindex];

  return list[Math.floor(Math.random()*list.length)];
}

function randGen() {
  let randlist = [Infinity];
  let thesum = sum(randlist);

  while (thesum > window.data.maxlength) {
    randlist = [];

    for (let i = 0; i < window.data.numwords; i = i + 1) {
      // inclusive rand from a <= x <= b
      const randnum = Math.floor(Math.random() *
        (window.data.maxwordlength + 1 - window.data.minwordlength) + window.data.minwordlength)
      const newRandWord = pickRandWithIndex(randnum);

      console.log(newRandWord);
      randlist = randlist.concat(newRandWord);
    }

    thesum = sum(randlist);
  }

  return randlist;
}

function tableGen(data, options) {
  if (typeof options === "undefined") {
    options = [];
  }

  const tableContent = data.reduce(function (acc, col) {
    const row = col.reduce(function (acc, cell) {

      // apply function list to cell
      const cellnew = options.reduce(function (acc, fun) {
        return fun(acc)
      }, cell);

      return acc + "<td>" + cellnew + "</td>";
    }, "")
    return acc + "<tr>" + row + "</tr>";
  }, "")
  return "<table>" + tableContent + "</table>";
}

function setTable() {
  // use proper dict
  window.dict = (window.data.easytype) ? window.dict_easy : window.dict_full;

  if (window.data.numwords * window.data.minwordlength > window.data.maxlength) {
    alert("Not Possible");
    return;
  }

  document.getElementById("passwordtable").innerHTML = "<h2>loading</h2>";

  const tableList = Array.from({length: window.data.numpasswords}).map(function () {
    return randGen();
  })

  // apply numberSub if neccesary
  const tablevalues = tableGen(tableList, (window.data.numbersub) ? [numberSub] : []);
  document.getElementById("passwordtable").innerHTML = tablevalues;
}

function onChange() {
  const key = this.id;

  switch(this.type) {
    case "checkbox":
      window.data[key] = this.checked;
      break;
    default:
      window.data[key] = this.value;
  }
}

function setVal(elem) {
  const key = elem.id;

  switch(elem.type) {
    case "checkbox":
      elem.checked = window.data[key];
      break;
    default:
      elem.value = window.data[key];
  }
}

function wordsToDict(words) {
  const dict = words.reduce(function (acc, cur) {
    const len = cur.length;

    if (len <= 0) {
      return acc;
    }

    if (!(len in acc)) {
      acc[len] = [];
    }

    acc[len] = acc[len].concat(cur);
    return acc;
  }, {});

  const keys = Object.keys(dict);
  const max = Math.max.apply(Math, keys);
  const min = Math.min.apply(Math, keys);

  return {
    max: max,
    min: min,
    dict: dict,
  };
}

function setup(data) {
  Object.keys(data).forEach(function (key) {
    const elem = document.getElementById(key);
    if (elem === undefined || elem === null) {
      return;
    }
    setVal(elem);
    elem.onchange = onChange;
  })
}

function main() {
  // hide root element until dict shown
  const root = document.getElementById("root");
  root.style.display = "none";

  const submit = document.getElementById("submit");
  submit.onclick = setTable;

  console.log(numberSub("hello"));

  setup(data);

  getWords(WORDS).then(function(data) {
    const dict_easy = wordsToDict(doubleLetter(data));
    const dict_full = wordsToDict(data);

    window.dict_easy = dict_easy.dict;
    window.dict_full = dict_full.dict;
    window.dict = window.dict_full;
    window.max = dict.max;
    window.min = dict.min;
    console.log(dict);
  }).then(function() {
    root.style.display = "grid";
  })
}

window.onload = main;
