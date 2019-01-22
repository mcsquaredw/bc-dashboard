-- UP

CREATE TABLE Person (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personName TEXT NOT NULL UNIQUE,
    latitude TEXT,
    longitude TEXT,
    speed INTEGER,
    registration TEXT
);

CREATE TABLE Customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    postcode TEXT NOT NULL
);

CREATE TABLE JobType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    typeName TEXT NOT NULL UNIQUE
);

CREATE TABLE Question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questionText TEXT NOT NULL UNIQUE
);

CREATE TABLE Job (
    id INTEGER PRIMARY KEY,
    jobTypeId INTEGER NOT NULL,
    personId INTEGER NOT NULL,
    customerId INTEGER NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    notified INTEGER NOT NULL,
    FOREIGN KEY(jobTypeId) REFERENCES JobType(id),
    FOREIGN KEY(personId) REFERENCES Person(id),
    FOREIGN KEY(customerId) REFERENCES Customer(id)
);

CREATE TABLE Answer (
    id INTEGER PRIMARY KEY,
    questionId INTEGER NOT NULL,
    answerText TEXT NOT NULL,
    FOREIGN KEY(questionId) REFERENCES Question(id)
);

-- DOWN

DROP TABLE Answer;
DROP TABLE Question;
DROP TABLE Job;
DROP TABLE JobType;
DROP TABLE Person;
DROP TABLE Customer;
