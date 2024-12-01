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

if __name__ == '__main__':
    app.run(debug=True)
