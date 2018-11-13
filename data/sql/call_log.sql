DROP TABLE IF EXISTS call_log;

CREATE TABLE call_log (
  area_id Int,
  call_type_id Int,
  call_purpose_id Int,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(area_id) REFERENCES area(rowid),
  FOREIGN KEY(call_type_id) REFERENCES call_type(rowid),
  FOREIGN KEY(call_purpose_id) REFERENCES call_purpose(rowid)
);
