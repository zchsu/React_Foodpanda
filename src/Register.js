import React, { useState } from 'react';
import axios from 'axios';

function Register({ closeModal }) {
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = () => {
        // 前端驗證
        if (!useremail.includes('@')) {
            setError('Email 不正確');
            return;
        }
        if (password.length < 8) {
            setError('密碼必須至少包含 8 個字符。');
            return;
        }
        setError(''); // 清空錯誤消息

        axios.post('http://localhost:5000/register', { useremail, password, name })
            .then(() => {
                alert('註冊成功！');
                closeModal();
            })
            .catch(error => {
                console.error('Error during registration:', error);
                setError('註冊失敗，請稍後再試。');
            });
    };

    return (
        <div>
            <h2>註冊</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="用戶email"
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <input
                type="text"
                placeholder="用戶名稱"
                value={name}
                onChange={(e) => setName(e.target.value)}
            /><br />
            <button onClick={handleRegister}>註冊</button>
        </div>
    );
}

export default Register;
