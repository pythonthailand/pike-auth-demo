import UserModel from '/models/User';
import PSModel from '/models/PWHistoty';
import "/utils/dbconnect";

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

function  checkPassword(currentHashedPassword, hashedPassword) {
    return bcrypt.compare(currentHashedPassword, hashedPassword)
  }

export const config = {
    api: {
      bodyParser: true
    }
  };
  
// ----------------------------------------------------------------
const put = async (req, res) => {

    // console.log(req.body)
    const {  username, password ,cpassword } = JSON.parse(req.body)
    let users = await UserModel.findOne({ username: username }); 
    let historypw = await PSModel.find({ username: users._id }).limit(5).sort({'daterecord': -1}); 
    // console.log( historypw )
    if (!users){
        res.status(400).json({ 
            isSuccessful: false,
            err : `USER_NOT_FOUND !(^_^)`
        })
    }
    else{
        let ch = await checkPassword(cpassword, users.password)
        let chck = await passwordStrength(password)

        if (!ch) {
            res.status(400).json({ 
                isSuccessful: false,
                err : `Your Current Password is wrong. (^_^)`
            })
        }
        else if (chck.value == 'Too weak'){
            res.status(400).json({ 
                isSuccessful: false,
                err : chck.value
            })
        }
    
        else{
            let i = 0
            for (i=0; i < historypw.length; i++){

                // console.log(historypw[i].password)

                let chhis = await checkPassword(password, historypw[i].password)
                console.log(chhis)

                if (chhis) {
                    res.status(400).json({ 
                        isSuccessful: false,
                        err : `Your new Password is used on last 5 . (^_^)`
                    })
                    return false;
                }
            }
            const hashedPassword = hashPassword(password);
            const filter = { username: username };
            const update = { password: hashedPassword };

            let doc = await UserModel.findOneAndUpdate(filter, update, {new: true});
            const newPS = new PSModel({
                username : doc._id,
                password : hashedPassword
            })
            newPS.save()
            if(doc){
                res.status(200).json({ 
                isSuccessful: true,
                massage : `Password change success`
                })
            }

        }
    }

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
  