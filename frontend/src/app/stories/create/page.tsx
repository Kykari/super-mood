"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EmotionWheel from "../../components/EmotionWheel";

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

// ←←← КРАСИВЫЕ СМАЙЛИКИ ДЛЯ ВСЕХ АКТИВНОСТЕЙ ←←←
const emojiMap: Record<string, string> = {
  "Работа за компьютером": "💻",
  Созвон: "📞",
  Обучение: "📚",
  Чтение: "📖",
  Планирование: "📅",
  Сериал: "📺",
  Книга: "📚",
  Видеоигры: "🎮",
  Музыка: "🎵",
  "Просто отдых": "😴",
  Бег: "🏃‍♀️",
  "Тренажёрный зал": "🏋️‍♀️",
  Йога: "🧘‍♀️",
  Велосипед: "🚴‍♀️",
  Прогулка: "🚶‍♀️",
  Кофе: "☕",
  Готовка: "🍳",
  "Вкусная еда": "🍽️",
  Алкоголь: "🍷",
  Доставка: "🛵",
  Парк: "🌳",
  "Прогулка с собакой": "🐕",
  Лес: "🌲",
  "Свежий воздух": "🌬️",
  "За городом": "🏞️",
  "Встреча с друзьями": "👥",
  "Звонок родным": "📱",
  Переписка: "💬",
  Тусовка: "🎉",
  "Новое знакомство": "🤝",
  Рисование: "🎨",
  Фотография: "📸",
  Писательство: "✍️",
  Рукоделие: "🧵",
  Душ: "🚿",
  "Уход за кожей": "🧴",
  Медитация: "🧘‍♀️",
  "Дневной сон": "😴",
  Растяжка: "🤸‍♀️",
  Уборка: "🧹",
  Стирка: "🧺",
  "Уход за растениями": "🌱",
  "Готовка на неделю": "🍱",
  "Дела по дому": "🏠",
  Дневник: "📔",
  "Планирование дня": "🗓️",
  "Изучение языка": "🗣️",
  Финансы: "💰",
  "Полезное чтение": "📰",
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
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
      }/activities`,
      { credentials: "include" }
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

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : prev.length < 3
        ? [...prev, emotion]
        : prev
    );
  };

  const toggleActivity = (id: number) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
        }/stories/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Ошибка бэкенда:", err);
        throw new Error(err.detail || "Не удалось сохранить");
      }

      const data = await res.json();
      console.log("Успешно сохранено:", data);
      toast.success("Запись сохранена!");
      router.push("/home");
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      toast.error("Ошибка сохранения");
    }
  };

  const canNext =
    (step === 0 && selectedEmotions.length > 0) ||
    (step === 1 && selectedActivities.length > 0) ||
    step > 1;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Загрузка...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Прогресс */}
        <div className="mb-10">
          <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
          Новая запись
        </h1>

        {/* Шаг 1 — Эмоции */}
        {step === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              {questions[0].title}
            </h2>
            <EmotionWheel
              selectedEmotions={selectedEmotions}
              onEmotionSelect={toggleEmotion}
              maxSelections={3}
            />
          </div>
        )}

        {/* Шаг 2 — Активности с красивыми смайликами */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              {questions[1].title}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {activities.map((act) => (
                <button
                  key={act.id}
                  onClick={() => toggleActivity(act.id)}
                  className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-3
                    ${
                      selectedActivities.includes(act.id)
                        ? "border-red-600 bg-red-50 dark:bg-red-900/30 shadow-xl scale-105"
                        : "border-gray-300 dark:border-gray-600 hover:border-red-400"
                    }`}
                >
                  <span className="text-6xl">{emojiMap[act.name] || "✨"}</span>
                  <p className="text-sm font-medium text-center">{act.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Шаг 3 — Текст */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              {questions[2].title}
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Поделитесь своими мыслями..."
              className="w-full h-64 p-6 rounded-2xl border-2 border-gray-300 dark:border-gray-600 focus:border-red-600 outline-none resize-none"
            />
          </div>
        )}

        {/* Шаг 4 — Фото */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              {questions[3].title}
            </h2>
            <div className="border-4 border-dashed border-gray-400 rounded-3xl p-16 text-center cursor-pointer hover:border-red-600 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
                id="photo"
              />
              <label htmlFor="photo">
                <div className="text-6xl text-gray-400 mb-4">+</div>
                <p className="text-xl font-bold">Нажмите или перетащите фото</p>
              </label>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={src}
                      alt=""
                      width={300}
                      height={300}
                      className="rounded-xl"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Навигация */}
        <div className="flex justify-between mt-12">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-10 py-4 bg-gray-200 dark:bg-gray-700 rounded-2xl font-bold"
          >
            Назад
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="px-12 py-4 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-2xl font-bold disabled:opacity-50"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={saveEntry}
              className="px-16 py-5 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-red-600/50"
            >
              Сохранить запись
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
