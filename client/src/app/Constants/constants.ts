// Buttons in sidebar
export const BACKGROUND_GAINSBORO = { backgroundColor: 'gainsboro' };
export const BACKGROUND_WHITE = { backgroundColor: 'white' };
export const BACKGROUND_DARKGREY = { backgroundColor: 'DimGray' };

// Button inputs;
export const NEW_DRAWING_EVENT = 'o';
export const CAROUSEL_SHORTCUT = 'g';
export const CRAYON_SHORTCUT = 'c';
export const LINE_SHORTCUT = 'l';
export const RECTANGLE_SHORTCUT = '1';
export const ELLIPSIS_SHORTCUT = '2';
export const AEROSOL_SHORTCUT = 'a';
export const SHIFT_SHORTCUT = 'Shift';
export const ESCAPE_SHORTCUT = 'Escape';
export const BACKSPACE_SHORTCUT = 'Backspace';
export const EXPORT_SHORTCUT = 'e';
export const RECTANGLE_SELECTION_SHORTCUT = 'r';
export const CANVAS_SELECTION_EVENT = 'a';
export const CANVAS_SAVE_SHORTCUT = 's';
export const UNDO_SHORTCUT = 'z';
export const REDO_SHORTCUT = 'Z';
// Variables d'editor
export const CONSTANTE_AGRANDISSEMENT_TRAVAIL = 1.1;

// Variables pour parcourir le RGBA
export const ROUGE = 0;
export const VERT = 1;
export const BLEU = 2;
export const OPACITE = 3;
export const PIXEL_SIZE = 4;
export const WHITE = 255;

// Color
export const MAX_OPACITY = 100;
export const LINE_WIDTH_PALETTE = 5;
export const LINE_HEIGTH_PALETTE = 10;
export const GRADIENT_LEVEL_1 = 0.17;
export const GRADIENT_LEVEL_2 = 0.34;
export const GRADIENT_LEVEL_3 = 0.51;
export const GRADIENT_LEVEL_4 = 0.68;
export const GRADIENT_LEVEL_5 = 0.81;
export const DEFAULT_COLOR = 'rgba(0,0,0,1)';
export const PRIMARY_COLOR = 'Primary';
export const SECONDARY_COLOR = 'Secondary';
export const MAX_SIZE_RECENT_COLORS = 10;
export const MAX_RGB_VALUE = 255;
export const RGB_STRING_VALUE_POSITION = 5;

// Mouse event enum
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
// Server response
export class Metadata {
    codeID: string;
    name: string;
    tags: string[];
}
// Constante affichage éditeur et canvas
export const CORRECTION_CONTROL_MARGIN = 2.5;
export const CANVAS_SIZE_MIN = 250;
export const SIDEBAR_WIDTH = 470;
export const CANVAS_MAX_VW_MULTIPLIER = 0.95;
export const CANVAS_MAX_VH_MULTIPLIER = 0.95;

// Constante pour test
export const TEST_MAT_SLIDER_VALUE = 12;

// Constante pour timer
export const MILS_TO_SEC = 1000;

// constante pour outil sélection
export const N_PIXELS_DEPLACEMENT = 3;
export const LINE_DASH = 10;
export const HANDLERS_POSITION = 5;
export const CURRENT_SELECTION_POSITION = 4;
export const TIMEOUT_MS = 500;
export const INTERVAL_MS = 100;

// Position des 8 handlers (sens horaire à partir du coin sup gauche)
export const TOP_LEFT_HANDLER = 0; // coin haut gauche
export const TOP_HANDLER = 1; // centre haut
export const TOP_RIGHT_HANDLER = 2; // coin haut droite
export const RIGHT_HANDLER = 3; // centre droite
export const BOTTOM_RIGHT_HANDLER = 4; // coin bas droite
export const BOTTOM_HANDLER = 5; // centre bas
export const BOTTOM_LEFT_HANDLER = 6; // coin bas gauche
export const LEFT_HANDLER = 7; // centre gauche
