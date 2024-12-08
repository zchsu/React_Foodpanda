import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Login from './Login';
import Menu from './Menu'; 
import Payment from './Payment';

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu/:restaurantName" element={<Menu />} /> {/* 新增路由 */}
            <Route path="/payment" element={<Payment />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);
