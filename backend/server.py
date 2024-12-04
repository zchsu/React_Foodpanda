# server.py
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL 配置
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'foodpanda_db'

mysql = MySQL(app)

# 註冊用戶
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    useremail = data['useremail']
    password = data['password']
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO user_info (user_email, password) VALUES (%s, %s)", (useremail, password))
    mysql.connection.commit()
    return jsonify({"message": "User registered successfully"}), 201

# 用戶登入
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    useremail = data['useremail']
    password = data['password']
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM user_info WHERE user_email = %s AND password = %s", (useremail, password))
    user = cursor.fetchone()
    if user:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# 獲取餐廳
@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT restaurant_name, restaurant_address, restaurant_desc, restaurant_phone FROM restaurant")
    result = cursor.fetchall()
    restaurants = [{"name": row[0], "address": row[1], "description": row[2], "phone": row[3]} for row in result]
    return jsonify(restaurants)

#搜尋餐廳
@app.route('/restaurants/search', methods=['GET'])
def search_restaurants():
    address = request.args.get('address', '')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT restaurant_name, restaurant_address, restaurant_desc, restaurant_phone FROM restaurant WHERE restaurant_address LIKE %s", ('%' + address + '%',))
    result = cursor.fetchall()
    restaurants = [{"name": row[0], "address": row[1], "description": row[2], "phone": row[3]} for row in result]
    return jsonify(restaurants)

#獲取菜單
@app.route('/menu', methods=['GET'])
def get_menu():
    restaurant_name = request.args.get('restaurant_name')
    cursor = mysql.connection.cursor()
    cursor.execute(
        "SELECT meal_name, meal_price, meal_desc FROM menu WHERE restaurant_name = %s",
        (restaurant_name,)
    )
    result = cursor.fetchall()
    menu_items = [{"meal_name": row[0], "meal_price": row[1], "meal_desc": row[2]} for row in result]
    return jsonify(menu_items)

# 新增到購物車
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    restaurant_name = data['restaurant_name']
    meal_name = data['meal_name']
    user_email = data['user_email']
    content = data['content']
    amount = data['amount']

    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO cart (restaurant_name, meal_name, user_email, content, amount) VALUES (%s, %s, %s, %s, %s)",
        (restaurant_name, meal_name, user_email, content, amount)
    )
    mysql.connection.commit()
    return jsonify({"message": "Added to cart successfully"}), 201

if __name__ == '__main__':
    app.run(host='172.26.11.72', port=5000 , debug=True)
    #app.run(debug=True)
