
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { removeToken } from "/middleware/token";
import Router from "next/router";

  
export default function Layout({ status }) {
    
const [navshow, setnavshow] = useState(true)
const [xbutton, setxbutton] = useState(true)
const [authen, setauthen] = useState()
const [text01, settext01] = useState("Hello world !")
const [logoutah, setlogoutah] = useState()


useEffect(() => {
    setauthen(status)
},[status])

useEffect(() => {
    setlogoutah(!status)
},[!status])



const handleClick = (e) => {
    setnavshow(!navshow)
    setxbutton(!xbutton)

}
const closenav = (e) => {
    setnavshow(true)
    setxbutton(true)
}
function handleLogout(e) {
    e.preventDefault();
    removeToken();
    redirectToLogin();
}
  function redirectToLogin() {
    Router.push("/login");
}

  return (
    <>
    <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
        <Link href="#">
        <a className="navbar-item">
        <Image 
        src="/navlogo.png" 
        alt='logo'
        width="112" height="28"
        />
        </a>
        </Link>

        <Link href="#" >
        <a role="button" 
        className={xbutton ? "navbar-burger" : "navbar-burger burger is-active"}
        aria-label="menu" 
        aria-expanded="false" 
        data-target="navbarBasicExample"
        onClick={handleClick}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
        </Link>
    </div>

    <div id="navbarBasicExample" className={navshow ? "navbar-menu" : "navbar-menu is-active"}>
        <div className="navbar-start">
        <Link  href="/" >
        <a className="navbar-item" onClick={handleClick}>
        Home
        </a>
        </Link>
        <Link  href="/update">
        <a className="navbar-item" onClick={handleClick}>
        Edit
        </a>
        </Link>
{/* 
        <Link  href="#">
        <a className="navbar-item">
        {text01}
        </a>
        </Link> */}

        <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
            More
            </a>

            <div className="navbar-dropdown">
            <a className="navbar-item">
                About
            </a>
            <a className="navbar-item">
                Jobs
            </a>
            <a className="navbar-item">
                Contact
            </a>
            <hr className="navbar-divider" />
            <a className="navbar-item">
                Report an issue
            </a>
            </div>
        </div>
        </div>
        
        <div className="navbar-end">
        {authen && (
            <div className="navbar-item" id="navbarstat" >
                <div className="buttons">
                <Link  href='/register' >
                <a className="button is-primary" onClick={closenav}>
                <strong>Sign up</strong>
                </a>
                </Link>
                <Link  href='/login' >
                <a className="button is-light"  onClick={closenav} >
                Log in
                </a>
                </Link>
                </div>
            </div>
        )}
        {logoutah && (
            <div className="navbar-item" id="navbarstat" >
                <div className="buttons">
                <Link href="#" >
                <a className="button is-danger" onClick={handleLogout} >
                <strong>Logout</strong>
                </a>
                </Link>
                </div>
            </div>
        )}
        </div>
    </div>
    </nav>
    </>
  )
}
