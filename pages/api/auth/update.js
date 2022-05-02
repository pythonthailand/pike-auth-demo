import UserModel from '/models/User';
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
const put = async (req, res) => {

    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {

      const {  username,  firstname, lastname } = fields

        if (files.file) {
          const data = fs.readFileSync(files.file.path)
          fs.writeFileSync(`./public/image/${username}.png`, data)
          await fs.unlinkSync(files.file.path)
        }
        const filter = { username: username };
        const update = {firstname:firstname ,  lastname: lastname };
        let doc = await UserModel.findOneAndUpdate(filter, update, {new: true});
        if(doc){
          res.status(200).json({ 
            isSuccessful: true,
            massage : `Update success`
          })
        }


    });

};


export default (req, res) => {
        req.method === "POST"
      ? res.status(404).json({isSuccessful: false})
      : req.method === "PUT"
      ? put(req, res)
      : req.method === "DELETE"
      ? res.status(404).json({isSuccessful: false})
      : req.method === "GET"
      ? res.status(404).json({isSuccessful: false})
      : res.status(404).json({isSuccessful: false})
  };
  