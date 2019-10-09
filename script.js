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

function rand() {
  return Math.floor(Math.random() * (window.data.maxwordlength - window.data.minwordlength) + window.data.minwordlength);
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

// function allPossible() {
//   function helper(list) {
//     return
//
//   }
//   const min = window.data.minwordlength;
//   const max = window.data.maxwordlength;
//   const maxlen = window.data.maxlength;
//   const numwords = window.data.numwords;
//
//   allPossible()
// }

function randGen() {
  let randlist = [Infinity];
  let thesum = sum(randlist);

  while (thesum > window.data.maxlength) {
    randlist = [];

    for (let i = 0; i < window.data.numwords; i = i + 1) {
      const newRandWord = pickRandWithIndex(rand());
      console.log(newRandWord);
      randlist = randlist.concat(newRandWord);
    }

    thesum = sum(randlist);
  }

  return randlist;
}

function tableGen(data) {
  const tableContent = data.reduce(function (acc, col) {
    const row = col.reduce(function (acc, cell) {
      return acc + "<td>" + cell + "</td>";
    }, "")
    return acc + "<tr>" + row + "</tr>";
  }, "")
  return "<table>" + tableContent + "</table>";
}

function setTable() {
  if (window.data.numwords * window.data.minwordlength > window.data.maxlength) {
    alert("Not Possible");
    return;
  }

  document.getElementById("passwordtable").innerHTML = "<h2>loading</h2>";

  const tableList = Array.from({length: window.data.numpasswords}).map(function () {
    return randGen();
  })

  document.getElementById("passwordtable").innerHTML = tableGen(tableList);
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
  Object.keys(data).forEach(function(key) {
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

  setup(data);

  getWords(WORDS).then(function(data) {
    const dict = wordsToDict(data);

    window.dict = dict.dict;
    window.max = dict.max;
    window.min = dict.min;
    console.log(dict);
  }).then(function() {
    root.style.display = "block";
  })
}

window.onload = main;
