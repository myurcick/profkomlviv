/*
  # Створення таблиці новин

  1. Нові таблиці
    - `news`
      - `id` (integer, primary key, auto-increment)
      - `title` (text, required) - заголовок новини
      - `content` (text, required) - текст новини
      - `image_url` (text, optional) - URL зображення
      - `is_important` (boolean, default false) - чи є новина важливою
      - `created_at` (timestamp, default now()) - дата створення
      - `updated_at` (timestamp, default now()) - дата оновлення

  2. Безпека
    - Увімкнути RLS для таблиці `news`
    - Політика читання для всіх користувачів
    - Політика запису лише для автентифікованих користувачів
*/

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Увімкнути Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Політика для читання новин (всі користувачі)
CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  TO public
  USING (true);

-- Політика для створення новин (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can create news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Політика для оновлення новин (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Політика для видалення новин (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (true);

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();