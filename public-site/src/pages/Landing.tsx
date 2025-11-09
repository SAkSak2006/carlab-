import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Send,
  Car,
  Truck,
  Gift,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Menu,
  LogIn,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StatCard } from "../components/StatCard";
import { ServiceCard } from "../components/ServiceCard";
import { ReviewCard } from "../components/ReviewCard";
import { PrimaryButton } from "../components/PrimaryButton";
import GradualBlur from "../components/GradualBlur";
import { MetallicLogo } from "../components/MetallicLogo";
import ShinyText from "../components/ShinyText";
import { publicApi } from "../services/api";
import heroImage from "../assets/56f9ca18871e3e018f61abd63571d4364b77b68b.png";
import formImage from "../assets/875e5a98f309049cbf6feb29b47496a2eddd97a6.png";
import galleryImage from "../assets/da8ce4e3522ddf8da71acc2c30b6cab6d22b9470.png";
import logoImage from "../assets/2d1f8671e7945caff2184d60a09d391acf0b2e5b.png";

export default function Landing() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    car: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requestInfo, setRequestInfo] = useState<{
    requestNumber: string;
    trackingUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Parse car field (assume format: "Brand Model")
      const carParts = formData.car.split(" ");
      const brand = carParts[0] || formData.car;
      const model = carParts.slice(1).join(" ") || brand;

      const response = await publicApi.submitRequest({
        client: {
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ")[1] || "",
          phone: formData.phone,
        },
        vehicle: {
          brand: brand,
          model: model,
        },
        description: formData.description,
      });

      setRequestInfo({
        requestNumber: response.requestNumber,
        trackingUrl: response.trackingUrl,
      });
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        name: "",
        phone: "",
        car: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Ошибка при отправке заявки. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white bg-[rgba(0,0,0,0)]">
      {/* Success Modal */}
      {showSuccessModal && requestInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-[#0A0E1A]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Заявка принята!</h3>
              <p className="text-gray-600 mb-4">Мы свяжемся с вами в течение 15 минут</p>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Номер вашей заявки:</p>
                <p className="text-3xl font-bold text-blue-600">#{requestInfo.requestNumber}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Отслеживайте статус заявки:</p>
                <Link
                  to={`/track/${requestInfo.trackingUrl.split('/').pop()}`}
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  Открыть страницу отслеживания
                </Link>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#A8B2C1] text-white py-3 rounded-lg font-semibold hover:bg-[#9099AA] transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md shadow-[0px_2px_10px_rgba(0,0,0,0.2)]">
        <div className="max-w-[1440px] mx-auto px-20 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="h-16">
            <img
              src={logoImage}
              alt="CarLab"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <a
              href="#about"
              className="text-sm uppercase hover:text-[#A8B2C1] transition-colors"
            >
              О компании
            </a>
            <a
              href="#gallery"
              className="text-sm uppercase hover:text-[#A8B2C1] transition-colors"
            >
              Галерея
            </a>
            <a
              href="#services"
              className="text-sm uppercase hover:text-[#A8B2C1] transition-colors"
            >
              Услуги
            </a>
            <a
              href="#reviews"
              className="text-sm uppercase hover:text-[#A8B2C1] transition-colors"
            >
              Отзывы
            </a>
            <a
              href="#contacts"
              className="text-sm uppercase hover:text-[#A8B2C1] transition-colors"
            >
              Контакты
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/AvtoKompleks_CarLab"
              className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#A8B2C1] transition-colors"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/79825220008"
              className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#A8B2C1] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="tel:+79825220008"
              className="border-2 border-white rounded-lg px-5 py-3 hover:bg-white/10 transition-colors"
            >
              +7 (982) 522-00-08
            </a>
            <Link
              to="/login"
              className="flex items-center gap-2 border-2 border-[#A8B2C1]/30 rounded-lg px-5 py-3 hover:bg-[#A8B2C1]/10 hover:border-[#A8B2C1] transition-all group"
            >
              <LogIn className="w-4 h-4 text-[#A8B2C1]" />
              <span className="text-sm text-[#A8B2C1]">Вход для сотрудников</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-20 max-w-[1440px] mx-auto relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -mx-20 rounded-3xl overflow-hidden">
          <img
            src={heroImage}
            alt="Auto Service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 via-[#0A0E1A]/85 to-[#0A0E1A]/60"></div>
        </div>

        <div className="relative z-10 flex gap-16 items-center">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Metallic Logo */}
            <div className="w-64 h-24 mb-4">
              <MetallicLogo logoSrc={logoImage} className="w-full h-full" />
            </div>

            <h1 className="text-7xl font-bold leading-tight">
              ПРОФЕССИОНАЛЬНЫЙ<br />
              УХОД ЗА ВАШИМ<br />
              <span className="inline-block">
                <ShinyText text="АВТОМОБИЛЕМ" speed={3} />
              </span>
            </h1>

            <p className="text-lg text-[#A0A5B8] leading-relaxed">
              Комплексный ремонт, полировка, химчистка<br />
              и защитные покрытия для Вашего авто
            </p>

            <div>
              <a href="#contact-form">
                <PrimaryButton>Записаться на диагностику</PrimaryButton>
              </a>
            </div>
          </div>

          {/* Right Column - Statistics Cards */}
          <div className="flex-1 flex flex-col gap-4">
            <StatCard number="15" text="лет на рынке" />
            <StatCard number="20 000+" text="запчастей на складе" />
            <StatCard number="12 000+" text="машин прошли диагностику" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-20 px-20 max-w-[1440px] mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-sm uppercase text-[#A8B2C1] tracking-wider">
            [ О компании ]
          </div>
        </div>

        <div className="flex gap-16">
          <div className="flex-1">
            <h2 className="text-5xl font-bold leading-tight">
              СОВРЕМЕННЫЙ<br />
              АВТОКОМПЛЕКС<br />
              <span className="inline-block">
                <ShinyText text="CARLAB" speed={3} />
              </span>
            </h2>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <p className="text-[#A0A5B8] leading-relaxed">
              Мы понимаем, для Вас машина — это не просто средство передвижения. Это объект гордости, предмет увлечения и источник удовольствия.
            </p>
            <p className="text-[#A0A5B8] leading-relaxed">
              Именно поэтому мы разработали комплекс услуг, способных удовлетворить самые взыскательные требования. Доверьте нам свой автомобиль — и мы покажем, что профессиональный уход может быть качественным и доступным.
            </p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="mt-16 space-y-6">
          {[
            "Комплексный ремонт всех узлов и агрегатов",
            "Профессиональная полировка кузова",
            "Тщательная химчистка салона",
            "Нанесение защитных покрытий",
            "Озонирование и детейлинг",
          ].map((benefit, index) => (
            <div key={index}>
              <div className="flex items-center gap-6 py-4">
                <span className="text-lg font-bold text-[#A8B2C1]">
                  0{index + 1}
                </span>
                <span className="text-lg font-medium">
                  {benefit}
                </span>
              </div>
              {index < 4 && (
                <div className="h-[1px] bg-[#2A2A2A]"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section
        id="gallery"
        className="py-20 px-20 max-w-[1440px] mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-sm uppercase text-[#A8B2C1] tracking-wider">
            [ Галерея ]
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            <div className="flex-shrink-0 w-[400px] h-[300px] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1597086657068-7e10f874e8c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwd29ya3Nob3AlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI1MjM5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Workshop interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[400px] h-[300px] rounded-2xl overflow-hidden">
              <img
                src={galleryImage}
                alt="Building exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-shrink-0 w-[400px] h-[300px] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666558892801-64638a8ae0b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY3MlMjB0ZWFtJTIwcGhvdG98ZW58MXx8fHwxNzYyNTIzOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section
        id="services"
        className="py-20 px-20 max-w-[1440px] mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-sm uppercase text-[#A8B2C1] tracking-wider mb-8">
            [ Наши услуги ]
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-8">
            ПОЛНЫЙ СПЕКТР
            <br />
            УСЛУГ ДЛЯ ЛЕГКОВЫХ
            <br />И ГРУЗОВЫХ АВТО
          </h2>
          <p className="text-lg text-[#A0A5B8] max-w-3xl mx-auto">
            Услуги — это не просто список операций. Для нас это
            чёткий процесс: диагностика, решение, результат.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-16">
          <ServiceCard
            image="https://images.unsplash.com/photo-1760827797819-4361cd5cd353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtYWludGVuYW5jZSUyMHNlcnZpY2V8ZW58MXx8fHwxNzYyNTAyMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Автосервис ⚙️"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1708805282676-0c15476eb8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwb2xpc2hpbmclMjBkZXRhaWxpbmd8ZW58MXx8fHwxNzYyNTkxMDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Полировка кузова ✨"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1656077885491-3922185f3932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuaW5nfGVufDF8fHx8MTc2MjUwODQ1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Химчистка салона 🧼"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1572359249699-5ced96364f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBjZXJhbWljJTIwY29hdGluZ3xlbnwxfHx8fDE3NjI1MTgwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Керамика 💎"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1646531840695-62810bcd1171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kb3clMjB0aW50aW5nfGVufDF8fHx8MTc2MjUxODQzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Тонировка ⚫"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1606235994317-b517abfd89cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYWludCUyMHByb3RlY3Rpb24lMjBmaWxtfGVufDF8fHx8MTc2MjUxOTc0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Бронирование 🚗"
          />
          <ServiceCard
            image="https://images.unsplash.com/photo-1624884269715-70759892cd29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kc2hpZWxkJTIwd2F0ZXIlMjByZXBlбельт8ZW58MXx8fHwxNzYyNTkxMDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            title="Антидождь ☔"
          />
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact-form" className="py-20 px-20 max-w-[1440px] mx-auto relative bg-[#0A0A0A]">
        <div className="relative z-10 flex gap-16">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-6xl font-bold leading-tight">
              УЗНАЙТЕ ТОЧНУЮ
              <br />
              СТОИМОСТЬ
              <br />
              <span className="inline-block">
                <ShinyText text="РЕМОНТА!" speed={3} />
              </span>
            </h2>

            <p className="text-lg text-[#A0A5B8] leading-relaxed">
              Оставьте заявку, и наш мастер свяжется с вами в
              течение 15 минут для уточнения деталей и записи на
              удобное время.
            </p>

            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#A8B2C1]/20 rounded-lg">
                  <Gift className="w-6 h-6 text-[#A8B2C1]" />
                </div>
                <span>Бесплатная диагностика</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#A8B2C1]/20 rounded-lg">
                  <Clock className="w-6 h-6 text-[#A8B2C1]" />
                </div>
                <span>
                  Работаем с 8:00 до 20:00 без выходных
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#A8B2C1]/20 rounded-lg">
                  <Phone className="w-6 h-6 text-[#A8B2C1]" />
                </div>
                <span>
                  Перезвоним через 15 минут после заявки
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 border border-white/10"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ВАШЕ ИМЯ"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0A0A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A8B2C1]"
                  required
                />
                <input
                  type="tel"
                  placeholder="ТЕЛЕФОН"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0A0A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A8B2C1]"
                  required
                />
                <input
                  type="text"
                  placeholder="МАРКА АВТОМОБИЛЯ"
                  value={formData.car}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      car: e.target.value,
                    })
                  }
                  className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0A0A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A8B2C1]"
                  required
                />
                <textarea
                  placeholder="КРАТКО ОПИШИТЕ ЧТО НЕ ТАК С АВТОМОБИЛЕМ"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-32 px-4 py-4 bg-white rounded-lg text-[#0A0A0A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A8B2C1] resize-none"
                  required
                />
              </div>

              <PrimaryButton
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ОТПРАВКА..." : "Записаться на диагностику"}
              </PrimaryButton>

              <p className="text-center text-xs text-[#A0A5B8]/60 mt-4">
                Нажимая вы даёте согласие на обработку
                персональных данных
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section
        id="reviews"
        className="py-20 px-20 max-w-[1440px] mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-sm uppercase text-[#A8B2C1] tracking-wider mb-8">
            [ Отзывы ]
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-8">
            СОТНИ ДОВОЛЬНЫХ
            <br />
            КЛИЕНТОВ
            <br />В МЕГИОНЕ
          </h2>

          {/* Rating */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="text-6xl font-bold text-[#A8B2C1]">
              4,9
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-[#A8B2C1] text-[#A8B2C1]"
                  />
                ))}
              </div>
              <div className="text-sm text-[#A0A5B8]">
                Яндекс карты
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative mt-16">
          <div className="flex gap-6 overflow-x-auto pb-4">
            <ReviewCard
              text="Отличный сервис! Быстро диагностировали проблему с двигателем и устранили. Цена адекватная, мастера знают своё дело. Рекомендую!"
              name="Алексей Смирнов"
              car="Toyota Camry 2018"
            />
            <ReviewCard
              text="Работаю водителем большегрузов. Ребята быстро починили КПП, не развели на деньги! Сделали качественно, езжу уже полгода без проблем. Спасибо!"
              name="Сергей Петров"
              car="КамАЗ 65115"
            />
            <ReviewCard
              text="Превосходное обслуживание! Поменяли быстро и качественно. Цена приятно удивила: дешевле, чем в сети быстро и качественно обслужили. Цены приятно удивили!"
              name="Анна Иванова"
              car="Volkswagen Polo 2017"
            />
          </div>

          {/* Navigation */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* CONTACTS SECTION */}
      <section
        id="contacts"
        className="py-20 px-20 max-w-[1440px] mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-sm uppercase text-[#A8B2C1] tracking-wider mb-8">
            [ Контакты ]
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            ЖДЁМ ВАС ПО АДРЕСУ
          </h2>
        </div>

        {/* Map Placeholder */}
        <div className="relative rounded-2xl overflow-hidden h-[400px] bg-[#1A1A1A] mt-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#A8B2C1] mx-auto mb-4" />
              <div className="text-xl font-semibold">
                г. Мегион, ул. Губкина 35 ст.1
              </div>
              <div className="text-[#A0A5B8] mt-2">
                Пн-Вс: 8:00 - 20:00
              </div>
              <div className="text-[#A8B2C1] mt-4">
                +7 (982) 522-00-08
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#05070F] py-12 px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-start mb-8">
            {/* Logo */}
            <div className="h-12">
              <img src={logoImage} alt="CarLab" className="h-full w-auto object-contain" />
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-3">
              <a
                href="#about"
                className="text-sm text-[#A0A5B8] hover:text-white transition-colors"
              >
                О компании
              </a>
              <a
                href="#gallery"
                className="text-sm text-[#A0A5B8] hover:text-white transition-colors"
              >
                Галерея
              </a>
              <a
                href="#services"
                className="text-sm text-[#A0A5B8] hover:text-white transition-colors"
              >
                Услуги
              </a>
              <a
                href="#reviews"
                className="text-sm text-[#A0A5B8] hover:text-white transition-colors"
              >
                Отзывы
              </a>
              <a
                href="#contacts"
                className="text-sm text-[#A0A5B8] hover:text-white transition-colors"
              >
                Контакты
              </a>
              <Link
                to="/track"
                className="text-sm text-[#A8B2C1] hover:text-white transition-colors"
              >
                Отследить заявку
              </Link>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://t.me/AvtoKompleks_CarLab"
                className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#A8B2C1] transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/79825220008"
                className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#A8B2C1] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="tel:+79825220008"
                className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#A8B2C1] transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-[#A0A5B8] pt-8 border-t border-[#2A2A2A]">
            © 2024 Автокомплекс CarLab. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
