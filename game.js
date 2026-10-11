// SISTEMA DE USUARIO AUTOMÁTICO
let usuarioActual = "Entrenador";
let idUsuarioActual = localStorage.getItem('pokeGachaIdUsuario') || null;
let amigosLista = [];
let amigoSeleccionadoIntercambio = null;

// VARIABLES DE JUEGO
let monedas = 500;
let inventario = [];
let pokedexDescubiertos = [];
let logrosReclamados = [];
let misionesReclamadas = [];
let tirandoGacha = false;
let seleccionadosFusion = [];

let maquinaActual = 'normal';
let costoActual = 100;

let stats = {
    tiradasTotales: 0,
    shiniesTotales: 0,
    gastadosTotales: 0,
    ganadosTotales: 0,
    victoriasTotales: 0,
    fusionesTotales: 0,
    tiradasHoy: 0,
    casinoHoy: 0,
    victoriasHoy: 0,
    torreHoy: 0,
    fusionesHoy: 0
};

// ESTADO DE COMBATE & TORRE
let pokemonLuchador = null;
let pokemonLuchadorTorre = null;
let pokemonRival = null;
let hpJugadorActual = 0, hpJugadorMax = 0;
let hpRivalActual = 0, hpRivalMax = 0;

let pisoTorreActual = 1;
let liderTorreActual = null;
let hpLiderTorreActual = 0, hpLiderTorreMax = 0;
let hpJugadorTorreActual = 0, hpJugadorTorreMax = 0;

const CODIGOS_VALIDOS = {
    "071011": { recompensa: 20000, tipo: "monedas", descripcion: "20.000 Pokedólares" },
    "UNOVA2026": { recompensa: 10000, tipo: "monedas", descripcion: "10.000 Pokedólares de bienvenida a Gen 5" }
};

// POKÉDEX HASTA GEN 5 (649 POKÉMON)
const POKEDEX_TOTAL = Array.from({ length: 649 }, (_, i) => i + 1);

// LEGENDARIOS GEN 1 A 5
const POOL_LEGENDARIOS = [
    144, 145, 146, 150, 151,
    243, 244, 245, 249, 250, 251,
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649
];

// ÉPICOS GEN 1 A 5
const POOL_EPICOS = [
    3, 6, 9, 12, 15, 18, 31, 34, 59, 62, 65, 68, 71, 76, 94, 103, 115, 130, 131, 134, 135, 136, 139, 141, 142, 143, 149,
    154, 157, 160, 169, 178, 181, 182, 186, 196, 197, 199, 208, 212, 214, 217, 227, 229, 230, 232, 242, 248,
    254, 257, 260, 267, 269, 282, 289, 292, 295, 306, 310, 319, 321, 330, 334, 344, 346, 348, 350, 356, 359, 362, 365, 368, 373, 376,
    389, 392, 395, 398, 405, 407, 411, 413, 419, 429, 430, 435, 437, 445, 448, 450, 452, 454, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479,
    497, 500, 503, 521, 526, 530, 534, 537, 542, 545, 547, 553, 555, 560, 563, 565, 567, 571, 576, 579, 584, 589, 604, 609, 612, 614, 621, 623, 625, 628, 630, 635, 637
];

// RAROS GEN 1 A 5
const POOL_RAROS = [
    2, 5, 8, 11, 14, 17, 22, 24, 26, 28, 30, 33, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 58, 61, 64, 67, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 97, 99, 101, 105, 107, 109, 110, 112, 117, 119, 121, 123, 125, 126, 127, 128, 138, 140,
    153, 156, 159, 162, 164, 166, 171, 176, 180, 184, 185, 190, 192, 195, 202, 203, 205, 207, 210, 211, 213, 215, 219, 221, 224, 226, 233, 234, 237, 241,
    253, 256, 259, 262, 264, 271, 272, 274, 275, 277, 279, 281, 284, 286, 288, 291, 294, 297, 299, 301, 303, 305, 308, 317, 323, 326, 329, 332, 335, 338, 340, 342, 354, 358, 361, 364, 367, 372, 375,
    388, 391, 394, 397, 400, 402, 404, 409, 416, 418, 421, 423, 426, 428, 432, 434, 436, 439, 441, 444, 447, 449, 457, 459,
    496, 499, 502, 505, 507, 508, 510, 512, 514, 516, 518, 520, 523, 525, 528, 533, 536, 539, 541, 544, 549, 552, 558, 562, 566, 569, 573, 575, 578, 581, 583, 586, 588, 591, 593, 596, 598, 601, 603, 606, 608, 611, 617, 619, 627, 629, 634
];

const POOL_COMUNES = POKEDEX_TOTAL.filter(id => !POOL_LEGENDARIOS.includes(id) && !POOL_EPICOS.includes(id) && !POOL_RAROS.includes(id));

// MAPA DE EVOLUCIONES HASTA GEN 5
const MAPA_EVOLUCIONES = {
    1: { nivel: 5, target: 2 }, 2: { nivel: 10, target: 3 }, 4: { nivel: 5, target: 5 }, 5: { nivel: 10, target: 6 }, 7: { nivel: 5, target: 8 }, 8: { nivel: 10, target: 9 }, 10: { nivel: 3, target: 11 }, 11: { nivel: 6, target: 12 }, 13: { nivel: 3, target: 14 }, 14: { nivel: 6, target: 15 }, 16: { nivel: 4, target: 17 }, 17: { nivel: 8, target: 18 }, 19: { nivel: 5, target: 20 }, 21: { nivel: 5, target: 22 }, 23: { nivel: 5, target: 24 }, 25: { nivel: 6, target: 26 }, 27: { nivel: 5, target: 28 }, 29: { nivel: 4, target: 30 }, 30: { nivel: 8, target: 31 }, 32: { nivel: 4, target: 33 }, 33: { nivel: 8, target: 34 }, 41: { nivel: 5, target: 42 }, 43: { nivel: 5, target: 44 }, 46: { nivel: 5, target: 47 }, 48: { nivel: 5, target: 49 }, 52: { nivel: 5, target: 53 }, 54: { nivel: 5, target: 55 }, 56: { nivel: 5, target: 57 }, 60: { nivel: 4, target: 61 }, 63: { nivel: 4, target: 64 }, 66: { nivel: 4, target: 67 }, 69: { nivel: 4, target: 70 }, 72: { nivel: 5, target: 73 }, 74: { nivel: 4, target: 75 }, 77: { nivel: 6, target: 78 }, 79: { nivel: 6, target: 80 }, 81: { nivel: 5, target: 82 }, 84: { nivel: 5, target: 85 }, 86: { nivel: 5, target: 87 }, 88: { nivel: 5, target: 89 }, 90: { nivel: 5, target: 91 }, 92: { nivel: 4, target: 93 }, 96: { nivel: 5, target: 97 }, 98: { nivel: 5, target: 99 }, 100: { nivel: 5, target: 101 }, 104: { nivel: 5, target: 105 }, 109: { nivel: 5, target: 110 }, 111: { nivel: 6, target: 112 }, 116: { nivel: 5, target: 117 }, 118: { nivel: 5, target: 119 }, 120: { nivel: 5, target: 121 }, 129: { nivel: 5, target: 130 }, 133: { nivel: 6, target: 134 }, 138: { nivel: 6, target: 139 }, 140: { nivel: 6, target: 141 }, 147: { nivel: 6, target: 148 }, 148: { nivel: 12, target: 149 },
    152: { nivel: 5, target: 153 }, 153: { nivel: 10, target: 154 }, 155: { nivel: 5, target: 156 }, 156: { nivel: 10, target: 157 }, 158: { nivel: 5, target: 159 }, 159: { nivel: 10, target: 160 }, 161: { nivel: 4, target: 162 }, 163: { nivel: 4, target: 164 }, 165: { nivel: 4, target: 166 }, 167: { nivel: 4, target: 168 }, 170: { nivel: 5, target: 171 }, 172: { nivel: 3, target: 25 }, 175: { nivel: 4, target: 176 }, 177: { nivel: 5, target: 178 }, 179: { nivel: 4, target: 180 }, 180: { nivel: 8, target: 181 }, 183: { nivel: 4, target: 184 }, 187: { nivel: 4, target: 188 }, 188: { nivel: 8, target: 189 }, 194: { nivel: 4, target: 195 }, 216: { nivel: 6, target: 217 }, 218: { nivel: 5, target: 219 }, 220: { nivel: 5, target: 221 }, 223: { nivel: 5, target: 224 }, 228: { nivel: 5, target: 229 }, 231: { nivel: 5, target: 232 }, 246: { nivel: 6, target: 247 }, 247: { nivel: 12, target: 248 },
    252: { nivel: 5, target: 253 }, 253: { nivel: 10, target: 254 }, 255: { nivel: 5, target: 256 }, 256: { nivel: 10, target: 257 }, 258: { nivel: 5, target: 259 }, 259: { nivel: 10, target: 260 }, 261: { nivel: 4, target: 262 }, 263: { nivel: 4, target: 264 }, 265: { nivel: 3, target: 266 }, 266: { nivel: 6, target: 267 }, 268: { nivel: 6, target: 269 }, 270: { nivel: 4, target: 271 }, 271: { nivel: 8, target: 272 }, 273: { nivel: 4, target: 274 }, 274: { nivel: 8, target: 275 }, 276: { nivel: 4, target: 277 }, 278: { nivel: 5, target: 279 }, 280: { nivel: 5, target: 281 }, 281: { nivel: 10, target: 282 }, 283: { nivel: 4, target: 284 }, 285: { nivel: 5, target: 286 }, 287: { nivel: 5, target: 288 }, 288: { nivel: 10, target: 289 }, 290: { nivel: 5, target: 291 }, 293: { nivel: 4, target: 294 }, 294: { nivel: 8, target: 295 }, 296: { nivel: 5, target: 297 }, 298: { nivel: 3, target: 183 }, 304: { nivel: 5, target: 305 }, 305: { nivel: 10, target: 306 }, 307: { nivel: 6, target: 308 }, 309: { nivel: 5, target: 310 }, 316: { nivel: 5, target: 317 }, 318: { nivel: 5, target: 319 }, 320: { nivel: 8, target: 321 }, 322: { nivel: 6, target: 323 }, 325: { nivel: 6, target: 326 }, 328: { nivel: 6, target: 329 }, 329: { nivel: 10, target: 330 }, 331: { nivel: 6, target: 332 }, 333: { nivel: 6, target: 334 }, 339: { nivel: 6, target: 340 }, 341: { nivel: 6, target: 342 }, 343: { nivel: 6, target: 344 }, 345: { nivel: 8, target: 346 }, 347: { nivel: 8, target: 348 }, 349: { nivel: 5, target: 350 }, 353: { nivel: 6, target: 354 }, 355: { nivel: 6, target: 356 }, 360: { nivel: 4, target: 202 }, 361: { nivel: 8, target: 362 }, 363: { nivel: 6, target: 364 }, 364: { nivel: 10, target: 365 }, 371: { nivel: 6, target: 372 }, 372: { nivel: 12, target: 373 }, 374: { nivel: 6, target: 375 }, 375: { nivel: 12, target: 376 },
    387: { nivel: 5, target: 388 }, 388: { nivel: 10, target: 389 }, 390: { nivel: 5, target: 391 }, 391: { nivel: 10, target: 392 }, 393: { nivel: 5, target: 394 }, 394: { nivel: 10, target: 395 }, 396: { nivel: 4, target: 397 }, 397: { nivel: 8, target: 398 }, 399: { nivel: 4, target: 400 }, 401: { nivel: 3, target: 402 }, 403: { nivel: 4, target: 404 }, 404: { nivel: 8, target: 405 }, 406: { nivel: 5, target: 407 }, 408: { nivel: 6, target: 409 }, 410: { nivel: 6, target: 411 }, 412: { nivel: 4, target: 413 }, 415: { nivel: 5, target: 416 }, 417: { nivel: 5, target: 418 }, 420: { nivel: 6, target: 421 }, 422: { nivel: 5, target: 423 }, 425: { nivel: 6, target: 426 }, 427: { nivel: 6, target: 428 }, 431: { nivel: 6, target: 432 }, 434: { nivel: 6, target: 435 }, 436: { nivel: 6, target: 437 }, 443: { nivel: 6, target: 444 }, 444: { nivel: 12, target: 445 }, 447: { nivel: 6, target: 448 }, 449: { nivel: 6, target: 450 }, 451: { nivel: 6, target: 452 }, 453: { nivel: 6, target: 454 }, 456: { nivel: 5, target: 457 }, 458: { nivel: 5, target: 459 },
    495: { nivel: 5, target: 496 }, 496: { nivel: 10, target: 497 }, 498: { nivel: 5, target: 499 }, 499: { nivel: 10, target: 500 }, 501: { nivel: 5, target: 502 }, 502: { nivel: 10, target: 503 }, 504: { nivel: 4, target: 505 }, 506: { nivel: 4, target: 507 }, 507: { nivel: 8, target: 508 }, 509: { nivel: 4, target: 510 }, 519: { nivel: 4, target: 520 }, 520: { nivel: 8, target: 521 }, 522: { nivel: 5, target: 523 }, 524: { nivel: 5, target: 525 }, 525: { nivel: 10, target: 526 }, 527: { nivel: 5, target: 528 }, 529: { nivel: 6, target: 530 }, 532: { nivel: 5, target: 533 }, 533: { nivel: 10, target: 534 }, 535: { nivel: 5, target: 536 }, 536: { nivel: 10, target: 537 }, 540: { nivel: 4, target: 541 }, 541: { nivel: 8, target: 542 }, 543: { nivel: 4, target: 544 }, 544: { nivel: 8, target: 545 }, 551: { nivel: 5, target: 552 }, 552: { nivel: 10, target: 553 }, 557: { nivel: 6, target: 558 }, 559: { nivel: 6, target: 560 }, 564: { nivel: 7, target: 565 }, 566: { nivel: 7, target: 567 }, 568: { nivel: 6, target: 569 }, 570: { nivel: 6, target: 571 }, 572: { nivel: 5, target: 573 }, 574: { nivel: 5, target: 575 }, 575: { nivel: 10, target: 576 }, 577: { nivel: 5, target: 578 }, 578: { nivel: 10, target: 579 }, 580: { nivel: 6, target: 581 }, 582: { nivel: 5, target: 583 }, 583: { nivel: 10, target: 584 }, 585: { nivel: 6, target: 586 }, 587: { nivel: 6, target: 588 }, 590: { nivel: 6, target: 591 }, 592: { nivel: 6, target: 593 }, 595: { nivel: 6, target: 596 }, 597: { nivel: 6, target: 598 }, 599: { nivel: 5, target: 600 }, 600: { nivel: 10, target: 601 }, 602: { nivel: 6, target: 603 }, 603: { nivel: 12, target: 604 }, 605: { nivel: 6, target: 606 }, 607: { nivel: 6, target: 608 }, 608: { nivel: 12, target: 609 }, 610: { nivel: 6, target: 611 }, 611: { nivel: 12, target: 612 }, 613: { nivel: 6, target: 614 }, 619: { nivel: 7, target: 620 }, 622: { nivel: 7, target: 623 }, 624: { nivel: 8, target: 625 }, 627: { nivel: 8, target: 628 }, 629: { nivel: 8, target: 630 }, 633: { nivel: 7, target: 634 }, 634: { nivel: 14, target: 635 }, 636: { nivel: 10, target: 637 }
};

const TABLA_TIPOS = {
    fire: { grass: 1.6, ice: 1.6, bug: 1.6, steel: 1.6, water: 0.6, fire: 0.6, rock: 0.6, dragon: 0.6 },
    water: { fire: 1.6, ground: 1.6, rock: 1.6, water: 0.6, grass: 0.6, dragon: 0.6 },
    grass: { water: 1.6, ground: 1.6, rock: 1.6, fire: 0.6, grass: 0.6, poison: 0.6, flying: 0.6, bug: 0.6, dragon: 0.6, steel: 0.6 },
    electric: { water: 1.6, flying: 1.6, electric: 0.6, grass: 0.6, dragon: 0.6, ground: 0 },
    ice: { grass: 1.6, ground: 1.6, flying: 1.6, dragon: 1.6, fire: 0.6, water: 0.6, ice: 0.6, steel: 0.6 },
    fighting: { normal: 1.6, ice: 1.6, rock: 1.6, dark: 1.6, steel: 1.6, poison: 0.6, flying: 0.6, psychic: 0.6, bug: 0.6, fairy: 0.6 },
    poison: { grass: 1.6, fairy: 1.6, poison: 0.6, ground: 0.6, rock: 0.6, ghost: 0.6, steel: 0 },
    ground: { fire: 1.6, electric: 1.6, poison: 1.6, rock: 1.6, steel: 1.6, grass: 0.6, bug: 0.6, flying: 0 },
    flying: { grass: 1.6, fighting: 1.6, bug: 1.6, electric: 0.6, rock: 0.6, steel: 0.6 },
    psychic: { fighting: 1.6, poison: 1.6, psychic: 0.6, steel: 0.6, dark: 0 },
    bug: { grass: 1.6, psychic: 1.6, dark: 1.6, fire: 0.6, fighting: 0.6, poison: 0.6, flying: 0.6, ghost: 0.6, steel: 0.6, fairy: 0.6 },
    rock: { fire: 1.6, ice: 1.6, flying: 1.6, bug: 1.6, fighting: 0.6, ground: 0.6, steel: 0.6 },
    ghost: { psychic: 1.6, ghost: 1.6, dark: 0.6, normal: 0 },
    dragon: { dragon: 1.6, steel: 0.6, fairy: 0 },
    steel: { ice: 1.6, rock: 1.6, fairy: 1.6, fire: 0.6, water: 0.6, electric: 0.6, steel: 0.6 },
    fairy: { fighting: 1.6, dragon: 1.6, dark: 1.6, fire: 0.6, poison: 0.6, steel: 0.6 },
    dark: { psychic: 1.6, ghost: 1.6, fighting: 0.6, dark: 0.6, fairy: 0.6 },
    normal: { rock: 0.6, steel: 0.6, ghost: 0 }
};

const LIDERES_TORRE = [
    { piso: 1, nombre: "Entrenador Novato", idPoke: 504, recompensa: 400 },
    { piso: 2, nombre: "Líder Cilan/Chili/Cress", idPoke: 512, recompensa: 700 },
    { piso: 3, nombre: "Líder Lenora", idPoke: 505, recompensa: 1000 },
    { piso: 4, nombre: "Líder Burgh", idPoke: 542, recompensa: 1500 },
    { piso: 5, nombre: "Líder Elesa", idPoke: 523, recompensa: 2200 },
    { piso: 6, nombre: "Líder Clay", idPoke: 530, recompensa: 3000 },
    { piso: 7, nombre: "Líder Skyla", idPoke: 581, recompensa: 4000 },
    { piso: 8, nombre: "Líder Brycen", idPoke: 615, recompensa: 5000 },
    { piso: 9, nombre: "Líder Drayden/Iris", idPoke: 612, recompensa: 6500 },
    { piso: 10, nombre: "Rival Cheren", idPoke: 508, recompensa: 8000 },
    { piso: 11, nombre: "Líder del Equipo Plasma N", idPoke: 571, recompensa: 10000 },
    { piso: 12, nombre: "Dragón Legendario Reshiram", idPoke: 643, recompensa: 13000 },
    { piso: 13, nombre: "Dragón Legendario Zekrom", idPoke: 644, recompensa: 16000 },
    { piso: 14, nombre: "Dragón Soberano Kyurem", idPoke: 646, recompensa: 20000 },
    { piso: 15, nombre: "Mítico Genesect", idPoke: 649, recompensa: 30000 }
];

// MISIONES Y LOGROS
const DEFINICION_MISIONES_DIARIAS = [
    { id: "m_tiradas", titulo: "🔴 Tirador Novato", desc: "Abre 3 Pokéballs en el Gacha", req: 3, recompensa: 300, getProgreso: () => stats.tiradasHoy || 0 },
    { id: "m_casino", titulo: "🎰 Apostador de Casino", desc: "Juega 3 veces a la Ruleta o Tragaperras", req: 3, recompensa: 400, getProgreso: () => stats.casinoHoy || 0 },
    { id: "m_arena", titulo: "⚔️ Luchador de Arena", desc: "Gana 2 combates en la Arena", req: 2, recompensa: 500, getProgreso: () => stats.victoriasHoy || 0 },
    { id: "m_torre", titulo: "🏰 Desafiante de la Torre", desc: "Vence 1 piso en la Torre de Batalla", req: 1, recompensa: 600, getProgreso: () => stats.torreHoy || 0 },
    { id: "m_fusion", titulo: "♻️ Alquimista Pokémon", desc: "Realiza 1 fusión de Pokémon", req: 1, recompensa: 500, getProgreso: () => stats.fusionesHoy || 0 }
];

const DEFINICION_LOGROS = [
    { id: "l_pokedex_20", titulo: "🏅 Coleccionista Principiante", desc: "Registra 20 Pokémon en la Pokédex", req: 20, recompensa: 1000, getProgreso: () => pokedexDescubiertos.length },
    { id: "l_pokedex_100", titulo: "🏆 Maestro Pokédex", desc: "Registra 100 Pokémon en la Pokédex", req: 100, recompensa: 5000, getProgreso: () => pokedexDescubiertos.length },
    { id: "l_shiny_1", titulo: "✨ Cazador de Estrellas", desc: "Consigue al menos 1 Pokémon Shiny", req: 1, recompensa: 3000, getProgreso: () => stats.shiniesTotales || 0 },
    { id: "l_torre_10", titulo: "🏰 Conquistador de la Torre", desc: "Alcanza el Piso 10 en la Torre", req: 10, recompensa: 10000, getProgreso: () => pisoTorreActual },
    { id: "l_ganancias_25k", titulo: "💰 Magnate Entrenador", desc: "Gana un total acumulado de 25.000 Pokedólares", req: 25000, recompensa: 5000, getProgreso: () => stats.ganadosTotales || 0 }
];

let notificacionesEnviadas = [];
let audioSilenciado = false;
let musicaIniciada = false;
let audioCtx = null;
let bgmTimer = null;

function mostrarToast(titulo, desc) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div style="font-size: 1.5rem;">🎉</div>
        <div>
            <strong style="display:block; color:#facc15;">${titulo}</strong>
            <span style="font-size:0.8rem; color:#cbd5e1;">${desc}</span>
        </div>
    `;
    container.appendChild(toast);
    reproducirSonido('legendario');

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function verificarNotificacionesMisionesYLogros() {
    DEFINICION_MISIONES_DIARIAS.forEach(m => {
        if (!misionesReclamadas.includes(m.id) && !notificacionesEnviadas.includes(`mision_${m.id}`)) {
            if (m.getProgreso() >= m.req) {
                notificacionesEnviadas.push(`mision_${m.id}`);
                mostrarToast("¡Misión Completada!", `${m.titulo}: Tienes recompensas por reclamar.`);
            }
        }
    });

    DEFINICION_LOGROS.forEach(l => {
        if (!logrosReclamados.includes(l.id) && !notificacionesEnviadas.includes(`logro_${l.id}`)) {
            if (l.getProgreso() >= l.req) {
                notificacionesEnviadas.push(`logro_${l.id}`);
                mostrarToast("¡Logro Desbloqueado!", `${l.titulo}: ¡Recompensa lista!`);
            }
        }
    });
}

function generarIdNumerico() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function inicializarJugadorDirecto() {
    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');

    if (!idUsuarioActual || !cuentas[idUsuarioActual]) {
        idUsuarioActual = generarIdNumerico();
        while (cuentas[idUsuarioActual]) { idUsuarioActual = generarIdNumerico(); }
        
        cuentas[idUsuarioActual] = {
            id: String(idUsuarioActual),
            nombre: "Entrenador",
            datos: null,
            amigos: []
        };
        localStorage.setItem('pokeGachaCuentas', JSON.stringify(cuentas));
        localStorage.setItem('pokeGachaIdUsuario', String(idUsuarioActual));
    }

    usuarioActual = cuentas[idUsuarioActual].nombre;
    document.getElementById('nombre-usuario-display').innerText = usuarioActual;
    document.getElementById('id-usuario-display').innerText = `#${idUsuarioActual}`;

    cargarPartida();
    actualizarUI();
}

function guardarPartida() {
    if (!idUsuarioActual) return;
    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');
    if (cuentas[idUsuarioActual]) {
        cuentas[idUsuarioActual].datos = { monedas, inventario, pokedexDescubiertos, logrosReclamados, misionesReclamadas, stats, pisoTorreActual };
        cuentas[idUsuarioActual].amigos = amigosLista;
        localStorage.setItem('pokeGachaCuentas', JSON.stringify(cuentas));
    }
}

function cargarPartida() {
    if (!idUsuarioActual) return;
    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');
    if (cuentas[idUsuarioActual]) {
        amigosLista = (cuentas[idUsuarioActual].amigos || []).map(id => String(id));
        if (cuentas[idUsuarioActual].datos) {
            const data = cuentas[idUsuarioActual].datos;
            monedas = data.monedas ?? 500;
            inventario = data.inventario ?? [];
            pokedexDescubiertos = data.pokedexDescubiertos ?? [];
            logrosReclamados = data.logrosReclamados ?? [];
            misionesReclamadas = data.misionesReclamadas ?? [];
            pisoTorreActual = data.pisoTorreActual ?? 1;
            stats = data.stats ?? { tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0, victoriasTotales: 0, fusionesTotales: 0, tiradasHoy: 0, casinoHoy: 0, victoriasHoy: 0, torreHoy: 0, fusionesHoy: 0 };
        }
    }
}

// NAVEGACIÓN
function cambiarPestana(pestana) {
    reproducirSonido('normal');
    
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('main.vista-seccion').forEach(m => m.classList.add('hidden'));

    if (pestana === 'juego') {
        document.querySelector('button[onclick="cambiarPestana(\'juego\')"]').classList.add('active');
        document.getElementById('vista-juego').classList.remove('hidden');
    } else if (pestana === 'misiones') {
        document.querySelector('button[onclick="cambiarPestana(\'misiones\')"]').classList.add('active');
        document.getElementById('vista-misiones').classList.remove('hidden');
        renderizarMisionesYLogros();
    } else if (pestana === 'batalla') {
        document.querySelector('button[onclick="cambiarPestana(\'batalla\')"]').classList.add('active');
        document.getElementById('vista-batalla').classList.remove('hidden');
        renderizarSeleccionBatalla();
    } else if (pestana === 'torre') {
        document.querySelector('button[onclick="cambiarPestana(\'torre\')"]').classList.add('active');
        document.getElementById('vista-torre').classList.remove('hidden');
        document.getElementById('piso-actual-num').innerText = pisoTorreActual;
        renderizarSeleccionTorre();
    } else if (pestana === 'minijuego') {
        document.querySelector('button[onclick="cambiarPestana(\'minijuego\')"]').classList.add('active');
        document.getElementById('vista-minijuego').classList.remove('hidden');
    } else if (pestana === 'amigos') {
        document.querySelector('button[onclick="cambiarPestana(\'amigos\')"]').classList.add('active');
        document.getElementById('vista-amigos').classList.remove('hidden');
        renderizarAmigos();
    } else if (pestana === 'pokedex') {
        document.querySelector('button[onclick="cambiarPestana(\'pokedex\')"]').classList.add('active');
        document.getElementById('vista-pokedex').classList.remove('hidden');
        renderizarPokedexCompleta();
    }
}

function renderizarMisionesYLogros() {
    const containerMisiones = document.getElementById('lista-misiones-diarias');
    const containerLogros = document.getElementById('lista-logros');
    
    if (!containerMisiones || !containerLogros) return;

    containerMisiones.innerHTML = '';
    containerLogros.innerHTML = '';

    // Misiones Diarias
    DEFINICION_MISIONES_DIARIAS.forEach(m => {
        const progre = Math.min(m.req, m.getProgreso());
        const completada = progre >= m.req;
        const reclamada = misionesReclamadas.includes(m.id);

        const card = document.createElement('div');
        card.className = `card-mision ${reclamada ? 'reclamada' : completada ? 'lista' : ''}`;
        card.innerHTML = `
            <div style="flex-grow: 1;">
                <strong>${m.titulo}</strong>
                <p style="font-size:0.75rem; color:#9ca3af; margin: 2px 0;">${m.desc}</p>
                <div class="hp-bar-bg" style="height:6px; margin-top:5px;"><div class="hp-bar-fill" style="width:${(progre / m.req) * 100}%;"></div></div>
                <small style="font-size:0.7rem; color:#6b7280;">${progre} / ${m.req}</small>
            </div>
            <div style="margin-left: 15px; text-align: right;">
                <span style="display:block; font-size:0.8rem; font-weight:bold; color:#facc15; margin-bottom:5px;">+${m.recompensa} 💰</span>
                ${reclamada 
                    ? '<span class="badge-completado">Completado ✔️</span>' 
                    : `<button class="btn-primary" style="font-size:0.7rem; padding:4px 8px;" ${!completada ? 'disabled' : ''} onclick="reclamarMision('${m.id}')">Reclamar</button>`
                }
            </div>
        `;
        containerMisiones.appendChild(card);
    });

    // Logros
    DEFINICION_LOGROS.forEach(l => {
        const progre = Math.min(l.req, l.getProgreso());
        const completada = progre >= l.req;
        const reclamada = logrosReclamados.includes(l.id);

        const card = document.createElement('div');
        card.className = `card-mision ${reclamada ? 'reclamada' : completada ? 'lista' : ''}`;
        card.innerHTML = `
            <div style="flex-grow: 1;">
                <strong>${l.titulo}</strong>
                <p style="font-size:0.75rem; color:#9ca3af; margin: 2px 0;">${l.desc}</p>
                <div class="hp-bar-bg" style="height:6px; margin-top:5px;"><div class="hp-bar-fill" style="width:${(progre / l.req) * 100}%;"></div></div>
                <small style="font-size:0.7rem; color:#6b7280;">${progre} / ${l.req}</small>
            </div>
            <div style="margin-left: 15px; text-align: right;">
                <span style="display:block; font-size:0.8rem; font-weight:bold; color:#facc15; margin-bottom:5px;">+${l.recompensa} 💰</span>
                ${reclamada 
                    ? '<span class="badge-completado">Completado ✔️</span>' 
                    : `<button class="btn-primary" style="font-size:0.7rem; padding:4px 8px;" ${!completada ? 'disabled' : ''} onclick="reclamarLogro('${l.id}')">Reclamar</button>`
                }
            </div>
        `;
        containerLogros.appendChild(card);
    });
}

function reclamarMision(misionId) {
    const mision = DEFINICION_MISIONES_DIARIAS.find(m => m.id === misionId);
    if (!mision || misionesReclamadas.includes(misionId)) return;

    if (mision.getProgreso() >= mision.req) {
        monedas += mision.recompensa;
        stats.ganadosTotales += mision.recompensa;
        misionesReclamadas.push(misionId);
        reproducirSonido('legendario');
        actualizarUI();
        renderizarMisionesYLogros();
        alert(`🎯 ¡Recompensa reclamada! +${mision.recompensa} Pokedólares por completar: ${mision.titulo}`);
    }
}

function reclamarLogro(logroId) {
    const logro = DEFINICION_LOGROS.find(l => l.id === logroId);
    if (!logro || logrosReclamados.includes(logroId)) return;

    if (logro.getProgreso() >= logro.req) {
        monedas += logro.recompensa;
        stats.ganadosTotales += logro.recompensa;
        logrosReclamados.push(logroId);
        reproducirSonido('legendario');
        actualizarUI();
        renderizarMisionesYLogros();
        alert(`🏆 ¡Logro alcanzado! +${logro.recompensa} Pokedólares por desbloquear: ${logro.titulo}`);
    }
}

// FIX SISTEMA DE AMIGOS
function agregarAmigo() {
    const input = document.getElementById('input-nuevo-amigo');
    const idAmigoIngresado = String(input.value.trim());

    if (!idAmigoIngresado || idAmigoIngresado.length !== 5) { alert("❌ Introduce un ID válido de 5 números."); return; }
    if (idAmigoIngresado === String(idUsuarioActual)) { alert("❌ No puedes agregarte a ti mismo."); return; }

    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');
    
    const idEncontrado = Object.keys(cuentas).find(id => String(id) === idAmigoIngresado);

    if (!idEncontrado) { 
        alert("❌ El ID de entrenador no existe en el sistema local."); 
        return; 
    }

    if (amigosLista.includes(idEncontrado)) { 
        alert("❌ Ya tienes a este amigo en tu lista."); 
        return; 
    }

    amigosLista.push(idEncontrado);
    input.value = '';
    reproducirSonido('normal');
    actualizarUI();
    renderizarAmigos();
    alert(`🎉 ¡Has añadido a ${cuentas[idEncontrado].nombre} (#${idEncontrado}) a tus amigos!`);
}

function renderizarAmigos() {
    const container = document.getElementById('lista-amigos');
    if (!container) return;
    container.innerHTML = '';

    if (amigosLista.length === 0) {
        container.innerHTML = `<p style="font-size:0.75rem; color:#6b7280; text-align:center;">No tienes amigos agregados aún.</p>`;
        return;
    }

    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');

    amigosLista.forEach(idAmigo => {
        const idStr = String(idAmigo);
        const amigo = cuentas[idStr];
        if (!amigo) return;

        const div = document.createElement('div');
        div.className = 'card-amigo';
        div.innerHTML = `
            <span>👤 ${amigo.nombre} (#${idStr})</span>
            <button class="btn-action-top" style="font-size:0.65rem;" onclick="prepararIntercambio('${idStr}')">Intercambiar 🔄</button>
        `;
        container.appendChild(div);
    });
}

function prepararIntercambio(idAmigo) {
    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');
    const amigo = cuentas[String(idAmigo)];
    if (!amigo) return;

    amigoSeleccionadoIntercambio = String(idAmigo);
    document.getElementById('msg-sin-amigo-seleccionado').classList.add('hidden');
    document.getElementById('zona-intercambio-amigo').classList.remove('hidden');
    document.getElementById('nombre-amigo-intercambio').innerText = `${amigo.nombre} (#${idAmigo})`;

    renderizarGridIntercambio();
}

function renderizarGridIntercambio() {
    const grid = document.getElementById('grid-inventario-intercambio');
    if (!grid) return;
    grid.innerHTML = '';

    if (inventario.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">No tienes Pokémon en tu colección para enviar.</p>`;
        return;
    }

    inventario.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `
            ${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <strong>${poke.nombre}</strong>
            <small>Nv. ${poke.nivel}</small>
            <button class="btn-card btn-subir" onclick="enviarPokemonIntercambio(${poke.instanciaId})">Enviar 🎁</button>
        `;
        grid.appendChild(card);
    });
}

function enviarPokemonIntercambio(instanciaId) {
    if (!amigoSeleccionadoIntercambio) return;

    const index = inventario.findIndex(p => p.instanciaId === instanciaId);
    if (index === -1) return;

    const cuentas = JSON.parse(localStorage.getItem('pokeGachaCuentas') || '{}');
    if (!cuentas[amigoSeleccionadoIntercambio]) { alert("Error al encontrar la cuenta del amigo."); return; }

    const pokeEnviado = inventario[index];
    inventario.splice(index, 1);

    if (!cuentas[amigoSeleccionadoIntercambio].datos) {
        cuentas[amigoSeleccionadoIntercambio].datos = { monedas: 500, inventario: [], pokedexDescubiertos: [], logrosReclamados: [], misionesReclamadas: [], stats: { tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0, victoriasTotales: 0, fusionesTotales: 0, tiradasHoy: 0 } };
    }

    cuentas[amigoSeleccionadoIntercambio].datos.inventario.push(pokeEnviado);
    if (!cuentas[amigoSeleccionadoIntercambio].datos.pokedexDescubiertos.includes(pokeEnviado.id)) {
        cuentas[amigoSeleccionadoIntercambio].datos.pokedexDescubiertos.push(pokeEnviado.id);
    }

    localStorage.setItem('pokeGachaCuentas', JSON.stringify(cuentas));
    reproducirSonido('legendario');
    actualizarUI();
    renderizarGridIntercambio();

    alert(`🎁 ¡Le has enviado a ${pokeEnviado.nombre} a ${cuentas[amigoSeleccionadoIntercambio].nombre}!`);
}

function inicializarAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!musicaIniciada && !audioSilenciado) {
        iniciarMusicaFondoChiptune();
        musicaIniciada = true;
    }
}

function reproducirSonido(tipo) {
    if (audioSilenciado) return;
    inicializarAudioContext();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const ahora = audioCtx.currentTime;

    if (tipo === 'tirar') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, ahora); osc.frequency.exponentialRampToValueAtTime(600, ahora + 0.4);
        gainNode.gain.setValueAtTime(0.08, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.4);
        osc.start(ahora); osc.stop(ahora + 0.4);
    } else if (tipo === 'golpe') {
        osc.type = 'square'; osc.frequency.setValueAtTime(150, ahora); osc.frequency.exponentialRampToValueAtTime(40, ahora + 0.15);
        gainNode.gain.setValueAtTime(0.2, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.15);
        osc.start(ahora); osc.stop(ahora + 0.15);
    } else if (tipo === 'super') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(250, ahora); osc.frequency.exponentialRampToValueAtTime(600, ahora + 0.25);
        gainNode.gain.setValueAtTime(0.25, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.25);
        osc.start(ahora); osc.stop(ahora + 0.25);
    } else if (tipo === 'shiny') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(500, ahora); osc.frequency.setValueAtTime(800, ahora + 0.1); osc.frequency.setValueAtTime(1200, ahora + 0.25);
        gainNode.gain.setValueAtTime(0.18, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.5);
        osc.start(ahora); osc.stop(ahora + 0.5);
    } else if (tipo === 'legendario') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, ahora); osc.frequency.setValueAtTime(600, ahora + 0.15); osc.frequency.setValueAtTime(800, ahora + 0.3);
        gainNode.gain.setValueAtTime(0.15, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.6);
        osc.start(ahora); osc.stop(ahora + 0.6);
    } else {
        osc.type = 'square'; osc.frequency.setValueAtTime(200, ahora); gainNode.gain.setValueAtTime(0.05, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.15);
        osc.start(ahora); osc.stop(ahora + 0.15);
    }
}

function iniciarMusicaFondoChiptune() {
    if (bgmTimer) clearInterval(bgmTimer);
    const melodia = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23, 261.63, 329.63];
    let paso = 0;

    bgmTimer = setInterval(() => {
        if (audioSilenciado || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melodia[paso], audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);
        paso = (paso + 1) % melodia.length;
    }, 400);
}

function alternarAudio() {
    audioSilenciado = !audioSilenciado;
    const btnAudio = document.getElementById('btn-audio');
    if (audioSilenciado) {
        btnAudio.innerText = "🔇 Música: OFF";
        btnAudio.classList.add('muted');
    } else {
        btnAudio.innerText = "🔊 Música: ON";
        btnAudio.classList.remove('muted');
        inicializarAudioContext();
    }
}

window.addEventListener('click', () => {
    if (!musicaIniciada && !audioSilenciado) inicializarAudioContext();
}, { once: true });

function abrirModalCodigo() { reproducirSonido('normal'); document.getElementById('input-codigo').value = ''; document.getElementById('modal-codigo').classList.remove('hidden'); }
function cerrarModalCodigo() { reproducirSonido('normal'); document.getElementById('modal-codigo').classList.add('hidden'); }

function canjearCodigo() {
    const input = document.getElementById('input-codigo');
    const codigoIngresado = input.value.trim().toUpperCase();
    if (!codigoIngresado) { alert("Por favor, introduce un código."); return; }

    if (CODIGOS_VALIDOS[codigoIngresado]) {
        const promo = CODIGOS_VALIDOS[codigoIngresado];
        monedas += promo.recompensa;
        stats.ganadosTotales += promo.recompensa;
        reproducirSonido('legendario');
        actualizarUI();
        cerrarModalCodigo();
        alert(`🎉 ¡Código canjeado con éxito! Has recibido ${promo.descripcion}.`);
    } else { alert("❌ Código inválido."); }
}

async function evolucionarPokemon(instanciaId) {
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    if (!poke || !MAPA_EVOLUCIONES[poke.id]) return;

    const datosEvol = MAPA_EVOLUCIONES[poke.id];
    if (poke.nivel < datosEvol.nivel) return;

    try {
        reproducirSonido('legendario');
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${datosEvol.target}`);
        const datos = await res.json();

        const spriteFinal = poke.esShiny ? (datos.sprites.front_shiny || datos.sprites.front_default) : datos.sprites.front_default;
        let nuevaRareza = 'Comun';
        let nuevoValor = 40;

        if (POOL_LEGENDARIOS.includes(datos.id)) { nuevaRareza = 'Legendario'; nuevoValor = 500; }
        else if (POOL_EPICOS.includes(datos.id)) { nuevaRareza = 'Epico'; nuevoValor = 180; }
        else if (POOL_RAROS.includes(datos.id)) { nuevaRareza = 'Raro'; nuevoValor = 60; }

        if (poke.esShiny) nuevoValor *= 3;

        const nombreAnterior = poke.nombre;
        poke.id = datos.id;
        poke.nombre = poke.esShiny ? `✨ ${datos.name}` : datos.name;
        poke.sprite = spriteFinal;
        poke.rareza = nuevaRareza;
        poke.valorBase = nuevoValor;
        poke.tipo = datos.types[0].type.name;

        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);

        actualizarUI();
        alert(`✨ ¡Enhorabuena! Tu ${nombreAnterior} ha evolucionado a ${poke.nombre}! 🎉`);
    } catch (e) { console.error("Error al evolucionar", e); }
}

async function seleccionarLuchador(instanciaId) {
    reproducirSonido('normal');
    pokemonLuchador = inventario.find(p => p.instanciaId === instanciaId);
    if (!pokemonLuchador) return;

    if (!pokemonLuchador.tipo) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonLuchador.id}`);
            const data = await res.json();
            pokemonLuchador.tipo = data.types[0].type.name;
        } catch (e) { pokemonLuchador.tipo = 'normal'; }
    }

    const multiplicadorRareza = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 };
    const baseMult = multiplicadorRareza[pokemonLuchador.rareza] || 1;

    hpJugadorMax = Math.round(100 * baseMult + (pokemonLuchador.nivel * 20));
    hpJugadorActual = hpJugadorMax;

    document.getElementById('display-jugador').innerHTML = `<img id="img-jugador" src="${pokemonLuchador.sprite}" alt="${pokemonLuchador.nombre}">`;
    document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;
    document.getElementById('hp-jugador').style.width = '100%';

    const badgeTipo = document.getElementById('badge-tipo-jugador');
    badgeTipo.className = `badge-tipo tipo-${pokemonLuchador.tipo}`;
    badgeTipo.innerText = pokemonLuchador.tipo;

    document.getElementById('btn-iniciar-batalla').disabled = false;
    document.getElementById('btn-atacar').disabled = true;

    mostrarResumenCombate(`⚡ Has seleccionado a ${pokemonLuchador.nombre}. Pulsa "Buscar Rival".`, '');
}

async function buscarRival() {
    reproducirSonido('normal');
    const idRival = POKEDEX_TOTAL[Math.floor(Math.random() * POKEDEX_TOTAL.length)];
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idRival}`);
        const datos = await res.json();

        const nivelRival = Math.max(1, pokemonLuchador.nivel + Math.floor(Math.random() * 3) - 1);
        pokemonRival = {
            nombre: datos.name,
            sprite: datos.sprites.front_default,
            nivel: nivelRival,
            tipo: datos.types[0].type.name
        };

        hpRivalMax = Math.round(90 + (nivelRival * 18));
        hpRivalActual = hpRivalMax;

        document.getElementById('display-rival').innerHTML = `<img id="img-rival" src="${pokemonRival.sprite}" alt="${pokemonRival.nombre}">`;
        document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;
        document.getElementById('hp-rival').style.width = '100%';

        const badgeTipo = document.getElementById('badge-tipo-rival');
        badgeTipo.className = `badge-tipo tipo-${pokemonRival.tipo}`;
        badgeTipo.innerText = pokemonRival.tipo;

        document.getElementById('btn-atacar').disabled = false;
        document.getElementById('btn-iniciar-batalla').disabled = true;

        mostrarResumenCombate(`⚔️ ¡Apareció un ${pokemonRival.nombre} salvaje (Nv. ${nivelRival})! ¡A luchar!`, '');
    } catch (e) { console.error(e); }
}

function calcularMultiplicadorTipo(tipoAtaque, tipoDefensor) {
    if (TABLA_TIPOS[tipoAtaque] && TABLA_TIPOS[tipoAtaque][tipoDefensor] !== undefined) {
        return TABLA_TIPOS[tipoAtaque][tipoDefensor];
    }
    return 1.0;
}

// ANIMACIÓN DE IMPACTO Y SACUDIDA MEJORADA
function animarImpacto(targetBoxId, danio, esCritico = false) {
    const box = document.getElementById(targetBoxId);
    if (!box) return;

    box.classList.remove('screen-shake', 'flash-effect');
    void box.offsetWidth;
    box.classList.add(esCritico ? 'screen-shake' : 'flash-effect');

    const img = box.querySelector('img');
    if (img) {
        img.classList.remove('anim-hit');
        void img.offsetWidth;
        img.classList.add('anim-hit');
    }

    const floatEl = document.createElement('div');
    floatEl.className = `texto-danio-flotante ${esCritico ? 'critico' : ''}`;
    floatEl.innerText = esCritico ? `💥 -${danio}` : `-${danio}`;
    box.appendChild(floatEl);

    setTimeout(() => { floatEl.remove(); }, 800);
}

function mostrarResumenCombate(texto, tipoClase = '') {
    const box = document.getElementById('resumen-ganancia-combate');
    box.className = `resumen-combate-box ${tipoClase}`;
    document.getElementById('texto-resumen-combate').innerHTML = texto;
}

// COMBATE ARENA (CON PERMADETH / ELIMINACIÓN DE POKÉMON SI MUERE)
function ejecutarAtaque() {
    if (!pokemonLuchador || !pokemonRival || hpJugadorActual <= 0 || hpRivalActual <= 0) return;

    const multTipo = calcularMultiplicadorTipo(pokemonLuchador.tipo, pokemonRival.tipo);
    let danioBase = 15 + (pokemonLuchador.nivel * 5) + Math.random() * 8;
    let danyoFinal = Math.round(danioBase * multTipo);

    hpRivalActual = Math.max(0, hpRivalActual - danyoFinal);
    const pctRival = Math.round((hpRivalActual / hpRivalMax) * 100);
    document.getElementById('hp-rival').style.width = `${pctRival}%`;
    document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;

    const esSuper = multTipo > 1.2;
    animarImpacto('box-rival', danyoFinal, esSuper);
    reproducirSonido(esSuper ? 'super' : 'golpe');

    if (hpRivalActual <= 0) {
        const premio = 150 + (pokemonRival.nivel * 20);
        monedas += premio;
        stats.ganadosTotales += premio;
        stats.victoriasTotales++;
        stats.victoriasHoy = (stats.victoriasHoy || 0) + 1;

        reproducirSonido('legendario');
        mostrarResumenCombate(`🏆 ¡VICTORIA! Has derrotado a ${pokemonRival.nombre} y ganado +${premio} Pokedólares 💰`, 'ganado');
        document.getElementById('btn-atacar').disabled = true;
        document.getElementById('btn-iniciar-batalla').disabled = false;
        actualizarUI();
        return;
    }

    document.getElementById('btn-atacar').disabled = true;
    setTimeout(() => {
        if (hpRivalActual <= 0) return;

        const multRival = calcularMultiplicadorTipo(pokemonRival.tipo, pokemonLuchador.tipo);
        let danioRivalBase = 10 + (pokemonRival.nivel * 4) + Math.random() * 6;
        let danyoRivalFinal = Math.round(danioRivalBase * multRival);

        hpJugadorActual = Math.max(0, hpJugadorActual - danyoRivalFinal);
        const pctJugador = Math.round((hpJugadorActual / hpJugadorMax) * 100);
        document.getElementById('hp-jugador').style.width = `${pctJugador}%`;
        document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;

        const esSuperRival = multRival > 1.2;
        animarImpacto('box-jugador', danyoRivalFinal, esSuperRival);
        reproducirSonido(esSuperRival ? 'super' : 'golpe');

        if (hpJugadorActual <= 0) {
            // PERMA-DEATH: Se elimina el Pokémon del inventario
            const indexDead = inventario.findIndex(p => p.instanciaId === pokemonLuchador.instanciaId);
            if (indexDead !== -1) {
                inventario.splice(indexDead, 1);
            }

            mostrarResumenCombate(`☠️ ¡DESASTRE! Tu ${pokemonLuchador.nombre} cayó debilitado y ha sido eliminado de tu colección para siempre.`, 'perdido');
            document.getElementById('display-jugador').innerHTML = `<p>Elige un Pokémon a la izquierda</p>`;
            document.getElementById('btn-iniciar-batalla').disabled = true;
            document.getElementById('btn-atacar').disabled = true;
            pokemonLuchador = null;
            actualizarUI();
        } else {
            document.getElementById('btn-atacar').disabled = false;
        }
    }, 700);
}

function renderizarSeleccionBatalla() {
    const grid = document.getElementById('grid-seleccion-batalla');
    if (!grid) return;
    grid.innerHTML = '';
    if (inventario.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563;">Abre Pokéballs para conseguir Pokémon.</p>`; return; }

    const textoBusqueda = (document.getElementById('input-buscar-luchador')?.value || '').trim().toLowerCase();
    const pokemonsFiltrados = inventario.filter(p => p.nombre.toLowerCase().includes(textoBusqueda));

    if (pokemonsFiltrados.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 20px;">Sin resultados.</p>`;
        return;
    }

    pokemonsFiltrados.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="seleccionarLuchador(${poke.instanciaId})">Luchar ⚔️</button>`;
        grid.appendChild(card);
    });
}

function renderizarSeleccionTorre() {
    const grid = document.getElementById('grid-seleccion-torre');
    if (!grid) return;
    grid.innerHTML = '';
    if (inventario.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563;">Abre Pokéballs para conseguir Pokémon.</p>`; return; }

    const textoBusqueda = (document.getElementById('input-buscar-luchador-torre')?.value || '').trim().toLowerCase();
    const pokemonsFiltrados = inventario.filter(p => p.nombre.toLowerCase().includes(textoBusqueda));

    if (pokemonsFiltrados.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 20px;">Sin resultados.</p>`;
        return;
    }

    pokemonsFiltrados.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="seleccionarLuchadorTorre(${poke.instanciaId})">Elegir 🏰</button>`;
        grid.appendChild(card);
    });
}

function seleccionarLuchadorTorre(instanciaId) {
    reproducirSonido('normal');
    pokemonLuchadorTorre = inventario.find(p => p.instanciaId === instanciaId);
    if (!pokemonLuchadorTorre) return;

    const multiplicadorRareza = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 };
    const baseMult = multiplicadorRareza[pokemonLuchadorTorre.rareza] || 1;

    hpJugadorTorreMax = Math.round(100 * baseMult + (pokemonLuchadorTorre.nivel * 20));
    hpJugadorTorreActual = hpJugadorTorreMax;

    document.getElementById('display-jugador-torre').innerHTML = `<img src="${pokemonLuchadorTorre.sprite}" alt="${pokemonLuchadorTorre.nombre}">`;
    document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;
    document.getElementById('hp-jugador-torre').style.width = '100%';

    mostrarResumenTorre(`⚡ Has seleccionado a ${pokemonLuchadorTorre.nombre} para combatir en la Torre.`, '');
}

function cambiarMaquina(tipo, costo, elementoBtn) {
    reproducirSonido('normal');
    maquinaActual = tipo; costoActual = costo;
    document.querySelectorAll('.btn-maquina').forEach(b => b.classList.remove('active'));
    elementoBtn.classList.add('active');
    document.getElementById('costo-x1').innerText = costo;
    document.getElementById('costo-x10').innerText = costo * 9;
    const minis = document.querySelectorAll('.pokeball-mini');
    minis.forEach(m => { m.className = `pokeball-mini ${tipo === 'super' ? 'super-ball' : tipo === 'ultra' ? 'ultra-ball' : tipo === 'master' ? 'master-ball' : ''}`; });
}

function actualizarUI() {
    document.getElementById('cant-monedas').innerText = monedas;
    document.getElementById('cant-pokemon').innerText = inventario.length;
    document.getElementById('pokedex-count').innerText = `${pokedexDescubiertos.length}/${POKEDEX_TOTAL.length}`;
    aplicarFiltrosInventario();
    actualizarSlotsFusion();
    verificarEstadoRecompensaDiaria();
    verificarNotificacionesMisionesYLogros();
    guardarPartida();
}

function verificarEstadoRecompensaDiaria() {
    const ultimoReclamo = localStorage.getItem(`ultimoReclamoPokeGacha_${idUsuarioActual}`);
    const btnDiario = document.getElementById('btn-diario');
    if (!btnDiario) return;
    if (!ultimoReclamo) { btnDiario.disabled = false; btnDiario.innerText = "🎁 Reclamar 500 💰"; return; }
    const ahora = Date.now(); const tiempoTranscurrido = ahora - parseInt(ultimoReclamo);
    const veinticuatroHoras = 24 * 60 * 60 * 1000;
    if (tiempoTranscurrido >= veinticuatroHoras) { btnDiario.disabled = false; btnDiario.innerText = "🎁 Reclamar 500 💰"; }
    else {
        btnDiario.disabled = true; const tiempoRestante = veinticuatroHoras - tiempoTranscurrido;
        const horasRestantes = Math.floor(tiempoRestante / (1000 * 60 * 60));
        const minutosRestantes = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        btnDiario.innerText = `⏳ ${horasRestantes}h ${minutosRestantes}m`;
    }
}

function reclamarDiario() {
    reproducirSonido('legendario');
    const ultimoReclamo = localStorage.getItem(`ultimoReclamoPokeGacha_${idUsuarioActual}`);
    const ahora = Date.now(); const veinticuatroHoras = 24 * 60 * 60 * 1000;
    if (ultimoReclamo && (ahora - parseInt(ultimoReclamo)) < veinticuatroHoras) { alert("¡Ya has reclamado tu recompensa!"); return; }
    monedas += 500; stats.ganadosTotales += 500;
    localStorage.setItem(`ultimoReclamoPokeGacha_${idUsuarioActual}`, ahora.toString());
    actualizarUI();
    alert("🎉 ¡Has recibido tus 500 Pokedólares diarios!");
}

// GACHA
function obtenerPokemonAleatorioConfig() {
    const prob = Math.random() * 100;
    let pokemonId, rareza, valorBase;

    if (maquinaActual === 'master') {
        if (prob < 35) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; }
        else if (prob < 75) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; }
        else { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; }
    } else if (maquinaActual === 'ultra') {
        if (prob < 15) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; }
        else if (prob < 60) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; }
        else if (prob < 90) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; }
    } else if (maquinaActual === 'super') {
        if (prob < 7) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; }
        else if (prob < 32) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; }
        else if (prob < 77) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; }
    } else {
        if (prob < 3) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; }
        else if (prob < 15) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; }
        else if (prob < 45) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; }
    }

    const esShiny = Math.random() < 0.02;
    if (esShiny) valorBase = valorBase * 3;

    return { pokemonId, rareza, valorBase, esShiny };
}

async function tirarGacha(cantidad) {
    if (tirandoGacha) return;
    const costoTotal = cantidad === 10 ? costoActual * 9 : costoActual;
    if (monedas < costoTotal) { alert("¡No suficientes Pokedólares!"); return; }

    monedas -= costoTotal;
    stats.gastadosTotales += costoTotal;
    stats.tiradasTotales += cantidad;
    stats.tiradasHoy = (stats.tiradasHoy || 0) + cantidad;

    tirandoGacha = true;
    document.getElementById('btn-tirar').disabled = true;
    document.getElementById('btn-tirar-10').disabled = true;
    actualizarUI();
    reproducirSonido('tirar');

    const pantalla = document.getElementById('pantalla-gacha');
    pantalla.innerHTML = `<div class="pokeball-grande ${maquinaActual} anim-shake"></div>`;

    try {
        if (cantidad === 1) {
            const config = obtenerPokemonAleatorioConfig();
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${config.pokemonId}`);
            const datos = await resp.json();

            const spriteFinal = config.esShiny ? (datos.sprites.front_shiny || datos.sprites.front_default) : (datos.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${datos.id}.png`);
            const nuevoPokemon = { 
                id: datos.id, nombre: config.esShiny ? `✨ ${datos.name}` : datos.name, rareza: config.rareza, sprite: spriteFinal, valorBase: config.valorBase, esShiny: config.esShiny, instanciaId: Date.now() + Math.random(), nivel: 1, tipo: datos.types[0].type.name
            };

            setTimeout(() => {
                inventario.push(nuevoPokemon);
                if (config.esShiny) stats.shiniesTotales = (stats.shiniesTotales || 0) + 1;
                if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);

                if (config.esShiny) reproducirSonido('shiny');
                else if (config.rareza === 'Legendario' || config.rareza === 'Epico') reproducirSonido('legendario');
                else reproducirSonido('normal');

                pantalla.innerHTML = `<img src="${nuevoPokemon.sprite}" width="75" class="anim-reveal" alt="${nuevoPokemon.nombre}">`;
                tirandoGacha = false;
                document.getElementById('btn-tirar').disabled = false;
                document.getElementById('btn-tirar-10').disabled = false;
                actualizarUI();
            }, 1500);

        } else {
            let obtenidos = [];
            for (let i = 0; i < 10; i++) {
                const conf = obtenerPokemonAleatorioConfig();
                const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${conf.pokemonId}`);
                const datos = await resp.json();
                const spriteFinal = conf.esShiny ? (datos.sprites.front_shiny || datos.sprites.front_default) : (datos.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${datos.id}.png`);
                const poke = { id: datos.id, nombre: conf.esShiny ? `✨ ${datos.name}` : datos.name, rareza: conf.rareza, sprite: spriteFinal, valorBase: conf.valorBase, esShiny: conf.esShiny, instanciaId: Date.now() + Math.random() + i, nivel: 1, tipo: datos.types[0].type.name };
                if (conf.esShiny) stats.shiniesTotales = (stats.shiniesTotales || 0) + 1;
                obtenidos.push(poke);
                inventario.push(poke);
                if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
            }

            setTimeout(() => {
                reproducirSonido('legendario');
                pantalla.innerHTML = `<span class="placeholder-text">¡x10 Abiertas!</span>`;
                mostrarModalX10(obtenidos);
                tirandoGacha = false;
                document.getElementById('btn-tirar').disabled = false;
                document.getElementById('btn-tirar-10').disabled = false;
                actualizarUI();
            }, 1500);
        }
    } catch (e) {
        console.error(e);
        alert("Error al conectar con la API.");
        monedas += costoTotal; stats.gastadosTotales -= costoTotal; stats.tiradasTotales -= cantidad; stats.tiradasHoy -= cantidad;
        tirandoGacha = false;
        document.getElementById('btn-tirar').disabled = false;
        document.getElementById('btn-tirar-10').disabled = false;
        actualizarUI();
    }
}

function mostrarModalX10(lista) {
    const grid = document.getElementById('grid-x10');
    grid.innerHTML = '';
    lista.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>${poke.rareza}</small>`;
        grid.appendChild(card);
    });
    document.getElementById('modal-x10').classList.remove('hidden');
}

function cerrarModalX10() { reproducirSonido('normal'); document.getElementById('modal-x10').classList.add('hidden'); }

// INVENTARIO Y FUSIÓN
function subirNivel(instanciaId) {
    reproducirSonido('normal');
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    const costoSubir = poke.nivel * 30;
    if (monedas >= costoSubir) {
        monedas -= costoSubir; stats.gastadosTotales += costoSubir;
        poke.nivel++;
        actualizarUI();
    } else { alert(`Necesitas ${costoSubir} Pokedólares.`); }
}

function venderPokemon(instanciaId) {
    reproducirSonido('normal');
    const index = inventario.findIndex(p => p.instanciaId === instanciaId);
    if (index !== -1) {
        const poke = inventario[index];
        const valorVenta = poke.valorBase + (poke.nivel * 15);
        monedas += valorVenta; stats.ganadosTotales += valorVenta;
        seleccionadosFusion = seleccionadosFusion.filter(id => id !== instanciaId);
        inventario.splice(index, 1);
        actualizarUI();
    }
}

function venderDuplicados() {
    if (inventario.length === 0) return;
    reproducirSonido('normal');
    const mapasPokemons = {};
    inventario.forEach(poke => {
        const clave = `${poke.id}_${poke.esShiny ? 'shiny' : 'normal'}`;
        if (!mapasPokemons[clave]) mapasPokemons[clave] = [];
        mapasPokemons[clave].push(poke);
    });

    let gananciaTotal = 0;
    let nuevosInventario = [];
    Object.values(mapasPokemons).forEach(grupo => {
        grupo.sort((a, b) => b.nivel - a.nivel);
        nuevosInventario.push(grupo[0]);
        for (let i = 1; i < grupo.length; i++) {
            gananciaTotal += grupo[i].valorBase + (grupo[i].nivel * 15);
            seleccionadosFusion = seleccionadosFusion.filter(id => id !== grupo[i].instanciaId);
        }
    });

    if (gananciaTotal > 0) {
        monedas += gananciaTotal; stats.ganadosTotales += gananciaTotal;
        inventario = nuevosInventario;
        actualizarUI();
        alert(`¡Vendidos duplicados por ${gananciaTotal} Pokedólares!`);
    } else { alert("No hay duplicados."); }
}

function seleccionarParaFusion(instanciaId) {
    reproducirSonido('normal');
    const index = seleccionadosFusion.indexOf(instanciaId);
    if (index !== -1) { seleccionadosFusion.splice(index, 1); } 
    else {
        if (seleccionadosFusion.length < 3) seleccionadosFusion.push(instanciaId);
        else alert("Máximo 3 Pokémon para fusionar.");
    }
    actualizarUI();
}

function actualizarSlotsFusion() {
    for (let i = 0; i < 3; i++) {
        const slotEl = document.querySelector(`[data-slot="${i}"]`);
        if (!slotEl) continue;
        const idActual = seleccionadosFusion[i];
        if (idActual) {
            const poke = inventario.find(p => p.instanciaId === idActual);
            if (poke) { slotEl.innerHTML = `<img src="${poke.sprite}" alt="${poke.nombre}">`; slotEl.style.borderStyle = "solid"; slotEl.style.borderColor = "#8b5cf6"; }
        } else { slotEl.innerHTML = `Slot ${i + 1}`; slotEl.style.borderStyle = "dashed"; slotEl.style.borderColor = "#4b5563"; }
    }
    const btnFus = document.getElementById('btn-fusionar');
    if (btnFus) btnFus.disabled = seleccionadosFusion.length !== 3;
}

async function ejecutarFusion() {
    if (seleccionadosFusion.length !== 3) return;
    inventario = inventario.filter(p => !seleccionadosFusion.includes(p.instanciaId));
    seleccionadosFusion = [];

    const idAleatorio = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)];
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
        const datos = await respuesta.json();
        const nuevoPokemon = { id: datos.id, nombre: datos.name, rareza: 'Epico', sprite: datos.sprites.front_default, valorBase: 180, esShiny: false, instanciaId: Date.now() + Math.random(), nivel: 1, tipo: datos.types[0].type.name };
        inventario.push(nuevoPokemon);
        stats.fusionesTotales++;
        stats.fusionesHoy = (stats.fusionesHoy || 0) + 1;
        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
        reproducirSonido('legendario');
        actualizarUI();
        alert(`¡Fusión exitosa! Obtuviste un ${nuevoPokemon.nombre} (Épico).`);
    } catch (e) { console.error(e); }
}

function aplicarFiltrosInventario() {
    const elFiltro = document.getElementById('filtro-rareza');
    const elOrden = document.getElementById('ordenar-por');
    if (!elFiltro || !elOrden) return;

    const filtroRareza = elFiltro.value;
    const ordenarPor = elOrden.value;
    let listaFiltrada = [...inventario];

    if (filtroRareza === 'shiny') listaFiltrada = listaFiltrada.filter(p => p.esShiny);
    else if (filtroRareza !== 'todas') listaFiltrada = listaFiltrada.filter(p => p.rareza === filtroRareza);

    if (ordenarPor === 'nivel') listaFiltrada.sort((a, b) => b.nivel - a.nivel);
    else if (ordenarPor === 'nombre') listaFiltrada.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (ordenarPor === 'rareza') {
        const o = { 'Legendario': 4, 'Epico': 3, 'Raro': 2, 'Comun': 1 };
        listaFiltrada.sort((a, b) => o[b.rareza] - o[a.rareza]);
    } else listaFiltrada.reverse();

    renderizarInventarioGrid(listaFiltrada);
}

function renderizarInventarioGrid(lista) {
    const grid = document.getElementById('grid-inventario');
    if (!grid) return;
    grid.innerHTML = '';
    if (lista.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563; padding: 40px;">No hay Pokémon en esta vista.</p>`; return; }

    lista.forEach(poke => {
        const estaSeleccionado = seleccionadosFusion.includes(poke.instanciaId);
        const datosEvol = MAPA_EVOLUCIONES[poke.id];
        const puedeEvolucionar = datosEvol && poke.nivel >= datosEvol.nivel;

        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        
        let botonEvolucionHTML = '';
        if (puedeEvolucionar) {
            botonEvolucionHTML = `<button class="btn-card btn-evolucionar" onclick="evolucionarPokemon(${poke.instanciaId})">Evolucionar 🧬</button>`;
        }

        card.innerHTML = `
            ${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <strong>${poke.nombre}</strong>
            <small>Nv. ${poke.nivel} (${poke.rareza})</small>
            ${botonEvolucionHTML}
            <button class="btn-card btn-subir" onclick="subirNivel(${poke.instanciaId})">Subir Nv. (${poke.nivel * 30} 💰)</button>
            <button class="btn-card btn-vender" onclick="venderPokemon(${poke.instanciaId})">Vender (+${poke.valorBase + (poke.nivel * 15)} 💰)</button>
            <button class="btn-card btn-seleccionar ${estaSeleccionado ? 'seleccionado' : ''}" onclick="seleccionarParaFusion(${poke.instanciaId})">${estaSeleccionado ? 'Quitar' : 'Fusionar'}</button>
        `;
        grid.appendChild(card);
    });
}

function renderizarPokedexCompleta() {
    const grid = document.getElementById('grid-pokedex');
    if (!grid) return;
    grid.innerHTML = '';
    POKEDEX_TOTAL.forEach(id => {
        const descubierto = pokedexDescubiertos.includes(id);
        const card = document.createElement('div');
        card.className = `card-pokemon ${descubierto ? 'Comun' : 'bloqueado'}`;
        card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="Pokédex"><strong>#${id}</strong><small>${descubierto ? 'Descubierto' : '???'}</small>`;
        grid.appendChild(card);
    });
}

// TORRE DE BATALLA (CON PERMADETH SI MUERE)
async function iniciarPisoTorre() {
    if (!pokemonLuchadorTorre) { alert("❌ Primero selecciona un Pokémon en el menú lateral de la Torre."); return; }
    reproducirSonido('normal');

    const datosPiso = LIDERES_TORRE.find(l => l.piso === pisoTorreActual) || LIDERES_TORRE[LIDERES_TORRE.length - 1];

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${datosPiso.idPoke}`);
        const datos = await res.json();

        liderTorreActual = {
            nombre: datosPiso.nombre,
            pokemonNombre: datos.name,
            sprite: datos.sprites.front_default,
            nivel: pisoTorreActual * 5,
            tipo: datos.types[0].type.name,
            recompensa: datosPiso.recompensa
        };

        hpLiderTorreMax = Math.round(150 + (pisoTorreActual * 50));
        hpLiderTorreActual = hpLiderTorreMax;

        const multiplicadorRareza = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 };
        const baseMult = multiplicadorRareza[pokemonLuchadorTorre.rareza] || 1;
        hpJugadorTorreMax = Math.round(100 * baseMult + (pokemonLuchadorTorre.nivel * 20));
        hpJugadorTorreActual = hpJugadorTorreMax;

        document.getElementById('nombre-lider-torre').innerText = `${liderTorreActual.nombre} (${liderTorreActual.pokemonNombre})`;
        document.getElementById('display-lider-torre').innerHTML = `<img src="${liderTorreActual.sprite}" alt="Líder">`;
        document.getElementById('text-hp-lider-torre').innerText = `${hpLiderTorreActual} / ${hpLiderTorreMax} HP`;
        document.getElementById('hp-lider-torre').style.width = '100%';

        document.getElementById('display-jugador-torre').innerHTML = `<img src="${pokemonLuchadorTorre.sprite}" alt="Tu Pokémon">`;
        document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;
        document.getElementById('hp-jugador-torre').style.width = '100%';

        document.getElementById('arena-torre').classList.remove('hidden');
        document.getElementById('controles-torre').classList.remove('hidden');
        document.getElementById('btn-enfrentar-piso').disabled = true;

        mostrarResumenTorre(`🏰 ¡Comienza el combate en el Piso ${pisoTorreActual} contra ${liderTorreActual.nombre}!`, '');
    } catch (e) { console.error(e); }
}

function ejecutarAtaqueTorre() {
    if (!pokemonLuchadorTorre || !liderTorreActual || hpJugadorTorreActual <= 0 || hpLiderTorreActual <= 0) return;

    let danioBase = 20 + (pokemonLuchadorTorre.nivel * 6) + Math.random() * 10;
    hpLiderTorreActual = Math.max(0, hpLiderTorreActual - Math.round(danioBase));
    const pctLider = Math.round((hpLiderTorreActual / hpLiderTorreMax) * 100);
    document.getElementById('hp-lider-torre').style.width = `${pctLider}%`;
    document.getElementById('text-hp-lider-torre').innerText = `${hpLiderTorreActual} / ${hpLiderTorreMax} HP`;
    
    animarImpacto('box-lider-torre', Math.round(danioBase), false);
    reproducirSonido('golpe');

    if (hpLiderTorreActual <= 0) {
        monedas += liderTorreActual.recompensa;
        stats.ganadosTotales += liderTorreActual.recompensa;
        stats.torreHoy = (stats.torreHoy || 0) + 1;

        reproducirSonido('legendario');
        mostrarResumenTorre(`🏆 ¡PISO ${pisoTorreActual} SUPERADO! Ganaste +${liderTorreActual.recompensa} Pokedólares 💰`, 'ganado');
        
        document.getElementById('controles-torre').classList.add('hidden');
        if (pisoTorreActual < LIDERES_TORRE.length) {
            pisoTorreActual++;
            document.getElementById('piso-actual-num').innerText = pisoTorreActual;
        } else {
            alert("👑 ¡Increíble! Has completado la cima de la Torre de Batalla.");
        }
        document.getElementById('btn-enfrentar-piso').disabled = false;
        actualizarUI();
        return;
    }

    setTimeout(() => {
        let danioLider = 15 + (pisoTorreActual * 6) + Math.random() * 8;
        hpJugadorTorreActual = Math.max(0, hpJugadorTorreActual - Math.round(danioLider));
        const pctJugador = Math.round((hpJugadorTorreActual / hpJugadorTorreMax) * 100);
        document.getElementById('hp-jugador-torre').style.width = `${pctJugador}%`;
        document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;
        
        animarImpacto('box-jugador-torre', Math.round(danioLider), true);
        reproducirSonido('golpe');

        if (hpJugadorTorreActual <= 0) {
            // PERMA-DEATH EN TORRE
            const indexDead = inventario.findIndex(p => p.instanciaId === pokemonLuchadorTorre.instanciaId);
            if (indexDead !== -1) {
                inventario.splice(indexDead, 1);
            }

            mostrarResumenTorre(`☠️ ¡DESASTRE! Tu Pokémon fue eliminado por el Líder del Piso ${pisoTorreActual} y ha desaparecido de tu colección.`, 'perdido');
            document.getElementById('display-jugador-torre').innerHTML = `<p>Selecciona a la izquierda</p>`;
            document.getElementById('controles-torre').classList.add('hidden');
            document.getElementById('btn-enfrentar-piso').disabled = false;
            pokemonLuchadorTorre = null;
            actualizarUI();
        }
    }, 600);
}

function mostrarResumenTorre(texto, clase) {
    const box = document.getElementById('resumen-torre');
    box.className = `resumen-combate-box ${clase}`;
    document.getElementById('texto-resumen-torre').innerHTML = texto;
}

// CASINO
function girarRuleta() {
    const costoApuesta = 200;
    if (monedas < costoApuesta) { alert("❌ No tienes suficientes Pokedólares (Costo: 200 💰)."); return; }

    monedas -= costoApuesta;
    stats.gastadosTotales += costoApuesta;
    stats.casinoHoy = (stats.casinoHoy || 0) + 1;
    reproducirSonido('tirar');

    const pantallaRuleta = document.getElementById('ruleta-display');
    pantallaRuleta.innerText = "🎰 Girando...";

    setTimeout(() => {
        const premioRol = Math.random() * 100;
        let premio = 0;
        let textoPremio = "";

        if (premioRol < 5) { premio = 2000; textoPremio = "🌟 ¡JACKPOT! +2.000 💰"; }
        else if (premioRol < 20) { premio = 600; textoPremio = "🎉 ¡Gran Premio! +600 💰"; }
        else if (premioRol < 55) { premio = 250; textoPremio = "✨ ¡Premio Menor! +250 💰"; }
        else { premio = 0; textoPremio = "😢 ¡Sin premio!"; }

        monedas += premio;
        if (premio > 0) stats.ganadosTotales += premio;

        pantallaRuleta.innerText = textoPremio;
        reproducirSonido(premio >= 600 ? 'legendario' : 'normal');
        actualizarUI();
    }, 1200);
}

function jugarTragaperras() {
    const costo = 100;
    if (monedas < costo) { alert("❌ No tienes suficientes Pokedólares para la Tragaperras (Costo: 100 💰)."); return; }

    monedas -= costo;
    stats.gastadosTotales += costo;
    stats.casinoHoy = (stats.casinoHoy || 0) + 1;
    reproducirSonido('tirar');

    const btnPalanca = document.getElementById('btn-palanca-slots');
    btnPalanca.disabled = true;

    const simbolos = ["🔴", "⚡", "💎", "7️⃣", "⭐", "🍇"];
    const reel1 = document.getElementById('reel-1');
    const reel2 = document.getElementById('reel-2');
    const reel3 = document.getElementById('reel-3');
    const txtRes = document.getElementById('texto-resultado-slots');

    txtRes.innerText = "🎰 ¡Girando carretes...!";

    let contador = 0;
    const intervalo = setInterval(() => {
        reel1.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        reel2.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        reel3.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        contador++;
        if (contador > 12) {
            clearInterval(intervalo);
            
            const s1 = simbolos[Math.floor(Math.random() * simbolos.length)];
            const s2 = simbolos[Math.floor(Math.random() * simbolos.length)];
            const s3 = simbolos[Math.floor(Math.random() * simbolos.length)];

            reel1.innerText = s1;
            reel2.innerText = s2;
            reel3.innerText = s3;

            let ganancia = 0;
            if (s1 === s2 && s2 === s3) {
                if (s1 === "💎" || s1 === "7️⃣") ganancia = 3000;
                else ganancia = 1000;
                txtRes.innerText = `🔥 ¡BOTE TRIPLE (${s1})! +${ganancia} 💰`;
                reproducirSonido('legendario');
            } else if (s1 === s2 || s2 === s3 || s1 === s3) {
                ganancia = 200;
                txtRes.innerText = `✨ ¡Par Coincidente! +${ganancia} 💰`;
                reproducirSonido('super');
            } else {
                txtRes.innerText = "❌ Inténtalo de nuevo.";
            }

            monedas += ganancia;
            if (ganancia > 0) stats.ganadosTotales += ganancia;
            
            btnPalanca.disabled = false;
            actualizarUI();
        }
    }, 80);
}

inicializarJugadorDirecto();
setInterval(verificarEstadoRecompensaDiaria, 60000);