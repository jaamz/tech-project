const bcrypt                = require('bcryptjs');
const saltRounds            = 10;
let db = require('../config/db');

const login = async (req, res) => {
    try{
        let loginUser = req.body;
        if(loginUser !== undefined) {
            let foundUserName = await db.one(`
                SELECT * 
                FROM User_Login
                WHERE User_login.username = $1
            `, [loginUser.username]);
            let passwordApproved = await checkHash(loginUser.password, foundUserName.password);
            if(passwordApproved) {
                res.status(200).send({message: "You are logged in"});
            } else {
                res.status(500).send({error: "Your login failed"});
            }
        } else {
            res.status(500).send({error: "Your login failed"});
        }
    } catch (e) {
        res.status(500).send({message: e.message});
    }

}

const signup = async (req, res) => {
    try{
        let newUser = req.body;
        let { username, password, isAdmin } = newUser;

        if(!(await userExists(newUser))) {
            password = await saltPassword(newUser.password);
            let user = await db.one(
                `INSERT INTO User_Login (username, password, isAdmin)
                 VALUES  ($1, $2, $3) 
                 RETURNING User_Login.username, User_Login.password, User_Login.isAdmin`,
                 [username, password, isAdmin]
            )
            res.status(200).send({ user });
        } else {
            res.status(400).send({ "Error": `Username: ${username} already exists.`})
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

const getAllUsers = async (req, res) => {
    try{
        let users = await db.any(
            `SELECT * 
             FROM User_Login`
        );
        res.status(200).send({users});
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        let user_id = parseInt(req.params.id);
        let employee = await db.one(`SELECT * 
                                     FROM User_Login
                                     WHERE user_id = $1`, user_id)
        await db.none(`DELETE FROM User_Login WHERE user_id = $1`, user_id)
        res.status(200).send({employee});
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}

const updateUser = async (req, res) => {
    try {
        let { username, password, isAdmin } = req.body;
        let user_id = parseInt(req.params.id);
        password = await saltPassword(password);
        await db.any('UPDATE User_Login SET username = $1, password = $2, isAdmin = $3 WHERE user_id = $4', 
                    [username, password, isAdmin, user_id])
        let newEmployee = await db.one('SELECT * FROM User_Login WHERE user_id = $1', user_id);
        res.status(200).json({ message: newEmployee })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

/**
 * Helper functions for salting and checking hash
 */
const saltPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds)
}

const checkHash = async (password, hashPw) => { 
    let authenticated = await bcrypt.compareSync(password, hashPw);
    console.log("Inside check hash: ", authenticated);  
    return authenticated;
}

const userExists = async (newUser) => {
    try {
        let foundUserName = await db.one(`
        SELECT * 
        FROM User_Login
        WHERE username = $1
    `, [newUser.username])
    return true;
    } catch (e) {
        console.log("Did not find user");
        return false;
    }
}

module.exports = { login, signup, getAllUsers, deleteUser, updateUser }
