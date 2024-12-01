// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/restaurants')
            .then(response => setRestaurants(response.data))
            .catch(error => console.error("Error fetching restaurants:", error));
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <header>
                <h1>Foodpanda 外送平台</h1>
            </header>
            <main>
                <input
                    type="text"
                    placeholder="搜尋餐廳..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div>
                    {filteredRestaurants.map(restaurant => (
                        <div key={restaurant.id}>
                            <h2>{restaurant.name}</h2>
                            <p>描述:{restaurant.description}</p>
                            <p>地址: {restaurant.address}</p>
                            <p>電話: {restaurant.phone}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
