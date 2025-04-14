"use client"

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/navigation'
import { createAccount } from "@/utils/firebase-caller";
import { AuthContext } from "@/app/context/AuthContext";

export default function SignUp() {
    const router = useRouter();
    const { user, loading } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        setButtonDisabled(!email || !password || !confirmPassword || password !== confirmPassword);
    }, [email, password, confirmPassword]);

    const signUp = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError("");
        try {
            await createAccount(email, password);
            // Firebase Auth observer will handle the state
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign up failed!");
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Sign Up</h1>
            <div>
                <h1>Why make an account?</h1>
                <p>Eventually, creating an account will allow you to save your bots and compete in tournaments!</p>
            </div>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px", alignItems: "center" }} onSubmit={signUp}>
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input id="confirmPassword" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={buttonDisabled}>Sign Up!</button>
                <p>Already have an account? <Link href="login" style={{ color: "#4AD44B", textDecoration: "underline" }}>Login</Link>!</p>
            </form>
        </div>
    );
}
