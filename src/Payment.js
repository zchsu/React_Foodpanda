import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || null;
    const originalAddress = location.state?.address || '';
    const cartItems = location.state?.cartItems || [];
    const deliveryOption = location.state?.deliveryOption || 'delivery';
    const needUtensils = location.state?.needUtensils || false;
    const [deliveryAddress, setDeliveryAddress] = useState(originalAddress);
    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState(originalAddress);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    const handleEditAddress = () => {
        setIsEditing(true);
    };

    const handleSaveAddress = () => {
        setDeliveryAddress(newAddress);
        setIsEditing(false);
    };

    const handleChangeAddress = (event) => {
        setNewAddress(event.target.value);
    };

    const handleConfirmOrder = async () => {
        const orderDetails = {
            user_email: user,
            deliveryAddress,
            cartItems,
            paymentMethod,
            deliveryOption,
            needUtensils,
            orderTime: new Date().toISOString() // 記錄訂單時間
        };

        // 發送訂單資料到後端
        const response = await fetch('http://172.26.11.72:5000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        if (response.ok) {
            navigate('/order-summary', { state: orderDetails });
        } else {
            alert('無法確認訂單，請稍後再試');
        }
    };

    return (
        <div className="payment-page">
            <h2>確認訂單</h2>

            <div className="address-section">
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>
                <br></br>
                {!isEditing ? (
                    <button onClick={handleEditAddress} className="edit-address">
                        更改地址
                    </button>
                ) : (
                    <div>
                        <textarea
                            value={newAddress}
                            onChange={handleChangeAddress}
                            rows="4"
                            className="address-input"
                        />
                        <button onClick={handleSaveAddress} className="save-address">
                            確認更改
                        </button>
                    </div>
                )}
            </div>

            <div className="delivery-option-section">
                <h3>配送方式</h3>
                <p>{deliveryOption === 'delivery' ? '外送' : '外帶自取'}</p>
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

            <div className="utensils-section">
                <h3>餐具需求</h3>
                <p>{needUtensils ? '需要提供餐具' : '不需要餐具'}</p>
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

            <button className="confirm-button" onClick={handleConfirmOrder}>
                確認訂單
            </button>
        </div>
    );
}

export default Payment;
