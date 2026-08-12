/**
 * Storage Service
 * Servicio desacoplado para gestionar almacenamiento local
 * Preparado para conectar con Firebase Storage
 */

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  userId: string;
}

const STORAGE_KEY = 'ecoalert_files';

class StorageService {
  /**
   * Guardar archivo (simulado)
   */
  async saveFile(file: File, userId: string): Promise<StorageFile> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const storageFile: StorageFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: event.target?.result as string,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          userId,
        };

        // Guardar en localStorage
        const files = this.getFiles(userId);
        files.push(storageFile);
        localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(files));

        resolve(storageFile);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Obtener archivos del usuario
   */
  getFiles(userId: string): StorageFile[] {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtener archivo por ID
   */
  getFile(userId: string, fileId: string): StorageFile | null {
    const files = this.getFiles(userId);
    return files.find((f) => f.id === fileId) || null;
  }

  /**
   * Eliminar archivo
   */
  deleteFile(userId: string, fileId: string): boolean {
    const files = this.getFiles(userId);
    const index = files.findIndex((f) => f.id === fileId);

    if (index !== -1) {
      files.splice(index, 1);
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(files));
      return true;
    }

    return false;
  }

  /**
   * Limpiar archivos del usuario
   */
  clearFiles(userId: string): void {
    localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
  }
}

export const storageService = new StorageService();
