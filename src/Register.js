// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        axios.post('http://localhost:5000/register', { useremail, password })
            .then(() => alert("註冊成功！"))
            .catch(error => console.error("Error during registration:", error));
    };

    return (
        <div>
            <h1>註冊</h1>
            <input
                type="text"
                placeholder="用戶email"
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
            />
            <input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>註冊</button>
        </div>
    );
}

export default Register;
