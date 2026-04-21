"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BackToHome from "../components/BackToHome";
import {
  History,
  Edit,
  Trash2,
  Save,
  X,
  Camera,
  Maximize2,
  Undo2,
  Sparkles,
  NotebookPen,
  Calendar,
  Clock,
  Smile,
  Activity,
  FolderOpen,
  Laptop,
  Phone,
  Book,
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
  PenTool,
  Scissors,
  Bath,
  Flower,
  Brain,
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
}

interface ActivityInStory {
  activity_id: number;
}

interface MoodStory {
  id: number;
  moods: string[];
  activities: ActivityInStory[];
  text: string | null;
  photo_urls: string | null;
  created_at: string;
}

// Маппинг эмоций на русский
const moodTranslations: Record<string, string> = {
  joy: "радость",
  trust: "доверие",
  fear: "страх",
  surprise: "удивление",
  sadness: "грусть",
  disgust: "отвращение",
  anger: "гнев",
  anticipation: "ожидание",
  ecstasy: "экстаз",
  admiration: "восхищение",
  terror: "ужас",
  amazement: "изумление",
  grief: "горе",
  loathing: "отвращение_глубокое",
  rage: "ярость",
  vigilance: "бдительность",
  love: "любовь",
  optimism: "оптимизм",
  submission: "покорность",
  awe: "благоговение",
  disapproval: "неодобрение",
  remorse: "раскаяние",
  contempt: "презрение",
  aggressiveness: "агрессивность",
  serenity: "спокойствие",
  acceptance: "принятие",
  apprehension: "тревога",
  distraction: "рассеянность",
  pensiveness: "задумчивость",
  boredom: "скука",
  annoyance: "раздражение",
  interest: "интерес",
};

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
  Фотография: Camera,
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

function PhotoViewer({
  isOpen,
  onClose,
  photos,
  initialIndex = 0,
}: {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  initialIndex: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
          >
            <span className="text-white text-2xl">←</span>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition"
          >
            <span className="text-white text-2xl">→</span>
          </button>
        </>
      )}

      <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4">
        <Image
          src={photos[currentIndex]}
          alt={`Фото ${currentIndex + 1}`}
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [stories, setStories] = useState<MoodStory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    text: string;
    photoUrls: string[];
    newPhotos: File[];
    photosToDelete: string[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [actsRes, storiesRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/activities`,
          { credentials: "include" },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/stories`,
          { credentials: "include" },
        ),
      ]);

      if (!storiesRes.ok) throw new Error();

      const [acts, strs] = await Promise.all([
        actsRes.json(),
        storiesRes.json(),
      ]);

      setActivities(acts);
      setStories(strs);
    } catch {
      toast.error("Ошибка загрузки");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const getNormalizedPhotoUrls = (story: MoodStory): string[] => {
    if (!story.photo_urls) return [];

    if (typeof story.photo_urls === "string") {
      try {
        const parsed = JSON.parse(story.photo_urls);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [story.photo_urls];
      }
    }
    return story.photo_urls;
  };

  const openPhotoViewer = (story: MoodStory, index: number = 0) => {
    const urls = getNormalizedPhotoUrls(story);
    if (urls.length > 0) {
      setCurrentPhotos(urls);
      setCurrentPhotoIndex(index);
      setIsViewerOpen(true);
    }
  };

  const startEditing = (story: MoodStory) => {
    const photoUrls = getNormalizedPhotoUrls(story);
    setEditingId(story.id);
    setEditData({
      text: story.text || "",
      photoUrls: [...photoUrls],
      newPhotos: [],
      photosToDelete: [],
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEdit = async (storyId: number) => {
    if (!editData) return;

    try {
      const formData = new FormData();

      if (editData.text.trim()) {
        formData.append("text", editData.text);
      }

      if (editData.photoUrls.length > 0 && editData.photosToDelete.length > 0) {
        const photosToKeep = editData.photoUrls.filter(
          (url) => !editData.photosToDelete.includes(url),
        );
        if (photosToKeep.length > 0) {
          formData.append("photos_to_keep", photosToKeep.join(","));
        }
      }

      if (editData.photosToDelete.length > 0) {
        formData.append("photos_to_delete", editData.photosToDelete.join(","));
      }

      editData.newPhotos.forEach((photo) => {
        formData.append("new_photos", photo);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/stories/${storyId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Ошибка сохранения");
      }

      const updatedStory = await res.json();

      setStories(stories.map((s) => (s.id === storyId ? updatedStory : s)));
      toast.success("Запись обновлена");
      cancelEditing();
    } catch (err: any) {
      toast.error(err.message || "Ошибка при сохранении");
    }
  };

  const handleDelete = async (storyId: number) => {
    if (!confirm("Удалить эту запись? Все фотографии также будут удалены."))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/stories/${storyId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.ok) {
        setStories(stories.filter((s) => s.id !== storyId));
        toast.success("Запись удалена");
      } else {
        const error = await res.json();
        throw new Error(error.detail || "Ошибка при удалении");
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка при удалении");
    }
  };

  const handleTextChange = (text: string) => {
    if (!editData) return;
    setEditData({ ...editData, text });
  };

  const handleNewPhotos = (files: File[]) => {
    if (!editData) return;
    setEditData({ ...editData, newPhotos: [...editData.newPhotos, ...files] });
  };

  const removeNewPhoto = (index: number) => {
    if (!editData) return;
    const newPhotos = [...editData.newPhotos];
    newPhotos.splice(index, 1);
    setEditData({ ...editData, newPhotos });
  };

  const togglePhotoDelete = (url: string) => {
    if (!editData) return;

    setEditData((prev) => {
      if (!prev) return prev;
      const isDeleting = prev.photosToDelete.includes(url);
      const photosToDelete = isDeleting
        ? prev.photosToDelete.filter((u) => u !== url)
        : [...prev.photosToDelete, url];
      return { ...prev, photosToDelete };
    });
  };

  const activityMap = Object.fromEntries(activities.map((a) => [a.id, a.name]));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1D1D]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        <BackToHome />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 flex items-center justify-center gap-3">
              <History className="w-10 h-10 text-[#7F1D1D] dark:text-[#f87171]" />
              <span className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] bg-clip-text text-transparent">
                ИСТОРИЯ ЗАПИСЕЙ
              </span>
            </h1>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-20">
              <FolderOpen className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-500" />
              <h3 className="text-2xl font-bold text-[#7F1D1D] dark:text-white mb-4">
                Записей пока нет
              </h3>
              <Link href="/stories/create">
                <button className="bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] hover:from-[#991B1B] hover:to-[#ef4444] text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-2 mx-auto">
                  <Sparkles className="w-6 h-6" />
                  Создать запись
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {stories.map((story) => {
                const photoUrls = getNormalizedPhotoUrls(story);
                const isEditing = editingId === story.id;

                return (
                  <div
                    key={story.id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] flex items-center justify-center">
                          <NotebookPen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#7F1D1D] dark:text-[#f87171]" />
                            {formatDate(story.created_at)}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(story.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(story.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
                            >
                              <Save className="w-4 h-4" />
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Отмена
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(story)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7F1D1D] to-[#DC2626] text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
                            >
                              <Edit className="w-4 h-4" />
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDelete(story.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Удалить
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3 flex items-center gap-2">
                        <Smile className="w-4 h-4" />
                        Эмоции:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {story.moods.map((mood, i) => {
                          const russian =
                            moodTranslations[mood.toLowerCase()] || mood;

                          return (
                            <span
                              key={i}
                              className="px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-medium text-sm"
                            >
                              {russian}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Активности:
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {story.activities.map((act, i) => {
                          const name =
                            activityMap[act.activity_id] ||
                            `ID ${act.activity_id}`;
                          const IconComponent =
                            activityIconMap[name] || Activity;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                              <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                              <span className="font-medium dark:text-white">
                                {name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {isEditing && editData ? (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3">
                          Заметки:
                        </h4>
                        <textarea
                          value={editData.text}
                          onChange={(e) => handleTextChange(e.target.value)}
                          placeholder="Опишите свои мысли..."
                          className="w-full h-48 p-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:border-[#7F1D1D] outline-none"
                        />
                      </div>
                    ) : story.text ? (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3">
                          Заметки:
                        </h4>
                      </div>
                    ) : null}

                    {isEditing && editData ? (
                      <div className="space-y-6">
                        {editData.photoUrls.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3">
                              Фотографии (нажмите для удаления):
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              {editData.photoUrls.map((url, i) => {
                                const isMarkedForDelete =
                                  editData.photosToDelete.includes(url);
                                return (
                                  <div key={i} className="relative">
                                    <div
                                      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                                        isMarkedForDelete
                                          ? "border-red-600 opacity-60"
                                          : "border-transparent hover:border-[#7F1D1D]"
                                      }`}
                                      onClick={() => togglePhotoDelete(url)}
                                    >
                                      <Image
                                        src={url}
                                        alt={`Фото ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        {isMarkedForDelete ? (
                                          <Undo2 className="w-8 h-8 text-white" />
                                        ) : (
                                          <Trash2 className="w-8 h-8 text-white" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3">
                            Добавить новые фото:
                          </h4>
                          <div className="border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-[#7F1D1D] transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleNewPhotos(Array.from(e.target.files));
                                }
                              }}
                              className="hidden"
                              id={`file-input-${story.id}`}
                            />
                            <label
                              htmlFor={`file-input-${story.id}`}
                              className="cursor-pointer"
                            >
                              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <p className="text-lg font-bold dark:text-white">
                                Нажмите для загрузки фото
                              </p>
                            </label>
                          </div>

                          {editData.newPhotos.length > 0 && (
                            <div className="mt-6">
                              <p className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-3">
                                Новые фото:
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                {editData.newPhotos.map((file, i) => (
                                  <div key={i} className="relative">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                      {file.type.startsWith("image/") && (
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt={`Новое фото ${i + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <button
                                      onClick={() => removeNewPhoto(i)}
                                      className="absolute -top-2 -right-2 bg-[#7F1D1D] text-white w-6 h-6 rounded-full flex items-center justify-center"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      photoUrls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[#7F1D1D] dark:text-gray-400 mb-4">
                            Фотографии:
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {photoUrls.map((url, i) => (
                              <div
                                key={i}
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 group cursor-pointer"
                                onClick={() => openPhotoViewer(story, i)}
                              >
                                <Image
                                  src={url}
                                  alt={`Фото ${i + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                  <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <PhotoViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        photos={currentPhotos}
        initialIndex={currentPhotoIndex}
      />
    </main>
  );
}
