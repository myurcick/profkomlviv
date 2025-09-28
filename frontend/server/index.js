import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database - у реальному проекті використовуйте Supabase
let news = [
  {
    id: 1,
    title: "Початок нового навчального року",
    content: "Вітаємо всіх студентів з початком нового навчального року! Бажаємо успіхів у навчанні та нових досягнень.",
    image_url: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    created_at: new Date().toISOString(),
    is_important: true
  },
  {
    id: 2,
    title: "Оновлення в системі матеріальної допомоги",
    content: "Інформуємо про оновлення в системі надання матеріальної допомоги студентам. Детальна інформація доступна в офісі профкому.",
    image_url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_important: false
  }
];

let nextNewsId = 3;

// Routes
app.get('/api/news', (req, res) => {
  res.json(news.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/news', (req, res) => {
  const { title, content, image_url, is_important } = req.body;
  
  const newNews = {
    id: nextNewsId++,
    title,
    content,
    image_url,
    created_at: new Date().toISOString(),
    is_important: is_important || false
  };
  
  news.push(newNews);
  res.status(201).json(newNews);
});

app.put('/api/news/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, image_url, is_important } = req.body;
  
  const newsIndex = news.findIndex(item => item.id === id);
  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News not found' });
  }
  
  news[newsIndex] = {
    ...news[newsIndex],
    title,
    content,
    image_url,
    is_important
  };
  
  res.json(news[newsIndex]);
});

app.delete('/api/news/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newsIndex = news.findIndex(item => item.id === id);
  
  if (newsIndex === -1) {
    return res.status(404).json({ error: 'News not found' });
  }
  
  news.splice(newsIndex, 1);
  res.status(204).send();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});