# CardBoard

A simple task board

# Installation

* Clone from github into a webserver reachable directory
* Make the application/cache and application/logs directories web server writable
* Make the main folder writable for the webserver in case sqlite is used
* Update Kohana:

    git submodule init
    git submodule update
    
* Create the database, e.g with sqlite using cardboard.sqlite3 as the database name, and make it writable
* Create a file called credentials which contains the password for people allowed to modify the board

# Schema

    CREATE TABLE deliverables (id integer primary key autoincrement not null, project_id integer, description text, status integer(1));
    CREATE TABLE people (id integer primary key autoincrement not null, name varchar(32), email varchar(64));
    CREATE TABLE projects (id integer primary key autoincrement not null, name varchar(255), description text, position int);
    CREATE TABLE tasks (id integer primary key autoincrement not null, project_id integer, description text, priotity integer(1), status integer(1), assignee_id integer);