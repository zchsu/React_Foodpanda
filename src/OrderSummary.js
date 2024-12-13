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

    // 當組件掛載時，設定 5 秒後顯示已送達的狀態
    useEffect(() => {
        const timer = setTimeout(() => {
            // 訂單狀態在進度條完成後更新
            if (progress === 100) {
                setOrderStatus('已送達'); // 更新訂單狀態為已送達
                alert('訂單已送達');
            }
        }, 5000); // 5秒後顯示 alert 並更新狀態

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 2; // 每 100ms 增加 2%（大約 5 秒完成）
                } else {
                    clearInterval(progressTimer); // 進度條完成後清除定時器
                    return 100;
                }
            });
        }, 100); // 每 100ms 更新一次進度條

        // 清除定時器，防止組件卸載後仍然執行
        return () => {
            clearTimeout(timer);
            clearInterval(progressTimer);
        };
    }, [progress]); // 當 progress 更新時才會執行這個 effect

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
                {/*<p>進度: {progress}%</p>*/}
                <br></br>
                <br></br>
                <h3>付款人姓名</h3>
                <p>{payer_name}</p>
                <br></br>
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>
                <br></br>
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
