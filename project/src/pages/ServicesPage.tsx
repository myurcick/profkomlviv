import React from 'react';
import { Users, FileText, Phone, Heart, Book, Shield, CheckCircle } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Соціальна підтримка",
      description: "Матеріальна допомога студентам у складних життєвих ситуаціях",
      details: [
        "Одноразова матеріальна допомога",
        "Щомісячна соціальна стипендія",
        "Допомога у надзвичайних ситуаціях",
        "Підтримка сімейних студентів"
      ]
    },
    {
      icon: <FileText className="h-12 w-12" />,
      title: "Юридичні консультації",
      description: "Безкоштовні консультації з правових питань для студентів",
      details: [
        "Консультації з трудового права",
        "Допомога у вирішенні академічних конфліктів",
        "Правова підтримка у спорах з орендодавцями",
        "Консультації з соціальних питань"
      ]
    },
    {
      icon: <Phone className="h-12 w-12" />,
      title: "Гаряча лінія",
      description: "Цілодобова підтримка студентів у критичних ситуаціях",
      details: [
        "Психологічна підтримка",
        "Консультації у кризових ситуаціях",
        "Інформаційна підтримка",
        "Переадресація до відповідних служб"
      ]
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Психологічна допомога",
      description: "Професійна психологічна підтримка та консультування",
      details: [
        "Індивідуальні консультації психолога",
        "Групові тренінги",
        "Підтримка у стресових ситуаціях",
        "Профілактика емоційного вигорання"
      ]
    },
    {
      icon: <Book className="h-12 w-12" />,
      title: "Освітні програми",
      description: "Додаткові освітні можливості та програми розвитку",
      details: [
        "Курси з особистісного розвитку",
        "Тренінги з лідерства",
        "Мовні курси",
        "Профорієнтаційні програми"
      ]
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Захист прав студентів",
      description: "Представництво інтересів студентів у різних інстанціях",
      details: [
        "Участь у академічних комісіях",
        "Представництво у адміністративних органах",
        "Захист від дискримінації",
        "Моніторинг якості освіти"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Наші послуги
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Професійна підтримка студентів у всіх сферах життя - від соціальної допомоги до правового захисту
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="text-blue-600 mb-6 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-center">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 px-8 py-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">
                    Отримати послугу
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Як отримати допомогу?
            </h2>
            <p className="text-lg text-gray-600">
              Простий процес подачі заяви на отримання підтримки
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Подайте заяву</h3>
              <p className="text-gray-600">Заповніть онлайн-форму або завітайте до нашого офісу</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Розгляд заяви</h3>
              <p className="text-gray-600">Наші фахівці розглянуть вашу заяву протягом 3-5 робочих днів</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Отримайте допомогу</h3>
              <p className="text-gray-600">Ми надамо вам необхідну підтримку або консультацію</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Подати заяву зараз
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;