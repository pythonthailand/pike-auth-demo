import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const data = fs.readFileSync(files.file.path);
    console.log(data)
    fs.writeFileSync(`./public/${files.file.name}`, data);
    await fs.unlinkSync(files.file.path);  
    return res.status(201).json({status:'OK'});
  });
};

// const saveFile = async (file) => {
// };

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
