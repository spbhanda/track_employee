-- Insert into Department table
INSERT INTO department (name)
VALUES 
("Engineering"),
("Manufacturing"),
("Sales");

-- Insert into role table
INSERT INTO role (title, salary, department_id)
VALUES 
("Manager", 90000, 1), 
("Engineer", 80000, 1), 
("Liaison", 70000, 2), 
("Sales_person", 60000, 3);

-- Insert into Employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ("Shom", "Bhandari", 1, 1), 
    ("Dennis", "Ochora", 1, 1), 
    ("Dion", "Bhandari", 2, 3), 
    ("Tamara", "Schneider", 3, NULL), 
    ("Kaya", "Bhandari", 2, 2);


