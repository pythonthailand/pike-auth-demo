// import { useState } from "react";
import React, { useState,useEffect} from "react";
import { getToken } from "/middleware/token";
import { removeToken } from "/middleware/token";

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

  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  function redirectToLogin() {
    Router.push("/login");
  }

  const fetchData = async () => {
    const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
    if (!token) {
      redirectToLogin();
    }
    try {
        const res = await fetch("/api/auth/authen", {
            headers: {
              authorization: getToken(),
            },
            method: "GET",
          });
        const data = await res.json();
        console.log(data.payload);
        setfirstname(data.payload.firstname)
        setlastname(data.payload.lastname)
        setCreateObjectURL(data.payload.image)
        setUsername(data.payload.username)
    } catch (err) {
        console.log(err);
    }
}

useEffect( () => { 
    
    fetchData();

}, []);




  async function handleSubmit(e) {

    e.preventDefault();

    if (firstname != '' && lastname != ''){


        const Dataform = new FormData();
        Dataform.append("file", image);

        Dataform.append("firstname", firstname);
        Dataform.append("lastname", lastname);
        Dataform.append("username", username);
        console.log(Dataform)



      const response = await fetch("/api/auth/update", {
        method: "PUT",
        body: Dataform        
      });
    
      let resdata = await response.json()
  
      if (resdata.isSuccessful == true){
        alert('Success update !')
        Router.push("/profile");
      }
      else{
        console.log(resdata)
        setIsLoading(false);
        setErrorMessage(resdata.massage);
      }  
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


  
  return (
    <div className="container column is-one-third-widescreen ">
    <form  className="box"  onSubmit={handleSubmit}>
      <fieldset>
        <legend className="title has-text-centered">
        <FontAwesomeIcon icon="fa-solid fa-user-plus" /> Edit profile </legend>
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
            value={firstname}
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
            value={lastname}
            onChange={(e) => setlastname(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
              <FontAwesomeIcon icon="fa-solid fa-id-card" />         
              </span>
          </div>
        </div>


        <button type="submit" className="button is-success"
        disabled={isLoading}>
          Save
        </button>
      </fieldset>
    </form>
    </div>
  );
}
RegisterForm.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar status={false}/>
      <main className="main">
      {page}
      </main>
      <Footer />
    </>
  )
}
