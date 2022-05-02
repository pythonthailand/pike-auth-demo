import React, { useState } from "react";
import Router from "next/router";
import { getToken } from "/middleware/token";
import { removeToken } from "/middleware/token";
import  Navbar  from "/components/navbar"
import Link from 'next/link'

const whoAmI = async () => {
    const res = await fetch("/api/auth/authen", {
      headers: {
        authorization: getToken(),
      },
      method: "GET",
    });
    const data = await res.json();
    return data;
  };

export default function Profile() {

  const [user, setUser] = useState({});
  // Watchers
  React.useEffect(() => {

    const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
    if (!token) {
      redirectToLogin();
    } else {
      (async () => {
        try {
          const data = await whoAmI();
        //   console.log(data)
          if (data.error === "Unauthorized") {
            // User is unauthorized and there is no way to support the User, it should be redirected to the Login page and try to logIn again.
            redirectToLogin();
          } else {
            setUser(data.payload);
          }
        } catch (error) {
          // If we receive any error, we should be redirected to the Login page
          redirectToLogin();
        }
      })();
    }
  }, []);

  function redirectToLogin() {
    Router.push("/login");
  }

  function handleLogout(e) {
    e.preventDefault();
    removeToken();
    redirectToLogin();
  }

  if (user.hasOwnProperty("username")) {
    return (
      <>
      <br/>
      <div className="notification is-success is-light">
        {/* <button class="delete"></button> */}

        {/* Username {user.username} ! */}
        Welcome {user.firstname} !
        <br/>
        <br/>
        <figure className="image is-128x128 ">
          <img  className="is-rounded" src={user.image} />
        </figure>
        <br/>
        <Link href={'/update'}>
        <button type="button" className="button is-success">
          Edit Profile
        </button>
        </Link>
        &nbsp; &nbsp; 
        <Link href={'/changepassword'}>
        <button type="button" className="button is-danger">
          Change Password
        </button>
        </Link>
      </div>
        {/* <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Welcome {user.username}!
            </a>
            <button
              className="btn btn-info"
              type="button"
              style={{ color: "white", backgroundColor: "#0d6efd" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav> */}
        {/* <h3>{user.username}'s Profile</h3> */}

      </>
    );
  }
  return <div>Welcome back soldier. Welcome to your empty profile.</div>;
}

Profile.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar status={false}/>
      {page}
    </>
  )
}