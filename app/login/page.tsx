"use client"

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation'
import { signIn } from "@/utils/firebase-caller";
import { AuthContext } from "@/app/context/AuthContext";

export default function Login() {
    const router = useRouter();
    const { user, loading } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            console.log("User is logged in:", user);
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        setButtonDisabled(!email || !password);
    }, [email, password])

    const signUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError("");
        try {
            await signIn(email, password);
            // No need to manually set user state - Firebase Auth observer will handle it
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed!");
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", alignItems: "center" }} onSubmit={signUp}>
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={buttonDisabled}>Log In!</button>
                <p>Don't have an account yet? <Link href="signup" style={{ color: "#4AD44B", textDecoration: "underline" }}>Sign Up</Link>!</p>
            </form>
        </div>
    );
}
