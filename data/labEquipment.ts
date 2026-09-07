export type EquipmentPrecision = "Baja" | "Intermedia" | "Alta" | "No aplica";

export type PhysicalState =
  | "Sólido"
  | "Líquido"
  | "Líquido viscoso"
  | "Semisólido"
  | "Gas";

export type LabEquipment = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  usos: string[];
  noRecomendadoPara: string[];
  precision: EquipmentPrecision;
  estadosFisicos: PhysicalState[];
  ejemplo: string;
  porqueUsarlo: string;
  seguridad?: string;
  requiereSupervision?: boolean;
};

export const labEquipment: LabEquipment[] = [
  {
    id: "balance",
    nombre: "Balanza",
    categoria: "Medición de masa",
    descripcion:
      "Instrumento utilizado para determinar la masa de una sustancia.",
    usos: [
      "Pesar sólidos",
      "Pesar sustancias viscosas",
      "Pesar materiales semisólidos",
      "Determinar masas de reactivos",
    ],
    noRecomendadoPara: ["Medir volumen"],
    precision: "Alta",
    estadosFisicos: ["Sólido", "Líquido viscoso", "Semisólido"],
    ejemplo: "Pesar una cantidad determinada de una sustancia.",
    porqueUsarlo:
      "Porque permite conocer con precisión la masa de sólidos, líquidos viscosos y materiales semisólidos.",
  },

  {
    id: "spatula",
    nombre: "Espátula",
    categoria: "Transferencia",
    descripcion:
      "Herramienta utilizada para tomar, transferir o incorporar pequeñas cantidades de sustancias sólidas, semisólidas o viscosas.",
    usos: [
      "Transferir sólidos",
      "Manipular semisólidos",
      "Transferir materiales viscosos",
      "Tomar reactivos en polvo",
    ],
    noRecomendadoPara: ["Medir masa", "Medir volumen"],
    precision: "No aplica",
    estadosFisicos: ["Sólido", "Líquido viscoso", "Semisólido"],
    ejemplo:
      "Transferir una sustancia desde su recipiente hasta el recipiente de pesada o de mezcla.",
    porqueUsarlo:
      "Porque permite transferir sólidos, semisólidos y materiales viscosos de forma controlada y sin contacto directo.",
  },

  {
    id: "watch-glass",
    nombre: "Vidrio reloj",
    categoria: "Contención y mezcla",
    descripcion:
      "Lámina de vidrio cóncava utilizada para contener pequeñas cantidades de sustancias.",
    usos: [
      "Pesar sólidos",
      "Cubrir recipientes",
      "Evaporar pequeñas cantidades",
    ],
    noRecomendadoPara: ["Medir volúmenes con precisión"],
    precision: "No aplica",
    estadosFisicos: ["Sólido", "Líquido"],
    ejemplo: "Colocar un sólido sobre el vidrio reloj antes de pesarlo.",
    porqueUsarlo:
      "Porque facilita el pesado y la manipulación de pequeñas cantidades.",
  },

  {
    id: "beaker",
    nombre: "Vaso de precipitados",
    categoria: "Contención y mezcla",
    descripcion:
      "Recipiente utilizado para contener, mezclar y realizar preparaciones de distintas consistencias.",
    usos: [
      "Mezclar",
      "Disolver",
      "Contener líquidos",
      "Homogeneizar preparaciones viscosas",
    ],
    noRecomendadoPara: ["Medir volúmenes con alta precisión"],
    precision: "Baja",
    estadosFisicos: ["Líquido", "Sólido", "Líquido viscoso", "Semisólido"],
    ejemplo: "Contener y mezclar los componentes de una preparación.",
    porqueUsarlo:
      "Porque permite contener, incorporar y mezclar cómodamente los componentes de una preparación.",
  },

  {
    id: "graduated-cylinder",
    nombre: "Probeta",
    categoria: "Material volumétrico",
    descripcion:
      "Recipiente graduado utilizado para medir volúmenes de líquidos.",
    usos: ["Medir volúmenes aproximados o intermedios"],
    noRecomendadoPara: [
      "Preparar un volumen final de máxima precisión",
      "Medir líquidos muy viscosos cuando su escurrimiento impida una lectura adecuada",
    ],
    precision: "Intermedia",
    estadosFisicos: ["Líquido"],
    ejemplo: "Medir aproximadamente 100 mL de agua.",
    porqueUsarlo:
      "Porque mide volúmenes con mayor precisión que un vaso de precipitados.",
  },

  {
    id: "volumetric-flask",
    nombre: "Matraz aforado",
    categoria: "Material volumétrico",
    descripcion:
      "Recipiente calibrado para contener un volumen final determinado con alta precisión.",
    usos: ["Preparar soluciones", "Realizar diluciones"],
    noRecomendadoPara: [
      "Calentar directamente",
      "Medir distintos volúmenes",
      "Preparaciones viscosas que no permitan un ajuste volumétrico confiable",
    ],
    precision: "Alta",
    estadosFisicos: ["Líquido"],
    ejemplo: "Preparar exactamente 500 mL de una solución.",
    porqueUsarlo:
      "Porque permite alcanzar un volumen final determinado con alta precisión.",
  },

  {
    id: "erlenmeyer",
    nombre: "Matraz Erlenmeyer",
    categoria: "Contención y mezcla",
    descripcion:
      "Recipiente cónico utilizado para mezclar líquidos y realizar determinadas reacciones.",
    usos: ["Mezclar", "Agitar", "Realizar titulaciones"],
    noRecomendadoPara: ["Medir volúmenes finales con alta precisión"],
    precision: "Baja",
    estadosFisicos: ["Líquido"],
    ejemplo: "Recibir una solución durante una titulación.",
    porqueUsarlo:
      "Porque su forma permite agitar líquidos reduciendo el riesgo de derrames.",
  },

  {
    id: "graduated-pipette",
    nombre: "Pipeta graduada",
    categoria: "Material volumétrico",
    descripcion:
      "Instrumento graduado utilizado para medir y transferir diferentes volúmenes de líquidos.",
    usos: ["Medir líquidos", "Transferir líquidos"],
    noRecomendadoPara: [
      "Aspirar líquidos con la boca",
      "Líquidos cuya elevada viscosidad impida un escurrimiento adecuado",
    ],
    precision: "Alta",
    estadosFisicos: ["Líquido"],
    ejemplo: "Transferir 7,5 mL de una solución.",
    porqueUsarlo:
      "Porque permite medir y transferir volúmenes con buena precisión.",
  },

  {
    id: "volumetric-pipette",
    nombre: "Pipeta volumétrica",
    categoria: "Material volumétrico",
    descripcion:
      "Instrumento diseñado para transferir un único volumen con alta precisión.",
    usos: ["Diluciones", "Transferencias volumétricas precisas"],
    noRecomendadoPara: [
      "Medir diferentes volúmenes",
      "Líquidos muy viscosos que no permitan una transferencia volumétrica confiable",
    ],
    precision: "Alta",
    estadosFisicos: ["Líquido"],
    ejemplo: "Transferir exactamente 10 mL de una solución madre.",
    porqueUsarlo:
      "Porque está calibrada para transferir un volumen específico con alta precisión.",
  },

  {
    id: "pipette-filler",
    nombre: "Propipeta",
    categoria: "Transferencia",
    descripcion:
      "Dispositivo utilizado para aspirar líquidos con una pipeta de forma segura.",
    usos: ["Utilizar pipetas"],
    noRecomendadoPara: ["Usarse como instrumento de medición por sí sola"],
    precision: "No aplica",
    estadosFisicos: ["Líquido"],
    ejemplo: "Aspirar una solución mediante una pipeta sin utilizar la boca.",
    porqueUsarlo: "Porque permite utilizar pipetas de forma más segura.",
    seguridad: "Nunca se debe pipetear con la boca.",
  },

  {
    id: "burette",
    nombre: "Bureta",
    categoria: "Material volumétrico",
    descripcion:
      "Tubo graduado que permite dispensar volúmenes controlados de líquido.",
    usos: ["Titulaciones", "Dosificación controlada"],
    noRecomendadoPara: ["Preparar directamente un volumen final"],
    precision: "Alta",
    estadosFisicos: ["Líquido"],
    ejemplo: "Agregar titulante lentamente durante una valoración.",
    porqueUsarlo: "Porque permite controlar con precisión el volumen agregado.",
  },

  {
    id: "glass-rod",
    nombre: "Varilla de vidrio",
    categoria: "Contención y mezcla",
    descripcion:
      "Varilla utilizada para mezclar líquidos, favorecer la homogeneización y ayudar en determinadas transferencias.",
    usos: [
      "Mezclar",
      "Homogeneizar líquidos",
      "Mezclar preparaciones viscosas de consistencia adecuada",
      "Ayudar en el trasvase",
    ],
    noRecomendadoPara: ["Medir cantidades"],
    precision: "No aplica",
    estadosFisicos: ["Líquido", "Sólido", "Líquido viscoso"],
    ejemplo:
      "Mezclar una preparación hasta lograr una distribución uniforme de sus componentes.",
    porqueUsarlo:
      "Porque permite homogeneizar manualmente soluciones, mezclas líquidas y determinadas preparaciones viscosas.",
  },

  {
    id: "funnel",
    nombre: "Embudo",
    categoria: "Transferencia",
    descripcion:
      "Instrumento utilizado para facilitar el trasvase o la filtración.",
    usos: ["Transferir líquidos", "Filtrar con papel de filtro"],
    noRecomendadoPara: [
      "Medir volumen",
      "Transferir materiales muy viscosos si pueden quedar retenidos en el embudo",
    ],
    precision: "No aplica",
    estadosFisicos: ["Líquido", "Sólido"],
    ejemplo: "Transferir una solución hacia un matraz aforado.",
    porqueUsarlo:
      "Porque reduce pérdidas durante el trasvase cuando la fluidez de la preparación lo permite.",
  },

  {
    id: "filter-paper",
    nombre: "Papel de filtro",
    categoria: "Filtración",
    descripcion:
      "Material poroso utilizado para separar sólidos suspendidos de líquidos.",
    usos: ["Filtración"],
    noRecomendadoPara: ["Separar sustancias disueltas"],
    precision: "No aplica",
    estadosFisicos: ["Sólido", "Líquido"],
    ejemplo: "Separar un precipitado de una fase líquida.",
    porqueUsarlo:
      "Porque permite retener partículas sólidas mientras el líquido atraviesa el papel.",
  },

  {
    id: "wash-bottle",
    nombre: "Piseta",
    categoria: "Transferencia",
    descripcion:
      "Frasco utilizado para dispensar pequeñas cantidades de agua destilada u otros líquidos apropiados.",
    usos: ["Enjuagar material", "Agregar agua destilada"],
    noRecomendadoPara: ["Medir volúmenes precisos"],
    precision: "No aplica",
    estadosFisicos: ["Líquido"],
    ejemplo: "Enjuagar un vaso y transferir los lavados a un matraz.",
    porqueUsarlo:
      "Porque permite agregar o dirigir pequeñas cantidades de líquido de forma controlada, por ejemplo agua destilada para enjuagar material o completar una preparación.",
  },

  {
    id: "mortar-pestle",
    nombre: "Mortero y pilón",
    categoria: "Trituración y homogeneización",
    descripcion:
      "Conjunto utilizado para triturar, pulverizar y homogeneizar sustancias sólidas y determinadas preparaciones semisólidas.",
    usos: [
      "Triturar sólidos",
      "Homogeneizar mezclas sólidas",
      "Favorecer la incorporación de componentes en determinadas preparaciones semisólidas",
    ],
    noRecomendadoPara: ["Medir masa o volumen"],
    precision: "No aplica",
    estadosFisicos: ["Sólido", "Semisólido"],
    ejemplo:
      "Homogeneizar componentes sólidos o una preparación semisólida cuando el método lo requiera.",
    porqueUsarlo:
      "Porque facilita la reducción del tamaño de partícula y la homogeneización de sólidos o determinadas preparaciones semisólidas.",
  },

  {
    id: "test-tube",
    nombre: "Tubo de ensayo",
    categoria: "Contención y mezcla",
    descripcion:
      "Recipiente pequeño utilizado para realizar ensayos con cantidades reducidas.",
    usos: ["Reacciones a pequeña escala", "Observaciones cualitativas"],
    noRecomendadoPara: ["Medir volumen con precisión"],
    precision: "Baja",
    estadosFisicos: ["Líquido", "Sólido"],
    ejemplo: "Observar una reacción química a pequeña escala.",
    porqueUsarlo:
      "Porque permite trabajar con cantidades pequeñas de reactivos.",
  },

  {
    id: "test-tube-rack",
    nombre: "Gradilla",
    categoria: "Soporte",
    descripcion:
      "Soporte utilizado para mantener tubos de ensayo en posición vertical.",
    usos: ["Sostener tubos de ensayo"],
    noRecomendadoPara: ["Calentar directamente"],
    precision: "No aplica",
    estadosFisicos: [],
    ejemplo: "Mantener varios tubos ordenados durante una experiencia.",
    porqueUsarlo: "Porque mantiene los tubos estables y organizados.",
  },

  {
    id: "thermometer",
    nombre: "Termómetro",
    categoria: "Medición de temperatura",
    descripcion: "Instrumento utilizado para medir la temperatura.",
    usos: ["Controlar temperatura", "Registrar cambios térmicos"],
    noRecomendadoPara: ["Medir masa o volumen"],
    precision: "Intermedia",
    estadosFisicos: ["Líquido", "Semisólido"],
    ejemplo: "Controlar si una preparación aumenta su temperatura.",
    porqueUsarlo:
      "Porque permite observar cuantitativamente cambios de temperatura.",
  },

  {
    id: "porcelain-dish",
    nombre: "Cápsula de porcelana",
    categoria: "Calentamiento",
    descripcion:
      "Recipiente resistente al calor utilizado para evaporaciones y calentamientos.",
    usos: ["Evaporar líquidos", "Calentar determinadas sustancias"],
    noRecomendadoPara: ["Medir volumen"],
    precision: "No aplica",
    estadosFisicos: ["Líquido", "Sólido"],
    ejemplo: "Evaporar una pequeña cantidad de solvente.",
    porqueUsarlo: "Porque resiste temperaturas elevadas.",
    requiereSupervision: true,
  },

  {
    id: "crucible",
    nombre: "Crisol",
    categoria: "Calentamiento",
    descripcion: "Recipiente resistente a temperaturas muy elevadas.",
    usos: ["Calentar sólidos a alta temperatura"],
    noRecomendadoPara: ["Uso autónomo por estudiantes"],
    precision: "No aplica",
    estadosFisicos: ["Sólido"],
    ejemplo: "Realizar un calentamiento controlado de una muestra sólida.",
    porqueUsarlo: "Porque soporta temperaturas elevadas.",
    requiereSupervision: true,
  },

  {
    id: "laboratory-tongs",
    nombre: "Pinza de laboratorio",
    categoria: "Soporte",
    descripcion: "Herramienta utilizada para sujetar material o recipientes.",
    usos: ["Sujetar recipientes", "Manipular material"],
    noRecomendadoPara: ["Medir cantidades"],
    precision: "No aplica",
    estadosFisicos: [],
    ejemplo: "Sujetar un recipiente durante una experiencia.",
    porqueUsarlo: "Porque permite manipular material sin contacto directo.",
  },

  {
    id: "retort-stand",
    nombre: "Soporte universal",
    categoria: "Soporte",
    descripcion:
      "Estructura utilizada para sostener diferentes instrumentos mediante pinzas y aros.",
    usos: ["Sostener buretas", "Montar equipos"],
    noRecomendadoPara: ["Medir sustancias"],
    precision: "No aplica",
    estadosFisicos: [],
    ejemplo: "Sostener una bureta durante una titulación.",
    porqueUsarlo:
      "Porque permite montar equipos de laboratorio de forma estable.",
  },

  {
    id: "tripod",
    nombre: "Trípode",
    categoria: "Soporte",
    descripcion: "Soporte utilizado en montajes de calentamiento.",
    usos: ["Sostener recipientes durante calentamiento"],
    noRecomendadoPara: ["Uso sin supervisión"],
    precision: "No aplica",
    estadosFisicos: [],
    ejemplo: "Sostener un recipiente durante un calentamiento controlado.",
    porqueUsarlo:
      "Porque permite mantener estable el recipiente durante el calentamiento.",
    requiereSupervision: true,
  },

  {
    id: "magnetic-stirrer",
    nombre: "Agitador magnético",
    categoria: "Contención y mezcla",
    descripcion:
      "Equipo utilizado para mezclar líquidos mediante una barra magnética.",
    usos: ["Homogeneizar soluciones", "Mantener agitación constante"],
    noRecomendadoPara: [
      "Triturar sólidos",
      "Preparaciones demasiado viscosas para permitir el giro adecuado de la barra",
    ],
    precision: "No aplica",
    estadosFisicos: ["Líquido"],
    ejemplo: "Mantener una solución en agitación continua.",
    porqueUsarlo:
      "Porque permite mezclar de manera uniforme sin agitación manual continua.",
  },

  {
    id: "stir-bar",
    nombre: "Barra magnética",
    categoria: "Contención y mezcla",
    descripcion:
      "Pequeña barra que gira dentro de un líquido accionada por un agitador magnético.",
    usos: ["Agitación de líquidos"],
    noRecomendadoPara: [
      "Usarse sin agitador magnético",
      "Preparaciones cuya viscosidad impida su giro",
    ],
    precision: "No aplica",
    estadosFisicos: ["Líquido"],
    ejemplo: "Homogeneizar una solución dentro de un vaso.",
    porqueUsarlo:
      "Porque transmite el movimiento del agitador magnético al líquido.",
  },

  {
    id: "micropipette",
    nombre: "Micropipeta",
    categoria: "Dosificación",
    descripcion:
      "Instrumento utilizado para medir y transferir volúmenes muy pequeños.",
    usos: ["Medir microlitros", "Transferencias pequeñas"],
    noRecomendadoPara: [
      "Volúmenes fuera de su rango",
      "Materiales cuya viscosidad impida una aspiración y dispensación adecuadas",
    ],
    precision: "Alta",
    estadosFisicos: ["Líquido"],
    ejemplo: "Transferir un pequeño volumen en el rango de microlitros.",
    porqueUsarlo:
      "Porque permite trabajar con volúmenes muy pequeños con buena precisión.",
  },

  {
    id: "weighing-container",
    nombre: "Recipiente para pesada",
    categoria: "Medición de masa",
    descripcion:
      "Recipiente utilizado para contener una sustancia durante su pesada.",
    usos: [
      "Pesar sólidos",
      "Pesar sustancias viscosas",
      "Pesar materiales semisólidos",
    ],
    noRecomendadoPara: ["Medir volumen"],
    precision: "No aplica",
    estadosFisicos: ["Sólido", "Líquido viscoso", "Semisólido"],
    ejemplo:
      "Pesar una cantidad determinada de un reactivo sólido, viscoso o semisólido.",
    porqueUsarlo:
      "Porque evita colocar directamente la sustancia sobre la balanza y facilita su manipulación durante la pesada.",
  },

  {
    id: "desiccator",
    nombre: "Desecador",
    categoria: "Almacenamiento",
    descripcion:
      "Recipiente utilizado para mantener sustancias protegidas de la humedad.",
    usos: ["Secar", "Conservar muestras sensibles a humedad"],
    noRecomendadoPara: ["Medir masa o volumen"],
    precision: "No aplica",
    estadosFisicos: ["Sólido"],
    ejemplo: "Conservar una muestra seca antes de pesarla.",
    porqueUsarlo:
      "Porque ayuda a evitar que una sustancia absorba humedad del ambiente.",
  },

  {
    id: "rinse-bottle",
    nombre: "Frasco lavador",
    categoria: "Transferencia",
    descripcion:
      "Recipiente utilizado para dirigir un chorro de líquido de lavado.",
    usos: ["Lavar material", "Realizar enjuagues"],
    noRecomendadoPara: ["Medir volumen con precisión"],
    precision: "No aplica",
    estadosFisicos: ["Líquido"],
    ejemplo: "Enjuagar las paredes de un recipiente con agua destilada.",
    porqueUsarlo:
      "Porque permite controlar la dirección del líquido durante el lavado.",
  },
];
