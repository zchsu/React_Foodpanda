import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSummary.css';

function OrderSummary() {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate hook to navigate between pages
    const { user, deliveryAddress, cartItems, deliveryOption, payer_name } = location.state || {};
    console.log(payer_name);

    const [orderStatus, setOrderStatus] = useState('未送達'); // 初始訂單狀態是未送達
    const [progress, setProgress] = useState(0); // 進度條初始為 0%
    const [deliveryTime, setDeliveryTime] = useState([40, 50]); // 初始預估外送時間範圍

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    // 根據訂單狀態或剩餘時間顯示預估外送時間或"訂單已送達"
    const estimateDeliveryTime = () => {
        if (orderStatus === '已送達') {
            return '訂單已送達'; // 訂單送達時顯示該訊息
        }
        return `預計外送時間: ${deliveryTime[0]}-${deliveryTime[1]} 分鐘`;
    };

    useEffect(() => {
        // 訂單送達倒計時
        const statusTimer = setTimeout(() => {
            if (progress === 100) {
                setOrderStatus('已送達'); // 更新訂單狀態為已送達
                alert('訂單已送達');
            }
        }, 5000); // 5 秒後檢查是否完成

        // 更新進度條和外送時間
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 20; // 每 100ms 增加 2%（大約 5 秒完成）
                } else {
                    clearInterval(progressTimer); // 進度條完成後清除定時器
                    return 100;
                }
            });

            setDeliveryTime((prev) => {
                if (prev[0] > 0) {
                    return [prev[0] - 10, prev[1] - 10]; // 每次減少 2 分鐘範圍
                }
                return prev;
            });
        }, 1000); // 每隔 1 秒更新一次時間範圍

        // 清除定時器，防止內存泄露
        return () => {
            clearTimeout(statusTimer);
            clearInterval(progressTimer);
        };
    }, [progress]); // 當進度條或時間更新時執行

    const handleReturnHome = () => {
        navigate('/', { state: { user } }); // Passing the user state to the home page
    };

    return (
        <div className="order-summary-page">
            <h2>訂單明細</h2>
            <div className="order-details">
                <h1>{estimateDeliveryTime()}</h1>

                {/* 顯示訂單狀態 */}
                <h3>訂單狀態: {orderStatus}</h3>

                {/* 進度條 */}
                <progress value={progress} max="100" className="order-progress" />
                <br />
                <br />
                <h3>付款人姓名</h3>
                <p>{payer_name}</p>
                <br />
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>
                <br />
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
