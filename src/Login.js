import React, { useState } from 'react';
import axios from 'axios';

function Login({ closeModal, setUser }) {
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:5000/login', { useremail, password })
            .then((response) => {
                console.log('Response data:', response.data); // 檢查回傳的資料
                const { user_email, user_name } = response.data;
                alert("登入成功！");
                setUser({ user: user_email, name: user_name }); // 傳遞完整的 user 資訊
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
            /><br></br>
            <input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br></br>
            <button onClick={handleLogin}>登入</button>
        </div>
    );
}

export default Login;
