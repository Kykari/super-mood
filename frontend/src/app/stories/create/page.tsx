"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EmotionWheel from "../../components/EmotionWheel";
import BackToHome from "../../components/BackToHome";
import {
  ArrowLeft,
  Camera,
  Trash2,
  Sparkles,
  Activity,
  Check,
  Laptop,
  Phone,
  Book,
  Calendar,
  Tv,
  Gamepad2,
  Music,
  Bed,
  Footprints,
  Dumbbell,
  Bike,
  Coffee,
  ChefHat,
  Utensils,
  Wine,
  Truck,
  Trees,
  Dog,
  Mountain,
  Wind,
  Users,
  Smartphone,
  MessageCircle,
  PartyPopper,
  Handshake,
  Paintbrush,
  Camera as CameraIcon,
  PenTool,
  Scissors,
  Bath,
  Flower,
  Brain,
  Sofa,
  Brush,
  Shirt,
  Leaf,
  Home,
  Notebook,
  CalendarDays,
  Languages,
  DollarSign,
  Newspaper,
} from "lucide-react";

interface Activity {
  id: number;
  name: string;
  category: string;
  icon_key: string;
}

const questions = [
  { title: "Как прошел ваш день?", subtitle: "Выберите от 1 до 3 эмоций" },
  { title: "Чем вы сегодня занимались?", subtitle: "Отметьте активности" },
  { title: "Расскажите подробности", subtitle: "Опишите свои мысли" },
  { title: "Прикрепите фотоотчет", subtitle: "Добавьте фотографии" },
];

// Маппинг активностей на иконки
const activityIconMap: Record<string, any> = {
  "Работа за компьютером": Laptop,
  Созвон: Phone,
  Обучение: Book,
  Чтение: Book,
  Планирование: Calendar,
  Сериал: Tv,
  Книга: Book,
  Видеоигры: Gamepad2,
  Музыка: Music,
  "Просто отдых": Bed,
  Бег: Footprints,
  "Тренажёрный зал": Dumbbell,
  Йога: Activity,
  Велосипед: Bike,
  Прогулка: Footprints,
  Кофе: Coffee,
  Готовка: ChefHat,
  "Вкусная еда": Utensils,
  Алкоголь: Wine,
  Доставка: Truck,
  Парк: Trees,
  "Прогулка с собакой": Dog,
  Лес: Trees,
  "Свежий воздух": Wind,
  "За городом": Mountain,
  "Встреча с друзьями": Users,
  "Звонок родным": Smartphone,
  Переписка: MessageCircle,
  Тусовка: PartyPopper,
  "Новое знакомство": Handshake,
  Рисование: Paintbrush,
  Фотография: CameraIcon,
  Писательство: PenTool,
  Рукоделие: Scissors,
  Душ: Bath,
  "Уход за кожей": Flower,
  Медитация: Brain,
  "Дневной сон": Bed,
  Растяжка: Activity,
  Уборка: Brush,
  Стирка: Shirt,
  "Уход за растениями": Leaf,
  "Готовка на неделю": ChefHat,
  "Дела по дому": Home,
  Дневник: Notebook,
  "Планирование дня": CalendarDays,
  "Изучение языка": Languages,
  Финансы: DollarSign,
  "Полезное чтение": Newspaper,
};

// Маппинг категорий на иконки
const categoryIconMap: Record<string, any> = {
  Спорт: Dumbbell,
  Хобби: Paintbrush,
  Работа: Laptop,
  Отдых: Sofa,
  Здоровье: Brain,
  Еда: Utensils,
  Общение: Users,
  Творчество: PenTool,
  Дом: Home,
  Развлечения: Tv,
  Природа: Trees,
  Образование: Book,
  Путешествия: Mountain,
  Финансы: DollarSign,
  Медитация: Flower,
};

export default function CreateEntry() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/activities`,
      { credentials: "include" },
    )
      .then((r) => r.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Не удалось загрузить активности");
        setLoading(false);
      });
  }, []);

  // Группировка активностей по категориям
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const category = activity.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>,
  );

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : prev.length < 3
          ? [...prev, emotion]
          : prev,
    );
  };

  const toggleActivity = (id: number) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    setPhotos((p) => [...p, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((pr) => [...pr, ev.target!.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (i: number) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const saveEntry = async () => {
    if (selectedEmotions.length === 0) return toast.error("Выберите эмоции");
    if (selectedActivities.length === 0)
      return toast.error("Выберите активности");

    const formData = new FormData();
    formData.append("moods", selectedEmotions.join(","));
    formData.append("activity_id", selectedActivities.join(","));
    if (description.trim()) formData.append("text", description.trim());

    if (photos.length > 0) {
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/stories/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Не удалось сохранить");
      }

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/analytics?force=true`,
        { credentials: "include" },
      );

      toast.success("Запись сохранена!");
      router.push("/home");
    } catch (err) {
      toast.error("Ошибка сохранения");
    }
  };

  const canNext =
    (step === 0 && selectedEmotions.length > 0) ||
    (step === 1 && selectedActivities.length > 0) ||
    step > 1;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg dark:text-white">
        Загрузка...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black py-3 pb-20">
      <BackToHome />
      <div className="max-w-5xl mx-auto px-3">
        {/* Прогресс */}
        <div className="mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 rounded-full"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            Шаг {step + 1} / {questions.length}
          </p>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent flex items-center justify-center gap-1.5">
          <Sparkles className="w-5 h-5" />
          Новая запись
        </h1>

        {/* Шаг 1 — Эмоции */}
        {step === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-bold dark:text-white text-center mb-1">
              {questions[0].title}
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
              {questions[0].subtitle}
            </p>
            <EmotionWheel
              selectedEmotions={selectedEmotions}
              onEmotionSelect={toggleEmotion}
              maxSelections={3}
            />
            {selectedEmotions.length > 0 && (
              <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Выбрано: {selectedEmotions.length}/3
              </div>
            )}
          </div>
        )}

        {/* Шаг 2 — Активности */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-bold dark:text-white text-center mb-1">
              {questions[1].title}
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
              {questions[1].subtitle}
            </p>

            {Object.keys(groupedActivities).length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                Нет доступных активностей
              </div>
            ) : (
              <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                {Object.entries(groupedActivities)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([category, categoryActivities]) => {
                    const CategoryIcon = categoryIconMap[category] || Activity;

                    return (
                      <div key={category} className="space-y-2.5">
                        {/* Заголовок категории */}
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                          <CategoryIcon className="w-4 h-4 text-red-500" />
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {category}
                          </h3>
                          <span className="text-[10px] text-gray-400 ml-auto bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                            {categoryActivities.length}
                          </span>
                        </div>

                        {/* Активности */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {categoryActivities.map((act) => {
                            const IconComponent =
                              activityIconMap[act.name] || Activity;
                            const isSelected = selectedActivities.includes(
                              act.id,
                            );
                            return (
                              <button
                                key={act.id}
                                onClick={() => toggleActivity(act.id)}
                                className={`
                                  relative p-2.5 rounded-xl border transition-all duration-150
                                  flex flex-col items-center gap-1.5
                                  hover:scale-105 active:scale-95
                                  ${
                                    isSelected
                                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm"
                                      : "border-gray-200 dark:border-gray-700 hover:border-red-300 bg-white dark:bg-gray-800"
                                  }
                                `}
                              >
                                <IconComponent
                                  className={`w-6 h-6 ${
                                    isSelected
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                />
                                <p className="text-xs font-medium text-center leading-tight text-gray-700 dark:text-gray-200">
                                  {act.name.length > 14
                                    ? act.name.slice(0, 12) + "..."
                                    : act.name}
                                </p>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 shadow-sm">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Индикатор выбора */}
            {selectedActivities.length > 0 && (
              <div className="mt-4 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">
                  ✓ Выбрано активностей: {selectedActivities.length}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Шаг 3 — Текст */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-bold dark:text-white text-center mb-1">
              {questions[2].title}
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
              {questions[2].subtitle}
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Поделитесь мыслями..."
              className="w-full h-40 p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                       focus:border-red-500 outline-none resize-none text-sm
                       bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="mt-1 text-right text-[10px] text-gray-400 dark:text-gray-500">
              {description.length} симв.
            </div>
          </div>
        )}

        {/* Шаг 4 — Фото */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-bold dark:text-white text-center mb-1">
              {questions[3].title}
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
              {questions[3].subtitle}
            </p>

            <label
              htmlFor="photo-upload"
              className="block border-2 border-dashed border-gray-300 dark:border-gray-600 
                       rounded-lg p-4 text-center cursor-pointer
                       hover:border-red-500 transition-colors
                       bg-gray-50 dark:bg-gray-700/30"
            >
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
              <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Загрузить фото
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                до 5 шт.
              </p>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <Image
                      src={src}
                      alt={`Фото ${i + 1}`}
                      fill
                      className="rounded object-cover"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white w-5 h-5 rounded-full 
                               opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Навигация */}
        <div className="flex justify-between gap-3 mt-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 
                     hover:bg-gray-300 dark:hover:bg-gray-600 
                     rounded-lg text-sm font-medium flex items-center gap-1 transition
                     text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Назад
          </button>

          {step < questions.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="px-5 py-2 bg-gradient-to-r from-red-700 to-red-500 
                       text-white rounded-lg text-sm font-medium disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center gap-1 transition
                       hover:shadow-md"
            >
              Далее
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          ) : (
            <button
              onClick={saveEntry}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-500 
                       text-white rounded-lg text-sm font-medium flex items-center gap-1 transition
                       hover:shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              Сохранить
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
