import React, { useState, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { evaluate } from "mathjs";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

const Spreadsheet = () => {
  const [data, setData] = useState([
    ["", "A", "B", "C"],
    ["1", "", "", ""],
    ["2", "", "", ""],
  ]);

  const tableRef = useRef(null);

  // Function to evaluate mathematical formulas
  const evaluateFormula = (formula) => {
    try {
      return evaluate(formula.replace("=", ""));
    } catch (error) {
      return "ERROR";
    }
  };

  // Function to remove duplicate rows
  const removeDuplicates = (data) => {
    return Array.from(new Set(data.map((row) => row.join(",")))).map((row) =>
      row.split(",")
    );
  };

  // Function for text formatting (UPPERCASE, LOWERCASE, TRIM)
  const formatText = (text, type) => {
    if (type === "UPPER") return text.toUpperCase();
    if (type === "LOWER") return text.toLowerCase();
    if (type === "TRIM") return text.trim();
    return text;
  };

  // Function to add a new row
  const addRow = () => {
    setData([...data, Array(data[0].length).fill("")]);
  };

  // Function to add a new column
  const addColumn = () => {
    setData(data.map((row) => [...row, ""]));
  };

  return (
    <div>
      <h2>Google Sheets Clone</h2>
      <div className="toolbar">
        <button
          onClick={() => {
            setData(removeDuplicates(data));
            toast.success("Duplicates removed!");
          }}
        >
          Remove Duplicates
        </button>
        <button
          onClick={() => {
            const newData = data.map((row) =>
              row.map((cell) => formatText(cell, "UPPER"))
            );
            setData(newData);
            toast.success("Converted to UPPERCASE!");
          }}
        >
          UPPERCASE
        </button>
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
      </div>
      <Handsontable
        ref={tableRef}
        data={data}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={true}
        manualColumnResize={true}
        manualRowResize={true}
        afterChange={(changes, source) => {
          if (changes) {
            const newData = [...data];
            changes.forEach(([row, col, oldVal, newVal]) => {
              if (newVal.startsWith("=")) {
                newData[row][col] = evaluateFormula(newVal);
              } else {
                newData[row][col] = newVal;
              }
            });
            setData(newData);
          }
        }}
      />
      <Toaster />
    </div>
  );
};

export default Spreadsheet;
