import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'login' 或 'register'

    // 加載餐廳數據
    useEffect(() => {
        axios
            .get('http://172.26.11.72:5000/restaurants')
            .then((response) => setRestaurants(response.data))
            .catch((error) => console.error('Error fetching restaurants:', error));
    }, []);

    // 篩選餐廳
    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
    };

    return (
        <div>
            {/* 頁頭 */}
            <header style={headerStyle}>
                <h1 style={logoStyle}>foodpanda</h1>
                <div style={buttonGroupStyle}>
                    <button onClick={() => handleOpenModal('login')} style={loginButtonStyle}>
                        登入
                    </button>
                    <button onClick={() => handleOpenModal('register')} style={registerButtonStyle}>
                        註冊
                    </button>
                </div>
            </header>

            {/* 主頁內容 */}
            <main style={mainStyle}>
                <div style={contentStyle}>
                    <div style={backgroundStyle}>
                        <div style={searchContainerStyle}>
                            <input
                                type="text"
                                placeholder="輸入你欲送達的地址"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={searchInputStyle}
                            />
                            <button style={searchButtonStyle}>搜尋美食</button>
                        </div>
                    </div>
                    <div>
                        {filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                style={{
                                    borderBottom: '1px solid #ccc',
                                    margin: '10px 0',
                                    padding: '10px',
                                }}
                            >
                                <h2>{restaurant.name}</h2>
                                <p>描述: {restaurant.description}</p>
                                <p>地址: {restaurant.address}</p>
                                <p>電話: {restaurant.phone}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* 頁尾 */}
            <footer style={footerStyle}>
                © 2024 foodpanda. All rights reserved.
            </footer>

            {/* 浮動視窗 */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={closeButtonStyle} onClick={handleCloseModal}>
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
        </div>
    );
}

// 樣式
const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E21B70',
    padding: '10px 20px',
    zIndex: 1000,
};

const logoStyle = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
};

const loginButtonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    borderRadius: '20px',
    color: '#fff',
    padding: '5px 15px',
    cursor: 'pointer',
};

const registerButtonStyle = {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '20px',
    color: '#E21B70',
    padding: '5px 15px',
    cursor: 'pointer',
};

const mainStyle = {
    paddingTop: '80px',
    padding: '20px',
};

const contentStyle = {
    textAlign: 'center',
};

const backgroundStyle = {
    position: 'relative',
    width: '100%',
    minHeight: '350px',
    backgroundColor: '#f7f7f7',
    backgroundImage: 'url(/images/homepage.png)', // 請確認圖片路徑正確
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
};

const searchContainerStyle = {
    flex: 1,
    padding: '20px',
    maxWidth: '800px',
};

const searchInputStyle = {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    width: '60%',
};

const searchButtonStyle = {
    backgroundColor: '#E21B70',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
};

const footerStyle = {
    textAlign: 'center',
    backgroundColor: '#E21B70',
    color: '#fff',
    padding: '10px 0',
    position: 'fixed',
    bottom: 0,
    width: '100%',
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
};

export default App;
