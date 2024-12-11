import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
    const location = useLocation(); // 用來接收來自 App 傳遞的 state
    const navigate = useNavigate();
    const email = location.state?.user || null; // 接收傳遞過來的 email

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!email) {
            alert('請先登入！');
            navigate('/'); // 如果沒有 email 資料則導回首頁
            return;
        }

        // 假設後端有 API 可以查詢該用戶的訂單歷史
        axios
            .get(`http://172.26.11.72:5000/hisorders?user_email=${email}`)
            .then((response) => {
                // 計算每筆訂單的總金額
                const ordersWithTotal = response.data.orders.map((order) => {
                    // 計算總金額
                    const totalAmount = order.items.reduce(
                        (sum, item) => sum + item.amount * item.meal_price,
                        0
                    );
                    return { ...order, totalAmount };
                });
                setOrders(ordersWithTotal);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setIsLoading(false);
            });
    }, [email, navigate]);

    if (isLoading) {
        return <p>正在加載訂單...</p>;
    }

    return (
        <div className="order-history-page">
            <header>
                <h1>歷史訂單</h1>
                <button className="back-button" onClick={() => navigate('/')}>
                    返回主頁面
                </button>
            </header>

            <main>
                <div className="order-history">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="order-item">
                                <p>訂單時間: {new Date(order.order_time).toLocaleString()}</p>
                                <p>地址: {order.delivery_address}</p>
                                <p>付款方式: {order.payment_method === 'credit' ? '信用卡' : '現金'}</p>
                                <p>送餐方式: {order.delivery_option === 'delivery' ? '外送' : '外帶自取'}</p>
                                <p>是否需要餐具: {order.need_utensils ? '需要' : '不需要'}</p>
                                
                                <h3>訂單商品:</h3>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.meal_name} - {item.amount} 個 - {item.meal_price} 元
                                        </li>
                                    ))}
                                </ul>

                                <p>總金額: {order.totalAmount} 元</p> {/* 顯示總金額 */}
                            </div>
                        ))
                    ) : (
                        <p>沒有找到任何訂單</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrderHistory;
