import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'

const hostServer = '172.26.11.72:5000';

function Menu() {
    const { restaurantName } = useParams(); // 獲取餐廳名稱參數
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 從後端獲取菜單資料
        axios
            .get(`http://${hostServer}/menu?restaurant_name=${restaurantName}`)
            .then((response) => setMenuItems(response.data))
            .catch((error) => console.error('Error fetching menu:', error));
    }, [restaurantName]);

    return (
        <div>
            {/* Header */}
            <header style={headerStyle}>
                <h1 style={logoStyle}>foodpanda</h1>
                <div style={buttonGroupStyle}>
                    <button onClick={() => navigate('/cart')} style={cartButtonStyle}>
                        購物車
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={mainStyle}>
                <h2>{restaurantName} 的菜單</h2>
                {menuItems.length > 0 ? (
                    <ul style={menuListStyle}>
                        {menuItems.map((item) => (
                            <li key={item.meal_name} style={menuItemStyle}>
                                <h3>{item.meal_name}</h3>
                                <p>描述: {item.meal_desc}</p>
                                <p>價格: ${item.meal_price}</p>
                                <button style={addToCartButtonStyle}>加入購物車</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>目前沒有可用的菜單項目。</p>
                )}
            </main>

            {/* Footer */}
            <footer style={footerStyle}>© 2024 foodpanda. All rights reserved.</footer>
        </div>
    );
}

// 樣式
const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E21B70',
    padding: '10px 20px',
    zIndex: 1000,
};

const logoStyle = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
};

const buttonGroupStyle = {
    position: 'absolute',
    top: '25px',
    right: '50px',
};

const cartButtonStyle = {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '20px',
    color: '#E21B70',
    padding: '5px 15px',
    cursor: 'pointer',
};

const mainStyle = {
    paddingTop: '80px',
    padding: '20px',
    textAlign: 'center',
};

const menuListStyle = {
    listStyleType: 'none',
    padding: 0,
};

const menuItemStyle = {
    borderBottom: '1px solid #ccc',
    margin: '10px 0',
    padding: '10px',
};

const addToCartButtonStyle = {
    backgroundColor: '#E21B70',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '5px 10px',
    cursor: 'pointer',
};

const footerStyle = {
    textAlign: 'center',
    backgroundColor: '#E21B70',
    color: '#fff',
    padding: '10px 0',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
};

export default Menu;
