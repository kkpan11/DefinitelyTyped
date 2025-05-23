import { Xyz50 } from "../xyz50/types.js";
import { Xyz65 } from "./types.js";

declare function convertXyz65ToXyz50(color: Omit<Xyz65, "mode">): Xyz50;

export default convertXyz65ToXyz50;
