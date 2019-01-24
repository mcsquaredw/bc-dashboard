-- UP

CREATE TABLE Notifications (
    JobId INTEGER NOT NULL,
    NotificationType TEXT NOT NULL,
    PRIMARY KEY(JobId, NotificationType)
);

-- DOWN

DROP TABLE Notifications;
