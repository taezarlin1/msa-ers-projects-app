'use client'

import React, { useState } from 'react'
import { ShootingStars } from './ui/shooting-stars';
import { StarsBackground } from './ui/stars-background';

const AuthorizationClient = () => {
    const [action, setAction] = useState("login");

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignupChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "radio") {
            setSignUpData((prevData) => ({
                ...prevData,
                role: value,
            }));
        } else {
            setSignUpData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // include the cookie
            body: JSON.stringify(loginData),
        });

        if (res.ok) {
            console.log(res)
            window.location.href = '/'; // redirect to home
        } else {
            alert('Invalid credentials');
        }
    }

  return (
    <div
        style={{
            display: 'flex',
            // backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',

        }}
    >
        <ShootingStars />
        <StarsBackground />
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                borderRadius: '10px',
                zIndex: '10',
                boxShadow: '0px 10px 20px 1px lightblue',
                width: '20%',
                // height: '100%'
                paddingTop: '1%',
                paddingBottom: '1%'
            }}
        >
            {action === 'login' && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap:'15px',
                        width: '95%',
                        height: '100%',
                        color: 'white'
                    }}
                >
                    <img src="/mstc.png" alt="" style={{width: '25%'}}/>
                    <h1
                        style={{
                            fontSize: 'x-large'
                        }}
                    >
                        Login
                    </h1>
                    <h2>
                        Welcome back! Log in to your account
                    </h2>
                    <input
                        name='email'
                        type="email"
                        placeholder="Email"
                        className="w-full mb-2 p-2 border"
                        style={{padding: '2%'}}
                        value={loginData.email}
                        onChange={handleLoginChange}
                    />
                    <input
                        name='password'
                        type="password"
                        placeholder="Password"
                        className="w-full mb-2 p-2 border"
                        style={{padding: '2%'}}
                        value={loginData.password}
                        onChange={handleLoginChange}
                    />

                    <button 
                        onClick={handleLoginSubmit}
                        onMouseEnter={(e) => (e.currentTarget.style.scale = '1.02')}
                        onMouseLeave={(e) => (e.currentTarget.style.scale = '1')} 
                        style={{
                            background: 'navy',
                            padding: '5px',
                            borderRadius: '5px',
                            width: '100%',
                            cursor: 'pointer',
                            
                        }}
                    >
                        Log In
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}

export default AuthorizationClient
