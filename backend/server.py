# server.py
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MySQL 配置
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'foodpanda_db'
app.config['MYSQL_DB'] = 'foodpanda_db2'

mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    useremail = data.get('useremail', '')
    password = data.get('password', '')
    name = data.get('name', '')

    # 後端驗證
    if '@' not in useremail:
        return jsonify({"error": "Email 不正確"}), 400
    if len(password) < 8:
        return jsonify({"error": "密碼必須至少包含 8 個字符"}), 400

    # 插入資料庫
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO user_info (user_email, password, user_name) VALUES (%s, %s, %s)",
            (useremail, password, name)
        )
        mysql.connection.commit()
    except Exception as e:
        return jsonify({"error": "註冊失敗，請稍後再試。", "details": str(e)}), 500

    return jsonify({"message": "User registered successfully"}), 201


# 用戶登入
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    useremail = data['useremail']
    password = data['password']
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user_name, user_email FROM user_info WHERE user_email = %s AND password = %s", (useremail, password))
    user = cursor.fetchone()
    if user:
        response = {
            "user_name": user[0],  # 假設 user[0] 是 user_name
            "user_email": user[1]  # 假設 user[1] 是 user_email
        }
        return jsonify(response), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# 密碼重置
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    useremail = data['useremail']
    new_password = data['newPassword']
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user_email FROM user_info WHERE user_email = %s", (useremail,))
    user = cursor.fetchone()
    
    if user:
        cursor.execute(
            "UPDATE user_info SET password = %s WHERE user_email = %s",
            (new_password, useremail)
        )
        mysql.connection.commit()
        return jsonify({"message": "Password reset successfully"}), 200
    else:
        return jsonify({"message": "Email not found"}), 404

@app.route('/update_username', methods=['POST'])
def update_username():
    data = request.json
    email = data.get('email')
    new_name = data.get('name')

    if not email or not new_name:
        return jsonify({"error": "缺少必要參數"}), 400

    try:
        cursor = mysql.connection.cursor()
        query = "UPDATE user_info SET user_name = %s WHERE user_email = %s"
        cursor.execute(query, (new_name, email))
        mysql.connection.commit()
        return jsonify({"message": "用戶名稱更新成功"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
    category = request.args.get('category', '')  # 新增類別過濾
    query = "SELECT restaurant_name, restaurant_address, restaurant_desc, restaurant_phone FROM restaurant WHERE restaurant_address LIKE %s"
    params = ['%' + address + '%']

    if category:
        query += " AND restaurant_desc LIKE %s"
        params.append('%' + category + '%')

    cursor = mysql.connection.cursor()
    cursor.execute(query, tuple(params))
    result = cursor.fetchall()
    restaurants = [{"name": row[0], "address": row[1], "description": row[2], "phone": row[3]} for row in result]
    return jsonify(restaurants)

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

# 獲取用戶購物車
@app.route('/cart', methods=['GET'])
def get_cart():
    user_email = request.args.get('user_email')
    restaurant_name = request.args.get('restaurant_name')
    cursor = mysql.connection.cursor()
    cursor.execute(
        "SELECT meal_name, amount, content FROM cart WHERE user_email = %s AND restaurant_name = %s",
        (user_email, restaurant_name)
    )
    result = cursor.fetchall()
    cart_items = [{"meal_name": row[0], "amount": row[1], "content": row[2]} for row in result]
    return jsonify(cart_items)

# 更新購物車商品數量
@app.route('/cart/update', methods=['PUT'])
def update_cart_item():
    data = request.json
    user_email = data['user_email']
    meal_name = data['meal_name']
    amount = data['amount']

    cursor = mysql.connection.cursor()
    cursor.execute(
        "UPDATE cart SET amount = %s WHERE user_email = %s AND meal_name = %s",
        (amount, user_email, meal_name)
    )
    mysql.connection.commit()
    return jsonify({"message": "Cart item updated successfully"}), 200

# 刪除購物車商品
@app.route('/cart/delete', methods=['DELETE'])
def delete_cart_item():
    data = request.json
    user_email = data['user_email']
    meal_name = data['meal_name']

    cursor = mysql.connection.cursor()
    cursor.execute(
        "DELETE FROM cart WHERE user_email = %s AND meal_name = %s",
        (user_email, meal_name)
    )
    mysql.connection.commit()
    return jsonify({"message": "Cart item deleted successfully"}), 200


# 新增訂單
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    user_email = data['user_email']
    payer_name = data['payer_name']  # 新增付款人姓名
    delivery_address = data['deliveryAddress']
    cart_items = data['cartItems']
    payment_method = data['paymentMethod']
    delivery_option = data['deliveryOption']
    need_utensils = data['needUtensils']
    order_time = data['orderTime']

    cursor = mysql.connection.cursor()

    # 插入訂單主資料，包括付款人姓名
    cursor.execute(
        """
        INSERT INTO orders (user_email, payer, delivery_address, payment_method, delivery_option, need_utensils, order_time)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (user_email, payer_name, delivery_address, payment_method, delivery_option, need_utensils, order_time)
    )
    order_id = cursor.lastrowid  # 獲取新插入訂單的 ID

    # 插入每個購物車商品到 order_items
    for item in cart_items:
        cursor.execute(
            """
            INSERT INTO order_items (order_id, meal_name, amount, meal_price)
            VALUES (%s, %s, %s, %s)
            """,
            (order_id, item['meal_name'], item['amount'], item['meal_price'])
        )

    mysql.connection.commit()
    return jsonify({"message": "Order created successfully", "order_id": order_id}), 201


@app.route('/hisorders', methods=['GET'])
def get_orders():
    user_email = request.args.get('user_email', '')  # 從查詢參數獲取用戶電子郵件
    cursor = mysql.connection.cursor()

    # 使用 JOIN 來查詢用戶的所有訂單及商品項目
    cursor.execute("""
        SELECT o.order_id, o.delivery_address, o.payment_method, o.delivery_option, o.need_utensils, o.order_time,
               oi.meal_name, oi.amount, oi.meal_price
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_email = %s
    """, (user_email,))
    rows = cursor.fetchall()

    # 整理查詢結果
    result = {}
    for row in rows:
        order_id = row[0]

        # 檢查該訂單是否已存在，若不存在則創建新的訂單記錄
        if order_id not in result:
            result[order_id] = {
                'id': order_id,
                'delivery_address': row[1],
                'payment_method': row[2],
                'delivery_option': row[3],
                'need_utensils': row[4],
                'order_time': row[5],
                'items': []
            }
        
        # 將商品項目添加到對應的訂單
        result[order_id]['items'].append({
            'meal_name': row[6],
            'amount': row[7],
            'meal_price': row[8]
        })

    # 將結果轉換為列表形式
    final_result = list(result.values())
    
    return jsonify({'orders': final_result})



if __name__ == '__main__':
    #app.run(host='172.26.11.72', port=5000 , debug=True)
    app.run(debug=True)
