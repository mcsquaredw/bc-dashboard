DROP TABLE IF EXISTS call_purpose;

CREATE TABLE call_purpose (  id Integer Primary Key, label Varchar );

INSERT INTO call_purpose ( label ) VALUES
  ("Sales Lead"),
  ("Repair"),
  ("Cancellation"),
  ("Not Available"),
  ("Out of Area"),
  ("Phone Quote"),
  ("Technical Query"),
  ("Change Appointment"),
  ("Confirm Appointment"),
  ("Already Booked In"),
  ("Wrong Number"),
  ("Sales Call"),
  ("Call Dropped"),
  ("Supply"),
  ("Service"),
  ("Showroom"),
  ("Weekends/Out of Hours"),
  ("Insurance");
