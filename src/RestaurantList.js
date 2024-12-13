import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RestaurantList.css';

const hostServer = 'localhost:5000';

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]); // 儲存選擇的類別
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || null;
    const search = location.state?.address || '';

    useEffect(() => {
        if (!search) return;

        setIsLoading(true);
        const cityAndTown = search.match(/^(.*?市|縣).*?(區|鎮|鄉)/); 
        const simplifiedSearch = cityAndTown ? cityAndTown[0] : search;
        console.log('search address:', simplifiedSearch);

        // 傳遞選擇的類別
        const categoriesQuery = selectedCategories.join(',');

        axios
            .get(`http://${hostServer}/restaurants/search?address=${simplifiedSearch}&category=${categoriesQuery}`)
            .then((response) => {
                console.log('API返回的餐廳數據:', response.data);
                setRestaurants(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error searching restaurants:', error);
                setIsLoading(false);
            });
    }, [search, selectedCategories]);  // 當 search 或 selectedCategories 改變時觸發

    const handleNavigateToMenu = (restaurantName) => {
        navigate(`/menu/${restaurantName}`, { state: { user, address: search } });
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategories((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((item) => item !== category);  // 如果已選擇，則取消選擇
            } else {
                return [...prevCategories, category];  // 如果未選擇，則添加
            }
        });
    };

    return (
        <div>
             <div className="listheader">
                <h1>foodpanda</h1>
            </div>
            <br></br>
            <br></br>
        <div className="restaurant-list-container">
           
            <div className="filter-container">
                <h2>篩選</h2>
                <div className="checkbox-group">
                    <label>
                        <input 
                            type="checkbox" 
                            value="速食" 
                            checked={selectedCategories.includes('速食')} 
                            onChange={handleCategoryChange} 
                        />
                        速食
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            value="飲料" 
                            checked={selectedCategories.includes('飲料')} 
                            onChange={handleCategoryChange} 
                        />
                        飲料
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            value="中式美食" 
                            checked={selectedCategories.includes('中式美食')} 
                            onChange={handleCategoryChange} 
                        />
                        中式美食
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            value="小吃" 
                            checked={selectedCategories.includes('小吃')} 
                            onChange={handleCategoryChange} 
                        />
                        小吃
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            value="早餐" 
                            checked={selectedCategories.includes('早餐')} 
                            onChange={handleCategoryChange} 
                        />
                        早餐
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            value="便當" 
                            checked={selectedCategories.includes('便當')} 
                            onChange={handleCategoryChange} 
                        />
                        便當
                    </label>
                </div>
            </div>
            <div className="restaurants-list">
                <h1>餐廳列表</h1>
                {isLoading ? (
                    <p>正在加載...</p>
                ) : (
                    <div>
                        {restaurants.length > 0 ? (
                            restaurants.map((restaurant) => (
                                <div
                                    key={restaurant.name}
                                    onClick={() => handleNavigateToMenu(restaurant.name)}
                                    className="restaurant-item"
                                >
                                    <h2>{restaurant.name}</h2>
                                    <p>描述: {restaurant.description}</p>
                                    <p>地址: {restaurant.address}</p>
                                    <p>電話: {restaurant.phone}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-results">沒有找到餐廳，請調整搜尋條件</p>
                        )}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

export default RestaurantList;
