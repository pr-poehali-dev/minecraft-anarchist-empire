import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления привилегиями и заказами
    Args: event - HTTP запрос, context - контекст выполнения
    Returns: JSON ответ с данными
    '''
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        if method == 'GET':
            if path == 'privileges':
                cur.execute('SELECT id, name, description, price, features, duration FROM privileges ORDER BY price')
                rows = cur.fetchall()
                privileges = [
                    {
                        'id': r[0],
                        'name': r[1],
                        'description': r[2],
                        'price': r[3],
                        'features': r[4],
                        'duration': r[5]
                    } for r in rows
                ]
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'privileges': privileges}),
                    'isBase64Encoded': False
                }
            
            if path == 'orders':
                auth_token = event.get('headers', {}).get('x-auth-token', '')
                if not check_auth(cur, auth_token):
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('''
                    SELECT o.id, o.nickname, o.email, o.status, o.created_at, 
                           p.name, p.price
                    FROM orders o
                    JOIN privileges p ON o.privilege_id = p.id
                    ORDER BY o.created_at DESC
                ''')
                rows = cur.fetchall()
                orders = [
                    {
                        'id': r[0],
                        'nickname': r[1],
                        'email': r[2],
                        'status': r[3],
                        'created_at': r[4].isoformat(),
                        'privilege_name': r[5],
                        'price': r[6]
                    } for r in rows
                ]
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'orders': orders}),
                    'isBase64Encoded': False
                }
            
            if path == 'admins':
                auth_token = event.get('headers', {}).get('x-auth-token', '')
                if not check_auth(cur, auth_token):
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('SELECT id, username FROM admins ORDER BY username')
                rows = cur.fetchall()
                admins = [{'id': r[0], 'username': r[1]} for r in rows]
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'admins': admins}),
                    'isBase64Encoded': False
                }
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'login':
                username = body.get('username')
                password = body.get('password')
                cur.execute('SELECT id, username FROM admins WHERE username = %s AND password = %s', (username, password))
                row = cur.fetchone()
                if row:
                    token = f"{row[0]}:{row[1]}"
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({'token': token, 'username': row[1]}),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            if path == 'order':
                privilege_id = body.get('privilege_id')
                nickname = body.get('nickname')
                email = body.get('email', '')
                
                cur.execute(
                    'INSERT INTO orders (privilege_id, nickname, email) VALUES (%s, %s, %s) RETURNING id',
                    (privilege_id, nickname, email)
                )
                order_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'order_id': order_id, 'message': 'Order created'}),
                    'isBase64Encoded': False
                }
            
            if path == 'privilege':
                auth_token = event.get('headers', {}).get('x-auth-token', '')
                if not check_auth(cur, auth_token):
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                name = body.get('name')
                description = body.get('description')
                price = body.get('price')
                features = body.get('features', [])
                duration = body.get('duration')
                
                cur.execute(
                    'INSERT INTO privileges (name, description, price, features, duration) VALUES (%s, %s, %s, %s, %s) RETURNING id',
                    (name, description, price, features, duration)
                )
                privilege_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': privilege_id}),
                    'isBase64Encoded': False
                }
            
            if path == 'admin':
                auth_token = event.get('headers', {}).get('x-auth-token', '')
                if not check_auth(cur, auth_token):
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                username = body.get('username')
                password = body.get('password')
                
                cur.execute(
                    'INSERT INTO admins (username, password) VALUES (%s, %s) RETURNING id',
                    (username, password)
                )
                admin_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': admin_id}),
                    'isBase64Encoded': False
                }
        
        if method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'order_status':
                auth_token = event.get('headers', {}).get('x-auth-token', '')
                if not check_auth(cur, auth_token):
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                order_id = body.get('order_id')
                status = body.get('status')
                
                cur.execute('UPDATE orders SET status = %s WHERE id = %s', (status, order_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Status updated'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()

def check_auth(cur, token: str) -> bool:
    if not token or ':' not in token:
        return False
    parts = token.split(':')
    admin_id = parts[0]
    username = parts[1]
    cur.execute('SELECT id FROM admins WHERE id = %s AND username = %s', (admin_id, username))
    return cur.fetchone() is not None
