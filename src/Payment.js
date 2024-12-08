import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css';

function Payment() {
    const location = useLocation(); // 使用 useLocation 獲取 location
    const cartItems = location.state?.cartItems || []; // 預設為空陣列，避免錯誤
    const [deliveryAddress, setDeliveryAddress] = useState(''); // 預設為空字串
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    const handleUpdateAddress = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
                    fetch(url)
                        .then((response) => response.json())
                        .then((data) => {
                            const address = `${data.address.city || ''}${data.address.town || ''}${data.address.road || ''}`;
                            setDeliveryAddress(address || '無法取得地址');
                        })
                        .catch((error) => {
                            console.error('Error with reverse geocoding:', error);
                            alert('無法更新地址，請稍後再試！');
                        });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('無法取得定位，請檢查定位服務是否開啟！');
                }
            );
        } else {
            alert('此瀏覽器不支援定位功能！');
        }
    };

    return (
        <div className="payment-page">
            <h2>確認訂單</h2>
            <div className="address-section">
                <h3>送餐地址</h3>
                <p>{deliveryAddress || '尚未提供地址'}</p>
                <button onClick={handleUpdateAddress} className="edit-address">
                    更新地址
                </button>
            </div>
            <div className="cart-summary">
                <h3>您的訂單</h3>
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
            <div className="payment-method">
                <h3>選擇付款方式</h3>
                <label>
                    <input
                        type="radio"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    信用卡
                </label>
                <label>
                    <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    現金
                </label>
            </div>
            <button className="confirm-button" onClick={() => alert('訂單已確認！')}>
                確認訂單
            </button>
        </div>
    );
}

export default Payment;
