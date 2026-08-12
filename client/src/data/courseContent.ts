export interface LessonSection {
  heading: string;
  text: string;
}

export interface LessonContent {
  minutes: number;
  intro: string;
  sections: LessonSection[];
  tip: string;
  activity: string;
}

export const COURSE_LESSON_CONTENT: Record<string, Record<string, LessonContent>> = {
  // ─── c1: Fundamentos del Reciclaje ─────────────────────────────
  c1: {
    '¿Qué es reciclar?': {
      minutes: 8,
      intro: 'Reciclar es convertir materiales que ya cumplieron su función en nuevas materias primas. No es lo mismo que reutilizar ni que reducir: son tres acciones distintas que se complementan.',
      sections: [
        { heading: 'El ciclo del reciclaje', text: 'El reciclaje comienza cuando separas tus residuos en casa, sigue cuando el camión recolector los lleva a un centro de clasificación, y termina cuando una fábrica transforma el material en un producto nuevo. Sin tu separación inicial, todo el ciclo se detiene.' },
        { heading: 'Por qué importa', text: 'Reciclar reduce la extracción de materias primas, ahorra energía y agua, y disminuye la cantidad de residuos que terminan en rellenos sanitarios o en el océano. Un kilo de papel reciclado evita la tala de 20 árboles.' },
      ],
      tip: 'En Latinoamérica solo se recicla alrededor del 4% de los residuos generados. Cada vez que separas tu basura, aumentas ese porcentaje.',
      activity: 'Cuenta cuántos envases de plástico usas en una semana y piensa en cuántos podrías haber evitado o reciclado.',
    },
    'Historia del reciclaje': {
      minutes: 7,
      intro: 'El reciclaje no es un invento moderno: la humanidad ha reutilizado materiales durante siglos por necesidad.',
      sections: [
        { heading: 'De la necesidad a la industria', text: 'En la antigüedad, los metales se fundían y reutilizaban constantemente. Durante la Segunda Guerra Mundial, reciclar era una obligación patriótica en muchos países. El reciclaje industrial moderno nació en la década de 1970, con la crisis del petróleo y la primera conciencia ecológica masiva.' },
        { heading: 'La era moderna', text: 'Hoy, el reciclaje es una industria global valorada en cientos de miles de millones de dólares, y muchas ciudades han adoptado metas de "cero residuos" para 2030.' },
      ],
      tip: 'El símbolo del reciclaje (los tres flechas) fue diseñado en 1970 por Gary Anderson para un concurso de estudiantes.',
      activity: 'Investiga qué se hacía con los residuos en tu ciudad hace 30 años y compáralo con ahora.',
    },
    'Beneficios ambientales': {
      minutes: 8,
      intro: 'Reciclar tiene beneficios medibles para el planeta, tu ciudad y tu bolsillo.',
      sections: [
        { heading: 'Ahorro de recursos', text: 'Reciclar una tonelada de aluminio ahorra 14.000 kWh de electricidad, suficiente para abastecer una casa durante más de un año. Reciclar vidrio reduce las emisiones de CO₂ un 20% frente a fabricarlo desde cero.' },
        { heading: 'Menos contaminación', text: 'Menos residuos en vertederos significa menos metano (un gas de efecto invernadero 25 veces más potente que el CO₂) y menos lixiviados que contaminan el suelo y el agua.' },
      ],
      tip: 'La energía que se ahorra reciclando una lata de aluminio mantendría encendida una TV durante 3 horas.',
      activity: 'Busca en tu casa 5 objetos con el símbolo de reciclaje y verifica si van al contenedor correcto.',
    },
    'Material orgánico': {
      minutes: 9,
      intro: 'Los residuos orgánicos (restos de comida, cáscaras, hojas) representan casi la mitad de la basura doméstica y son los más fáciles de aprovechar.',
      sections: [
        { heading: 'Qué es orgánico', text: 'Todo lo que se descompone naturalmente: cáscaras de frutas y verduras, restos de comida, servilletas usadas, bolsas de té, posos de café y hojas secas. NO son orgánicos los plásticos, vidrios ni metales.' },
        { heading: 'Su destino correcto', text: 'Los orgánicos deben ir a compostaje o biodigestores. Al descomponerse sin oxígeno en un relleno sanitario, generan metano; al compostarse, se convierten en abono que devuelve nutrientes al suelo.' },
      ],
      tip: 'En muchos países, los orgánicos son el 40-50% de la basura. Compostarlos reduce a la mitad lo que envías al relleno.',
      activity: 'Haz un inventario: durante un día, anota cada residuo orgánico que generas en tu casa.',
    },
    'Plásticos y metales': {
      minutes: 10,
      intro: 'Plásticos y metales son los materiales con mayor valor económico de reciclaje, pero también los que más problemas causan si no se gestionan bien.',
      sections: [
        { heading: 'Plásticos', text: 'El PET (botellas de agua y gaseosas) es el plástico más reciclado. El HDPE (envases de detergente y shampoo) también tiene alta demanda. Los plásticos mezclados y contaminados con comida, como bolsas sucias, son mucho más difíciles de reciclar.' },
        { heading: 'Metales', text: 'Aluminio (latas) y acero (conservas) son 100% reciclables sin perder calidad. El aluminio puede reciclarse infinitas veces, y hacerlo ahorra el 95% de la energía necesaria para producirlo desde bauxita.' },
      ],
      tip: 'Lava y seca los envases antes de reciclarlos: la comida residual contamina lotes enteros y los manda al relleno.',
      activity: 'Revisa el fondo de 5 envases de plástico e identifica su número de resina (1-7).',
    },
    'Papel y cartón': {
      minutes: 8,
      intro: 'El papel y el cartón son los materiales que más se reciclan en el mundo, pero tienen un límite: sus fibras se desgastan.',
      sections: [
        { heading: 'Cómo reciclarlos', text: 'El papel y cartón limpios y secos pueden reciclarse hasta 7 veces antes de que sus fibras sean demasiado cortas. Las cajas de pizza con grasa NO son reciclables: la grasa contamina el lote.' },
        { heading: 'Qué NO va al contenedor', text: 'Papel encerado, plastificado, con cinta adhesiva o contaminado con comida no se recicla. Los recibos térmicos contienen BPA y deben ir a la basura general.' },
      ],
      tip: 'Aplana las cajas antes de reciclarlas: ocupan menos espacio y se transportan más eficientemente.',
      activity: 'Revisa tu papelera: ¿qué porcentaje del papel podría haberse reciclado y se descartó?',
    },
    'Vidrio': {
      minutes: 8,
      intro: 'El vidrio es el material de envase más sostenible: puede reciclarse infinitamente sin perder calidad.',
      sections: [
        { heading: 'Por qué vale la pena', text: 'El vidrio reciclado se funde a menor temperatura que el virgen, ahorrando hasta un 30% de energía. Una botella de vidrio tarda más de 4.000 años en degradarse en la naturaleza, así que cada botella reciclada cuenta.' },
        { heading: 'Cuidados al reciclar', text: 'Lava los envases y quita las tapas metálicas (van al contenedor de metales). No mezcles vidrio con cerámica ni porcelana: cambian el punto de fusión y arruinan el lote. Nunca pongas vidrio roto suelto en la bolsa: envuélvelo para proteger a los recolectores.' },
      ],
      tip: 'Los vidrios de colores y transparentes se reciclan por separado para mantener el color exacto del nuevo envase.',
      activity: 'Identifica 3 envases de vidrio en tu casa y verifica en tu distrito qué día se recogen.',
    },
    'Punto limpio en casa': {
      minutes: 9,
      intro: 'Un punto limpio es un espacio organizado en tu hogar donde separas residuos por categoría. Es el corazón de cualquier programa de reciclaje doméstico.',
      sections: [
        { heading: 'Cómo organizarlo', text: 'Necesitas al menos 4 contenedores claramente etiquetados: orgánicos, reciclables limpios (plástico, vidrio, metal), papel y cartón, y desechos generales. El punto limpio debe estar en un lugar accesible y con buena ventilación.' },
        { heading: 'Rutina de separación', text: 'Limpia y seca los reciclables apenas los usas, así evitas olores y moscas. Transfiere lo separado a los contenedores comunitarios o al recolector según el cronograma de tu distrito.' },
      ],
      tip: 'Una caneca pequeña en la cocina para "reciclables" cerca del lugar donde preparas alimentos facilita el hábito.',
      activity: 'Crea tu punto limpio hoy con cajas o baldes que ya tengas en casa.',
    },
    'Compostaje básico': {
      minutes: 10,
      intro: 'El compostaje es la descomposición controlada de materia orgánica que la convierte en abono natural.',
      sections: [
        { heading: 'La receta del compost', text: 'Necesitas una proporción aproximada de 2 partes de material "verde" (cáscaras, restos de fruta) por 1 de material "seco" (hojas, cartón, ramitas). El secreto está en la humedad: debe sentirse como una esponja escurrida.' },
        { heading: 'Qué evitar', text: 'No agregues carnes, lácteos ni grasas (atraen plagas y generan malos olores). Voltea la mezcla cada 3-4 días para oxigenarla, y en 2-3 meses tendrás compost listo para tus plantas.' },
      ],
      tip: 'El compostaje reduce hasta un 30% los residuos que envías a la basura y produce abono gratis.',
      activity: 'Empieza un mini compostador con una botella grande o un balde con tapa.',
    },
  },

  // ─── c2: Ahorro Inteligente de Agua ───────────────────────────
  c2: {
    'Fuentes de desperdicio': {
      minutes: 8,
      intro: 'Un grifo que gotea pierde hasta 30 litros de agua al día. Las fugas invisibles son la mayor fuente de desperdicio en el hogar.',
      sections: [
        { heading: 'Fugas visibles e invisibles', text: 'Las visibles son fáciles de detectar: goteos, humedades, inodoros que no dejan de correr. Las invisibles ocurren dentro de las paredes o en el sistema de descarga y solo se detectan revisando el medidor.' },
        { heading: 'Hábitos que gastan', text: 'Duchas largas, cepillado con la llave abierta, lavado de autos con manguera y el lavarropas a media carga son los principales hábitos que disparan el consumo.' },
      ],
      tip: 'Para detectar fugas: cierra todas las llaves y revisa el medidor. Si avanza, hay una fuga.',
      activity: 'Hoy vigila el inodoro: echa unas gotas de colorante y espera 20 min sin usarlo. Si colorea, hay fuga.',
    },
    'Medición de consumo': {
      minutes: 8,
      intro: 'No puedes mejorar lo que no mides. Conocer tu consumo de agua es el primer paso para reducirlo.',
      sections: [
        { heading: 'El medidor y la factura', text: 'Tu recibo de agua muestra el consumo en m³ (1 m³ = 1.000 litros). Un hogar de 4 personas en la región consume en promedio 15-20 m³ al mes. Compara tus recibos: un aumento sin motivo indica fuga.' },
        { heading: 'Meta personal', text: 'Ponte una meta realista: reducir tu consumo un 10% el primer mes. Solo ajustando la ducha y cerrando llaves al lavarte, un hogar ahorra 3-4 m³ al mes.' },
      ],
      tip: 'Registra tu lectura del medidor cada domingo a la misma hora para tener tu propio histórico.',
      activity: 'Revisa tu último recibo de agua y anota cuántos m³ consumiste este mes.',
    },
    'Reparación de fugas': {
      minutes: 9,
      intro: 'Reparar una fuga es la acción de ahorro de agua más rentable: recupera cientos de litros al día por unos pocos soles.',
      sections: [
        { heading: 'Fugas más comunes', text: 'El empaque desgastado de una llave, el flotador mal ajustado de un inodoro y las conexiones flojas son las fugas típicas. Repararlas requiere herramientas básicas y, en muchos casos, solo cambiar una junta de goma.' },
        { heading: 'Cuándo llamar a un profesional', text: 'Si el medidor avanza con todo cerrado y no encuentras la fuga, o si ves humedad creciente en paredes o piso, contacta a un plomero: una fuga interna puede dañar la estructura de tu casa.' },
      ],
      tip: 'El inodoro con fuga silenciosa puede gastar hasta 4.000 litros al mes sin que te des cuenta.',
      activity: 'Revisa todas las llaves de tu casa y aprieta las conexiones que goteen.',
    },
    'Aparatos eficientes': {
      minutes: 9,
      intro: 'Los aparatos eficientes usan la menor cantidad de agua posible sin sacrificar resultados.',
      sections: [
        { heading: 'Inodoros y duchas', text: 'Un inodoro de doble descarga usa 3 litros para líquidos y 6 para sólidos, frente a los 13 de uno antiguo. Un cabezal de ducha eficiente ahorra hasta 20 litros por minuto.' },
        { heading: 'Electrodomésticos', text: 'Lava la ropa solo con carga completa. En la cocina, llena el lavadero o usa un recipiente para lavar la vajilla en vez de dejar la llave corriendo.' },
      ],
      tip: 'Elige aparatos con etiqueta de eficiencia: pueden reducir el consumo de agua de tu hogar hasta un 35%.',
      activity: 'Revisa si tu inodoro tiene doble descarga y anota cuántos litros usa cada botón.',
    },
    'Captación de lluvia': {
      minutes: 10,
      intro: 'En ciudades con lluvias estacionales, captar agua de lluvia puede cubrir gran parte del riego de jardines y la limpieza.',
      sections: [
        { heading: 'Sistema básico', text: 'Un sistema simple consiste en canaletas que dirigen el agua a un tanque con tapa y filtro para hojas. Con un techo de 50 m², un milímetro de lluvia produce 50 litros de agua.' },
        { heading: 'Usos seguros', text: 'El agua de lluvia captada es ideal para regar plantas, lavar pisos, autos y descargar inodoros. Para beber necesitaría filtración adicional y control de calidad.' },
      ],
      tip: 'En una zona con 400 mm de lluvia al año, un techo de 50 m² capta 20.000 litros: un año completo de riego.',
      activity: 'Calcula cuánta agua podrías captar con tu techo multiplicando su área por la lluvia anual de tu zona.',
    },
    'Campañas de ahorro': {
      minutes: 7,
      intro: 'El ahorro de agua se multiplica cuando se hace en comunidad.',
      sections: [
        { heading: 'Vecinos y colegios', text: 'Organiza un taller sobre fugas, crea un grupo de WhatsApp para reportar roturas de tuberías públicas y promueve la instalación de recolectores de lluvia en zonas comunes.' },
        { heading: 'Cambio cultural', text: 'El ejemplo es contagioso: cuando tu vecindario ve tus hábitos y tus recibos a la baja, se anima a imitarlos. Comparte tus ahorros mensuales como reto amistoso.' },
      ],
      tip: 'Los municipios suelen ofrecer descuentos a hogares que demuestran reducciones de consumo. Infórmate en tu distrito.',
      activity: 'Comparte con un vecino o familiar un tip de ahorro que hayas aplicado esta semana.',
    },
  },

  // ─── c3: Calidad del Aire y Salud ──────────────────────────────
  c3: {
    'Contaminantes principales': {
      minutes: 9,
      intro: 'La contaminación del aire es una mezcla de gases y partículas que afecta la salud de todos los habitantes de una ciudad.',
      sections: [
        { heading: 'Los más peligrosos', text: 'Las PM2.5 (partículas menores a 2,5 micrómetros) son las más dañinas: penetran hasta los alvéolos y pasan a la sangre. El ozono troposférico, el dióxido de nitrógeno (de los vehículos) y el dióxido de azufre (de la industria) son otros contaminantes críticos.' },
        { heading: 'Cómo se miden', text: 'La calidad del aire se expresa en el Índice de Calidad del Aire (AQI/ICA). Valores sobre 100 se consideran insalubres para grupos sensibles, y sobre 200, para toda la población.' },
      ],
      tip: 'La contaminación del aire provoca más de 7 millones de muertes prematuras al año en el mundo, según la OMS.',
      activity: 'Busca el ICA de tu ciudad hoy en la web de tu Ministerio de Ambiente y regístralo.',
    },
    'Fuentes de emisión': {
      minutes: 8,
      intro: 'Conocer de dónde viene la contaminación te permite evitarla y exigir cambios.',
      sections: [
        { heading: 'En la ciudad', text: 'El transporte (autos, motos y buses viejos) es la principal fuente urbana. La quema de residuos a cielo abierto, común en zonas periurbanas, es una fuente grave pero evitable que emite dioxinas y metales pesados.' },
        { heading: 'Industria y energía', text: 'Las termoeléctricas, fábricas y ladrilleras artesanales contribuyen con azufre, partículas y CO₂. La distancia y los vientos determinan quién recibe más contaminación.' },
      ],
      tip: 'Las motos y autos antiguos emiten hasta 10 veces más partículas que uno moderno en buen estado.',
      activity: 'Identifica las 3 fuentes de contaminación más cercanas a tu casa.',
    },
    'Efectos en el organismo': {
      minutes: 9,
      intro: 'La contaminación del aire afecta casi todos los sistemas del cuerpo, no solo los pulmones.',
      sections: [
        { heading: 'Sistema respiratorio', text: 'El humo y las partículas irritan la garganta, provocan tos, bronquitis y ataques de asma. La exposición prolongada acelera el deterioro pulmonar, como si se envejeciera el pulmón décadas antes.' },
        { heading: 'Más allá de los pulmones', text: 'Las PM2.5 pasan al torrente sanguíneo y se asocian con infartos, accidentes cerebrovasculares, diabetes y efectos en el desarrollo cognitivo de niños y niñas.' },
      ],
      tip: 'Los niños, ancianos, embarazadas y personas con asma o enfermedades cardíacas son los más vulnerables.',
      activity: 'Conversa con tu familia sobre los síntomas que pueden asociarse a la contaminación del aire.',
    },
    'Grupos de riesgo': {
      minutes: 7,
      intro: 'No todas las personas se ven afectadas igual: algunos grupos necesitan protección especial.',
      sections: [
        { heading: 'Quiénes son', text: 'Niños menores de 5 años (sus pulmones están en desarrollo), adultos mayores, embarazadas, trabajadores al aire libre y personas con asma, EPOC o enfermedades cardiovasculares.' },
        { heading: 'Qué hacer', text: 'En días de mala calidad del aire, estos grupos deben reducir la actividad física al aire libre, mantener ventanas cerradas y usar purificadores o mascarillas N95 en exteriores.' },
      ],
      tip: 'Los días de alta contaminación, el ejercicio al aire libre puede hacer más daño que bien.',
      activity: 'Identifica a quiénes de tu hogar y comunidad pertenecen a grupos de riesgo.',
    },
    'Protección personal': {
      minutes: 8,
      intro: 'Hay medidas efectivas para reducir tu exposición a la contaminación del aire.',
      sections: [
        { heading: 'En el exterior', text: 'Evita calles con tráfico intenso, especialmente en horas punta. Mantén distancia de buses y motos. Si el ICA es alto, usa mascarilla N95 (las quirúrgicas no filtran partículas finas).' },
        { heading: 'En el hogar', text: 'No fumes dentro, ventila a las horas de menor contaminación, usa extractor en la cocina y considera un purificador de aire en habitaciones principales.' },
      ],
      tip: 'Los autos, buses y motos contaminan más en los semáforos: aléjate de las esquinas con mucho tráfico.',
      activity: 'Planea tu ruta de hoy evitando la avenida más transitada de tu zona.',
    },
    'Monitoreo comunitario': {
      minutes: 9,
      intro: 'La ciencia ciudadana ha democratizado la medición de la calidad del aire.',
      sections: [
        { heading: 'Sensores de bajo costo', text: 'Existen sensores portátiles de PM2.5 por menos de $100 que, calibrados correctamente, dan datos útiles. Comunidades alrededor del mundo instalan redes de monitoreo para mapear su propio aire.' },
        { heading: 'Del dato a la acción', text: 'Los datos comunitarios sirven para denunciar, exigir estaciones oficiales y cambiar hábitos. Una comunidad que se mide, se organiza y negocia mejor con las autoridades.' },
      ],
      tip: 'Los datos ciudadanos han sido clave para declarar alertas ambientales en varias ciudades de la región.',
      activity: 'Anota 3 acciones que harías si tuvieras datos de calidad del aire de tu cuadra.',
    },
    'Soluciones locales': {
      minutes: 8,
      intro: 'Las ciudades pueden limpiar su aire con decisiones concretas.',
      sections: [
        { heading: 'Urbanismo y movilidad', text: 'Más parques, más árboles en las calles y transporte público eléctrico reducen la contaminación. Promover la bici y el caminar con calles seguras es una de las medidas más efectivas.' },
        { heading: 'Regulación y comunidad', text: 'Prohibir la quema de residuos, fiscalizar ladrilleras y fábricas, y chatarrizar el parque automotor viejo son medidas regulatorias que funcionan cuando la comunidad las exige.' },
      ],
      tip: 'Un árbol maduro puede capturar hasta 22 kg de CO₂ al año y filtrar partículas del aire urbano.',
      activity: 'Elige una medida de esta lección y propón cómo implementarla en tu distrito.',
    },
  },

  // ─── c4: Huerta Urbana Sostenible ──────────────────────────────
  c4: {
    'Diseño del espacio': {
      minutes: 9,
      intro: 'Una huerta urbana exitosa comienza con un buen diseño, incluso en espacios pequeños.',
      sections: [
        { heading: 'Luz y orientación', text: 'La mayoría de hortalizas necesita al menos 6 horas de sol directo al día. Observa tu balcón o patio durante una jornada completa para identificar las zonas con más sol.' },
        { heading: 'Contenedores y mesas de cultivo', text: 'Las mesas de cultivo elevadas protegen tu espalda, mejoran el drenaje y evitan plagas del suelo. En balcones, usa macetas de al menos 20 cm de profundidad con buen drenaje.' },
      ],
      tip: 'Empieza pequeño: 3-4 macetas bien cuidadas producen más que 20 abandonadas.',
      activity: 'Dibuja un mapa de tu espacio marcando las horas de sol por zona.',
    },
    'Selección de cultivos': {
      minutes: 8,
      intro: 'Elegir qué sembrar según tu clima y temporada es la diferencia entre éxito y frustración.',
      sections: [
        { heading: 'Fáciles para empezar', text: 'Lechugas, rábanos, espinaca, hierbas aromáticas (albahaca, perejil, culantro) y tomates cherry son ideales para principiantes. Crecen rápido y dan feedback constante.' },
        { heading: 'Temporada', text: 'En climas cálidos, el rábano y la lechuga prefieren temporadas frescas, mientras que el tomate y el ají aman el calor. Consulta el calendario de siembra de tu región.' },
      ],
      tip: 'El rábano se cosecha en solo 30-40 días: perfecto para aprender y motivarse.',
      activity: 'Elige 3 cultivos adecuados a tu estación actual y averigua cuánto tardan en cosecharse.',
    },
    'Sustrato y abono': {
      minutes: 9,
      intro: 'El sustrato es el "alimento" de tus plantas: una buena mezcla vale más que cualquier fertilizante.',
      sections: [
        { heading: 'La mezcla ideal', text: 'Una mezcla clásica: 50% tierra, 25% compost y 25% perlita o cascarilla de arroz para aireación y drenaje. Evita reutilizar tierra de jardines tratados con químicos.' },
        { heading: 'Abono orgánico', text: 'El compost y el humus de lombriz aportan nutrientes de liberación lenta. El té de compost (infusión de compost en agua) es un fertilizante líquido foliar casero y poderoso.' },
      ],
      tip: 'Las cáscaras de huevo trituradas aportan calcio y ayudan a prevenir la pudrición apical del tomate.',
      activity: 'Prepara un pequeño lote de mezcla de sustrato con lo que tengas disponible.',
    },
    'Técnicas de siembra': {
      minutes: 9,
      intro: 'Sembrar correctamente determina la germinación y el vigor de tus plantas.',
      sections: [
        { heading: 'De semilla o plantín', text: 'Las semillas se siembran a una profundidad de 2-3 veces su tamaño. Los plantines (almácigos) te dan 2-3 semanas de ventaja y se transplante a las 3-4 hojas verdaderas.' },
        { heading: 'Densidad y asociación', text: 'No siembres demasiado junto: cada planta necesita espacio para su raíz y hojas. La asociación de cultivos (ej. albahaca con tomate) ayuda a repeler plagas y aprovechar espacio.' },
      ],
      tip: 'Siembra en luna de cuarto creciente favorece la germinación según la agricultura tradicional.',
      activity: 'Siembra tu primer almácigo con semillas de lechuga o rábano.',
    },
    'Riego inteligente': {
      minutes: 8,
      intro: 'El riego es la causa número uno de plantas muertas en huertas urbanas: por exceso y por defecto.',
      sections: [
        { heading: 'Cuándo y cuánto', text: 'Riega temprano en la mañana para reducir la evaporación. La regla del dedo: si el sustrato está seco a 3 cm de profundidad, toca regar. En verano puede ser cada día; en invierno, 2-3 veces por semana.' },
        { heading: 'Sistemas eficientes', text: 'El riego por goteo con botellas perforadas o sistemas de mecha mantienen la humedad constante. El acolchado (paja u hojas secas sobre el suelo) reduce la evaporación hasta un 50%.' },
      ],
      tip: 'Usa agua de lluvia captada o el agua de lavado de verduras para regar tus plantas.',
      activity: 'Prueba la regla del dedo en tus macetas durante 3 días y ajusta tu rutina de riego.',
    },
    'Cuidados básicos': {
      minutes: 8,
      intro: 'Observar tu huerta unos minutos al día previene la mayoría de problemas.',
      sections: [
        { heading: 'Revisión diaria', text: 'Revisa el envés de las hojas (ahí viven pulgones y arañitas), el color de las hojas (amarillo = falta nitrógeno o exceso de agua) y la firmeza de las plantas.' },
        { heading: 'Poda y tutorado', text: 'Pellizca las puntas de albahaca para que crezca frondosa. Tutorar tomates y pepinos evita que se quiebren con su peso y mejora la circulación de aire.' },
      ],
      tip: 'La mejor defensa contra plagas es una planta sana: la mayoría de problemas empiezan por estrés.',
      activity: 'Dedica 5 minutos a observar tu huerta con la lupa del detalle: hojas, envés y suelo.',
    },
    'Momento de cosecha': {
      minutes: 7,
      intro: 'Cosechar en el momento justo maximiza sabor y nutrición.',
      sections: [
        { heading: 'Señales de madurez', text: 'Las lechugas se cosechan cuando forman una cabeza firme o sus hojas externas alcanzan 15 cm. Los tomates, cuando toman color uniforme. Las hierbas, antes de que florezcan.' },
        { heading: 'Cosecha continua', text: 'Las hierbas y lechugas de hoja se cosechan "en corta y vuelve": corta las hojas externas y la planta seguirá produciendo semanas.' },
      ],
      tip: 'Cosecha temprano en la mañana, cuando la planta está hidratada: la verdura dura más fresca.',
      activity: 'Planifica tu primera cosecha anotando la fecha probable de cada cultivo.',
    },
    'Post-cosecha': {
      minutes: 7,
      intro: 'El cuidado después de cosechar define cuánto dura tu producción fresca.',
      sections: [
        { heading: 'Limpieza y almacenamiento', text: 'Lava y seca la verdura antes de guardarla. Las hojas verdes duran más en la heladera en un recipiente con papel absorbente. Las hierbas se guardan como un ramo en un vaso de agua.' },
        { heading: 'Conservación', text: 'Congela hierbas en bandejas de cubitos con aceite, deshidrata ajíes y tomates, y prepara conservas. Así aprovechas excedentes y reduces desperdicio.' },
      ],
      tip: 'La albahaca NO se refrigera: se guarda como ramo o se convierte en pesto para durar meses.',
      activity: 'Anota 2 técnicas de conservación que aplicarás con tu próxima cosecha.',
    },
    'Guardado de semillas': {
      minutes: 8,
      intro: 'Guardar semillas de tu propia cosecha te vuelve autosuficiente y conserva variedades locales.',
      sections: [
        { heading: 'Qué semillas guardar', text: 'Solo de plantas sanas y de variedades "polinización abierta" (no híbridas F1). El tomate y el ají requieren fermentar la pulpa 3 días para separar las semillas viables.' },
        { heading: 'Almacenamiento', text: 'Las semillas deben estar completamente secas. Guárdalas en sobres de papel en un frasco hermético, oscuro y fresco. La mayoría mantiene su poder germinativo 2-5 años.' },
      ],
      tip: 'Escribe siempre la especie y fecha en el sobre: la memoria falla, las etiquetas no.',
      activity: 'Guarda tus primeras semillas de rábano o albahaca en un sobre etiquetado.',
    },
  },

  // ─── c5: Energías Renovables para el Hogar ─────────────────────
  c5: {
    'Tipos de energía': {
      minutes: 8,
      intro: 'Las energías renovables se regeneran naturalmente y tienen huella de carbono mínima.',
      sections: [
        { heading: 'Principales renovables', text: 'Solar fotovoltaica (convierte luz en electricidad), solar térmica (calienta agua), eólica (viento), hidroeléctrica (agua), geotérmica (calor de la tierra) y biomasa (residuos orgánicos).' },
        { heading: 'Por qué cambiarse', text: 'Los costos de paneles solares han caído más del 80% en la última década. Hoy, la solar ya es la fuente de electricidad más barata en la mayoría de países.' },
      ],
      tip: 'El sol envía a la Tierra en una hora más energía de la que la humanidad consume en todo un año.',
      activity: 'Identifica qué fuentes de energía usa tu país para generar electricidad y su proporción.',
    },
    'El recurso solar': {
      minutes: 8,
      intro: 'La cantidad de sol que recibe tu zona determina el tamaño de tu sistema solar.',
      sections: [
        { heading: 'Irradiación', text: 'Se mide en kWh/m² por día. Una zona con 5 kWh/m²/día (típico de muchas ciudades costeras) es muy buena para solar. Con este dato puedes calcular cuánto generará tu techo.' },
        { heading: 'Orientación e inclinación', text: 'En el hemisferio sur, los paneles miran al norte; en el norte, al sur. La inclinación óptima es aproximadamente igual a la latitud del lugar.' },
      ],
      tip: 'Las sombras de árboles o edificios reducen drásticamente la producción: un panel sombreado al 20% pierde hasta 50% de potencia.',
      activity: 'Calcula la irradiación solar de tu ciudad usando un mapa solar en línea.',
    },
    'El recurso eólico': {
      minutes: 7,
      intro: 'El viento es otra fuente valiosa, especialmente complementaria al sol (a veces sopla más cuando no hay sol).',
      sections: [
        { heading: 'Aerogeneradores domésticos', text: 'Los pequeños aerogeneradores de eje vertical funcionan mejor en entornos urbanos porque no necesitan orientarse al viento. Requieren vientos promedio de al menos 4-5 m/s.' },
        { heading: 'Limitaciones urbanas', text: 'En ciudades densas, las turbulencias y los techos bajos reducen la eficiencia. Antes de comprar, mide tu viento real con un anemómetro durante un mes.' },
      ],
      tip: 'La potencia del viento crece con el cubo de su velocidad: el doble de viento = 8 veces más energía.',
      activity: 'Observa y anota la dirección y fuerza del viento en tu techo durante una semana.',
    },
    'Paneles': {
      minutes: 9,
      intro: 'El panel solar es el corazón del sistema fotovoltaico: convierte fotones en electrones.',
      sections: [
        { heading: 'Tipos', text: 'Monocristalinos (más eficientes, color negro uniforme), policristalinos (azules, un poco menos eficientes y más baratos) y de capa fina (flexibles, para superficies curvas).' },
        { heading: 'Potencia y degradación', text: 'Los paneles residenciales típicos producen entre 400 y 550 W. Pierden alrededor de 0,5% de eficiencia por año, y la mayoría trae 25 años de garantía de rendimiento.' },
      ],
      tip: 'El mantenimiento es casi nulo: una limpieza con agua cada 6 meses suele bastar en zonas sin polvo extremo.',
      activity: 'Calcula cuántos paneles necesitarías para tu consumo si cada uno produce 500 W al sol pico.',
    },
    'Inversores': {
      minutes: 8,
      intro: 'El inversor convierte la corriente continua (DC) de los paneles en corriente alterna (AC) que usan tus electrodomésticos.',
      sections: [
        { heading: 'Funciones', text: 'Además de convertir, gestiona la interacción con la red eléctrica, monitorea el sistema y cumple las normas de seguridad (desconexión automática ante cortes de red).' },
        { heading: 'Tipos', text: 'Inversores centrales (un solo equipo para toda la instalación), microinversores (uno por panel, ideal si hay sombras parciales) y optimizadores de potencia (mejoran la producción por panel).' },
      ],
      tip: 'La vida útil del inversor (10-15 años) es menor que la de los paneles: presupuesta su reemplazo.',
      activity: 'Compara los precios de inversores centrales vs microinversores para un sistema de 3 kW.',
    },
    'Baterías': {
      minutes: 9,
      intro: 'Las baterías te permiten usar tu energía solar de noche y tener respaldo ante cortes.',
      sections: [
        { heading: 'Química', text: 'Las de litio (LiFePO4) dominan el mercado residencial: duran más de 10 años, son seguras y aguantan miles de ciclos. Las de plomo-ácido son más baratas pero duran 3-5 años.' },
        { heading: 'Autoconsumo', text: 'Sin baterías, el sistema es "on-grid": exportas excedentes y compras de noche. Con baterías, maximizas el autoconsumo y la independencia, aunque encarece la inversión inicial.' },
      ],
      tip: 'Dimensiona la batería para cubrir tu consumo nocturno, no todo tu consumo, para optimizar costos.',
      activity: 'Revisa tu recibo: ¿cuántos kWh consumes en horario nocturno? Ese es el tamaño útil de tu batería.',
    },
    'Instalación': {
      minutes: 9,
      intro: 'Una instalación bien hecha garantiza seguridad, rendimiento y durabilidad de tu sistema.',
      sections: [
        { heading: 'Estructuras y cableado', text: 'Las estructuras de montaje deben soportar vientos y lluvia. El cableado DC de calidad y con protección solar es crítico. Todo debe estar aterrizado.' },
        { heading: 'Manos calificadas', text: 'En la mayoría de países, la instalación debe realizarla un electricista certificado y cumplir el reglamento local. Exige garantías escritas y verifica que el sistema se registre ante el distribuidor eléctrico.' },
      ],
      tip: 'Antes de firmar, pide 3 cotizaciones y verifica que el instalador tenga experiencia real comprobable.',
      activity: 'Haz una lista de 5 preguntas que le harías a un instalador antes de contratar.',
    },
    'Costos': {
      minutes: 8,
      intro: 'Entender la estructura de costos te permite tomar una decisión informada.',
      sections: [
        { heading: 'Inversión inicial', text: 'Un sistema residencial de 3 kW cuesta, según el país, entre $1.500 y $3.500 (paneles, inversor, estructura e instalación). Las baterías agregan 30-60% más.' },
        { heading: 'Compara con tu factura', text: 'Divide la inversión entre tu ahorro mensual para obtener el "tiempo de retorno". Si ahorras $60/mes y el sistema cuesta $2.400, el retorno es 40 meses (3,3 años).' },
      ],
      tip: 'Pregunta por el precio por Wp instalado: es el indicador estándar para comparar ofertas.',
      activity: 'Con tu consumo mensual y tarifa, estima cuánto pagarías de electricidad si tuvieras solar.',
    },
    'Ahorro': {
      minutes: 7,
      intro: 'El ahorro real de un sistema solar se calcula a 20-25 años, no solo en el primer año.',
      sections: [
        { heading: 'Flujo de ahorro', text: 'Paga menos o nada a la red, recibe crédito por excedentes (si tu país tiene medición neta) y protege tu hogar de futuros aumentos de tarifa.' },
        { heading: 'El aumento de tarifas importa', text: 'Si las tarifas eléctricas suben 5% anual, tu ahorro crece con el tiempo: la decisión solar mejora cada año que pasa.' },
      ],
      tip: 'Los excedentes se compensan en la mayoría de países con "medición neta": tu medidor corre hacia atrás.',
      activity: 'Simula el ahorro acumulado a 5 y 10 años para tu posible sistema.',
    },
    'Subsidios': {
      minutes: 7,
      intro: 'Muchos gobiernos y bancos apoyan la energía solar con incentivos.',
      sections: [
        { heading: 'Tipos de incentivo', text: 'Deducciones de impuestos, subsidios directos, líneas de crédito verdes con tasa baja y programas de "impulso solar" municipales son los más comunes en la región.' },
        { heading: 'Dónde informarte', text: 'Revisa el ministerio de energía de tu país, la distribuidora eléctrica local y los programas de ONGs. Los incentivos cambian constantemente, así que verifica fechas y requisitos.' },
      ],
      tip: 'En algunos países, instalar solar también incrementa el valor de reventa de tu vivienda.',
      activity: 'Investiga qué incentivos solares existen hoy en tu país y anota los 2 más relevantes.',
    },
  },

  // ─── c6: Gestión de Residuos Orgánicos ─────────────────────────
  c6: {
    '¿Qué es el compost?': {
      minutes: 8,
      intro: 'El compost es un abono natural producido por la descomposición aeróbica (con oxígeno) de residuos orgánicos.',
      sections: [
        { heading: 'De residuo a recurso', text: 'Microorganismos, hongos y bacterias transforman la materia orgánica en humus: un material oscuro, esponjoso y rico en nutrientes que mejora la estructura del suelo y retiene agua.' },
        { heading: 'Diferencias con el abono químico', text: 'El compost libera nutrientes lentamente, mejora la vida microbiana del suelo y no quema raíces. Es la base de la agricultura regenerativa.' },
      ],
      tip: 'El compost maduro no huele mal: huele a bosque húmedo.',
      activity: 'Compara el compost con el abono químico en precio, resultados y efecto en el suelo.',
    },
    'Microorganismos': {
      minutes: 8,
      intro: 'El compostaje es un ecosistema microscópico: billones de microorganismos trabajan por ti.',
      sections: [
        { heading: 'Quién trabaja', text: 'Bacterias (inician el proceso y alcanzan temperaturas altas), hongos (descomponen materiales más resistentes como la celulosa), actinobacterias (dan el aroma a tierra) y lombrices en las etapas finales.' },
        { heading: 'Condiciones ideales', text: 'Necesitan humedad (como esponja escurrida), oxígeno (voltear la pila) y una proporción balanceada de carbono (materiales secos) y nitrógeno (materiales verdes).' },
      ],
      tip: 'Si tu compost huele mal, le falta oxígeno o carbono: agrega hojas secas y voltea.',
      activity: 'Observa tu compost con atención: ¿notas hongos, lombrices o alguna mosca? Cada uno cuenta una historia.',
    },
    'Lombricompostaje': {
      minutes: 9,
      intro: 'Las lombrices rojas californianas transforman tus residuos en humus de altísima calidad, sin malos olores y en espacios pequeños.',
      sections: [
        { heading: 'El sistema', text: 'Un vermicompostador tiene bandejas apiladas: las lombrices viven en la superior con los residuos y el "té de lombriz" se filtra a la inferior. Es ideal para departamentos.' },
        { heading: 'Qué darles de comer', text: 'Restos de frutas y verduras picadas, cáscaras de huevo trituradas y papel. Evita cítricos en exceso, cebolla y ajo en grandes cantidades, carnes y lácteos.' },
      ],
      tip: 'Una población de 1.000 lombrices procesa aproximadamente 500 g de residuos al día.',
      activity: 'Investiga dónde conseguir lombrices rojas californianas en tu ciudad.',
    },
    'Compostaje en frio': {
      minutes: 7,
      intro: 'El compostaje en frío es el método más simple: sin control de temperatura, solo paciencia.',
      sections: [
        { heading: 'Cómo funciona', text: 'Acumulas residuos en una compostera y los vas mezclando con material seco, sin voltear activamente. La descomposición tarda de 6 a 12 meses, dependiendo del clima.' },
        { heading: 'Ventajas', text: 'Requiere mínimo esfuerzo y mantenimiento. Es ideal para quienes tienen poco tiempo o un espacio exterior simple.' },
      ],
      tip: 'Pica los residuos en trozos pequeños: más superficie = descomposición más rápida.',
      activity: 'Empieza una pila de compost en frío con una compostera de madera o malla.',
    },
    'Compostaje en caliente': {
      minutes: 8,
      intro: 'El compostaje en caliente produce compost en 6-8 semanas manteniendo una temperatura activa de 55-65°C.',
      sections: [
        { heading: 'El método Berkeley', text: 'Construye la pila de una vez (mínimo 1 m³), con proporción 2:1 de secos a verdes. La temperatura sube sola; voltéala cuando baje de 50°C, cada 2-3 días.' },
        { heading: 'Por qué importa el calor', text: 'Las altas temperaturas higienizan el compost eliminando patógenos y semillas de malezas. Es el método preferido para residuos de jardín abundantes.' },
      ],
      tip: 'Un termómetro de compost (sonda larga) cuesta poco y te ahorra adivinar.',
      activity: 'Si tienes jardín, arma una pila caliente y mide su temperatura a los 3 días.',
    },
    'Compostaje industrial': {
      minutes: 8,
      intro: 'A escala comunitaria o municipal, el compostaje se industrializa para procesar toneladas diarias.',
      sections: [
        { heading: 'Tecnologías', text: 'Túneles de compostaje con aireación forzada, pilas con volteo mecánico y reactores rotatorios controlan temperatura, oxígeno y humedad de forma automatizada.' },
        { heading: 'El desafío de la separación', text: 'El mayor costo no es la tecnología sino la contaminación del material: cuando la ciudadanía separa bien en origen, el compost industrial es rentable y de calidad.' },
      ],
      tip: 'Un municipio que separa el 40% de sus residuos orgánicos puede reducir a la mitad lo que entierra.',
      activity: 'Investiga qué planta de compostaje o biodigestión existe cerca de tu ciudad.',
    },
    'Biorrefinación': {
      minutes: 8,
      intro: 'La biorrefinación va más allá del compost: extrae de los residuos bioproductos de alto valor.',
      sections: [
        { heading: 'Biogás', text: 'En biodigestores sin oxígeno, la materia orgánica produce biogás (60% metano) que se usa como combustible, y un residuo llamado "digestato" que es excelente abono.' },
        { heading: 'Bioplásticos y más', text: 'Se investiga obtener bioplásticos, aceites esenciales, biopesticidas y proteínas de residuos orgánicos. Es la economía circular llevada al máximo.' },
      ],
      tip: 'El biogás de una tonelada de residuos equivale a unos 100 m³ de gas, suficiente para cocinar un hogar un mes.',
      activity: 'Dibuja una "cadena de valor" desde tu cáscara de plátano hasta un producto final.',
    },
  },

  // ─── c7: Impacto Ambiental Industrial ──────────────────────────
  c7: {
    'Contaminación del aire': {
      minutes: 9,
      intro: 'La industria es una de las mayores fuentes de contaminación atmosférica, pero también la más controlable.',
      sections: [
        { heading: 'Emisiones industriales', text: 'Gases de combustión (CO₂, SO₂, NOx), material particulado, compuestos orgánicos volátiles (COV) y metales pesados se emiten en procesos como fundición, fabricación química y generación de energía.' },
        { heading: 'Herramientas de control', text: 'Filtros de mangas, precipitadores electrostáticos, lavadores de gases y quemadores de COV reducen las emisiones. El monitoreo continuo con reportes públicos es la mejor garantía.' },
      ],
      tip: 'Los acuerdos de producción limpia y las normas de emisión de la OMS son los estándares de referencia.',
      activity: 'Identifica 3 industrias cercanas a tu zona y qué contaminantes podrían emitir.',
    },
    'Agua industrial': {
      minutes: 8,
      intro: 'La industria consume y contamina enormes volúmenes de agua, especialmente en países sin regulación estricta.',
      sections: [
        { heading: 'Efluentes', text: 'Las aguas residuales industriales contienen metales pesados, grasas, químicos y materia orgánica. Sin tratamiento, destruyen ecosistemas acuáticos y arruinan fuentes de agua potable.' },
        { heading: 'Tratamiento', text: 'Plantas de tratamiento fisicoquímico (coagulación, floculación) y biológico (lodos activados) permiten reutilizar el agua en el mismo proceso industrial, cerrando el ciclo.' },
      ],
      tip: 'El enfoque moderno es la "jerarquía de efluentes": primero reducir, luego reutilizar, luego tratar, y solo al final descargar.',
      activity: 'Investiga un caso local de contaminación industrial de agua y sus efectos.',
    },
    'Residuos peligrosos': {
      minutes: 8,
      intro: 'Los residuos peligrosos requieren manejo especializado por su toxicidad, corrosividad o inflamabilidad.',
      sections: [
        { heading: 'Tipos', text: 'Solventes, pinturas, baterías, aceites usados, lodos de tratamiento y residuos con metales pesados. Su disposición inadecuada contamina suelos y acuíferos durante décadas.' },
        { heading: 'Gestión', text: 'Requieren registro, etiquetado, transporte especializado y disposición en celdas de seguridad o plantas de co-procesamiento autorizadas. La trazabilidad desde el origen es obligatoria.' },
      ],
      tip: 'El principio "quien contamina paga" está incorporado en la legislación de la mayoría de países de la región.',
      activity: 'Identifica qué residuos peligrosos genera tu hogar (pilas, aceite de cocina, pinturas) y cómo disponerlos.',
    },
    'LCA': {
      minutes: 10,
      intro: 'El Análisis de Ciclo de Vida (LCA) evalúa el impacto ambiental de un producto "de la cuna a la tumba".',
      sections: [
        { heading: 'Etapas', text: 'Extracción de materias primas, fabricación, transporte, uso y disposición final. El LCA cuantifica impactos en cada etapa usando bases de datos como Ecoinvent y normas ISO 14040/44.' },
        { heading: 'Resultados', text: 'Permite comparar productos (¿bolsa de plástico o de papel?) y detectar dónde se concentra el impacto (a veces el transporte pesa más que la fabricación).' },
      ],
      tip: 'Un LCA mal hecho (sin límites claros o datos inventados) se llama "greenwashing". Desconfía de declaraciones sin metodología.',
      activity: 'Elige un producto de tu casa y piensa en qué etapa de su ciclo genera más impacto.',
    },
    'Huella de carbono': {
      minutes: 8,
      intro: 'La huella de carbono mide las emisiones de gases de efecto invernadero de un producto, organización o persona.',
      sections: [
        { heading: 'Alcances', text: 'Alcance 1 (emisiones directas), Alcance 2 (energía comprada) y Alcance 3 (cadena de suministro y uso del producto). El Alcance 3 suele ser el mayor y el más difícil de medir.' },
        { heading: 'Compensación', text: 'Tras medir, las empresas reducen (eficiencia, renovables) y compensan lo restante (reforestación, proyectos de energía limpia). La compensación nunca debe sustituir a la reducción.' },
      ],
      tip: 'Una tonelada de CO₂ equivale a aproximadamente 2.300 km recorridos en auto promedio.',
      activity: 'Estima tu huella de carbono personal usando una calculadora en línea.',
    },
    'Auditorías': {
      minutes: 8,
      intro: 'La auditoría ambiental verifica que la industria cumpla la normativa y mejore continuamente.',
      sections: [
        { heading: 'Tipos', text: 'Auditorías de cumplimiento (contra la ley), de gestión (ISO 14001) y debida diligencia (antes de comprar una empresa). Incluyen revisión documental e inspecciones en planta.' },
        { heading: 'El informe', text: 'El auditor emite hallazgos clasificados por severidad y un plan de acciones correctivas con plazos. Las auditorías públicas aumentan la transparencia y la confianza de la comunidad.' },
      ],
      tip: 'ISO 14001 es el estándar voluntario más usado: certifica un sistema de gestión ambiental.',
      activity: 'Investiga qué empresas de tu país han sido auditadas y qué hallazgos tuvieron.',
    },
    'Tecnologías limpias': {
      minutes: 8,
      intro: 'Las tecnologías limpias reducen el impacto ambiental sin sacrificar productividad.',
      sections: [
        { heading: 'Ejemplos', text: 'Hornos eléctricos en acerías, catálisis para reducir NOx, membranas de filtración, electrólisis con energías renovables para hidrógeno verde y pinturas sin solventes.' },
        { heading: 'El caso de negocio', text: 'Muchas tecnologías limpias se pagan solas: consumen menos energía y materia prima. La inversión inicial se recupera con la eficiencia operativa.' },
      ],
      tip: 'El "ecodiseño" evita el problema desde el inicio: diseña productos fáciles de reparar, reciclar y sin tóxicos.',
      activity: 'Busca un ejemplo de industria que haya reducido costos y contaminación con tecnología limpia.',
    },
    'Economía circular industrial': {
      minutes: 9,
      intro: 'La economía circular propone que los residuos de una industria sean materias primas de otra: el residuo cero como meta.',
      sections: [
        { heading: 'Simbiosis industrial', text: 'En parques ecoindustriales, una fábrica envía su calor residual, agua o subproductos a otra que los aprovecha. Kalundborg, Dinamarca, es el ejemplo clásico con décadas de funcionamiento.' },
        { heading: 'Cierre de ciclos', text: 'Diseñar para el desensamblaje, usar materiales reciclables, devolver productos al fabricante y compartir activos ociosos son estrategias concretas de circularidad.' },
      ],
      tip: 'Se estima que la economía circular podría reducir el consumo de recursos primarios hasta en un 32% para 2030.',
      activity: 'Mapea 3 residuos industriales de tu región y piensa qué otra industria podría usarlos.',
    },
    'Regulación': {
      minutes: 8,
      intro: 'La regulación ambiental es el marco que obliga y orienta a la industria hacia la sostenibilidad.',
      sections: [
        { heading: 'Instrumentos', text: 'Límites de emisión, estudios de impacto ambiental (EIA), licencias, instrumentos económicos (impuestos al carbono, bonos de reciclaje) y responsabilidad extendida del productor (REP).' },
        { heading: 'Participación ciudadana', text: 'Las consultas públicas y los derechos de información (acceso a datos de monitoreo) permiten que las comunidades fiscalicen a la industria. La participación informada es un derecho, no un favor.' },
      ],
      tip: 'El principio de precaución: ante duda de daño grave, se actúa con medidas preventivas antes que lamentar.',
      activity: 'Investiga la norma de EIA de tu país y cómo los ciudadanos participan en ella.',
    },
  },

  // ─── c8: Biodiversidad y Ecosistemas ───────────────────────────
  c8: {
    'Cadenas tróficas': {
      minutes: 8,
      intro: 'Las cadenas tróficas describen quién se come a quién: el flujo de energía a través del ecosistema.',
      sections: [
        { heading: 'Niveles', text: 'Productores (plantas y algas convierten el sol en energía), consumidores primarios (herbívoros), secundarios (carnívoros) y descomponedores (hongos y bacterias cierran el ciclo).' },
        { heading: 'Redes, no cadenas', text: 'En la realidad las relaciones son redes: un depredador come varias presas y una presa tiene varios depredadores. La pérdida de una especie puede colapsar toda la red.' },
      ],
      tip: 'Se pierde cerca del 90% de la energía en cada salto de nivel trófico: por eso hay más plantas que leones.',
      activity: 'Dibuja una red trófica de tu región incluyendo un animal de tu distrito.',
    },
    'Nichos ecológicos': {
      minutes: 7,
      intro: 'El nicho es el "oficio" de una especie: cómo obtiene alimento, cuándo está activa y qué papel juega.',
      sections: [
        { heading: 'Hábitat vs nicho', text: 'El hábitat es la dirección (dónde vive); el nicho es el oficio (cómo se gana la vida). Dos especies no pueden ocupar exactamente el mismo nicho indefinidamente: una desplaza a la otra.' },
        { heading: 'Nicho y ecosistema', text: 'Cuando una especie desaparece, su nicho queda vacante y el ecosistema se desestabiliza. Las especies "clave" (como los polinizadores) sostienen a muchísimas otras.' },
      ],
      tip: 'Los murciélagos polinizan más de 300 frutas comerciales, incluyendo el mango y la guayaba.',
      activity: 'Elige un animal común de tu zona y describe su nicho completo.',
    },
    'Sucesión ecológica': {
      minutes: 8,
      intro: 'Los ecosistemas no son estáticos: se regeneran en secuencias predecibles llamadas sucesión ecológica.',
      sections: [
        { heading: 'Primaria y secundaria', text: 'Sucesión primaria: colonizar terreno desnudo (lava, roca). Secundaria: recuperar un área perturbada (un campo abandonado, un bosque quemado). La secundaria es más rápida porque queda suelo.' },
        { heading: 'Etapas', text: 'Empieza con líquenes y pastos, sigue con arbustos y árboles pioneros, hasta una comunidad clímax estable. En los trópicos, la sucesión puede verse en décadas; en climas fríos, en siglos.' },
      ],
      tip: 'Después de un incendio forestal, la regeneración natural suele ser más efectiva que reforestar con especies exóticas.',
      activity: 'Observa un terreno abandonado cercano e identifica en qué etapa de sucesión está.',
    },
    'Áreas protegidas': {
      minutes: 8,
      intro: 'Las áreas naturales protegidas son la principal herramienta de conservación a gran escala.',
      sections: [
        { heading: 'Categorías', text: 'Parques nacionales, reservas naturales, santuarios históricos, reservas comunales y zonas reservadas. Cada categoría equilibra protección estricta con uso sostenible.' },
        { heading: 'Efectividad', text: 'Estudios globales muestran que las áreas protegidas bien gestionadas reducen la deforestación y mantienen poblaciones estables, pero el 30% de las áreas críticas del planeta sigue sin protección.' },
      ],
      tip: 'El acuerdo Kunming-Montreal (2022) busca proteger el 30% de la Tierra para 2030.',
      activity: 'Ubica en un mapa las áreas protegidas de tu país y visita una virtualmente.',
    },
    'Conservación ex-situ': {
      minutes: 8,
      intro: 'Cuando un hábitat ya no puede sostener a una especie, los zoológicos, bancos de semillas y laboratorios se vuelven refugios.',
      sections: [
        { heading: 'Herramientas', text: 'Bancos de germoplasma y semillas, reproducción en cautiverio, bancos de ADN y criopreservación. El Banco de Semillas del Milenio (Inglaterra) conserva más de 2 mil millones de semillas.' },
        { heading: 'El objetivo final', text: 'La conservación ex-situ debe servir para la reintroducción: devolver especies sanas a hábitats restaurados. Sin hábitat protegido, el cautiverio es solo un parche.' },
      ],
      tip: 'El cóndor andino ha sido reintroducido con éxito en varios países usando cría en cautiverio.',
      activity: 'Investiga un banco de semillas de tu país y cómo puedes contribuir.',
    },
    'Corredores biológicos': {
      minutes: 8,
      intro: 'Los corredores biológicos conectan parches de hábitat aislados, permitiendo que las especies se muevan.',
      sections: [
        { heading: 'Por qué conectan', text: 'La fragmentación por carreteras y ciudades aísla poblaciones, reduce la diversidad genética y eleva el riesgo de extinción local. Los corredores (franjas de vegetación, pasos de fauna) reconectan.' },
        { heading: 'Pasos de fauna', text: 'Los ecoductos (puentes verdes sobre carreteras) y pasos inferiores reducen hasta 90% los atropellos de fauna y restauran rutas migratorias.' },
      ],
      tip: 'El jaguar necesita corredores de cientos de kilómetros: el Corredor Biológico Mesoamericano es uno de los más importantes del mundo.',
      activity: 'Identifica una carretera que fragmenta un ecosistema en tu zona y qué fauna afecta.',
    },
    'Bioindicadores': {
      minutes: 8,
      intro: 'Algunas especies nos avisan de la salud de un ecosistema: son los bioindicadores.',
      sections: [
        { heading: 'Ejemplos', text: 'Las macroinvertebrados en ríos (las "moscas de piedra" solo viven en agua limpia), los líquenes (solo crecen en aire puro) y las ranas (piel sensible a contaminantes) son indicadores clásicos.' },
        { heading: 'Cómo usarlos', text: 'El índice de integridad biótica combina la cantidad y tipo de especies presentes: más especies sensibles = mejor salud del ecosistema. Es más barato y confiable que solo medir químicos.' },
      ],
      tip: 'La ausencia de anfibios en un humedal que antes los tenía es una alarma temprana de contaminación.',
      activity: 'Investiga qué bioindicadores usan los científicos en los ríos de tu región.',
    },
    'Tecnología de monitoreo': {
      minutes: 8,
      intro: 'La tecnología revolucionó la conservación: ahora monitoreamos especies sin perturbarlas.',
      sections: [
        { heading: 'Herramientas', text: 'Cámaras trampa, drones con cámaras térmicas, collares GPS y análisis de ADN ambiental (ADNe): el ADN que las especies dejan en agua y suelo permite detectarlas sin verlas.' },
        { heading: 'Ciencia ciudadana', text: 'Apps como iNaturalist y eBird permiten que millones de personas registren avistamientos que alimentan bases de datos científicas globales.' },
      ],
      tip: 'Con ADNe, basta un litro de agua de un río para saber qué peces, anfibios y mamíferos lo habitan.',
      activity: 'Instala una app de ciencia ciudadana y registra tu primer avistamiento de fauna.',
    },
    'Ciencia ciudadana': {
      minutes: 7,
      intro: 'La ciencia ciudadana convierte a la comunidad en investigadores: más ojos, más datos, más protección.',
      sections: [
        { heading: 'Proyectos', text: 'Conteos de aves, monitoreo de mariposas, reportes de ballenas, medición de calidad de agua. Cada reporte ciudadano es un dato que los científicos usan para decisiones de conservación.' },
        { heading: 'Tu rol', text: 'Reportar especies invasoras, participar en censos y compartir avistamientos con fotos y geolocalización. Tu ojo de vecino conoce mejor que nadie el territorio.' },
      ],
      tip: 'En tu comunidad puedes organizar un "bioblitz": un censo relámpago de biodiversidad de 24 horas.',
      activity: 'Elige un proyecto de ciencia ciudadana activo en tu país y comprométete a aportar 3 registros este mes.',
    },
  },

  // ─── c9: Cambio Climático: Ciencia y Acción ────────────────────
  c9: {
    'Efecto invernadero': {
      minutes: 9,
      intro: 'El efecto invernadero es un proceso natural que mantiene al planeta habitable. El problema es que lo estamos intensificando.',
      sections: [
        { heading: 'Cómo funciona', text: 'Los gases de efecto invernadero (GEI) — CO₂, metano, óxido nitroso, vapor de agua — dejan pasar la luz solar pero retienen el calor que la Tierra reemite. Sin ellos, la temperatura promedio sería de -18°C en vez de +15°C.' },
        { heading: 'El desequilibrio', text: 'Desde la revolución industrial, quemamos carbón, petróleo y gas que liberan a la atmósfera el CO₂ que estuvo atrapado millones de años. El CO₂ pasó de 280 a más de 420 partes por millón: el nivel más alto en 800.000 años.' },
      ],
      tip: 'El CO₂ emitido hoy permanecerá en la atmósfera entre 300 y 1.000 años.',
      activity: 'Investiga el gráfico de "Curva de Keeling" (CO₂ atmosférico) y observa la tendencia.',
    },
    'Ciclos del carbono': {
      minutes: 9,
      intro: 'El carbono circula permanentemente entre la atmósfera, los océanos, el suelo y los seres vivos.',
      sections: [
        { heading: 'El ciclo lento', text: 'El carbono queda atrapado millones de años en rocas, carbón y petróleo. Al quemarlos, completamos en minutos un ciclo que tardaba eras geológicas.' },
        { heading: 'El ciclo rápido', text: 'Las plantas absorben CO₂ por fotosíntesis, los océanos disuelven carbono y la respiración lo devuelve. Los océanos absorben el 30% del CO₂ humano, pero al acidificarse amenazan a los corales y el plancton.' },
      ],
      tip: 'La acidificación oceánica ya redujo en un 30% la capacidad de los corales para calcificar su esqueleto.',
      activity: 'Dibuja el ciclo del carbono con 4 reservorios y las flechas que los conectan.',
    },
    'Retroalimentaciones': {
      minutes: 8,
      intro: 'Las retroalimentaciones son efectos que amplifican o moderan el calentamiento.',
      sections: [
        { heading: 'Amplificadores', text: 'El deshielo del Ártico: menos hielo blanco = más superficie oscura que absorbe más calor = más deshielo. El permafrost, al derretirse, libera metano que calienta más el planeta. Son retroalimentaciones positivas peligrosas.' },
        { heading: 'Moderadores', text: 'Los océanos absorben calor y CO₂, y los bosques crecen con más CO₂ (efecto fertilización). Pero sus límites ya se están alcanzando.' },
      ],
      tip: 'El punto de no retorno: más allá de ~1,5-2°C, algunas retroalimentaciones (Amazonía, Groenlandia) podrían hacerse irreversibles.',
      activity: 'Identifica una retroalimentación local (ej. incendios que generan más sequía) en tu región.',
    },
    'Modelos GCM': {
      minutes: 9,
      intro: 'Los Modelos de Circulación General (GCM) simulan el clima futuro del planeta entero.',
      sections: [
        { heading: 'Cómo trabajan', text: 'Dividen el planeta en millones de celdas y resuelven ecuaciones de física de atmósfera, océanos, hielo y suelo. Usan supercomputadoras y se validan contra el clima pasado antes de proyectar el futuro.' },
        { heading: 'Qué pueden y no pueden', text: 'Predicen tendencias a décadas (temperatura, lluvias, nivel del mar), pero no el clima de un día concreto ni eventos puntuales. Por eso hablamos de escenarios, no de certezas.' },
      ],
      tip: 'Los GCM proyectan hasta 4-5°C de calentamiento a fin de siglo si seguimos con emisiones altas.',
      activity: 'Explora el Climate Atlas (World Bank) y compara tu ciudad bajo dos escenarios de emisiones.',
    },
    'Escenarios IPCC': {
      minutes: 8,
      intro: 'El IPCC construye escenarios según nuestras decisiones de emisiones: cada camino lleva a un futuro distinto.',
      sections: [
        { heading: 'SSP (Shared Socioeconomic Pathways)', text: 'SSP1-1.9 y SSP2-1.6: rutas de emisiones netas cero y calentamiento de 1,5-1,8°C. SSP3-7.0 y SSP5-8.5: rutas altas con 3-5°C de calentamiento. La diferencia entre rutas es la diferencia entre la vida que conocemos y otra muy distinta.' },
        { heading: 'Cuál se está cumpliendo', text: 'Las políticas actuales nos dirigen a unos 2,7-3°C. Aún hay tiempo, pero cada año de inacción reduce las opciones.' },
      ],
      tip: 'Cada 0,1°C de calentamiento evita eventos extremos adicionales: la meta de 1,5°C es cuestión de vidas concretas.',
      activity: 'Compara los escenarios SSP1 y SSP8.5 para tu región en precipitación y temperatura.',
    },
    'Proyecciones regionales': {
      minutes: 8,
      intro: 'El cambio climático no se reparte por igual: algunas regiones se calientan el doble que el promedio.',
      sections: [
        { heading: 'América Latina', text: 'Los Andes tropicales perderán hasta el 80% de sus glaciares, el Caribe sufre huracanes más intensos y la Amazonía se acerca a un punto de "sabanización". La costa del Pacífico enfrenta más eventos El Niño extremos.' },
        { heading: 'Qué esperar', text: 'Más olas de calor, lluvias intensas e inundaciones, sequías agrícolas y subida del nivel del mar que amenaza las ciudades costeras. Los más vulnerables son quienes menos contribuyeron a la crisis.' },
      ],
      tip: 'En la región, el cambio climático ya se traduce en inseguridad alimentaria y migración climática.',
      activity: 'Busca proyecciones climáticas específicas para tu ciudad o distrito.',
    },
    'Mitigación': {
      minutes: 9,
      intro: 'La mitigación busca reducir las emisiones y atacar la causa del problema.',
      sections: [
        { heading: 'El camino a cero neto', text: 'Descarbonizar la energía (solar, eólica), electrificar el transporte, eficiencia energética, frenar la deforestación y cambiar la dieta son las palancas principales. "Cero neto 2050" es la meta global.' },
        { heading: 'Tu papel', text: 'Reducir el desperdicio de alimentos, consumir menos carne, usar transporte limpio, ahorrar energía y exigir a gobiernos y empresas acciones concretas. La acción personal importa, pero la sistémica es decisiva.' },
      ],
      tip: 'Las dietas con menos carne y lácteos pueden reducir la huella alimentaria hasta en un 70%.',
      activity: 'Calcula tu huella de carbono y comprométete con 2 reducciones concretas este mes.',
    },
    'Adaptación': {
      minutes: 8,
      intro: 'La adaptación nos prepara para los impactos que ya son inevitables.',
      sections: [
        { heading: 'Medidas', text: 'Infraestructura resistente (malecones, drenajes), sistemas de alerta temprana, cultivos tolerantes a sequía, techos verdes y protección de manglares como barreras naturales contra huracanes.' },
        { heading: 'Adaptación basada en ecosistemas', text: 'Restaurar manglares, humedales y bosques protege comunidades y biodiversidad a la vez: es más barato y más efectivo que construir sola infraestructura gris.' },
      ],
      tip: 'Los manglares reducen la altura de las olas hasta en un 66% y su protección vale miles de millones.',
      activity: 'Identifica una medida de adaptación que tu ciudad debería priorizar y por qué.',
    },
    'Políticas climáticas': {
      minutes: 8,
      intro: 'Las políticas climáticas convierten la ciencia en reglas: presupuestos de carbono, mercados y compromisos internacionales.',
      sections: [
        { heading: 'Instrumentos', text: 'Impuestos al carbono, mercados de emisiones (ETS), estándares de eficiencia, metas de renovables y prohibiciones (ej. autos de combustión en 2035 en la UE). El Acuerdo de París exige NDCs (contribuciones nacionales) cada 5 años.' },
        { heading: 'Justicia climática', text: 'Los países ricos, responsables de la mayoría de emisiones históricas, comprometieron financiamiento para la transición de los países vulnerables. El cumplimiento sigue siendo el gran pendiente.' },
      ],
      tip: 'Un precio de $50 por tonelada de CO₂ reduciría las emisiones globales entre un 10% y un 20%.',
      activity: 'Investiga qué NDC ha comprometido tu país y evalúa si va en camino de cumplirla.',
    },
  },
};

export function getLessonContent(courseId: string, lessonTitle: string): LessonContent | null {
  const courseContent = COURSE_LESSON_CONTENT[courseId];
  if (!courseContent) return null;
  const lesson = courseContent[lessonTitle];
  return lesson || null;
}

export function getLessonMinutes(courseId: string, lessonTitle: string): number {
  return getLessonContent(courseId, lessonTitle)?.minutes ?? 5;
}
