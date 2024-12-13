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
    const [payerName, setPayerName] = useState(user?.name || ''); // 預設為當前使用者的名字
    const [isEditingPayer, setIsEditingPayer] = useState(false);
    const [newPayerName, setNewPayerName] = useState(payerName);

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
        console.log(event.target.value);
    };

    const handleEditPayerName = () => {
        setIsEditingPayer(true);
    };

    const handleSavePayerName = () => {
        setPayerName(newPayerName);
        setIsEditingPayer(false);
    };

    const handleChangePayerName = (event) => {
        setNewPayerName(event.target.value);
    };

    const handleConfirmOrder = async () => {
        const orderDetails = {
            user_email: user.user,
            payer_name: payerName,  // 新增付款人姓名
            deliveryAddress,
            cartItems,
            paymentMethod,
            deliveryOption,
            needUtensils,
            orderTime: new Date().toISOString() // 記錄訂單時間
        };

        // 發送訂單資料到後端
        const response = await fetch('http://localhost:5000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        if (response.ok) {
            console.log(orderDetails.payer_name);
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

            {/* 付款人姓名區塊 */}
            <div className="payer-section">
                <h3>付款人姓名</h3>
                <p>{payerName}</p>
                <br></br>
                {!isEditingPayer ? (
                    <button onClick={handleEditPayerName} className="edit-payer">
                        更改付款人姓名
                    </button>
                ) : (
                    <div>
                        <input
                            type="text"
                            value={newPayerName}
                            onChange={handleChangePayerName}
                            className="payer-name-input"
                        />
                        <button onClick={handleSavePayerName} className="save-payer-name">
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
                            <br></br>
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
