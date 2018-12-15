const fs = require("fs");
const path = require("path");
const marked = require("marked");

// const mainmd = fs.readFileSync(path.join(__dirname, "main.md"), "utf8");
const mainmd = fs.readFileSync("main.md", "utf8");

const tokens = marked.lexer(mainmd);

const acceptedNames = [
  "寄生部位",
  "对人感染期",
  "形态",
  "生活史",
  "致病",
  "诊断",
  "治疗"
];
const sepReg = /[:：]/;
const htmlPrepend = `
<html>
  <head>
    <!-- The first thing in any HTML file should be the charset -->
    <meta charset="utf-8">
    <link rel="stylesheet" href="../Templates/solarized-light.min.css">
    <style>body{max-width:2000px;min-width:1000px;padding:0;margin:0;}ul{padding-left:15px;}</style>
  </head>
  <body>
`;
const htmlPostpend = `
  </body>
</html>
`;

let prevHeadings = [];
let prevHeadingLevel = -1;
let output = [];
let outputDetail = [];
let outputHtml = [];
let listLevel = 0;
let listItemLevel = 0;
let parentItemLevel = null;
let listContext = []; // Recording header-level drugs
let itemContext = []; // Recording item-level drugs
let listAccept = false;
let itemAccept = false;

function flushList() {
  if (!listAccept) return;

  let currentItem = {};
  currentItem.genre = prevHeadings[prevHeadingLevel - 1];
  currentItem.name = prevHeadings[prevHeadingLevel];
  currentItem.type = "list";
  currentItem.content = listContext;
  currentItem.content.links = {};

  output = output.concat(currentItem);
  currentItem = {};
}

function flushItem() {
  if (!itemAccept) return;

  let currentItem = {};
  currentItem.genre = prevHeadings[prevHeadingLevel - 1];
  currentItem.name = prevHeadings[prevHeadingLevel];
  currentItem.type = "item";
  currentItem.content = itemContext;
  currentItem.content.links = {};

  output = output.concat(currentItem);
  currentItem = {};
}

function parseList(list, detailItemLevel = 1) {
  let output = {};
  let itemLevel = 0;
  let item = null;

  function getDetailFromItem(itemList) {
    if (itemList.length < 6) {
      // One-line item
      const detailItem = itemList.find(i => i.type === "text");
      if (detailItem !== undefined) {
        const detail = detailItem.text;
        const sepLoc = sepReg.exec(detail);
        if (sepLoc !== null) {
          const key = detail.slice(0, sepLoc.index);
          const value = detail.slice(sepLoc.index + 1);
          output[key] = [{ type: "text", text: value }];
          output[key].links = {};
        }
      }
    } else {
      // Multi-line item
      const detailItem = itemList.find(i => i.type === "text");
      if (detailItem !== undefined) {
        let key;
        const detail = detailItem.text;
        const sepLoc = sepReg.exec(detail);
        if (sepLoc !== null) {
          key = detail.slice(0, sepLoc.index);
        } else {
          key = detail;
        }
        // Remove first and last <li></li> component
        output[key] = itemList.slice(1, itemList.length - 1);
        output[key].links = {};
      } else {
        console.log("Unexpected non-text detailItem");
      }
    }
  }

  list.forEach(function(token) {
    if (item !== null) {
      item = item.concat(token);
    }
    switch (token.type) {
      case "list_item_start":
        itemLevel += 1;
        if (itemLevel === detailItemLevel) {
          item = [token];
        }
        break;
      case "list_item_end":
        itemLevel -= 1;
        if (itemLevel === detailItemLevel - 1) {
          getDetailFromItem(item);
          item = null;
        }
        break;
    }
  });
  return output;
}

function parseItem(itemList) {
  return parseList(itemList, 2);
}

function detailizeItem(item) {
  if (item.type === "item") {
    const detail = parseItem(item.content);
    const detailItem = item.content.find(i => i.type === "text");
    if (detailItem !== undefined) {
      item.name = detailItem.text;
    }
    return Object.assign({}, detail, { name: item.name, genre: item.genre });
  } else if (item.type === "list") {
    const detail = parseList(item.content, 1);
    return Object.assign({}, detail, { name: item.name, genre: item.genre });
  }
}

function getHtml(detailList) {
  let table = "<table>";
  /* header */
  table += "<th><td>章节</td>";
  acceptedNames.forEach(function(name) {
    table += `<td>${name}</td>`;
  });
  table += "</th>";

  /* content */
  detailList.forEach(function(detail) {
    table += `<tr><td>${detail.name}</td><td>${detail.genre}</td>`;
    acceptedNames.forEach(function(name) {
      table += `<td>${detail[name] || ""}</td>`;
    });
    table += "</tr>";
  });

  table += "</table>";
  return htmlPrepend + table + htmlPostpend;
}

function getCsv(detailList) {
  let table = "";
  /* header */
  table += ",";
  acceptedNames.forEach(function(name) {
    table += `,"${name}"`;
  });
  table += "\n";

  /* content */
  detailList.forEach(function(detail) {
    table += `"${detail.name}"`;
    acceptedNames.forEach(function(name) {
      table += `,"${detail[name] || ""}"`;
    });
    table += "\n";
  });

  return table;
}

tokens.forEach(function(token) {
  if (listContext !== null) {
    listContext = listContext.concat(token);
  }
  if (itemContext !== null) {
    itemContext = itemContext.concat(token);
  }

  switch (token.type) {
    case "list_end":
      listLevel -= 1;
      if (listLevel == 0) {
        flushList();
        listContext = null;
      }
      break;
    case "list_start":
      listLevel += 1;
      if (listLevel == 1) {
        listContext = [token];
        listAccept = false;
      }
      break;
    case "list_item_end":
      listItemLevel -= 1;
      if (listItemLevel == 0) {
        flushItem();
        itemContext = null;
      }
      break;
    case "list_item_start":
      listItemLevel += 1;
      if (listItemLevel == 1) {
        itemContext = [token];
        itemAccept = false;
      }
      break;
    case "heading":
      prevHeadingLevel = token.depth;
      prevHeadings[token.depth] = token.text;
      break;
    case "text": {
      if ((listLevel === 1 && listAccept) || (listLevel === 2 && itemAccept)) {
        break;
      }
      let text;
      const sep = sepReg.exec(token.text);
      if (sep !== null) {
        text = token.text.slice(0, sep.index);
      } else {
        text = token.text;
      }
      if (acceptedNames.indexOf(text) !== -1) {
        if (listLevel === 1) {
          // Is list-level drug
          listAccept = true;
        }
        if (listLevel === 2) {
          // Is item-level drug
          itemAccept = true;
        }
      }
      break;
    }
  }
});

outputDetail = output.map(detailizeItem);
outputHtml = outputDetail.map(function(det) {
  let output = {};
  output.name = det.name;
  output.genre = det.genre;
  for (key in det) {
    if (key !== "name" && key !== "genre") {
      output[key] = marked.parser(det[key]);
    }
  }
  return output;
});

fs.writeFileSync("table.html", getHtml(outputHtml));
fs.writeFileSync("table.csv", getCsv(outputHtml));
