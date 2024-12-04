import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import './App.css'; // 匯入外部樣式

const hostServer = '172.26.11.72:5000';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(null); // Store user's location
    const navigate = useNavigate();

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
        { name: '新竹縣', image: '/images/新竹縣.png' },
        { name: '苗栗縣', image: '/images/苗栗縣.png' },
        { name: '彰化縣', image: '/images/彰化縣.png' },
        { name: '南投縣', image: '/images/南投縣.png' },
        { name: '雲林縣', image: '/images/雲林縣.png' },
        { name: '嘉義縣', image: '/images/嘉義縣.png' },
        { name: '屏東縣', image: '/images/屏東縣.png' },
        { name: '宜蘭縣', image: '/images/宜蘭縣.png' },
        { name: '花蓮縣', image: '/images/花蓮縣.png' },
        { name: '台東縣', image: '/images/台東縣.png' },
        { name: '澎湖縣', image: '/images/澎湖縣.png' },
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
        setIsLoading(true);
        axios
            .get(`http://${hostServer}/restaurants/search?address=${search}`)
            .then((response) => {
                setRestaurants(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error searching restaurants:', error);
                setIsLoading(false);
            });
    };

    const getlocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    console.log('User location:', { latitude, longitude });
    
                    // Call the reverse geocoding API to get the address
                    const apiKey = 'AIzaSyAFsDAifUDGbzyqqHhf5p415ZvHCPacJZY';  // Replace with your API key
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
                    axios
                        .get(url)
                        .then((response) => {
                            if (response.data.status === 'OK') {
                                const address = response.data.results[0].formatted_address;
                                console.log('User address:', address);
                            } else {
                                console.error('Failed to get address:', response.data.status);
                            }
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

    return (
        <div>
            {/* Header */}
            <header>
                <h1>foodpanda</h1>
                <div className="button-group">
                    <button className="login-button" onClick={() => handleOpenModal('login')}>
                        登入
                    </button>
                    <button className="register-button" onClick={() => handleOpenModal('register')}>
                        註冊
                    </button>
                </div>
            </header>

            {/* Main */}
            <main>
                <div className="content">
                    <div className="background">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="輸入你欲送達的地址"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={handleSearchRestaurants}>搜尋美食</button>
                        </div>
                    </div>
                    {isLoading ? (
                        <p>正在加載...</p>
                    ) : (
                        <div>
                            {restaurants.length > 0 ? (
                                restaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.name}
                                        onClick={() => navigate(`/menu/${restaurant.name}`)}
                                        className="restaurant-item"
                                    >
                                        <h2>{restaurant.name}</h2>
                                        <p>描述: {restaurant.description}</p>
                                        <p>地址: {restaurant.address}</p>
                                        <p>電話: {restaurant.phone}</p>
                                    </div>
                                ))
                            ) : (
                                <p>找不到餐廳</p>
                            )}
                        </div>
                    )}
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
                            }}
                        >
                            <img src={city.image} alt={city.name} />
                            <p>{city.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer>© 2024 foodpanda. 軟體工程.</footer>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseModal}>
                            ✕
                        </button>
                        {modalType === 'login' ? (
                            <Login closeModal={handleCloseModal} />
                        ) : (
                            <Register closeModal={handleCloseModal} />
                        )}
                    </div>
                </div>
            )}
            <button onClick={getlocation}>Location</button>
        </div>
    );
}

export default App;
