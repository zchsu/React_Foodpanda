import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // 引入 useNavigate
import './Payment.css';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();  // 初始化 navigate 用於頁面跳轉
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

    const handleConfirmOrder = () => {
        // 傳遞訂單資料並跳轉至 OrderSummary 頁面
        const orderDetails = {
            user,
            deliveryAddress,
            cartItems,
            paymentMethod,
            deliveryOption,
            needUtensils,
        };
        navigate('/order-summary', { state: orderDetails });  // 使用 navigate 進行頁面跳轉並傳遞資料
    };

    return (
        <div className="payment-page">
            <h2>確認訂單</h2>

            <div className="address-section">
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>
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
