USE company_db;
INSERT INTO department (name) 
VALUES 
('Human Resources'),
('Engineering'),
('Finance'),
('Management'),
('Sales'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Talent Management Recruiter',80000,1),
('Talent Management Hiring Manager',100000,1),
('Talent Management Supporting Officer',75000,1),
('Talent Management Retaining Officer',75000,1),
('Benefits Practitioner',75000,1),
('Orientation Manager',65000,1),
('Training Manager',75000,1),
('Compensation Practitioner',80000,1),
('Project Manager',135000,2),
('Lead Engineer',120000,2),
('Sr. Engineer',105000,2),
('Jr. Engineer',85000,2),
('Financial Manager',130000,3),
('Sr. Analyst',110000,3),
('Jr. Analyst',85000,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
('Harry', 'James',2,null),
('Joe', 'Smith',1,1),
('Santiago', 'Erickson',3,1),
('Marguerite', 'Mccoy',4,1),
('Holly', 'Brock',9,null),
('Micheal', 'Jefferson',10,5),
('Alan', 'Collins',11,6),
('Christina', 'Lewis',12,7),
('Kenneth', 'Schultz',13,null),
('Dewey', 'May',14,9);