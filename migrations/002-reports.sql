-- UP

CREATE TABLE Reports (
    reportDate TEXT NOT NULL,
    reportType TEXT NOT NULL,
    PRIMARY KEY(reportDate, reportType)
);

-- DOWN

DROP TABLE Reports;