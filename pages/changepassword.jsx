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
  const [cpassword, setcPassword] = useState("");

//   const [firstname, setfirstname] = useState("");
//   const [lastname, setlastname] = useState("");
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
    console.log(cpassword)
    console.log(password)
    
    if (password != password2){
        setIsLoading(false);
        setErrorMessage(`Password not match !`);  
        return;
    }
    else if (password != '' && password2 != ''){


      const response = await fetch("/api/auth/changepw", {
        method: "PUT",
        body: JSON.stringify({ username , cpassword , password })        
      });
    
      let resdata = await response.json()
  
      if (resdata.isSuccessful == true){
        alert('Password change success')
        Router.push("/profile");
      }
      else{
        console.log(resdata)
        setIsLoading(false);
        setErrorMessage(resdata.err);
        return;
      }  
    }

    else{
      setIsLoading(false);
      setErrorMessage(`Please input data !`);
      return;

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
        <FontAwesomeIcon icon="fa-solid fa-user-plus" /> Change Password </legend>
        {errorMessage && (
          <div className="notification is-warning" role="alert">
            {errorMessage}
          </div>
        )}

<div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-warning" 
            type="password" 
            placeholder="Current Password" 
            id="cpasswordInput"
            onChange={(e) => setcPassword(e.target.value)}
            />
            <span className="icon is-small is-left">
            <FontAwesomeIcon icon="fa-solid fa-key" />
            </span>
          </div>
        </div>

        <div className="field">
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-success" 
            type="password" 
            placeholder="New Password" 
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
            className="input is-success" 
            type="password" 
            placeholder="Confirm New Password" 
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
