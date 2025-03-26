import { useState } from "react";
import "./App.css";

// Función para generar las conversiones
const generateConversionTable = (start: number, end: number, step: number) => {
  let table = [];
  for (let i = start; i <= end; i += step) {
    const fraction = i;
    const millimeters = fraction * 25.4;
    const feet = fraction / 12;
    table.push({
      fraction,
      millimeters,
      feet,
    });
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
    return { inches, millimeters, feet };
  };

  const { inches, millimeters, feet } = convertValue(value, unit);

  // Estado para la tabla dinámica (inicio, fin, incremento)
  const [start, setStart] = useState<number>(1); // Valor de inicio
  const [end, setEnd] = useState<number>(64); // Valor de fin
  const [step, setStep] = useState<number>(0.1); // Valor del incremento, por defecto 0.1

  // Generar la tabla de conversiones dinámicas
  const conversionTable = generateConversionTable(start, end, step);

  return (
    <div>
      <h1>Conversor de Unidades y Tabla de Conversiones</h1>

      {/* Conversor de unidades */}
      <div className="card">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          placeholder="Ingrese valor"
        />
        <select
          value={unit}
          onChange={(e) =>
            setUnit(e.target.value as "inches" | "millimeters" | "feet")
          } // Aseguramos que el valor es válido
        >
          <option value="inches">Pulgadas</option>
          <option value="millimeters">Milímetros</option>
          <option value="feet">Pies</option>
        </select>
      </div>

      {/* Tabla de conversiones del conversor */}
      <table>
        <thead>
          <tr>
            <th>Pulgadas</th>
            <th>Milímetros</th>
            <th>Pies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{inches.toFixed(2)}</td>
            <td>{millimeters.toFixed(2)}</td>
            <td>{feet.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabla dinámica de conversiones (1/64 de pulgada a 1) */}
      <h2>Tabla de Conversiones (1/64 hasta 1 pulgada)</h2>
      <div className="card">
        <div>
          <label htmlFor="start">Desde (Pulgadas): </label>
          <input
            id="start"
            type="number"
            step="any" // Permite números decimales
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            placeholder="Inicio"
          />
        </div>
        <div>
          <label htmlFor="end">Hasta (Pulgadas): </label>
          <input
            id="end"
            type="number"
            step="any" // Permite números decimales
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
            placeholder="Fin"
          />
        </div>
        <div>
          <label htmlFor="step">Incremento (Pulgadas): </label>
          <input
            id="step"
            type="number"
            step="any" // Permite números decimales
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            placeholder="Incremento"
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fracción en Pulgadas</th>
            <th>Milímetros</th>
            <th>Pies</th>
          </tr>
        </thead>
        <tbody>
          {conversionTable.map((row, index) => (
            <tr key={index}>
              <td>{row.fraction.toFixed(3)}</td>
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
