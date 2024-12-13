import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import './App.css';

const hostServer = 'localhost:5000';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(null);
    const [userNameInput, setUserNameInput] = useState(''); // 儲存新用戶名稱輸入
    const navigate = useNavigate();

    // Check if user is logged in on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Set the user from localStorage
        }
    }, []);

    // Store user to localStorage on login
    const handleUserLogin = (userInfo) => {
        console.log('User info received:', userInfo); // 確認完整物件內容
        if (!userInfo.user || !userInfo.name) {
            console.error('User info missing required fields:', userInfo);
        }
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo)); // 儲存至 localStorage
    };
    

    // Handle user logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Clear user info from localStorage
        navigate('/'); // Redirect to home page
    };

    const handleUpdateUserName = () => {
        if (!userNameInput) return;
    
        axios
            .post(`http://${hostServer}/update_username`, { email: user.user, name: userNameInput })
            .then((response) => {
                setUser({ ...user, name: userNameInput });
                localStorage.setItem('user', JSON.stringify({ ...user, name: userNameInput }));
                alert('用戶名稱已更新！');
                console.log()
                handleCloseModal();
            })
            .catch((error) => {
                console.error('更新用戶名稱失敗:', error);
                alert('更新失敗，請稍後再試。');
            });
    };

    const cities = [
        { name: '台北市', image: '/images/台北市.png' },
        { name: '新北市', image: '/images/新北市.png' },
        { name: '桃園市', image: '/images/桃園市.png' },
        { name: '台中市', image: '/images/台中市.png' },
        { name: '台南市', image: '/images/台南市.png' },
        { name: '高雄市', image: '/images/高雄市.png' },
        { name: '基隆市', image: '/images/基隆市.png' },
        { name: '新竹市', image: '/images/新竹市.png' },
        { name: '嘉義市', image: '/images/嘉義市.png' },
        { name: '苗栗市', image: '/images/苗栗市.png' },
        { name: '彰化市', image: '/images/彰化市.png' },
        { name: '南投市', image: '/images/南投市.png' },
        { name: '雲林縣', image: '/images/雲林縣.png' },
        { name: '屏東縣', image: '/images/屏東縣.png' },
        { name: '宜蘭縣', image: '/images/宜蘭縣.png' },
        { name: '花蓮縣', image: '/images/花蓮縣.png' },
        { name: '台東市', image: '/images/台東市.png' },
    ];

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
    };

    const handleSearchRestaurants = () => {
        if (!search) return;

        // 導航到餐廳列表頁面，並將搜尋的地址傳遞過去
        navigate('/restaurants', { state: { user, address: search } });
    };

    const getlocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });

                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
                    axios
                        .get(url)
                        .then((response) => {
                            const address = `${response.data.address.city || ''}${response.data.address.town || ''}${response.data.address.road || ''}${response.data.address.house_number || ''}`;
                            console.log('User address:', address);
                            setSearch(address);
                        })
                        .catch((error) => {
                            console.error('Error with reverse geocoding:', error);
                        });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

    const handleNavigateToMenu = (restaurantName) => {
        if (!user) {
            alert('請先登入！');
            setShowModal(true);
            setModalType('login');
            return;
        }
        navigate(`/menu/${restaurantName}`, { state: { user, address: search } });
    };

    const handleNavigateToOrders = () => {
        navigate('/order-history', { state: { user }});
    };
    

    return (
        <div>
            <header>
                <h1>foodpanda</h1>
                <div className="button-group">
                    {user ? (
                        <>
                            <button onClick={() => handleOpenModal('updateName')}>
                                Hi, {user.name}
                            </button>
                            <button className="cart-button" onClick={handleNavigateToOrders}>
                                🛒 歷史訂單
                            </button>
                            <button className="logout-button" onClick={handleLogout}>
                                登出
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="login-button" onClick={() => handleOpenModal('login')}>
                                登入
                            </button>
                            <button className="register-button" onClick={() => handleOpenModal('register')}>
                                註冊
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main>
                <div className="content">
                    <div className="background">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="輸入你欲送達的地址"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="location-button" onClick={getlocation}>
                                    📍
                                </button>
                            </div>
                            <button onClick={handleSearchRestaurants}>搜尋美食</button>
                        </div>
                    </div>
                    
                </div>
            </main>

            {/* Cities */}
            <div className="city-section">
                <h3>我們有在您的城市提供送餐服務!</h3>
                <div className="city-grid">
                    {cities.map((city) => (
                        <div
                            key={city.name}
                            className="city-card"
                            onClick={() => {
                                setSearch(city.name);
                                handleSearchRestaurants();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <img src={city.image} alt={city.name} />
                            <p>{city.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="footer-content">© 2024 foodpanda. 軟體工程</div>

            {showModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
                ✕
            </button>
            {modalType === 'login' ? (
                <Login closeModal={handleCloseModal} setUser={handleUserLogin} />
            ) : modalType === 'register' ? (
                <Register closeModal={handleCloseModal} />
            ) : modalType === 'updateName' ? (
                <div>
                    <h3>更新用戶名稱</h3>
                    <input
                        type="text"
                        placeholder="輸入新用戶名稱"
                        value={userNameInput}
                        onChange={(e) => setUserNameInput(e.target.value)}
                    />
                    <button onClick={handleUpdateUserName}>確認</button>
                    <button onClick={handleCloseModal}>取消</button>
                </div>
            ) : null}
        </div>
    </div>
)}

            
        </div>
    );
}

export default App;
