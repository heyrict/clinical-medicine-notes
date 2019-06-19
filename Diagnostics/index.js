const fs = require("fs");
const path = require("path");
const marked = require("marked");

// const mainmd = fs.readFileSync(path.join(__dirname, "main.md"), "utf8");
const mainmd = fs.readFileSync("main.md", "utf8");

const tokens = marked.lexer(mainmd);

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

let prevListHeading = [];
let prevText = "";
let output = [];
let outputDetail = [];
let outputHtml = [];
let listLevel = 0;
let listItemLevel = 0;

function flushItem(currentItem) {
  output = output.concat(
    Object.assign({}, { index: prevListHeading[listItemLevel] }, currentItem)
  );
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
          output["key"] = [{ type: "text", text: key }];
          output["value"] = [{ type: "text", text: value }];
          output["key"].links = {};
          output["value"].links = {};
        }
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
  table += "<th>指标</th><th>范围</th>";

  /* content */
  detailList.forEach(function(detail) {
    table += `<tr><td>${detail.index} ${detail.key}</td><td>${
      detail.value
    }</td></tr>`;
  });

  table += "</table>";
  return htmlPrepend + table + htmlPostpend;
}

function getCsv(detailList) {
  let table = "";
  /* header */
  table += "指标,范围";
  table += "\n";

  /* content */
  detailList.forEach(function(detail) {
    table += `"${detail.index} → ${detail.key}","${detail.value}"`;
    table += "\n";
  });

  return table;
}

tokens.forEach(function(token) {
  switch (token.type) {
    case "list_end":
      listLevel -= 1;
      break;
    case "list_start":
      listLevel += 1;
      prevListHeading[listLevel] = prevText;
      break;
    case "list_item_end":
      listItemLevel -= 1;
      break;
    case "list_item_start":
      listItemLevel += 1;
      break;
    case "text": {
      let key, value;
      prevText = token.text;
      if (token.text.indexOf("参考值") !== -1) {
        const sep = sepReg.exec(token.text);
        if (sep !== null) {
          key = token.text.slice(0, sep.index);
          value = token.text.slice(sep.index + 1);
        }
        flushItem({ key: key, value: value });
      }
      break;
    }
  }
});

fs.writeFileSync("table.html", getHtml(output));
fs.writeFileSync("table.csv", getCsv(output));
