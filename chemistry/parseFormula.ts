import type { ElementComposition, ParsedFormula } from "@/chemistry/types";
import { elementsBySymbol } from "@/data/elements";

export class FormulaParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaParseError";
  }
}

export function parseFormula(formula: string): ParsedFormula {
  const normalizedFormula = formula.replace(/\s+/g, "");

  if (!normalizedFormula) {
    throw new FormulaParseError("La fórmula no puede estar vacía.");
  }

  const composition: ElementComposition = {};
  const hydrateParts = normalizedFormula.split(/[·.]/u);

  for (const part of hydrateParts) {
    if (!part) {
      throw new FormulaParseError(
        "El separador de hidrato debe unir dos fórmulas.",
      );
    }

    const { multiplier, formulaPart } = readLeadingMultiplier(part);
    const partComposition = parseFormulaPart(formulaPart);

    for (const [symbol, count] of Object.entries(partComposition)) {
      composition[symbol] = (composition[symbol] ?? 0) + count * multiplier;
    }
  }

  return { originalFormula: formula, composition };
}

function readLeadingMultiplier(part: string): {
  multiplier: number;
  formulaPart: string;
} {
  const match = /^(\d+)(.*)$/u.exec(part);

  if (!match) {
    return { multiplier: 1, formulaPart: part };
  }

  const multiplier = Number(match[1]);
  if (multiplier < 1) {
    throw new FormulaParseError("Los multiplicadores deben ser positivos.");
  }

  return { multiplier, formulaPart: match[2] };
}

function parseFormulaPart(formulaPart: string): ElementComposition {
  let position = 0;
  const composition = parseGroup();

  if (position !== formulaPart.length) {
    throw new FormulaParseError(
      `No se pudo interpretar "${formulaPart.slice(position)}".`,
    );
  }

  return composition;

  function parseGroup(): ElementComposition {
    const group: ElementComposition = {};

    while (position < formulaPart.length && formulaPart[position] !== ")") {
      if (formulaPart[position] === "(") {
        position += 1;
        const nested = parseGroup();

        if (formulaPart[position] !== ")") {
          throw new FormulaParseError("Falta cerrar un paréntesis.");
        }
        position += 1;

        const multiplier = readCount();
        addComposition(group, nested, multiplier);
        continue;
      }

      const symbol = readElementSymbol();
      const count = readCount();
      group[symbol] = (group[symbol] ?? 0) + count;
    }

    return group;
  }

  function readElementSymbol(): string {
    const firstCharacter = formulaPart[position];
    if (!firstCharacter || !/[A-Z]/u.test(firstCharacter)) {
      throw new FormulaParseError(
        `Símbolo inválido cerca de "${formulaPart.slice(position)}".`,
      );
    }

    position += 1;
    const secondCharacter = formulaPart[position];
    if (secondCharacter && /[a-z]/u.test(secondCharacter)) {
      position += 1;
    }

    const symbol = formulaPart.slice(
      position - (secondCharacter && /[a-z]/u.test(secondCharacter) ? 2 : 1),
      position,
    );
    if (!elementsBySymbol.has(symbol)) {
      throw new FormulaParseError(
        `El símbolo "${symbol}" no existe en la tabla periódica.`,
      );
    }

    return symbol;
  }

  function readCount(): number {
    const start = position;
    while (position < formulaPart.length && /\d/u.test(formulaPart[position])) {
      position += 1;
    }

    if (start === position) {
      return 1;
    }

    const count = Number(formulaPart.slice(start, position));
    if (count < 1) {
      throw new FormulaParseError("Los subíndices deben ser positivos.");
    }
    return count;
  }
}

function addComposition(
  target: ElementComposition,
  source: ElementComposition,
  multiplier: number,
): void {
  for (const [symbol, count] of Object.entries(source)) {
    target[symbol] = (target[symbol] ?? 0) + count * multiplier;
  }
}
