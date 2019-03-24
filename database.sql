
CREATE TABLE "thangs-table"
(
    -- This tells the db to generate unique keys for us
    "id" serial primary key,
    "thang_name" varchar(200) NOT NULL,
    "thang_date" date,
    "completed" boolean
);

INSERT INTO "thangs-table"
    ("thang_name", "thang_date", "completed")
VALUES
    ('Finish the base requirements of this assignment', '03/25/19', false);