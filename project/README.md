# Сайт профкому студентів ЛНУ імені Івана Франка

Сучасний веб-сайт для профспілкової організації студентів Львівського національного університету імені Івана Франка.

## Функціональність

### Для відвідувачів:
- Перегляд актуальних новин та оголошень
- Інформація про послуги профкому
- Доступ до необхідних документів та форм
- Контактна інформація та режим роботи
- Адаптивний дизайн для всіх пристроїв

### Для адміністраторів:
- Повноцінна адмін панель
- Управління новинами (створення, редагування, видалення)
- Позначення важливих новин
- Завантаження зображень до новин
- Статистика відвідувань

## Технології

### Frontend:
- **React 18** з TypeScript
- **Tailwind CSS** для стилізації
- **React Router** для навігації
- **Lucide React** для іконок
- **Vite** як збірник

### Backend:
- **Supabase** для бази даних та аутентифікації
- **Express.js** для API (опціонально)
- **PostgreSQL** через Supabase

## Встановлення та налаштування

### 1. Клонування репозиторію
```bash
git clone <repository-url>
cd lnu-student-union-website
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування Supabase

1. Створіть проект на [supabase.com](https://supabase.com)
2. Скопіюйте `.env.example` в `.env`
3. Додайте ваші Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Створення таблиць бази даних

Виконайте SQL міграції в Supabase SQL Editor:

```sql
-- Створення таблиці новин
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

-- Політики доступу
CREATE POLICY "Anyone can read news" ON news FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create news" ON news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update news" ON news FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete news" ON news FOR DELETE TO authenticated USING (true);
```

### 5. Додавання тестових даних
```sql
INSERT INTO news (title, content, is_important) VALUES 
('Перша новина', 'Текст першої новини', true),
('Друга новина', 'Текст другої новини', false);
```

### 6. Створення адмін користувача

В Supabase Authentication створіть користувача-адміністратора або скористайтеся функцією signup.

### 7. Запуск проекту

```bash
# Режим розробки
npm run dev

# Збірка для продакшену
npm run build

# Запуск Express сервер (опціонально)
npm run server
```

## Структура проекту

```
src/
├── components/          # React компоненти
│   ├── Header.tsx      # Навігаційна панель
│   ├── Footer.tsx      # Підвал сайту
│   └── NewsCard.tsx    # Картка новини
├── pages/              # Сторінки
│   ├── HomePage.tsx    # Головна сторінка
│   ├── ServicesPage.tsx # Сторінка послуг
│   ├── DocumentsPage.tsx # Сторінка документів
│   ├── ContactsPage.tsx # Контакти
│   ├── NewsPage.tsx    # Список новин
│   ├── AdminLogin.tsx  # Логін адміна
│   └── AdminDashboard.tsx # Адмін панель
├── context/            # React Context
│   └── AuthContext.tsx # Контекст аутентифікації
├── lib/               # Утиліти
│   └── supabase.ts    # Налаштування Supabase
└── App.tsx            # Головний компонент
```

## Адмін панель

Для доступу до адмін панелі:
1. Перейдіть на `/admin/login`
2. Увійдіть з credentials адміністратора
3. Керуйте новинами через інтуїтивний інтерфейс

Функції адмін панелі:
- Створення нових новин
- Редагування існуючих новин
- Видалення новин
- Позначення важливих новин
- Перегляд статистики

## Деплой

### Netlify (рекомендовано)
1. Підключіть репозиторій до Netlify
2. Встановіть environment variables
3. Деплой відбудеться автоматично

### Vercel
1. Імпортуйте проект у Vercel
2. Додайте environment variables
3. Деплой готовий

## Розробка

### Додавання нових сторінок
1. Створіть компонент у `src/pages/`
2. Додайте маршрут у `App.tsx`
3. Оновіть навігацію в `Header.tsx`

### Стилізація
Проект використовує Tailwind CSS. Основні кольори:
- Синій: `#0057B7` (український синій)
- Жовтий: `#FFD700` (український жовтий)
- Сірі відтінки для тексту та фону

### База даних
Всі операції з базою даних проходять через Supabase клієнт. Приклад використання:

```typescript
import { supabase } from '../lib/supabase';

// Отримання новин
const { data, error } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });
```

## Підтримка

Для технічної підтримки або питань щодо розробки звертайтеся до команди розробки профкому.

## Ліцензія

Цей проект створено для профспілкової організації студентів ЛНУ імені Івана Франка.