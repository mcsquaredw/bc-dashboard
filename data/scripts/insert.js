var fs = require("fs")
, spawn = require("child_process").spawn
, child = spawn("sqlite3", ["./data/database/gdn.db"]);

fs.createReadStream("./data/sql/area.sql").pipe(child.stdin);
fs.createReadStream("./data/sql/call_purpose.sql").pipe(child.stdin);
fs.createReadStream("./data/sql/call_type.sql").pipe(child.stdin);
fs.createReadStream("./data/sql/call_log.sql").pipe(child.stdin);
