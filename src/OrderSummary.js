import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSummary.css';

function OrderSummary() {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate hook to navigate between pages
    const { user, deliveryAddress, cartItems, deliveryOption } = location.state || {};

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    // 模擬預估外送時間
    const estimateDeliveryTime = () => {
        const deliveryTimes = {
            'delivery': '預計外送時間: 30-45 分鐘',
            'pickup': '外帶自取時間: 15 分鐘'
        };
        return deliveryTimes[deliveryOption] || '未知';
    };

    const handleReturnHome = () => {
        navigate('/', { state: { user } }); // Passing the user state to the home page
    };

    return (
        <div className="order-summary-page">
            <h2>訂單明細</h2>
            <div className="order-details">
                <h1>{estimateDeliveryTime()}</h1>
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>

                <h3>餐點清單</h3>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            <p>{item.meal_name}</p>
                            <p>數量: {item.amount}</p>
                            <p>價格: ${item.meal_price * item.amount}</p>
                        </li>
                    ))}
                </ul>
                <h4>總計: ${calculateTotal()}</h4>
            </div>

            {/* 返回主頁面按鈕 */}
            <button className="return-home-button" onClick={handleReturnHome}>
                返回主頁
            </button>
        </div>
    );
}

export default OrderSummary;
