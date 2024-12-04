import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';

const hostServer = '172.26.11.72:5000';

function Menu() {
    const { restaurantName } = useParams(); // 獲取餐廳名稱參數
    const [menuItems, setMenuItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [amount, setAmount] = useState(1);
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 從後端獲取菜單資料
        axios
            .get(`http://${hostServer}/menu?restaurant_name=${restaurantName}`)
            .then((response) => setMenuItems(response.data))
            .catch((error) => console.error('Error fetching menu:', error));
    }, [restaurantName]);

    const handleAddToCart = (meal) => {
        setSelectedMeal(meal);
        setShowModal(true);
    };

    const handleConfirmAddToCart = () => {
        const userEmail = "d"; // 假設用戶已登入，這裡用靜態 email 替代
        axios
            .post(`http://${hostServer}/cart`, {
                restaurant_name: restaurantName,
                meal_name: selectedMeal.meal_name,
                user_email: userEmail,
                content,
                amount,
            })
            .then(() => {
                alert('已成功加入購物車！');
                setShowModal(false);
                setAmount(1);
                setContent('');
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
                alert('加入購物車失敗');
            });
    };

    return (
        <div>
            {/* Header */}
            <header>
                <h1>foodpanda</h1>
                <button onClick={() => navigate('/cart')} className="cart-button">
                    購物車
                </button>
            </header>

            {/* Main Content */}
            <main>
                <h2>{restaurantName} 的菜單</h2>
                {menuItems.length > 0 ? (
                    <ul className="menu-list">
                        {menuItems.map((item) => (
                            <li key={item.meal_name} className="menu-item">
                                <h3>{item.meal_name}</h3>
                                <p>描述: {item.meal_desc}</p>
                                <p>價格: ${item.meal_price}</p>
                                <button
                                    className="add-to-cart"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    加入購物車
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>目前沒有可用的菜單項目。</p>
                )}
            </main>

            {/* Footer */}
            <footer>© 2024 foodpanda. All rights reserved.</footer>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>加入購物車</h3>
                        <p>餐點: {selectedMeal.meal_name}</p>
                        <label>
                            數量:
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                            />
                        </label>
                        <label>
                            備註:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </label>
                        <div className="modal-actions">
                            <button onClick={handleConfirmAddToCart}>確認</button>
                            <button onClick={() => setShowModal(false)}>取消</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu;
