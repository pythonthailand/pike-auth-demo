import { useState } from "react";
import Router from "next/router";
import Navbar from "/components/navbar"
import Footer from "/components/footer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas  } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas)

export default function RegisterForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  async function handleSubmit(e) {

    e.preventDefault();
    if (password != password2){
      setErrorMessage(`Password not match`);
      return
    }
    if (username != '' && password != '' && password2 != '' &&  firstname != '' && lastname != '' && image != null){
      // setIsLoading(true);

      const Dataform = new FormData();
      Dataform.append("file", image);
      Dataform.append("username", username);
      Dataform.append("password", password);
      Dataform.append("firstname", firstname);
      Dataform.append("lastname", lastname);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: Dataform        
      });
    
      let resdata = await response.json()
  
      if (resdata.isSuccessful == true){
        alert('Success register !')
        Router.push("/login");
      }
      else{
        console.log(resdata)
        setIsLoading(false);
        setErrorMessage(resdata.massage);
      }  
    }
    else if(image == null){
      setIsLoading(false);
      setErrorMessage(`Please upload photo !`);
    }
    else{
      setIsLoading(false);
      setErrorMessage(`Please input data !`);
    }

  }

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  // const uploadToServer = async (event) => {
  //   const body = new FormData();
  //   body.append("file", image);

  //   const response = await fetch("/api/auth/image", {
  //     method: "POST",
  //     body
  //   });
  // };

  
  return (
    <div className="container column is-one-third-widescreen ">
    <form  className="box"  onSubmit={handleSubmit}>
      <fieldset>
        <legend className="title has-text-centered">
        <FontAwesomeIcon icon="fa-solid fa-user-plus" /> Register</legend>
        {errorMessage && (
          <div className="notification is-warning" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="container column is-one-third-widescreen">
        {/* <h2>Profile Picture</h2> */}

        <figure className="image is-128x128 ">
          <img  className="is-rounded" src={createObjectURL} />
        </figure>
        </div>

        <div  className="file is-info field">
          <label className="file-label">
            <input className="file-input" type="file" name="myImage"
             onChange={uploadToClient} />
            <span className="file-cta">
              <span className="file-icon">
              <FontAwesomeIcon icon="fa-solid fa-upload" />
              </span>
              <span className="file-label">
                Photo
              </span>
            </span>
          </label>
        </div>

        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-success" 
            type="text" 
            placeholder="Firstname" 
            id="firstnameInput"
            onChange={(e) => setfirstname(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
              <FontAwesomeIcon icon="fa-solid fa-file-signature" />            
              </span>
          </div>
        </div>

        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-success" 
            type="text" 
            placeholder="Lastname" 
            id="lastnameInput"
            onChange={(e) => setlastname(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
              <FontAwesomeIcon icon="fa-solid fa-id-card" />            
              </span>
          </div>
        </div>
        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-success" 
            type="text" 
            placeholder="Username" 
            id="usernameInput"
            onChange={(e) => setUsername(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
              <FontAwesomeIcon icon="fa-solid fa-user" />
            </span>
          </div>
        </div>

        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-danger" 
            type="password" 
            placeholder="Password" 
            id="passwordInput"
            onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon is-small is-left">
            <FontAwesomeIcon icon="fa-solid fa-key" />
            </span>
          </div>
        </div>

        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-danger" 
            type="password" 
            placeholder="Confirm Password" 
            id="passwordInput2"
            onChange={(e) => setPassword2(e.target.value)}
            />
            <span className="icon is-small is-left">
            <FontAwesomeIcon icon="fa-solid fa-key" />
            </span>
          </div>
        </div>

        <button type="submit" className="button is-success"
        disabled={isLoading}>
          Sign up
        </button>
      </fieldset>
    </form>
    </div>
  );
}
RegisterForm.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar status={true}/>
      <main className="main">
      {page}
      </main>
      <Footer />
    </>
  )
}
