import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';

const hostServer = '172.26.11.72:5000';

function Menu() {
    const { restaurantName } = useParams();
    const location = useLocation();
    const user = location.state?.user || null;
    const address = location.state?.address || '';
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

        if (user) {
            axios
                .get(`http://${hostServer}/cart?user_email=${user}&restaurant_name=${restaurantName}`)
                .then((response) => setCartItems(response.data))
                .catch((error) => console.error('Error fetching cart:', error));
        }
    }, [restaurantName, user]);

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

    const handleUpdateCartItem = (index, newAmount) => {
        if (newAmount < 1) return; // 確保數量不能小於 1
        const cartItem = cartItems[index];
        axios
            .put(`http://${hostServer}/cart/update`, {
                user_email: user,
                meal_name: cartItem.meal_name,
                amount: newAmount,
            })
            .then(() => {
                const updatedCart = [...cartItems];
                updatedCart[index].amount = newAmount;
                setCartItems(updatedCart);
            })
            .catch((error) => {
                console.error('Error updating cart item:', error);
                alert('更新購物車失敗');
            });
    };

    const handleDeleteCartItem = (index) => {
        const cartItem = cartItems[index];
        axios
            .delete(`http://${hostServer}/cart/delete`, {
                data: {
                    user_email: user,
                    meal_name: cartItem.meal_name,
                },
            })
            .then(() => {
                const updatedCart = cartItems.filter((_, i) => i !== index);
                setCartItems(updatedCart);
            })
            .catch((error) => {
                console.error('Error deleting cart item:', error);
                alert('刪除購物車失敗');
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
                                    <br></br>
                                    <p>備註: {item.content}</p>
                                    <p>價格: ${item.meal_price * item.amount}</p>
                                    <div className="item-actions">
                                        <label>
                                            數量:
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.amount}
                                                onChange={(e) =>
                                                    handleUpdateCartItem(
                                                        index,
                                                        parseInt(e.target.value, 10)
                                                    )
                                                }
                                            />
                                        </label>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteCartItem(index)}
                                        >
                                            刪除
                                        </button>
                                    </div>
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
                            需要餐具
                        </label>
                        <br />
                        <button
                            className="checkout-button"
                            onClick={() =>
                                navigate('/payment', { state: { user, cartItems, deliveryOption, needUtensils, address } })
                            }
                        >
                            查看付款方式及地址
                        </button>
                    </div>
                </div>
            </div>

            

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
