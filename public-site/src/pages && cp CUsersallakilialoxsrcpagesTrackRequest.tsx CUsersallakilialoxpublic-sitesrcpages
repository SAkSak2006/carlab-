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
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StatCard } from "../components/StatCard";
import { ServiceCard } from "../components/ServiceCard";
import { ReviewCard } from "../components/ReviewCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { publicApi } from "../services/api";
import heroImage from "figma:asset/56f9ca18871e3e018f61abd63571d4364b77b68b.png";
import formImage from "figma:asset/875e5a98f309049cbf6feb29b47496a2eddd97a6.png";
import galleryImage from "figma:asset/da8ce4e3522ddf8da71acc2c30b6cab6d22b9470.png";

export default function Landing() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
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
      const [brand, ...modelParts] = formData.brand.split(" ");
      const model = modelParts.join(" ") || brand;

      const response = await publicApi.submitRequest({
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email || undefined,
        },
        vehicle: {
          brand: brand,
          model: model,
          year: formData.year ? parseInt(formData.year) : undefined,
          licensePlate: formData.licensePlate || undefined,
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
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        brand: "",
        model: "",
        year: "",
        licensePlate: "",
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
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] to-[#1A1F2E] text-white bg-[rgba(0,0,0,0)]">
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
                className="w-full bg-[#D4F347] text-[#0A0E1A] py-3 rounded-lg font-semibold hover:bg-[#e0f75e] transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E1A]/80 backdrop-blur-md shadow-[0px_2px_10px_rgba(0,0,0,0.2)]">
        <div className="max-w-[1440px] mx-auto px-20 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="border-2 border-white rounded-lg px-3 py-2">
            <div className="text-2xl font-bold">ILIALOX</div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <a
              href="#about"
              className="text-sm uppercase hover:text-[#D4F347] transition-colors"
            >
              О компании
            </a>
            <a
              href="#gallery"
              className="text-sm uppercase hover:text-[#D4F347] transition-colors"
            >
              Галерея
            </a>
            <a
              href="#services"
              className="text-sm uppercase hover:text-[#D4F347] transition-colors"
            >
              Услуги
            </a>
            <a
              href="#reviews"
              className="text-sm uppercase hover:text-[#D4F347] transition-colors"
            >
              Отзывы
            </a>
            <a
              href="#contacts"
              className="text-sm uppercase hover:text-[#D4F347] transition-colors"
            >
              Контакты
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-[#D4F347] hover:underline"
            >
              Вход для сотрудников
            </Link>
            <a
              href="tel:+79998881111"
              className="border-2 border-white rounded-lg px-5 py-3 hover:bg-white/10 transition-colors"
            >
              +7 (999) 888-11-11
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-20 max-w-[1440px] mx-auto relative">
        <div className="absolute inset-0 -mx-20 rounded-3xl overflow-hidden">
          <img
            src={heroImage}
            alt="Auto Service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 via-[#0A0E1A]/85 to-[#0A0E1A]/60"></div>
        </div>

        <div className="relative z-10 flex gap-16 items-center">
          <div className="flex-1 flex flex-col gap-8">
            <h1 className="text-7xl font-bold leading-tight">
              РЕМОНТ ЛЕГКОВЫХ<br />
              И ГРУЗОВЫХ АВТО<br />
              В МЕГИОНЕ<br />
              <span className="text-[#D4F347]">ПОД КЛЮЧ</span>
            </h1>

            <p className="text-lg text-[#A0A5B8] leading-relaxed">
              Бесплатная диагностика авто —<br />
              за 15 минут узнаешь всё
            </p>

            <div>
              <a href="#contact-form">
                <PrimaryButton>Записаться на диагностику</PrimaryButton>
              </a>
            </div>

            <div className="flex gap-8 mt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg">
                  <Car className="w-8 h-8 text-white/80" />
                </div>
                <span className="text-xs text-[#A0A5B8]">Легковые</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg">
                  <Truck className="w-8 h-8 text-white/80" />
                </div>
                <span className="text-xs text-[#A0A5B8]">Грузовые</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <StatCard number="15" text="лет на рынке" />
            <StatCard number="20 000+" text="запчастей на складе" />
            <StatCard number="12 000+" text="машин прошли диагностику" />
          </div>
        </div>
      </section>

      {/* Continue with other sections... (About, Gallery, Services) */}
      {/* I'll include the form section with updated integration */}

      {/* CONTACT FORM SECTION */}
      <section id="contact-form" className="py-20 px-20 max-w-[1440px] mx-auto relative">
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img
            src={formImage}
            alt="Workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 to-[#0A0E1A]/80"></div>
        </div>

        <div className="relative z-10 flex gap-16">
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-6xl font-bold leading-tight">
              ОСТАВЬТЕ
              <br />
              ЗАЯВКУ НА
              <br />
              <span className="text-[#D4F347]">РЕМОНТ!</span>
            </h2>

            <p className="text-lg text-[#A0A5B8] leading-relaxed">
              Оставьте заявку, и наш мастер свяжется с вами в
              течение 15 минут для уточнения деталей и записи на
              удобное время.
            </p>

            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#D4F347]/20 rounded-lg">
                  <Gift className="w-6 h-6 text-[#D4F347]" />
                </div>
                <span>Бесплатная диагностика</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#D4F347]/20 rounded-lg">
                  <Clock className="w-6 h-6 text-[#D4F347]" />
                </div>
                <span>
                  Работаем с 8:00 до 20:00 без выходных
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#D4F347]/20 rounded-lg">
                  <Phone className="w-6 h-6 text-[#D4F347]" />
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
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ИМЯ"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ФАМИЛИЯ"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="EMAIL (необязательно)"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="МАРКА И МОДЕЛЬ АВТОМОБИЛЯ"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    })
                  }
                  className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ГОС. НОМЕР"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licensePlate: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                  />
                  <input
                    type="number"
                    placeholder="ГОД ВЫПУСКА"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: e.target.value,
                      })
                    }
                    className="w-full h-14 px-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347]"
                  />
                </div>

                <textarea
                  placeholder="ОПИШИТЕ ПРОБЛЕМУ"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-32 px-4 py-4 bg-white rounded-lg text-[#0A0E1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4F347] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 h-14 bg-[#D4F347] text-[#0A0E1A] rounded-lg font-semibold uppercase hover:bg-[#e0f75e] transition-all shadow-[0px_4px_16px_rgba(212,243,71,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "ОТПРАВКА..." : "ОСТАВИТЬ ЗАЯВКУ"}
              </button>

              <p className="text-center text-xs text-[#A0A5B8]/60 mt-4">
                Нажимая вы даёте согласие на обработку
                персональных данных
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Add remaining sections from original App.tsx (Reviews, Contacts, Footer) */}
      {/* Footer can include link to track request */}
      <footer className="bg-[#05070F] py-12 px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="border-2 border-white rounded-lg px-3 py-2">
              <div className="text-2xl font-bold">ILIALOX</div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/track" className="text-sm text-[#D4F347] hover:underline">
                Отследить заявку
              </Link>
              <Link to="/login" className="text-sm text-[#A0A5B8] hover:text-white transition-colors">
                Вход для сотрудников
              </Link>
            </div>

            <div className="flex gap-4">
              <a
                href="tel:+79998881111"
                className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-lg hover:border-[#D4F347] transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="text-center text-xs text-[#A0A5B8] pt-8 border-t border-[#2A2F3E]">
            © 2024 Автосервис ILIALOX. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
