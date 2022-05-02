import UserModel from '/models/User';
import "/utils/dbconnect";

// lib -> users -> All JS function that I use across the project.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export function verifyToken(token) {
    return jwt.verify(token, jwtSecretKey);
}
  

function hashPassword(password) {
    return bcrypt.hashSync(password, salt);
}
function  checkPassword(currentHashedPassword, hashedPassword) {
    return bcrypt.compare(currentHashedPassword, hashedPassword)
  }
  
export default async  (req, res) => {
    const {  username, password } = JSON.parse(req.body);
    if (!username || !password) {
        res.status(400).json({ 
            isSuccessful: false,
            err : `Both Username and Password are required.`
        })
    }
  
    let users = await UserModel.findOne({ username: username }); 
    if (!users){
        res.status(400).json({ 
            isSuccessful: false,
            err : `USER_NOT_FOUND !(^_^)`
        })
    }
    else{
        // console.log(checkPassword(password, users.password));
        let ch = await checkPassword(password, users.password)
        if (!ch) {
            res.status(400).json({ 
                isSuccessful: false,
                err : `Your Password is wrong. Shame on you!(^_^)`
            })
        }
        else{
        // Create new token by username
        const token = jwt.sign({ username: users.username, email: users.email, id: users.id }, jwtSecretKey, {
            expiresIn: 3000, // 50min
        });
        res.status(200).json({ 
            isSuccessful: true,
            token : token
        })      
        }
    }
  
  
  
  }