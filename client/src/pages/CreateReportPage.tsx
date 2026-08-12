import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
  MapPin,
  Camera,
  Image as ImageIcon,
  FileText,
  Locate,
  CheckCircle2,
  AlertTriangle,
  Send,
  Home,
  RotateCcw,
  FolderOpen,
  Clock,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import MapPicker from '@/components/MapPicker';

interface CategoryData {
  id: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  priority: string;
}

interface PhotoData {
  file: File;
  preview: string;
  progress: number;
  name: string;
  size: string;
}

interface FormData {
  category: CategoryData | null;
  description: string;
  photos: PhotoData[];
  address: string;
  district: string;
  reference: string;
  latitude: number | null;
  longitude: number | null;
}

interface WizardStep {
  id: number;
  label: string;
  shortLabel: string;
  icon: typeof FileText;
}

const MAX_DESCRIPTION = 500;
const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const STEPS: WizardStep[] = [
  { id: 0, label: 'Categoría', shortLabel: 'Categ.', icon: FileText },
  { id: 1, label: 'Descripción', shortLabel: 'Desc.', icon: FileText },
  { id: 2, label: 'Fotos', shortLabel: 'Fotos', icon: ImageIcon },
  { id: 3, label: 'Ubicación', shortLabel: 'Ubic.', icon: MapPin },
  { id: 4, label: 'Revisión', shortLabel: 'Revis.', icon: Check },
  { id: 5, label: 'Confirmación', shortLabel: 'Envío', icon: CheckCircle2 },
];

const CATEGORIES: CategoryData[] = [
  {
    id: 'solidos',
    emoji: '🗑️',
    name: 'Residuos Sólidos',
    description: 'Basura, escombros y desechos acumulados',
    color: '#4ADE80',
    borderColor: 'border-[#4ADE80]',
    bgColor: 'bg-[#4ADE80]/10',
    priority: 'Media',
  },
  {
    id: 'quema',
    emoji: '🔥',
    name: 'Quema de Residuos',
    description: 'Quema de basura, hojas o materiales',
    color: '#F97316',
    borderColor: 'border-[#F97316]',
    bgColor: 'bg-[#F97316]/10',
    priority: 'Alta',
  },
  {
    id: 'agua',
    emoji: '💧',
    name: 'Contaminación del Agua',
    description: 'Ríos, quebradas o fuentes contaminadas',
    color: '#3B82F6',
    borderColor: 'border-[#3B82F6]',
    bgColor: 'bg-[#3B82F6]/10',
    priority: 'Alta',
  },
  {
    id: 'deforestacion',
    emoji: '🌳',
    name: 'Deforestación',
    description: 'Tala de árboles o destrucción de áreas verdes',
    color: '#10B981',
    borderColor: 'border-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
    priority: 'Alta',
  },
  {
    id: 'escombros',
    emoji: '🏗️',
    name: 'Escombros',
    description: 'Material de construcción abandonado',
    color: '#F59E0B',
    borderColor: 'border-[#F59E0B]',
    bgColor: 'bg-[#F59E0B]/10',
    priority: 'Media',
  },
  {
    id: 'aire',
    emoji: '☁️',
    name: 'Contaminación del Aire',
    description: 'Humo, gases o partículas en el aire',
    color: '#9CA3AF',
    borderColor: 'border-[#9CA3AF]',
    bgColor: 'bg-[#9CA3AF]/10',
    priority: 'Alta',
  },
  {
    id: 'auditiva',
    emoji: '🔊',
    name: 'Contaminación Auditiva',
    description: 'Ruidos molestos excesivos',
    color: '#818CF8',
    borderColor: 'border-[#818CF8]',
    bgColor: 'bg-[#818CF8]/10',
    priority: 'Baja',
  },
  {
    id: 'otro',
    emoji: '⚠️',
    name: 'Otro',
    description: 'Otro tipo de problemática ambiental',
    color: '#EAB308',
    borderColor: 'border-[#EAB308]',
    bgColor: 'bg-[#EAB308]/10',
    priority: 'Media',
  },
];

const DISTRICTS = [
  'Villa El Salvador',
  'Villa María del Triunfo',
  'San Juan de Miraflores',
  'Lurín',
  'Cieneguilla',
  'Pachacámac',
  'San Bartolo',
];

function generateReportId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#RPT-${year}-${num}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function CreateReportPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportId, setReportId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState<FormData>({
    category: null,
    description: '',
    photos: [],
    address: '',
    district: 'Villa El Salvador',
    reference: '',
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateForm = useCallback((partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const canAdvance = useCallback((): boolean => {
    switch (currentStep) {
      case 0:
        return form.category !== null;
      case 1:
        return form.description.trim().length >= 10;
      case 2:
        return true;
      case 3:
        return form.address.trim().length >= 3;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, form]);

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!form.category) newErrors.category = 'Selecciona una categoría';
        break;
      case 1:
        if (form.description.trim().length < 10)
          newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        break;
      case 3:
        if (form.address.trim().length < 3)
          newErrors.address = 'Ingresa una dirección válida';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, form]);

  const goNext = useCallback(() => {
    if (!validateStep()) {
      toast.error('Completa los campos requeridos para continuar');
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection('back');
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step < currentStep) {
        setDirection('back');
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter(
        (f) => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/heic'
      );

      if (form.photos.length + fileArray.length > MAX_PHOTOS) {
        toast.error(`Máximo ${MAX_PHOTOS} imágenes permitidas`);
        return;
      }

      const newPhotos: PhotoData[] = [];

      fileArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} supera los 5MB`);
          return;
        }
        const preview = URL.createObjectURL(file);
        newPhotos.push({
          file,
          preview,
          progress: 0,
          name: file.name,
          size: formatFileSize(file.size),
        });
      });

      if (newPhotos.length > 0) {
        updateForm({ photos: [...form.photos, ...newPhotos] });

        newPhotos.forEach((photo, idx) => {
          const actualIdx = form.photos.length + idx;
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 25 + 10;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
            }
            setForm((prev) => {
              const updated = [...prev.photos];
              if (updated[actualIdx]) {
                updated[actualIdx] = { ...updated[actualIdx], progress };
              }
              return { ...prev, photos: updated };
            });
          }, 200);
        });
      }
    },
    [form.photos, updateForm]
  );

  const removePhoto = useCallback(
    (index: number) => {
      const updated = [...form.photos];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      updateForm({ photos: updated });
    },
    [form.photos, updateForm]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles]
  );

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('La geolocalización no está disponible');
      return;
    }
    toast.info('Obteniendo ubicación...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateForm({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success('Ubicación obtenida correctamente');
      },
      () => {
        toast.error('No se pudo obtener la ubicación. Ingresa la dirección manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [updateForm]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const id = generateReportId();
    setReportId(id);

    const report = {
      id,
      category: form.category?.name || '',
      description: form.description,
      photoCount: form.photos.length,
      address: form.address,
      district: form.district,
      reference: form.reference,
      latitude: form.latitude,
      longitude: form.longitude,
      date: new Date().toISOString(),
      status: 'Pendiente',
    };

    const existing = JSON.parse(localStorage.getItem('ecoalert_reports') || '[]');
    existing.unshift(report);
    localStorage.setItem('ecoalert_reports', JSON.stringify(existing));

    setIsSubmitting(false);
    setShowSuccess(true);
    setCurrentStep(5);
    toast.success('¡Reporte enviado exitosamente!');
  }, [form, validateStep]);

  const resetWizard = useCallback(() => {
    form.photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setForm({
      category: null,
      description: '',
      photos: [],
      address: '',
      district: 'Villa El Salvador',
      reference: '',
      latitude: null,
      longitude: null,
    });
    setErrors({});
    setCurrentStep(0);
    setShowSuccess(false);
    setReportId('');
    setIsSubmitting(false);
  }, [form]);

  useEffect(() => {
    return () => {
      form.photos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isCurrent = currentStep === idx;
          const isAccessible = idx < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => isAccessible && goToStep(idx)}
                disabled={!isAccessible}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isAccessible ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${
                    isCompleted
                      ? 'bg-[#4ADE80] border-[#4ADE80] text-[#0B0F14]'
                      : isCurrent
                        ? 'bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] scale-110 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                        : 'bg-transparent border-[#9CA3AF]/40 text-[#9CA3AF]'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium transition-all hidden sm:block ${
                    isCurrent
                      ? 'text-[#4ADE80]'
                      : isCompleted
                        ? 'text-[#4ADE80]/80'
                        : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`text-[10px] font-medium transition-all sm:hidden ${
                    isCurrent
                      ? 'text-[#4ADE80]'
                      : isCompleted
                        ? 'text-[#4ADE80]/80'
                        : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 mb-6">
                  <div
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]/30'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Progress
        value={((currentStep + 1) / STEPS.length) * 100}
        className="h-1.5 bg-[#9CA3AF]/20"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#9CA3AF]">
          Paso {currentStep + 1} de {STEPS.length}
        </span>
        <span className="text-[10px] text-[#9CA3AF]">
          {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
        </span>
      </div>
    </div>
  );

  const renderStepCategory = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-1">
          Selecciona la categoría
        </h2>
        <p className="text-sm text-[#9CA3AF]">
          Elige el tipo de problema ambiental que mejor describe tu reporte
        </p>
      </div>

      {errors.category && (
        <div className="flex items-center gap-2 text-sm text-[#EF4444] bg-[#EF4444]/10 px-3 py-2 rounded-lg border border-[#EF4444]/20">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {errors.category}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = form.category?.id === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                updateForm({ category: cat });
                clearError('category');
              }}
              className={`eco-card p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? `${cat.borderColor} ${cat.bgColor} shadow-lg scale-[1.02]`
                  : 'border-[#1a1f2e] hover:border-[#9CA3AF]/40'
              }`}
            >
              <div className="flex flex-col items-start gap-2">
                <div
                  className={`text-3xl sm:text-4xl transition-transform duration-300 ${
                    isSelected ? 'scale-110' : ''
                  }`}
                >
                  {cat.emoji}
                </div>
                <div>
                  <h3
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: isSelected ? cat.color : '#E5E7EB' }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-snug">
                    {cat.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                      style={{ backgroundColor: cat.color + '20', color: cat.color }}
                    >
                      Seleccionado
                    </Badge>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStepDescription = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-1">
          Describe el problema
        </h2>
        <p className="text-sm text-[#9CA3AF]">
          Cuanta más información proporciones, mejor podremos analizar tu reporte
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#E5E7EB]">
            Descripción del problema <span className="text-[#EF4444]">*</span>
          </label>
          <span
            className={`text-xs font-mono ${
              form.description.length > MAX_DESCRIPTION * 0.9
                ? 'text-[#EF4444]'
                : form.description.length > MAX_DESCRIPTION * 0.7
                  ? 'text-[#FBBF24]'
                  : 'text-[#9CA3AF]'
            }`}
          >
            {form.description.length} / {MAX_DESCRIPTION}
          </span>
        </div>

        <textarea
          value={form.description}
          onChange={(e) => {
            if (e.target.value.length <= MAX_DESCRIPTION) {
              updateForm({ description: e.target.value });
              clearError('description');
            }
          }}
          placeholder="Describe detalladamente el problema ambiental que observa. Incluye el tamaño aproximado del área afectada, materiales visibles, duración del problema y cualquier detalle relevante..."
          className="w-full min-h-[180px] bg-[#1a1f2e] border border-[#9CA3AF]/30 rounded-lg p-4 text-[#E5E7EB] placeholder-[#9CA3AF]/60 focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]/50 outline-none transition-all resize-none text-sm sm:text-base"
          maxLength={MAX_DESCRIPTION}
        />

        <Progress
          value={(form.description.length / MAX_DESCRIPTION) * 100}
          className="h-1"
        />

        {errors.description && (
          <div className="flex items-center gap-2 text-sm text-[#EF4444] bg-[#EF4444]/10 px-3 py-2 rounded-lg border border-[#EF4444]/20">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {errors.description}
          </div>
        )}
      </div>

      <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#00D4FF]" />
          <h4 className="text-sm font-medium text-[#00D4FF]">Consejos para una buena descripción</h4>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-[#4ADE80]">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Sé específico con la ubicación
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4ADE80]">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Menciona el tiempo que lleva el problema
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4ADE80]">
            <Check className="w-3.5 h-3.5 shrink-0" />
            Describe materiales visibles
          </div>
          <div className="flex items-center gap-2 text-sm text-[#EF4444]">
            <X className="w-3.5 h-3.5 shrink-0" />
            Evita datos personales
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepPhotos = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-1">
          Adjunta fotografías
        </h2>
        <p className="text-sm text-[#9CA3AF]">
          Las fotos ayudan al análisis de IA y a verificar el reporte
        </p>
      </div>

      {form.photos.length < MAX_PHOTOS && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? 'border-[#4ADE80] bg-[#4ADE80]/10 scale-[1.01]'
              : 'border-[#4ADE80]/40 hover:border-[#4ADE80] hover:bg-[#4ADE80]/5'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#4ADE80]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#4ADE80]" />
            </div>
            <div>
              <p className="font-semibold text-[#E5E7EB]">
                Arrastra imágenes aquí
              </p>
              <p className="text-sm text-[#9CA3AF] mt-1">
                o haz clic para seleccionar
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="border-[#4ADE80]/40 text-[#4ADE80] hover:bg-[#4ADE80]/10"
              >
                <ImageIcon className="w-4 h-4" />
                Seleccionar imágenes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10"
              >
                <Camera className="w-4 h-4" />
                O tomar foto
              </Button>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              JPG, PNG, HEIC — Máximo 5MB cada una • {form.photos.length}/{MAX_PHOTOS} imágenes
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {form.photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#E5E7EB]">
            Imágenes adjuntas ({form.photos.length}/{MAX_PHOTOS})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {form.photos.map((photo, idx) => (
              <div
                key={idx}
                className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-video bg-[#0B0F14]">
                  <img
                    src={photo.preview}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <div className="w-7 h-7 rounded-full bg-[#4ADE80] text-[#0B0F14] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#EF4444]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#EF4444]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#E5E7EB] truncate">{photo.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{photo.size}</p>
                  {photo.progress < 100 && (
                    <div className="mt-2">
                      <Progress value={photo.progress} className="h-1" />
                      <p className="text-[10px] text-[#9CA3AF] mt-1">
                        Subiendo... {Math.round(photo.progress)}%
                      </p>
                    </div>
                  )}
                  {photo.progress >= 100 && (
                    <div className="flex items-center gap-1 mt-2">
                      <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                      <p className="text-[10px] text-[#4ADE80]">Listo</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {form.photos.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-[#9CA3AF] italic">
            💡 Las fotos ayudan al análisis de IA
          </p>
        </div>
      )}
    </div>
  );

  const renderStepLocation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-1">
          Ubicación del reporte
        </h2>
        <p className="text-sm text-[#9CA3AF]">
          Indica dónde se encuentra el problema ambiental
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#E5E7EB] mb-1.5 block">
            Dirección <span className="text-[#EF4444]">*</span>
          </label>
          <Input
            value={form.address}
            onChange={(e) => {
              updateForm({ address: e.target.value });
              clearError('address');
            }}
            placeholder="Ej: Av. Los Héroes MZ-1 LT-5"
            className="bg-[#1a1f2e] border-[#9CA3AF]/30 text-[#E5E7EB] placeholder-[#9CA3AF]/60 focus-visible:border-[#4ADE80] focus-visible:ring-[#4ADE80]/50"
          />
          {errors.address && (
            <p className="text-xs text-[#EF4444] mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[#E5E7EB] mb-1.5 block">
            Distrito
          </label>
          <select
            value={form.district}
            onChange={(e) => updateForm({ district: e.target.value })}
            className="w-full h-9 bg-[#1a1f2e] border border-[#9CA3AF]/30 rounded-md px-3 text-sm text-[#E5E7EB] outline-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]/50 transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#E5E7EB] mb-1.5 block">
            Referencia <span className="text-[#9CA3AF]">(opcional)</span>
          </label>
          <Input
            value={form.reference}
            onChange={(e) => updateForm({ reference: e.target.value })}
            placeholder="Ej: frente al parque, al lado del mercado..."
            className="bg-[#1a1f2e] border-[#9CA3AF]/30 text-[#E5E7EB] placeholder-[#9CA3AF]/60 focus-visible:border-[#4ADE80] focus-visible:ring-[#4ADE80]/50"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={getLocation}
          className="w-full border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10"
        >
          <Locate className="w-4 h-4" />
          Obtener mi ubicación
        </Button>
      </div>

      <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl overflow-hidden">
        <MapPicker
          value={
            form.latitude !== null && form.longitude !== null
              ? { lat: form.latitude, lng: form.longitude }
              : null
          }
          onChange={(coords) => updateForm({ latitude: coords.lat, longitude: coords.lng })}
          height="h-56 sm:h-64"
          placeholderText="Toca el mapa para marcar la ubicación exacta"
        />

        {form.latitude !== null && form.longitude !== null && (
          <div className="px-4 py-3 border-t border-[#9CA3AF]/20">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="text-xs text-[#9CA3AF]">
                Coordenadas:{' '}
                <span className="text-[#E5E7EB] font-mono">
                  {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepReview = () => {
    const cat = form.category;
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-1">
            Revisa tu reporte
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Verifica que toda la información sea correcta antes de enviar
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#FBBF24] bg-[#FBBF24]/10 px-3 py-2 rounded-lg border border-[#FBBF24]/20">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Verifica que toda la información sea correcta antes de enviar
        </div>

        <div className="space-y-4">
          <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#9CA3AF]">Categoría</h4>
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
              >
                Editar
              </button>
            </div>
            {cat && (
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <p className="font-semibold" style={{ color: cat.color }}>
                    {cat.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{cat.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#9CA3AF]">Descripción</h4>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
              >
                Editar
              </button>
            </div>
            <p className="text-sm text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">
              {form.description}
            </p>
          </div>

          <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#9CA3AF]">Fotografías</h4>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
              >
                Editar
              </button>
            </div>
            {form.photos.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {form.photos.map((photo, idx) => (
                  <div key={idx} className="relative shrink-0">
                    <img
                      src={photo.preview}
                      alt={`Foto ${idx + 1}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#4ADE80] text-[#0B0F14] flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] italic">Sin fotografías</p>
            )}
          </div>

          <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#9CA3AF]">Ubicación</h4>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="text-xs text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors"
              >
                Editar
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#4ADE80] mt-0.5 shrink-0" />
                <p className="text-sm text-[#E5E7EB]">{form.address}</p>
              </div>
              <p className="text-xs text-[#9CA3AF] ml-5.5">{form.district}</p>
              {form.reference && (
                <p className="text-xs text-[#9CA3AF] ml-5.5">
                  Ref: {form.reference}
                </p>
              )}
              {form.latitude && form.longitude && (
                <p className="text-xs text-[#9CA3AF] ml-5.5 font-mono">
                  GPS: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#9CA3AF]">Detalles</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Fecha</span>
                <span className="text-sm text-[#E5E7EB]">{dateStr}</span>
              </div>
              <Separator className="bg-[#9CA3AF]/20" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Hora</span>
                <span className="text-sm text-[#E5E7EB]">{timeStr}</span>
              </div>
              <Separator className="bg-[#9CA3AF]/20" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Prioridad</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    cat?.priority === 'Alta'
                      ? 'bg-[#EF4444]/15 text-[#EF4444]'
                      : cat?.priority === 'Media'
                        ? 'bg-[#FBBF24]/15 text-[#FBBF24]'
                        : 'bg-[#9CA3AF]/15 text-[#9CA3AF]'
                  }`}
                >
                  {cat?.priority || 'Media'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="w-20 h-20 rounded-full bg-[#4ADE80]/20 flex items-center justify-center mx-auto mb-5 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-[#4ADE80]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4ADE80] mb-2">
          ¡Reporte enviado correctamente!
        </h2>
        <p className="text-[#9CA3AF]">
          Tu reporte ha sido registrado en el sistema
        </p>
      </div>

      <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9CA3AF]">Número de reporte</span>
          <span className="font-mono font-bold text-[#4ADE80] text-lg">{reportId}</span>
        </div>
        <Separator className="bg-[#9CA3AF]/20" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9CA3AF]">Categoría</span>
          <div className="flex items-center gap-2">
            <span>{form.category?.emoji}</span>
            <span className="text-sm text-[#E5E7EB]">{form.category?.name}</span>
          </div>
        </div>
        <Separator className="bg-[#9CA3AF]/20" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9CA3AF]">Fecha</span>
          <span className="text-sm text-[#E5E7EB]">
            {new Date().toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <Separator className="bg-[#9CA3AF]/20" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#9CA3AF]">Estado</span>
          <Badge variant="secondary" className="bg-[#FBBF24]/15 text-[#FBBF24]">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-[#1a1f2e] rounded-xl p-5">
        <h4 className="text-sm font-medium text-[#00D4FF] mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          ¿Qué sigue?
        </h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#00D4FF]/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#00D4FF]">1</span>
            </div>
            <p className="text-sm text-[#E5E7EB]">
              Tu reporte será analizado por nuestro sistema de IA
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#00D4FF]/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#00D4FF]">2</span>
            </div>
            <p className="text-sm text-[#E5E7EB]">
              Será revisado por el equipo de EcoAlert
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#00D4FF]/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#00D4FF]">3</span>
            </div>
            <p className="text-sm text-[#E5E7EB]">
              Recibirás notificaciones sobre el estado
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex-1 bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0B0F14] font-semibold"
        >
          <Home className="w-4 h-4" />
          Volver al Dashboard
        </Button>
        <Button
          type="button"
          onClick={resetWizard}
          variant="secondary"
          className="flex-1 bg-[#1a1f2e] hover:bg-[#1a1f2e]/80 text-[#E5E7EB] border border-[#9CA3AF]/30"
        >
          <RotateCcw className="w-4 h-4" />
          Crear otro reporte
        </Button>
        <Button
          type="button"
          onClick={() => navigate('/reports')}
          variant="outline"
          className="flex-1 border-[#9CA3AF]/30 text-[#E5E7EB] hover:bg-[#1a1f2e]"
        >
          <FolderOpen className="w-4 h-4" />
          Ver mis reportes
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStepCategory();
      case 1:
        return renderStepDescription();
      case 2:
        return renderStepPhotos();
      case 3:
        return renderStepLocation();
      case 4:
        return renderStepReview();
      case 5:
        return renderStepConfirmation();
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    if (currentStep === 5) return null;

    return (
      <div className="flex items-center justify-between gap-4 pt-6">
        <div>
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="border-[#9CA3AF]/30 text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1a1f2e]"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </Button>
          )}
        </div>
        <div>
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canAdvance()}
              className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0B0F14] font-semibold px-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0B0F14] font-semibold px-8 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B0F14]/30 border-t-[#0B0F14] rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6" style={{ backgroundColor: '#0B0F14' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">
            Crear Reporte
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Reporta problemas ambientales en tu comunidad
          </p>
        </div>

        {renderProgressBar()}

        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        {renderNavigation()}
      </div>
    </div>
  );
}
