"use client";

import { useContext, useEffect } from "react";
import Image from 'next/image';
import logo from "../images/logo.png";
import NavigationElement from "./NavigationElement";
import { AuthContext } from "@/app/context/AuthContext";
import { signOut } from "@/utils/firebase-caller";

export default function Navigation() {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            console.log("User is logged in in nav:", user);
        }
    }, [user]);

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "10px", position: "sticky", top: "0", backgroundColor: "black" }} className={"navbar"}>
            <NavigationElement to="/"><Image src={logo} alt="QWARKS logo" width="50" height="50" /></NavigationElement>
            <NavigationElement to="/">QWARKS</NavigationElement>
            <NavigationElement to="/about">About</NavigationElement>
            <NavigationElement to="/editor">Editor</NavigationElement>
            <NavigationElement to="/install">Install</NavigationElement>
            {user ? <p onClick={signOut}>{user.email}</p> :
                <div style={{display: "flex", flexDirection: "row"}}>
                    <NavigationElement to="/login">Login</NavigationElement>
                    <NavigationElement to="/signup">Sign Up</NavigationElement>
                </div>
            }
        </div>
    );
}