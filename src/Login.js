import React, { useState } from 'react';
import axios from 'axios';

function Login({ closeModal, setUser }) {
    const [useremail, setUseremail] = useState('');
    const [password, setPassword] = useState('');
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:5000/login', { useremail, password })
            .then((response) => {
                console.log('Response data:', response.data);
                const { user_email, user_name } = response.data;
                alert("登入成功！");
                setUser({ user: user_email, name: user_name });
                closeModal();
            })
            .catch(() => alert("帳號或密碼錯誤"));
    };

    const handleResetPassword = () => {
        axios.post('http://localhost:5000/reset_password', { useremail, newPassword })
            .then(() => {
                alert("密碼重置成功！請重新登入。");
                setIsResettingPassword(false);
            })
            .catch(() => alert("密碼重置失敗，請確認Email是否正確。"));
    };

    return (
        <div>
            <h2>登入</h2>
            {isResettingPassword ? (
                <div>
                    <input
                        type="text"
                        placeholder="用戶email"
                        value={useremail}
                        onChange={(e) => setUseremail(e.target.value)}
                    /><br />
                    <input
                        type="password"
                        placeholder="新密碼"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    /><br />
                    <button onClick={handleResetPassword}>重置密碼</button>
                    <button onClick={() => setIsResettingPassword(false)}>取消</button>
                </div>
            ) : (
                <div>
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
                    <button onClick={handleLogin}>登入</button>
                    <button onClick={() => setIsResettingPassword(true)}>忘記密碼</button>
                </div>
            )}
        </div>
    );
}

export default Login;
