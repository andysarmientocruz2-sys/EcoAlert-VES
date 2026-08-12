/**
 * Search Service
 * Sistema de búsqueda global
 */

export interface SearchResult {
  id: string;
  type: 'report' | 'news' | 'article' | 'mission' | 'location';
  title: string;
  description: string;
  category?: string;
  url: string;
  icon: string;
  relevance: number;
}

// Mock data for search
const MOCK_DATA = {
  reports: [
    { id: '1', title: 'Contaminación en Parque Central', description: 'Basura acumulada', category: 'Basura' },
    { id: '2', title: 'Quema de Residuos', description: 'Humo tóxico', category: 'Quema' },
    { id: '3', title: 'Agua Contaminada', description: 'Río con residuos', category: 'Agua' },
  ],
  news: [
    { id: '1', title: 'Villa El Salvador Alcanza 5,000 Árboles', description: 'Hito importante en reforestación' },
    { id: '2', title: 'Mejora en Calidad del Aire', description: 'Estudio revela reducción de contaminantes' },
    { id: '3', title: 'Campaña de Limpieza Comunitaria', description: 'Únete a nosotros este fin de semana' },
  ],
  articles: [
    { id: '1', title: 'Guía de Reciclaje', description: 'Aprende a reciclar correctamente' },
    { id: '2', title: 'Energías Renovables', description: 'Fuentes de energía limpia' },
    { id: '3', title: 'Cambio Climático', description: 'Lo que necesitas saber' },
  ],
  missions: [
    { id: '1', title: 'Reportar Problema', description: 'Envía tu primer reporte' },
    { id: '2', title: 'Leer Artículo', description: 'Lee un artículo educativo' },
    { id: '3', title: 'Completar Guía', description: 'Completa una guía ambiental' },
  ],
  locations: [
    { id: '1', title: 'Parque Central', description: 'Ubicación: Centro de VES' },
    { id: '2', title: 'Playa Blanca', description: 'Ubicación: Zona Costera' },
    { id: '3', title: 'Bosque Urbano', description: 'Ubicación: Zona Verde' },
  ],
};

class SearchService {
  /**
   * Realizar búsqueda global
   */
  search(query: string, limit: number = 10): SearchResult[] {
    if (!query || query.length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Buscar en reportes
    MOCK_DATA.reports.forEach((report) => {
      if (
        report.title.toLowerCase().includes(lowerQuery) ||
        report.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: report.id,
          type: 'report',
          title: report.title,
          description: report.description,
          category: report.category,
          url: '/reports',
          icon: '📍',
          relevance: this.calculateRelevance(report.title, lowerQuery),
        });
      }
    });

    // Buscar en noticias
    MOCK_DATA.news.forEach((news) => {
      if (
        news.title.toLowerCase().includes(lowerQuery) ||
        news.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: news.id,
          type: 'news',
          title: news.title,
          description: news.description,
          url: '/news',
          icon: '📰',
          relevance: this.calculateRelevance(news.title, lowerQuery),
        });
      }
    });

    // Buscar en artículos
    MOCK_DATA.articles.forEach((article) => {
      if (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: article.id,
          type: 'article',
          title: article.title,
          description: article.description,
          url: '/education',
          icon: '📚',
          relevance: this.calculateRelevance(article.title, lowerQuery),
        });
      }
    });

    // Buscar en misiones
    MOCK_DATA.missions.forEach((mission) => {
      if (
        mission.title.toLowerCase().includes(lowerQuery) ||
        mission.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: mission.id,
          type: 'mission',
          title: mission.title,
          description: mission.description,
          url: '/dashboard',
          icon: '🎯',
          relevance: this.calculateRelevance(mission.title, lowerQuery),
        });
      }
    });

    // Buscar en ubicaciones
    MOCK_DATA.locations.forEach((location) => {
      if (
        location.title.toLowerCase().includes(lowerQuery) ||
        location.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: location.id,
          type: 'location',
          title: location.title,
          description: location.description,
          url: '/mapa',
          icon: '🗺️',
          relevance: this.calculateRelevance(location.title, lowerQuery),
        });
      }
    });

    // Ordenar por relevancia y limitar
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  }

  /**
   * Obtener sugerencias de búsqueda
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    // Recolectar sugerencias de todos los tipos de datos
    [MOCK_DATA.reports, MOCK_DATA.news, MOCK_DATA.articles, MOCK_DATA.missions, MOCK_DATA.locations].forEach(
      (data) => {
        data.forEach((item: any) => {
          if (item.title.toLowerCase().includes(lowerQuery)) {
            suggestions.add(item.title);
          }
        });
      }
    );

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Obtener resultados por categoría
   */
  searchByType(query: string, type: 'report' | 'news' | 'article' | 'mission' | 'location'): SearchResult[] {
    return this.search(query).filter((result) => result.type === type);
  }

  /**
   * Obtener tendencias de búsqueda
   */
  getTrends(): string[] {
    return [
      'Contaminación',
      'Reciclaje',
      'Energías renovables',
      'Cambio climático',
      'Reforestación',
      'Agua limpia',
      'Aire puro',
      'Biodiversidad',
    ];
  }

  // ===== PRIVATE METHODS =====

  private calculateRelevance(title: string, query: string): number {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.startsWith(query)) return 100;
    if (lowerTitle.includes(query)) return 50;
    return 10;
  }
}

export const searchService = new SearchService();
