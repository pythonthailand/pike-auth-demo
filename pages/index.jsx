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

    Router.push("/profile");

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