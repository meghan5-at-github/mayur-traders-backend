// user.js
const express = require('express');
const router = express.Router();
const connection = require('./db');

console.log("add_user ");


router.get('/get_user', (req, res) => {
    console.log("get_user ", req);
    const query = 'Select * from users_tbl';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error inserting user details:', err);
            return res.status(500).send('An error occurred');
        }
        console.log("results :: ", results);
        res.status(201).json({ "status": 1, "message": 'Users fetched Successfully', "data": results });
    });
});

router.post('/add_user', (req, res) => {
    console.log("add_user ", req.body);

    const { name, email_id, password, phone_number, role, vehicle_number, joining_date, is_deleted, address } = req.body;

    if (!name || !email_id || !password) {
        return res.status(400).send('All fields are required');
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updated_at = created_at;

    const getNextUserIdQuery = 'SELECT userId FROM users_tbl ORDER BY userId DESC LIMIT 1';
    console.log("get last user id", getNextUserIdQuery);
    connection.query(getNextUserIdQuery, (err, results) => {
        if (err) {
            console.error('Error fetching latest user ID:', err);
            return res.status(500).json({ "status": 0, "message": err.message });
        }

        let newUserId;
        console.log("get results ::", results);

        if (results.length > 0) {
            const lastUserId = results[0].userId;
            const lastUserIdNumber = parseInt(lastUserId.replace('MT', ''), 10);
            newUserId = 'MT' + (lastUserIdNumber + 1).toString().padStart(4, '0');
        } else {
            newUserId = 'MT0001';
        }

        const insertUserQuery = 'INSERT INTO users_tbl (userId, name, email_id, password, phone_number, role, vehicle_number, joining_date, is_deleted, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        console.log("insert query :: ", insertUserQuery + "newUserId: ", newUserId);
        connection.query(insertUserQuery, [newUserId, name, email_id, password, phone_number, role, vehicle_number, joining_date, is_deleted, address, created_at, updated_at], (err, results) => {
            if (err) {
                console.error('Error inserting user details:', err);
                return res.status(500).json({ "status": 0, "message": err.message });
            }
            console.log("results :: ", results);
            res.status(201).json({ "status": 1, "message": 'User created successfully' });
        });
    });
});


//update
router.put('/update_user/:id', (req, res) => {
    const { id } = req.params;
    const {
        name,
        email_id,
        phone_number,
        role,
        address,
        vehicle_number,
        joining_date,
        is_deleted
    } = req.body;



    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      UPDATE users_tbl SET 
        name = ?, 
        email_id = ?, 
        phone_number = ?, 
        role = ?, 
        address = ?,
        vehicle_number = ?, 
        joining_date = ?, 
        is_deleted = ?, 
        updated_at = ?
      WHERE id = ?`;

    connection.query(
        query,
        [name, email_id, phone_number, role, address, vehicle_number, joining_date, is_deleted, updated_at, id],
        (err, results) => {
            if (err) {
                console.error('Error updating user details:', err);
                return res.status(500).json({ status: 0, message: 'An error occurred' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ status: 0, message: 'User not found' });
            }
            res.status(200).json({ status: 1, message: 'User updated successfully' });
        });
});

// Delete user route
router.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM users_tbl WHERE id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ status: 0, message: 'An error occurred' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 0, message: 'User not found' });
        }
        res.status(200).json({ status: 1, message: 'User deleted successfully' });
    });
});


module.exports = router;
