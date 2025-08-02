import * as XLSX from "xlsx";
import { promises as fs } from "fs";

/**
 * Converts an XLSX file to JSON format
 *
 * @param filePath - Path to the XLSX file
 * @param sheetName - Optional name of the sheet to convert (converts first sheet if not specified)
 * @param options - Optional configuration options
 * @returns Promise resolving to the JSON data
 */
export async function xlsxToJson<T = any>(
  fileBuffer: string,
  sheetName?: string,
  options: {
    dateNF?: string; // Date format string
    header?: number | string[]; // Row index for the header or custom headers
    range?: string | number; // Range of cells to read
    raw?: boolean; // Whether to return raw values
  } = {}
): Promise<T[]> {
  try {
    // Read the file

    // Parse the workbook
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Get the sheet name (use provided name or first sheet)
    const sheet = sheetName || workbook.SheetNames[0];

    // Ensure the sheet exists
    if (!workbook.SheetNames.includes(sheet)) {
      throw new Error(`Sheet "${sheet}" not found in workbook`);
    }

    // Convert to JSON
    const worksheet = workbook.Sheets[sheet];
    const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, options);

    return jsonData;
  } catch (error) {
    console.error("Error converting XLSX to JSON:", error);
    throw error;
  }
}

/**
 * Converts multiple sheets from an XLSX file to JSON format
 *
 * @param filePath - Path to the XLSX file
 * @param options - Optional configuration options
 * @returns Promise resolving to an object with sheet names as keys and JSON data as values
 */
export async function xlsxSheetsToJson<T = any>(
  filePath: string,
  options: {
    dateNF?: string;
    header?: number | string[];
    range?: string | number;
    raw?: boolean;
  } = {}
): Promise<Record<string, T[]>> {
  try {
    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Parse the workbook
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Convert each sheet to JSON
    const result: Record<string, T[]> = {};

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json<T>(worksheet, options);
    }

    return result;
  } catch (error) {
    console.error("Error converting XLSX sheets to JSON:", error);
    throw error;
  }
}
