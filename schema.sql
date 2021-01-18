drop database if exists directory_db;

create database directory_db;

use directory_db;

create table departments (
    id int not null auto_increment,
    name varchar(30) not null,
    primary key (id)
);

use directory_db;

create table roles (
    id int not null auto_increment,
    title varchar(30) not null,
    salary decimal(20,2),
    department_id int not null,
    primary key (id)
);

use directory_db;

create table employees (
    id int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    primary key (id)
);

