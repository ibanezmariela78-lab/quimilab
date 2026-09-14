# QuimiLab EDU

QuimiLab EDU es una aplicación educativa de química orientada a estudiantes de nivel secundario y docentes. Integra cálculo químico, preparación de laboratorio, consulta de sustancias y materiales, tabla periódica e informes finales en PDF dentro de una misma herramienta.

## Objetivo

El proyecto busca acompañar el aprendizaje de química con una herramienta clara, guiada y científicamente consistente. La aplicación no se limita a resolver cálculos: también ayuda a interpretar qué se está preparando, qué materiales conviene utilizar, qué precauciones deben considerarse y cómo documentar la experiencia de laboratorio.

## Funcionalidades principales

### Preparación de laboratorio

Permite trabajar con distintos tipos de preparación y concentración:

- Molaridad
- Molalidad
- Normalidad
- Formalidad
- Porcentaje masa/masa
- Porcentaje masa/volumen
- Porcentaje volumen/volumen
- Fracción molar
- ppm y ppb
- Diluciones
- Preparaciones a partir de reactivos comerciales
- Sistemas sólido + líquido
- Sistemas sólido + sólido
- Sustancias viscosas o semisólidas

La aplicación calcula cantidades, identifica materiales necesarios, muestra resultados teóricos y genera orientaciones compatibles con criterios de laboratorio escolar.

### Calculadora química

Incluye herramientas para:

- Masa molar
- Molaridad
- Molalidad
- Normalidad
- Formalidad
- Porcentajes
- Fracción molar
- Concentraciones traza
- Diluciones
- Reactivos comerciales
- Conversión de concentraciones

### Tabla periódica

Incluye los 118 elementos y permite buscar por:

- Nombre
- Símbolo
- Número atómico

Cada elemento cuenta con una ficha individual con información básica para consulta educativa.

### Sustancias y materiales

La aplicación incorpora una biblioteca de sustancias y una biblioteca de materiales de laboratorio.

En sustancias se puede consultar información como:

- Fórmula
- Propiedades
- Solubilidad
- Comportamiento frente a la temperatura
- Observaciones de seguridad

En materiales se informa:

- Para qué sirve cada instrumento
- Cuándo se utiliza
- Cuándo no conviene utilizarlo
- Nivel de precisión
- Estados físicos asociados
- Ejemplos de uso
- Recomendaciones de seguridad

### Informe final de laboratorio

QuimiLab EDU permite generar un informe final combinando:

- Datos ingresados por el estudiante
- Objetivo
- Fundamentación
- Resultado experimental
- Observaciones
- Conclusión
- Sustancias utilizadas
- Cálculos
- Resultado teórico
- Materiales
- Procedimiento
- Seguridad

El informe puede guardarse como borrador y luego generarse y compartirse en formato PDF.

## Criterios científicos incorporados

El proyecto fue diseñado respetando criterios importantes de química experimental, entre ellos:

- El volumen final de una solución no se interpreta automáticamente como volumen de agua agregada.
- En porcentaje m/m se trabaja con la masa total de la mezcla.
- En porcentaje v/v no se asume aditividad ideal de volúmenes.
- La normalidad depende de la reacción y del factor de equivalencia.
- Los reactivos comerciales concentrados requieren considerar concentración y densidad.
- Las sustancias viscosas o semisólidas pueden requerir estrategias basadas en masa o densidad.
- Un sólido en agua no se clasifica automáticamente como solución.
- Sistemas inmiscibles no se presentan automáticamente como emulsiones.
- Cuando la información química no es suficiente, la aplicación evita inventar propiedades o comportamientos.

## Seguridad

QuimiLab EDU tiene un enfoque educativo.

Las sustancias o procedimientos que pueden implicar riesgo se presentan de manera teórica y con advertencias. La aplicación no reemplaza la supervisión docente, las normas institucionales ni los protocolos de seguridad de laboratorio.

## Tecnologías utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- expo-print
- expo-sharing
- expo-file-system

## Estructura general

```text
app/
components/
chemistry/
data/
hooks/
```

La aplicación utiliza rutas independientes para cada módulo y componentes reutilizables para los cálculos y las preparaciones.

## Instalación

Requisitos:

- Node.js
- npm
- Expo

Clonar el repositorio:

```bash
git clone https://github.com/ibanezmariela78-lab/quimilab.git
cd quimilab
npm install
```

Iniciar el proyecto:

```bash
npx expo start
```

Si la red local presenta problemas de conexión:

```bash
npx expo start --tunnel
```

## Validación del proyecto

El proyecto se valida con:

```bash
npx tsc --noEmit
npx eslint app chemistry components data hooks
npx expo-doctor
git diff --check
```

Estado de la última revisión técnica:

- TypeScript sin errores
- ESLint sin errores
- Expo Doctor: 21/21 checks passed
- Árbol de trabajo Git limpio

## Estado del proyecto

QuimiLab EDU se encuentra en una etapa funcional avanzada, con los módulos principales integrados y revisados.

El proyecto continúa abierto a mejoras de experiencia de usuario, ampliación de sustancias, nuevos contenidos educativos y distribución como aplicación instalable.

## Repositorio

GitHub: https://github.com/ibanezmariela78-lab/quimilab

---

Autora: Mariela Ibañez  
Teléfono: +54 11 4058-2174  
GitHub: https://github.com/ibanezmariela78-lab  
LinkedIn: https://ar.linkedin.com/in/mariela-ibanez-quimioinformatica
