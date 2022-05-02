import UserModel from '/models/User';
import "/utils/dbconnect";
import {verifyToken} from './login'
export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(403).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the GET http method.`,
    });
    return;
  }
  const authorizationToken = req.headers.authorization;
  if (authorizationToken) {
    try {
      const verifiedUser = verifyToken(authorizationToken);
      // console.log(verifiedUser)
      if (verifiedUser) {
        // const user = findUser(verifiedUser.username);
        const user = await UserModel.findOne({ username: verifiedUser.username }); 
        res.status(200).json({
          payload: {
            username: verifiedUser.username,
            image: user.image,
            firstname: user.firstname,
            lastname: user.lastname,
            // id: verifiedUser.id,
          },
        });
        return;
      }
    } catch (error) {
      console.log("error", error);
      // Token has been expired or we detected a fruad attack
      res.status(401).json({
        error: "Unauthorized",
        message: "Not allowed.",
      });
      return;
    }
  }

  // Token has been expired or we detected a fruad attack
  res.status(401).json({
    error: "Unauthorized",
    message: "Not allowed.",
  });
};
