import React, { useState } from 'react';
import axios from 'axios';

function Login({ closeModal }) {
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://172.26.11.72:5000/login', { useremail, password })
            .then(() => {
                alert("登入成功！");
                closeModal();
            })
            .catch(() => alert("帳號或密碼錯誤"));
    };

    return (
        <div>
            <h2>登入</h2>
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
            <button onClick={handleLogin}>登入</button>
        </div>
    );
}

export default Login;
