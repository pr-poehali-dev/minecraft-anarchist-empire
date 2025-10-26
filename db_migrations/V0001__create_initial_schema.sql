
CREATE TABLE IF NOT EXISTS privileges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  features TEXT[],
  duration VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  privilege_id INTEGER REFERENCES privileges(id),
  nickname VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password) VALUES ('skzry', '568876Qqq');

INSERT INTO privileges (name, description, price, features, duration) VALUES
('VIP', 'Базовая привилегия для комфортной игры', 100, ARRAY['Префикс [VIP]', 'Доступ к /fly', '5 сетов', 'Приоритет входа'], 'Навсегда'),
('PREMIUM', 'Расширенные возможности для продвинутых игроков', 250, ARRAY['Префикс [PREMIUM]', 'Доступ к /fly и /speed', '10 сетов', 'Приоритет входа', 'Кит Premium каждые 12ч'], '30 дней'),
('ELITE', 'Элитная привилегия с максимальными возможностями', 500, ARRAY['Префикс [ELITE]', 'Все команды донатера', '20 сетов', 'Максимальный приоритет', 'Кит Elite каждые 6ч', 'Уникальный скин'], '60 дней');
