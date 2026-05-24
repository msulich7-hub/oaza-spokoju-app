/**
 * Project context — generowany z karty technicznej (źródło prawdy)
 */
import { buildPlotData, buildProjectContext } from "./karta-techniczna";

export const projectContext = buildProjectContext();

/** Domyślnie: powiększona bryła 14,0 × 10,84 m */
export const plotData = buildPlotData(true);
