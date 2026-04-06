CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role user_role,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('viewer','analyst','admin');
CREATE TYPE user_status AS ENUM ('active','inactive');

drop table users;

CREATE TABLE IF NOT EXISTS financial_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DOUBLE PRECISION,
  type record_type,
  category VARCHAR(50),
  date DATE,
  notes VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE record_type AS ENUM ('income','expense');