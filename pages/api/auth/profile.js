
import UserModel from '/models/User';
import "/utils/dbconnect";

export async function whoAmI(username) {
    try {
        let users = await UserModel.findOne({ username: username });
        if (!users){
            res.status(400).json({ 
                isSuccessful: false,
                error : `${username} is not defined, make sure the user is registered before.`
            })
        }
        else{
            res.status(200).json({
                isSuccessful: true,
                payload: {
                    username: users.username,
                    id: users.id,
                },
            })
        }    
    }catch(err) {
        res.status(400).json({ 
            isSuccessful: false,
            error : `${err}`
        })

    }

  }
  