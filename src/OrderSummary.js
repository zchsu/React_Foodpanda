import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import './OrderSummary.css';

function OrderSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, deliveryAddress, cartItems, deliveryOption, payer_name } = location.state || {};
    const [orderStatus, setOrderStatus] = useState('未送達');
    const [progress, setProgress] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState([40, 50]);
    const [coords, setCoords] = useState(null); // 經緯度座標
    const [search, setSearch] = useState(''); // 解析後的地址

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyB4OBWXlzs9mD8nK0cV54PxJChL0rN-e5M', // 替換成您的 API 金鑰
    });

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.meal_price * item.amount, 0);
    };

    const estimateDeliveryTime = () => {
        if (orderStatus === '已送達') {
            return deliveryOption === 'pickup'
                ? '餐點準備完成，可以領取餐點'
                : '訂單已送達';
        }
        return `預計外送時間: ${deliveryTime[0]}-${deliveryTime[1]} 分鐘`;
    };

    const getlocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoords({ lat: latitude, lng: longitude });

                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
                    axios
                        .get(url)
                        .then((response) => {
                            const address = `${response.data.address.city || ''}${response.data.address.town || ''}${response.data.address.road || ''}${response.data.address.house_number ? response.data.address.house_number + '號' : ''}`;
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

    useEffect(() => {
        getlocation();

        const statusTimer = setTimeout(() => {
            if (progress === 100) {
                setOrderStatus('已送達');
                alert(deliveryOption === 'pickup'
                    ? '餐點已準備完成，請前往領取'
                    : '訂單已送達');
            }
        }, 5000);

        const progressTimer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 20 : 100));
            setDeliveryTime((prev) => (prev[0] > 0 ? [prev[0] - 10, prev[1] - 10] : prev));
            if (progress === 100) clearInterval(progressTimer);
        }, 1000);

        return () => {
            clearTimeout(statusTimer);
            clearInterval(progressTimer);
        };
    }, [progress, deliveryOption]);

    const handleReturnHome = () => {
        navigate('/', { state: { user } });
    };

    return (
        <div className="order-summary-page">
            <h2>訂單明細</h2>
            <div className="order-details">
                <h1>{estimateDeliveryTime()}</h1>
                <h3>訂單狀態: {orderStatus}</h3>
                <progress value={progress} max="100" className="order-progress" />
                <br />
                <br />
                <h3>付款人姓名</h3>
                <p>{payer_name}</p>
                <br />
                <h3>送餐地址</h3>
                <p>{deliveryAddress}</p>
               
                <br />
                {isLoaded && coords && (
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '300px' }}
                            center={coords}
                            zoom={15}
                        >
                            <Marker position={coords} />
                        </GoogleMap>
                    </div>
                )}
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
            <button className="return-home-button" onClick={handleReturnHome}>
                返回主頁
            </button>
        </div>
    );
}

export default OrderSummary;
