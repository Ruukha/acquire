require("dotenv").config();

const KUNNA_URL = process.env.KUNNA_URL;
const ALIAS = process.env.ALIAS;

/**
 * Llama a Kunna con un rango [timeStart, timeEnd]
 * y devuelve el objeto { columns, values }.
 */
async function fetchKunna(timeStart, timeEnd) {
    const url = KUNNA_URL;

    const headers = {
        "Content-Type": "application/json"
    };

    const body = {
        // Definimos si son más de las 23, predecimos mañana, sino predecimos hoy
        // Buscar target date
        // Time_end = target date -1
        // Time_start =  time_end – 3
        time_start: timeStart.toISOString(),
        time_end: timeEnd.toISOString(),
        filters: [
            { filter: "name", values: ["1d"] },
            { filter: "alias", values: [ALIAS] }
        ],
        limit: 100,
        count: false,
        order: "DESC"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`KUNNA_BAD_STATUS:${response.status}`);
    }

    const json = await response.json();
    const result = json.result;

    if (!result || !Array.isArray(result.columns) || !Array.isArray(result.values)) {
        throw new Error("KUNNA_INVALID_RESULT");
    }

    return result; // { columns, values }
}
