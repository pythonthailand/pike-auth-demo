import UserModel from '/models/User';
import PSModel from '/models/PWHistoty';
import "/utils/dbconnect";
import formidable from "formidable";
import fs from "fs";

const { passwordStrength } = require('check-password-strength')

// lib -> users -> All JS function that I use across the project.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

function hashPassword(password) {
    return bcrypt.hashSync(password, salt);
}
export const config = {
    api: {
      bodyParser: false
    }
  };
  
// ----------------------------------------------------------------
const post = async (req, res) => {

    // const {  username, password, email ,image } = JSON.parse(req.body);


    const form = new formidable.IncomingForm();
    

    form.parse(req, async function (err, fields, files) {
      const {  username, password, firstname, lastname } = fields

      
        
    let users = await UserModel.findOne({ username: username }); 

    let chck = await passwordStrength(password)

    if(users){
        res.status(200).json({ 
            isSuccessful: false,
            massage : `Username : ${users.username} is already exits.`
        })
    }
    else if(username.match((/^[A-Za-z0-9_.]+$/)) == null || username.length > 12){
        console.log(username)
        res.status(200).json({ 
            isSuccessful: false,
            massage : `Username allow A-Z 0-9_ & less than 12 characters`
        })

    }
    else if (password.length < 6){

        res.status(200).json({ 
            isSuccessful: false,
            massage : `Password less than 6 characters`
        })

    }
    else if (chck.value == 'Too weak'){
        res.status(200).json({ 
            isSuccessful: false,
            massage : chck.value
        })

    }

    else{

        const data = fs.readFileSync(files.file.path)
        fs.writeFileSync(`./public/image/${username}.png`, data)
        await fs.unlinkSync(files.file.path)
  
        const hashedPassword = hashPassword(password);
        const newData = new UserModel({
            username : username,
            password: hashedPassword,
            firstname : firstname,
            lastname : lastname,
            image:`/image/${username}.png`,
        });
        newData.save()
        .then(data => {
            console.log(data._id)
            const newPS = new PSModel({
                username : data._id,
                password : data.password
            })
            newPS.save()
            res.status(200).json({ 
                isSuccessful: true,
                massage : `Username : ${data.username} is register success`
            })
        })
        .catch(err => {
            res.status(400).json({ 
                isSuccessful: false,
                err : err
            })
        });
    }

    });

};


export default (req, res) => {
    req.method === "POST"
      ? post(req, res)
      : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
      ? console.log("DELETE")
      : req.method === "GET"
      ? console.log("GET")
      : res.status(404).send("");
  };
  