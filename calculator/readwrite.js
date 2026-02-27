const fs = require("fs");
//console.log("start");
//fs.readFile("input.txt", function (err, data) {
//if (err) return console.error(err);
//console.log(data.toString());
//});
//console.log("end");
fs.writeFile("output.txt", "Hello World!", function (err) {
  if (err) return console.error(err);
  console.log("File written successfully!");
});
