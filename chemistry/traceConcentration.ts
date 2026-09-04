import { parsePositiveNumber } from "@/chemistry/conversions";
import {
    gramsToMass,
    massToGrams,
    type MassUnit,
} from "@/chemistry/traceConversions";

export type TraceUnit = "ppm" | "ppb";
export type TraceMode = "mass-mass" | "dilute-aqueous";
export type TraceMassUnit = "g" | "kg";
export type TraceVolumeUnit = "mL" | "L";

export type TraceConcentrationResult = {
  component: string;
  concentration: number;
  unit: TraceUnit;
  mode: TraceMode;
  finalAmount: number;
  finalUnit: TraceMassUnit | TraceVolumeUnit;
  finalAmountBase: number;
  componentMassGrams: number;
  componentMass: { grams: number; milligrams: number; micrograms: number };
  calculation: string;
  approximation: boolean;
  warning?: string;
};

export type TraceConcentrationError = { error: string };

export function calculateMassMassTrace(
  componentInput: string,
  concentrationInput: string,
  finalMassInput: string,
  finalUnit: TraceMassUnit,
  unit: TraceUnit,
): TraceConcentrationResult | TraceConcentrationError {
  const component = componentInput.trim();
  if (!component)
    return { error: "Escribí el nombre o fórmula del componente." };
  const concentration = parsePositiveNumber(concentrationInput);
  if (concentration === null)
    return { error: "Ingresá una concentración mayor que cero." };
  const finalMass = parsePositiveNumber(finalMassInput);
  if (finalMass === null)
    return { error: "Ingresá una masa final mayor que cero." };

  const finalMassKg = massToGrams(finalMass, finalUnit) / 1000;
  const factor = unit === "ppm" ? 1 : 0.001;
  const componentMilligrams = concentration * factor * finalMassKg;
  const componentMassGrams = componentMilligrams / 1000;
  const componentMass = gramsToMass(componentMassGrams);
  const componentUnit: MassUnit = unit === "ppm" ? "mg" : "µg";
  const componentValue =
    unit === "ppm" ? componentMass.milligrams : componentMass.micrograms;

  return {
    component,
    concentration,
    unit,
    mode: "mass-mass",
    finalAmount: finalMass,
    finalUnit,
    finalAmountBase: finalMassKg,
    componentMassGrams,
    componentMass,
    calculation: `${formatNumber(concentration)} ${unit} = ${formatNumber(concentration)} ${componentUnit}/kg × ${formatNumber(finalMassKg)} kg = ${formatNumber(componentValue)} ${componentUnit}`,
    approximation: false,
  };
}

export function calculateDiluteAqueousTrace(
  componentInput: string,
  concentrationInput: string,
  finalVolumeInput: string,
  finalUnit: TraceVolumeUnit,
  unit: TraceUnit,
): TraceConcentrationResult | TraceConcentrationError {
  const component = componentInput.trim();
  if (!component)
    return { error: "Escribí el nombre o fórmula del componente." };
  const concentration = parsePositiveNumber(concentrationInput);
  if (concentration === null)
    return { error: "Ingresá una concentración mayor que cero." };
  const finalVolume = parsePositiveNumber(finalVolumeInput);
  if (finalVolume === null)
    return { error: "Ingresá un volumen final mayor que cero." };

  const finalVolumeLiters =
    finalUnit === "mL" ? finalVolume / 1000 : finalVolume;
  const concentrationMilligramsPerLiter =
    unit === "ppm" ? concentration : concentration * 0.001;
  const componentMilligrams =
    concentrationMilligramsPerLiter * finalVolumeLiters;
  const componentMassGrams = componentMilligrams / 1000;
  const componentMass = gramsToMass(componentMassGrams);
  const componentUnit: MassUnit = unit === "ppm" ? "mg" : "µg";
  const componentValue =
    unit === "ppm" ? componentMass.milligrams : componentMass.micrograms;

  return {
    component,
    concentration,
    unit,
    mode: "dilute-aqueous",
    finalAmount: finalVolume,
    finalUnit,
    finalAmountBase: finalVolumeLiters,
    componentMassGrams,
    componentMass,
    calculation: `${formatNumber(concentration)} ${componentUnit}/L × ${formatNumber(finalVolumeLiters)} L ≈ ${formatNumber(componentValue)} ${componentUnit}`,
    approximation: true,
    warning:
      "Esta equivalencia es una aproximación válida principalmente para soluciones acuosas diluidas con densidad cercana a 1 kg/L.",
  };
}

function formatNumber(value: number): string {
  return value
    .toFixed(6)
    .replace(/\.?(0+)$/u, "")
    .replace(".", ",");
}
