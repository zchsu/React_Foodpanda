import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const hostServer = '172.26.11.72:5000';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // 開啟註冊或登入視窗
    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
    };

    // 搜尋餐廳
    const handleSearchRestaurants = () => {
        if (!search) return; // 如果沒有輸入地址，則不發送請求
        setIsLoading(true); // 顯示加載狀態
        axios
            .get(`http://${hostServer}/restaurants/search?address=${search}`)
            .then((response) => {
                setRestaurants(response.data);
                setIsLoading(false); // 停止加載狀態
            })
            .catch((error) => {
                console.error('Error searching restaurants:', error);
                setIsLoading(false); // 停止加載狀態
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
                            <button onClick={handleSearchRestaurants} style={searchButtonStyle}>
                                搜尋美食
                            </button>
                        </div>
                    </div>
                    {/* 顯示搜尋結果 */}
                    {isLoading ? (
                        <p>正在加載...</p>
                    ) : (
                        <div>
                            {restaurants.length > 0 ? (
                                restaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.name}
                                        onClick={() => navigate(`/menu/${restaurant.name}`)} // 點擊跳轉
                                        style={{
                                            borderBottom: '1px solid #ccc',
                                            margin: '10px 0',
                                            padding: '10px',
                                            cursor: 'pointer', // 鼠標變成手型
                                        }}
                                        
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

            {/* 縣市選擇區域 */}
            <div style={citySectionStyle}>
                <h3>我們有在您的城市提供送餐服務!</h3>
                <div style={cityGridStyle}>
                    {cities.map((city) => (
                        <div
                            key={city.name}
                            onClick={() => {
                                setSearch(city.name); // 更新搜尋欄位
                                handleSearchRestaurants(); // 執行搜尋
                            }}
                            style={cityCardStyle}
                        >
                            <img
                                src={city.image}
                                alt={city.name}
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                            <p>{city.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 頁尾 */}
            <footer style={footerStyle}>
                © 2024 foodpanda. 軟體工程.
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
    position: 'absolute',
    top: '25px',
    right: '50px',
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
    left: 0,
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
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: '#E21B70',
    color: '#fff',
    padding: '10px 0',
    left: 0,
    right: 0,
    marginTop: '50px',
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

const citySectionStyle = {
    marginTop: '30px',
    textAlign: 'center',
};

const cityGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
};

const cityCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    width: '120px',
    transition: 'transform 0.3s, box-shadow 0.3s',
};

cityCardStyle[':hover'] = {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};


export default App;
