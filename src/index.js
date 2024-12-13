import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Register from './Register';
import Login from './Login';
import Menu from './Menu'; 
import RestaurantList from './RestaurantList';
import Payment from './Payment';
import OrderSummary from './OrderSummary';
import OrderHistory from './OrderHistory';

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/menu/:restaurantName" element={<Menu />} /> 
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);
