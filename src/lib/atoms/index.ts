/**
 * SHARED · lib/atoms — every atom's props (Zod) and description, for the catalog.
 * The React side of each atom lives in components/atoms/.
 */
import { ITEM_ATOMS } from "./items";
import { TEXT_ATOMS } from "./text";

export const ATOMS = { ...TEXT_ATOMS, ...ITEM_ATOMS };
export const ATOM_TYPES = Object.keys(ATOMS);
