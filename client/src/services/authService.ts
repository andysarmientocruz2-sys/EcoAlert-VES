/**
 * Authentication Service
 * Conectado con Firebase Authentication
 * Maneja registro, login, logout y persistencia de sesión
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/firebase/config';
import { userService } from './userService';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  ecoPoints: number;
  level: number;
  achievements: string[];
  reportsCount: number;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  error?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authStateCallbacks: ((user: User | null) => void)[] = [];

  constructor() {
    this.setupAuthListener();
    // Cargar usuario de demo mode si existe
    this.loadDemoUser();
  }

  /**
   * Cargar usuario del demo mode desde localStorage
   */
  private loadDemoUser(): void {
    try {
      const demoUserStr = localStorage.getItem('ecoalert_demo_user');
      if (demoUserStr) {
        const demoUser = JSON.parse(demoUserStr);
        this.currentUser = demoUser;
        this.notifyAuthStateChange();
      }
    } catch (error) {
      console.error('Error loading demo user:', error);
    }
  }

  /**
   * Configurar listener para cambios de autenticación
   * Detecta automáticamente cuando un usuario inicia/cierra sesión
   */
  private setupAuthListener(): void {
    if (!auth) {
      console.warn('Firebase Auth not initialized - running in demo mode');
      return;
    }
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado
        try {
          const userData = await userService.getUserData(firebaseUser.uid);
          if (userData) {
            this.currentUser = userData;
          } else {
            // Si no existe documento en Firestore, crear uno
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Usuario',
              photoURL: firebaseUser.photoURL || undefined,
              ecoPoints: 0,
              level: 1,
              achievements: [],
              reportsCount: 0,
              createdAt: new Date(),
            };
            await userService.createUserData(newUser);
            this.currentUser = newUser;
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          this.currentUser = null;
        }
      } else {
        // Usuario no autenticado
        this.currentUser = null;
      }

      // Notificar a todos los listeners
      this.notifyAuthStateChange();
    });
  }

  /**
   * Registrar nuevo usuario con Firebase Authentication
   * En modo demo, crea un usuario local sin Firebase
   */
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> {
    try {
      // Validaciones básicas
      if (!email || !password || !displayName) {
        return {
          success: false,
          message: 'Por favor completa todos los campos',
          error: 'MISSING_FIELDS',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres',
          error: 'WEAK_PASSWORD',
        };
      }

      // Si Firebase no está configurado, usar modo demo
      if (!auth) {
        console.log('Registrando en modo demo...');
        
        // Generar un UID simulado
        const demoUID = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newUser: User = {
          uid: demoUID,
          email: email,
          displayName: displayName,
          photoURL: undefined,
          ecoPoints: 0,
          level: 1,
          achievements: [],
          reportsCount: 0,
          createdAt: new Date(),
        };

        // Guardar en localStorage para persistencia en demo mode
        try {
          localStorage.setItem('ecoalert_demo_user', JSON.stringify(newUser));
          localStorage.setItem('ecoalert_demo_auth', JSON.stringify({ email, password }));
          console.log('Usuario guardado en localStorage:', newUser);
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          return {
            success: false,
            message: 'Error al guardar los datos',
            error: 'STORAGE_ERROR',
          };
        }

        this.currentUser = newUser;
        this.notifyAuthStateChange();

        return {
          success: true,
          message: 'Registro exitoso (Modo Demo)',
          user: newUser,
        };
      }

      // Crear usuario en Firebase Authentication
      console.log('Registrando en Firebase...');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Crear documento del usuario en Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: displayName,
        photoURL: undefined,
        ecoPoints: 0,
        level: 1,
        achievements: [],
        reportsCount: 0,
        createdAt: new Date(),
      };

      await userService.createUserData(newUser);

      this.currentUser = newUser;
      this.notifyAuthStateChange();

      return {
        success: true,
        message: 'Registro exitoso',
        user: newUser,
      };
    } catch (error: unknown) {
      console.error('Register error:', error);
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        message: errorMessage,
        error: (error as { code?: string }).code || 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Iniciar sesión con Firebase Authentication
   * En modo demo, valida contra localStorage
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validaciones básicas
      if (!email || !password) {
        return {
          success: false,
          message: 'Por favor completa todos los campos',
          error: 'MISSING_FIELDS',
        };
      }

      // Si Firebase no está configurado, usar modo demo
      if (!auth) {
        console.log('Iniciando sesión en modo demo...');
        
        // Buscar usuario en localStorage
        const demoAuthStr = localStorage.getItem('ecoalert_demo_auth');
        const demoUserStr = localStorage.getItem('ecoalert_demo_user');
        
        if (!demoAuthStr || !demoUserStr) {
          return {
            success: false,
            message: 'Usuario no encontrado. Por favor regístrate primero',
            error: 'USER_NOT_FOUND',
          };
        }

        try {
          const demoAuth = JSON.parse(demoAuthStr);
          const demoUser = JSON.parse(demoUserStr);

          // Validar credenciales
          if (demoAuth.email !== email || demoAuth.password !== password) {
            return {
              success: false,
              message: 'Email o contraseña incorrectos',
              error: 'INVALID_CREDENTIALS',
            };
          }

          this.currentUser = demoUser;
          this.notifyAuthStateChange();

          return {
            success: true,
            message: 'Sesión iniciada (Modo Demo)',
            user: demoUser,
          };
        } catch (parseError) {
          console.error('Error parsing demo auth:', parseError);
          return {
            success: false,
            message: 'Error al procesar credenciales',
            error: 'PARSE_ERROR',
          };
        }
      }

      // Iniciar sesión en Firebase
      console.log('Iniciando sesión en Firebase...');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Obtener datos del usuario desde Firestore
      const userData = await userService.getUserData(firebaseUser.uid);

      if (!userData) {
        // Si no existe, crear documento
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Usuario',
          photoURL: firebaseUser.photoURL || undefined,
          ecoPoints: 0,
          level: 1,
          achievements: [],
          reportsCount: 0,
          createdAt: new Date(),
        };
        await userService.createUserData(newUser);
        this.currentUser = newUser;
      } else {
        this.currentUser = userData;
      }

      this.notifyAuthStateChange();

      return {
        success: true,
        message: 'Sesión iniciada',
        user: this.currentUser || undefined,
      };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        message: errorMessage,
        error: (error as { code?: string }).code || 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Iniciar sesión con Google (Firebase Authentication)
   * Requiere Google habilitado en Firebase Console y .env.local configurado
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      if (!auth) {
        return {
          success: false,
          message: 'Firebase no está configurado. Crea el archivo .env.local',
          error: 'NO_AUTH',
        };
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Obtener datos del usuario desde Firestore, o crear si no existe
      const userData = await userService.getUserData(firebaseUser.uid);

      if (!userData) {
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Usuario',
          photoURL: firebaseUser.photoURL || undefined,
          ecoPoints: 0,
          level: 1,
          achievements: [],
          reportsCount: 0,
          createdAt: new Date(),
        };
        await userService.createUserData(newUser);
        this.currentUser = newUser;
      } else {
        this.currentUser = userData;
      }

      this.notifyAuthStateChange();

      return {
        success: true,
        message: 'Sesión iniciada con Google',
        user: this.currentUser || undefined,
      };
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Ventana de Google cerrada', error: 'POPUP_CLOSED' };
      }
      if (code === 'auth/unauthorized-domain') {
        return {
          success: false,
          message: 'Dominio no autorizado. Agrega localhost:3000 en Firebase Console → Authentication → Settings → Authorized domains',
          error: 'UNAUTHORIZED_DOMAIN',
        };
      }
      return {
        success: false,
        message: this.getErrorMessage(error),
        error: code || 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<AuthResponse> {
    try {
      // Limpiar usuario del demo mode
      localStorage.removeItem('ecoalert_demo_user');
      localStorage.removeItem('ecoalert_demo_auth');
      
      this.currentUser = null;
      this.notifyAuthStateChange();

      if (!auth) {
        return { success: true, message: 'Sesión cerrada' };
      }
      
      await signOut(auth);

      return {
        success: true,
        message: 'Sesión cerrada',
      };
    } catch (error: unknown) {
      console.error('Logout error:', error);
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        message: errorMessage,
        error: (error as { code?: string }).code || 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Enviar correo para recuperar contraseña
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Por favor ingresa tu correo electrónico',
          error: 'MISSING_EMAIL',
        };
      }

      if (!auth) {
        return { 
          success: false, 
          message: 'Recuperación de contraseña no disponible en modo demo', 
          error: 'NO_AUTH' 
        };
      }

      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: 'Correo de recuperación enviado',
      };
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        message: errorMessage,
        error: (error as { code?: string }).code || 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Verificar si usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Obtener ID del usuario actual
   */
  getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  /**
   * Suscribirse a cambios de autenticación
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);

    // Llamar inmediatamente con el estado actual
    callback(this.currentUser);

    // Retornar función para desuscribirse
    return () => {
      this.authStateCallbacks = this.authStateCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Notificar a todos los listeners sobre cambios de autenticación
   */
  private notifyAuthStateChange(): void {
    this.authStateCallbacks.forEach((callback) => {
      callback(this.currentUser);
    });
  }

  /**
   * Convertir código de error de Firebase a mensaje amigable
   */
  private getErrorMessage(error: unknown): string {
    const code = (error as { code?: string }).code;

    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests':
        'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed':
        'Error de conexión. Verifica tu internet',
    };

    // Si hay un código conocido, retornar su mensaje
    if (code && errorMessages[code]) {
      return errorMessages[code];
    }

    // Si el error tiene un mensaje, usarlo
    if ((error as { message?: string }).message) {
      return (error as { message?: string }).message || 'Error de autenticación';
    }

    // Mensaje por defecto
    return 'Error de autenticación';
  }
}

// Exportar instancia única
export const authService = new AuthService();

export default authService;
