DROP TABLE IF EXISTS call_type;

CREATE TABLE call_type (  id Integer Primary Key, label Varchar );

INSERT INTO call_type ( label ) VALUES
( "Incoming Call" ),
( "Call Centre" ),
( "Web" );
