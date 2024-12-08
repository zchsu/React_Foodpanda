import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';

const hostServer = '172.26.11.72:5000';

function Menu() {
    const { restaurantName } = useParams();
    const location = useLocation();
    const user = location.state?.user || null;
    const [menuItems, setMenuItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [amount, setAmount] = useState(1);
    const [content, setContent] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [deliveryOption, setDeliveryOption] = useState('delivery');
    const [needUtensils, setNeedUtensils] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://${hostServer}/menu?restaurant_name=${restaurantName}`)
            .then((response) => setMenuItems(response.data))
            .catch((error) => console.error('Error fetching menu:', error));
    }, [restaurantName]);

    const handleAddToCart = (meal) => {
        if (!user) {
            alert('請先登入！');
            return;
        }
        setSelectedMeal(meal);
        setShowModal(true);
    };

    const handleConfirmAddToCart = () => {
        axios
            .post(`http://${hostServer}/cart`, {
                restaurant_name: restaurantName,
                meal_name: selectedMeal.meal_name,
                user_email: user,
                content,
                amount,
            })
            .then(() => {
                alert('已成功加入購物車！');
                setCartItems([...cartItems, { ...selectedMeal, amount, content }]);
                setShowModal(false);
                setAmount(1);
                setContent('');
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
                alert('加入購物車失敗');
            });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    return (
        <div className="menu-page">
            <div className="menu-container">
                <div className="menu-list-container">
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
                </div>
                <div className="cart-container">
                    <h2>購物車</h2>
                    <div className="delivery-options">
                        <label>
                            <input
                                type="radio"
                                value="delivery"
                                checked={deliveryOption === 'delivery'}
                                onChange={(e) => setDeliveryOption(e.target.value)}
                            />
                            外送
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="pickup"
                                checked={deliveryOption === 'pickup'}
                                onChange={(e) => setDeliveryOption(e.target.value)}
                            />
                            外帶自取
                        </label>
                    </div>
                    {cartItems.length > 0 ? (
                        <ul className="cart-list">
                            {cartItems.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <h4>{item.meal_name}</h4>
                                    <p>數量: {item.amount}</p>
                                    <p>備註: {item.content}</p>
                                    <p>價格: ${item.meal_price * item.amount}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>購物車是空的</p>
                    )}
                    <div className="total-price">
                        <p>總價: ${calculateTotal()}</p>
                        <label>
                            <input
                                type="checkbox"
                                checked={needUtensils}
                                onChange={(e) => setNeedUtensils(e.target.checked)}
                            />
                            需要餐具<br></br><br></br>
                        </label>
                        <button 
                            className="checkout-button"
                            onClick={() =>
                                navigate('/payment', { state: { cartItems } })
                            }
                        >查看付款方式及地址</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer>© 2024 foodpanda. All rights reserved.</footer>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>加入購物車: {selectedMeal.meal_name}</h3>
                        <div className="form-group">
                            <label>數量:</label>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>備註:</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="confirm-button"
                                onClick={handleConfirmAddToCart}
                            >
                                確認
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => setShowModal(false)}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu;
