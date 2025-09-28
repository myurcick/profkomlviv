/*
  # Створення таблиці профбюро факультетів

  1. Нові таблиці
    - `faculty_unions`
      - `id` (integer, primary key, auto-increment)
      - `faculty_name` (text, required) - назва факультету
      - `union_head_name` (text, required) - ім'я голови профбюро
      - `union_head_photo` (text, optional) - фото голови профбюро
      - `contact_email` (text, optional) - контактний email
      - `contact_phone` (text, optional) - контактний телефон
      - `office_location` (text, optional) - розташування офісу
      - `working_hours` (text, optional) - години роботи
      - `description` (text, optional) - опис діяльності
      - `website_url` (text, optional) - сайт факультету
      - `social_links` (jsonb, optional) - соціальні мережі
      - `order_index` (integer, default 0) - порядок відображення
      - `is_active` (boolean, default true) - чи активне профбюро
      - `created_at` (timestamp, default now()) - дата створення
      - `updated_at` (timestamp, default now()) - дата оновлення

  2. Безпека
    - Увімкнути RLS для таблиці `faculty_unions`
    - Політика читання для всіх користувачів
    - Політика запису лише для автентифікованих користувачів
*/

CREATE TABLE IF NOT EXISTS faculty_unions (
  id SERIAL PRIMARY KEY,
  faculty_name TEXT NOT NULL,
  union_head_name TEXT NOT NULL,
  union_head_photo TEXT,
  contact_email TEXT,
  office_location TEXT,
  working_hours TEXT DEFAULT 'Пн-Пт: 9:00-17:00',
  description TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Увімкнути Row Level Security
ALTER TABLE faculty_unions ENABLE ROW LEVEL SECURITY;

-- Політика для читання профбюро факультетів (всі користувачі)
CREATE POLICY "Anyone can read faculty unions"
  ON faculty_unions
  FOR SELECT
  TO public
  USING (is_active = true);

-- Політика для створення профбюро факультетів (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can create faculty unions"
  ON faculty_unions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Політика для оновлення профбюро факультетів (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can update faculty unions"
  ON faculty_unions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Політика для видалення профбюро факультетів (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can delete faculty unions"
  ON faculty_unions
  FOR DELETE
  TO authenticated
  USING (true);

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_faculty_unions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення updated_at
CREATE TRIGGER update_faculty_unions_updated_at
  BEFORE UPDATE ON faculty_unions
  FOR EACH ROW
  EXECUTE FUNCTION update_faculty_unions_updated_at_column();