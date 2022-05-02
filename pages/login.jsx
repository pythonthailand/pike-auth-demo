import { useState, useEffect } from "react";
import Router from "next/router";
import { removeToken } from "/middleware/token";
import Navbar from "/components/navbar"
import Footer from "/components/footer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas  } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas)


export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Remove the User's token which saved before.
    removeToken();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      // API call:
      const res = await fetch("/api/auth/login", {
        body: JSON.stringify({username,password}),
        method: "POST",
      });
      const data = await res.json();
      console.log(data.isSuccessful)

      if (data.token) {
        if (rememberMe) {
          window.localStorage.setItem("token", data.token);
        } 
        else {
          console.log(data.token)
          window.sessionStorage.setItem("token", data.token);
        }
        setTimeout(() => {
           Router.push("/profile");
        }, 1000);
      } 
      else {
        setErrorMessage(data.err);
      }

    } catch (error) {
    console.log(error);
    } finally {
    setIsLoading(false);
    }
  }

  return (
    <div className="container column is-one-third-widescreen ">
    <form className="box" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="title has-text-centered"><FontAwesomeIcon icon="fa-solid fa-right-to-bracket" /> Login</legend>
        
        {errorMessage && (
          <div className="notification is-warning" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="field">
          <label className="label">Username</label>
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
          <label className="label">Password</label>
          <div className="control has-icons-left has-icons-right ">
            <input 
            className="input is-success" 
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
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" 
              id="RememberMeInput"
              onChange={(e) => setRememberMe(e.target.checked)}/> Remember <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>

        <button type="submit" 
        className="button is-link" 
        disabled={isLoading}> 
         Login
        </button>
      </fieldset>
    </form>
    </div>
  );
}

LoginForm.getLayout = function getLayout(page) {

  return (
    <>
      <Navbar status={true} text01={"sadksaodkasokd"}/>
      <main className="main">
      {page}
      </main>
      <Footer />
    </>
  )
}
