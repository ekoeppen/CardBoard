# CardBoard

A simple task board

# Schema

    CREATE TABLE deliverables (id integer primary key autoincrement not null, project_id integer, description text, status integer(1));
    CREATE TABLE people (id integer primary key autoincrement not null, name varchar(32), email varchar(64));
    CREATE TABLE projects (id integer primary key autoincrement not null, name varchar(255), description text, position int);
    CREATE TABLE tasks (id integer primary key autoincrement not null, project_id integer, description text, priotity integer(1), status integer(1), assignee_id integer);
