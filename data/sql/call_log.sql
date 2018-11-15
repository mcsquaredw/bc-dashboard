DROP TABLE IF EXISTS call_log;

CREATE TABLE call_log (
   id Integer Primary Key, 
  area_id INTEGER,
  call_type_id INTEGER,
  call_purpose_id INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(area_id) REFERENCES area(rowid),
  FOREIGN KEY(call_type_id) REFERENCES call_type(rowid),
  FOREIGN KEY(call_purpose_id) REFERENCES call_purpose(rowid)
);
