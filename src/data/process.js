const fs = require("fs");
const _ = require("lodash");

const raw = require("./output_domain.osm_metadata.json");
console.log("RAW: " + JSON.stringify(raw.length));
let processed = _.filter(raw, function(record) {
    "use strict";
    return record.name !== null;
});

console.log("PROCESSED: " + JSON.stringify(processed.length));

fs.writeFileSync("./processed.json", JSON.stringify(processed), "utf8");