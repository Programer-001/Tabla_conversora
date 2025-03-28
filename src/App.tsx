import { useState, useEffect } from "react";
import "./App.css";

//devuelve fracciones
const toFraction = (decimal: number): string => {
  if (decimal === 0) return "0";

  const tolerance = 1.0e-6;
  let numerator = decimal;
  let denominator = 1;

  while (Math.abs(numerator - Math.round(numerator)) > tolerance) {
    numerator *= 10;
    denominator *= 10;
  }

  numerator = Math.round(numerator);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  let intPart = Math.floor(numerator / denominator);
  let fracPart = numerator % denominator;

  if (fracPart === 0) return `${intPart}`;
  if (intPart === 0) return `${fracPart}/${denominator}`;
  return `${intPart} ${fracPart}/${denominator}`;
};
// Función para generar las conversiones
const generateConversionTable = (start: number, end: number, step: number) => {
  let table = [];
  let count = 0;
  const maxRows = 500;

  for (let i = start; i <= end && count < maxRows; i += step) {
    const fraction = i;
    const millimeters = fraction * 25.4;
    const feet = fraction / 12;
    const fractionString = toFraction(fraction);
    table.push({
      fraction,
      fractionString,
      millimeters,
      feet,
    });
    count++;
  }

  return table;
};

function App() {
  // Usar un tipo explícito para asegurarse de que `unit` no sea `undefined`
  const [value, setValue] = useState<number>(0); // Valor ingresado
  const [unit, setUnit] = useState<"inches" | "millimeters" | "feet">("inches"); // Unidad seleccionada

  // Generar la tabla de conversiones
  const convertValue = (
    value: number,
    unit: "inches" | "millimeters" | "feet"
  ) => {
    let inches, millimeters, feet;
    if (unit === "inches") {
      inches = value;
      millimeters = value * 25.4;
      feet = value / 12;
    } else if (unit === "millimeters") {
      inches = value / 25.4;
      millimeters = value;
      feet = value / 304.8;
    } else if (unit === "feet") {
      inches = value * 12;
      millimeters = value * 304.8;
      feet = value;
    }
    return {
      inches,
      inchesFraction: toFraction(inches ?? 0),
      millimeters,
      feet,
    };
  };

  const { inches, inchesFraction, millimeters, feet } = convertValue(
    value,
    unit
  );

  // Estado para la tabla dinámica (inicio, fin, incremento)
  const [start, setStart] = useState<number>(0); // Valor de inicio
  const [end, setEnd] = useState<number>(1); // Valor de fin
  const [step, setStep] = useState<number>(0.015625); // Valor del incremento, por defecto 0.1

  // Estado para la tabla de conversiones (tabla dinámica)
  const [conversionTable, setConversionTable] = useState<any[]>([]);

  // Limitar el número de filas de la tabla para evitar el congelamiento
  useEffect(() => {
    if (step > 0) {
      const table = generateConversionTable(start, end, step);
      setConversionTable(table);
    }
  }, [start, end, step]);

  return (
    <div>
      <h1>Convertidor de unidades</h1>

      {/* Conversor de unidades */}
      <div className="card">
        <div className="Entradas">
          <input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Ingrese valor"
          />
          <select
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value as "inches" | "millimeters" | "feet")
            }
          >
            <option value="inches">Pulgadas</option>
            <option value="millimeters">Milímetros</option>
            <option value="feet">Pies</option>
          </select>
        </div>
      </div>

      {/* Tabla de conversiones del conversor */}
      <table>
        <thead>
          <tr>
            <th>Pulgadas</th>
            <th>Fracción</th>
            <th>Milímetros</th>
            <th>Pies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{(inches ?? 0).toFixed(2)}</td>
            <td>{inchesFraction}</td>
            <td>{(millimeters ?? 0).toFixed(2)}</td>
            <td>{(feet ?? 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabla dinámica de conversiones (1/64 de pulgada a 1) */}
      <h2>Tabla de Conversiones</h2>
      <div className="card">
        <div className="Entradas">
          <label htmlFor="start">Desde (Pulgadas): </label>
          <input
            id="start"
            type="number"
            step="any" // Permite números decimales
            inputMode="decimal"
            pattern="[0-9]*"
            onChange={(e) => setStart(Number(e.target.value))}
            placeholder="Inicio"
          />
        </div>
        <div className="Entradas">
          <label htmlFor="end">Hasta (Pulgadas): </label>
          <input
            id="end"
            type="number"
            step="any" // Permite números decimales
            inputMode="decimal"
            pattern="[0-9]*"
            onChange={(e) => setEnd(Number(e.target.value))}
            placeholder="Fin"
          />
        </div>
        <div className="Entradas">
          <label htmlFor="step">Incremento (Pulgadas): </label>
          <input
            id="step"
            type="number"
            step="any" // Permite números decimales
            inputMode="decimal"
            pattern="[0-9]*"
            onChange={(e) => setStep(Number(e.target.value))}
            placeholder="Incremento"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Decimal en Pulgadas</th>
            <th>Fracción en Pulgadas</th>
            <th>Milímetros</th>
            <th>Pies</th>
          </tr>
        </thead>
        <tbody>
          {conversionTable.map((row, index) => (
            <tr key={index}>
              <td>{row.fraction.toFixed(3)}</td>
              <td>{row.fractionString}</td>
              <td>{row.millimeters.toFixed(3)}</td>
              <td>{row.feet.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
