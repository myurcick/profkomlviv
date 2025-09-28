/*
  # Створення таблиці членів команди

  1. Нові таблиці
    - `team_members`
      - `id` (integer, primary key, auto-increment)
      - `name` (text, required) - ім'я та прізвище
      - `position` (text, required) - посада
      - `description` (text, optional) - опис/біографія
      - `photo_url` (text, optional) - URL фото
      - `email` (text, optional) - email для контакту
      - `phone` (text, optional) - телефон
      - `order_index` (integer, default 0) - порядок відображення
      - `is_active` (boolean, default true) - чи активний член команди
      - `created_at` (timestamp, default now()) - дата створення
      - `updated_at` (timestamp, default now()) - дата оновлення

  2. Безпека
    - Увімкнути RLS для таблиці `team_members`
    - Політика читання для всіх користувачів
    - Політика запису лише для автентифікованих користувачів
*/

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Увімкнути Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Політика для читання членів команди (всі користувачі)
CREATE POLICY "Anyone can read team members"
  ON team_members
  FOR SELECT
  TO public
  USING (is_active = true);

-- Політика для створення членів команди (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can create team members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Політика для оновлення членів команди (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can update team members"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Політика для видалення членів команди (лише автентифіковані користувачі)
CREATE POLICY "Authenticated users can delete team members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_team_members_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at_column();