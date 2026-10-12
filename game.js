let usuarioActual = "Entrenador";
let idUsuarioActual = localStorage.getItem('pokeGachaIdUsuario') || null;

let peer = null;
let conexionPeerActiva = null;

let monedas = 500;
let inventario = [];
let bolsaObjetos = {
    carameloRaro: 0,
    escudoPermaDeath: 0,
    piedraFuego: 0,
    piedraAgua: 0,
    piedraTrueno: 0,
    pocionMaxima: 0
};

let pokedexDescubiertos = [];
let logrosReclamados = [];
let misionesReclamadas = [];
let generacionesReclamadas = [];
let insigniasObtenidas = [];
let gtsGlobalListado = [];

let tirandoGacha = false;
let seleccionadosFusion = [];

let maquinaActual = 'normal';
let costoActual = 100;

let stats = {
    tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0,
    victoriasTotales: 0, fusionesTotales: 0, tiradasHoy: 0, casinoHoy: 0,
    victoriasHoy: 0, torreHoy: 0, fusionesHoy: 0
};

// ESTADO PVP DIRECTO CON AMIGOS
let estadoPvp = {
    enCombate: false,
    miPokemon: null,
    hpMiPokemon: 0,
    hpMaxMiPokemon: 0,
    rivalPokemon: null,
    hpRivalPokemon: 0,
    hpMaxRivalPokemon: 0
};

// ESTADO HIGHER / LOWER (CASINO)
let highLowNivelActual = null;
let rachaHighLow = 0;

// ESTADO DIANA VOLTORB (CASINO)
let voltorbTablero = [];
let voltorbAcumulado = 0;
let voltorbJugando = false;

// ESTADO TORNEO 3v3
let equipoTorneo = [];
let rivalTorneoIndex = 0;
let pokemonRivalActivo = null;
let pokemonJugadorActivo = null;
let indexPokeJugadorActivo = 0;
let hpJugadorTorneoActual = 0, hpJugadorTorneoMax = 0;
let hpRivalTorneoActual = 0, hpRivalTorneoMax = 0;

const LIDERES_TORNEO_3V3 = [
    { id: "roca", nombre: "Brock", titulo: "Líder Roca 🪨", equipoIds: [95, 74, 140], niveles: [15, 18, 22], recompensa: 1000 },
    { id: "cascada", nombre: "Misty", titulo: "Líder Agua 💧", equipoIds: [120, 121, 130], niveles: [20, 25, 28], recompensa: 2000 },
    { id: "trueno", nombre: "Lt. Surge", titulo: "Líder Eléctrico ⚡", equipoIds: [25, 26, 125], niveles: [25, 30, 32], recompensa: 3000 },
    { id: "arcoiris", nombre: "Erika", titulo: "Líder Planta 🌿", equipoIds: [44, 45, 114], niveles: [30, 35, 38], recompensa: 4000 },
    { id: "pantano", nombre: "Sabrina", titulo: "Líder Psíquico 🔮", equipoIds: [64, 65, 122], niveles: [35, 40, 42], recompensa: 5000 },
    { id: "volcan", nombre: "Blaine", titulo: "Líder Fuego 🔥", equipoIds: [58, 59, 126], niveles: [40, 45, 48], recompensa: 6000 },
    { id: "tierra", nombre: "Giovanni", titulo: "Jefe Equipo Rocket 🚀", equipoIds: [31, 34, 112], niveles: [45, 50, 55], recompensa: 8000 },
    { id: "dragon", nombre: "Cintia", titulo: "Campeona de la Liga 👑", equipoIds: [445, 448, 350], niveles: [55, 60, 65], recompensa: 15000 }
];

let pokemonLuchador = null;
let pokemonLuchadorTorre = null;
let pokemonRival = null;
let hpJugadorActual = 0, hpJugadorMax = 0;
let hpRivalActual = 0, hpRivalMax = 0;

let pisoTorreActual = 1;
let liderTorreActual = null;
let hpLiderTorreActual = 0, hpLiderTorreMax = 0;

const CODIGOS_VALIDOS = {
    "071011": { recompensa: 20000, tipo: "monedas", descripcion: "20.000 Pokedólares" },
    "UNOVA2026": { recompensa: 10000, tipo: "monedas", descripcion: "10.000 Pokedólares" }
};

const POKEDEX_TOTAL = Array.from({ length: 649 }, (_, i) => i + 1);

const RANGOS_GENERACIONES = [
    { gen: 1, nombre: "Kanto (Gen 1)", inicio: 1, fin: 151, recompensa: 15000 },
    { gen: 2, nombre: "Johto (Gen 2)", inicio: 152, fin: 251, recompensa: 10000 },
    { gen: 3, nombre: "Hoenn (Gen 3)", inicio: 252, fin: 386, recompensa: 12000 },
    { gen: 4, nombre: "Sinnoh (Gen 4)", inicio: 387, fin: 493, recompensa: 15000 },
    { gen: 5, nombre: "Unova (Gen 5)", inicio: 494, fin: 649, recompensa: 20000 }
];

const POOL_LEGENDARIOS = [
    144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649
];

const POOL_EPICOS = [
    3, 6, 9, 12, 15, 18, 31, 34, 59, 62, 65, 68, 71, 76, 94, 103, 115, 130, 131, 134, 135, 136, 139, 141, 142, 143, 149,
    154, 157, 160, 169, 178, 181, 182, 186, 196, 197, 199, 208, 212, 214, 217, 227, 229, 230, 232, 242, 248,
    254, 257, 260, 267, 269, 282, 289, 292, 295, 306, 310, 319, 321, 330, 334, 344, 346, 348, 350, 356, 359, 362, 365, 368, 373, 376,
    389, 392, 395, 398, 405, 407, 411, 413, 419, 429, 430, 435, 437, 445, 448, 450, 452, 454, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479,
    497, 500, 503, 521, 526, 530, 534, 537, 542, 545, 547, 553, 555, 560, 563, 565, 567, 571, 576, 579, 584, 589, 604, 609, 612, 614, 621, 623, 625, 628, 630, 635, 637
];

const POOL_RAROS = [
    2, 5, 8, 11, 14, 17, 22, 24, 26, 28, 30, 33, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 58, 61, 64, 67, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 97, 99, 101, 105, 107, 109, 110, 112, 117, 119, 121, 123, 125, 126, 127, 128, 138, 140,
    153, 156, 159, 162, 164, 166, 171, 176, 180, 184, 185, 190, 192, 195, 202, 203, 205, 207, 210, 211, 213, 215, 219, 221, 224, 226, 233, 234, 237, 241,
    253, 256, 259, 262, 264, 271, 272, 274, 275, 277, 279, 281, 284, 286, 288, 291, 294, 297, 299, 301, 303, 305, 308, 317, 323, 326, 329, 332, 335, 338, 340, 342, 354, 358, 361, 364, 367, 372, 375,
    388, 391, 394, 397, 400, 402, 404, 409, 416, 418, 421, 423, 426, 428, 432, 434, 436, 439, 441, 444, 447, 449, 457, 459,
    496, 499, 502, 505, 507, 508, 510, 512, 514, 516, 518, 520, 523, 525, 528, 533, 536, 539, 541, 544, 549, 552, 558, 562, 566, 569, 573, 575, 578, 581, 583, 586, 588, 591, 593, 596, 598, 601, 603, 606, 608, 611, 617, 619, 627, 629, 634
];

const POOL_COMUNES = POKEDEX_TOTAL.filter(id => !POOL_LEGENDARIOS.includes(id) && !POOL_EPICOS.includes(id) && !POOL_RAROS.includes(id));

const MAPA_EVOLUCIONES = {
    1: { nivel: 15, target: 2 }, 2: { nivel: 35, target: 3 }, 4: { nivel: 15, target: 5 }, 5: { nivel: 35, target: 6 }, 7: { nivel: 15, target: 8 }, 8: { nivel: 35, target: 9 }, 10: { nivel: 15, target: 11 }, 11: { nivel: 35, target: 12 }, 13: { nivel: 15, target: 14 }, 14: { nivel: 35, target: 15 }, 16: { nivel: 15, target: 17 }, 17: { nivel: 35, target: 18 }, 19: { nivel: 15, target: 20 }, 21: { nivel: 15, target: 22 }, 23: { nivel: 15, target: 24 }, 25: { nivel: 15, target: 26 }, 27: { nivel: 15, target: 28 }, 29: { nivel: 15, target: 30 }, 30: { nivel: 35, target: 31 }, 32: { nivel: 15, target: 33 }, 33: { nivel: 35, target: 34 }, 41: { nivel: 15, target: 42 }, 43: { nivel: 15, target: 44 }, 46: { nivel: 15, target: 47 }, 48: { nivel: 15, target: 49 }, 52: { nivel: 15, target: 53 }, 54: { nivel: 15, target: 55 }, 56: { nivel: 15, target: 57 }, 60: { nivel: 15, target: 61 }, 63: { nivel: 15, target: 64 }, 66: { nivel: 15, target: 67 }, 69: { nivel: 15, target: 70 }, 72: { nivel: 15, target: 73 }, 74: { nivel: 15, target: 75 }, 77: { nivel: 15, target: 78 }, 79: { nivel: 15, target: 80 }, 81: { nivel: 15, target: 82 }, 84: { nivel: 15, target: 85 }, 86: { nivel: 15, target: 87 }, 88: { nivel: 15, target: 89 }, 90: { nivel: 15, target: 91 }, 92: { nivel: 15, target: 93 }, 96: { nivel: 15, target: 97 }, 98: { nivel: 15, target: 99 }, 100: { nivel: 15, target: 101 }, 104: { nivel: 15, target: 105 }, 109: { nivel: 15, target: 110 }, 111: { nivel: 15, target: 112 }, 116: { nivel: 15, target: 117 }, 118: { nivel: 15, target: 119 }, 120: { nivel: 15, target: 121 }, 129: { nivel: 15, target: 130 }, 133: { nivel: 15, target: 134 }, 138: { nivel: 15, target: 139 }, 140: { nivel: 15, target: 141 }, 147: { nivel: 15, target: 148 }, 148: { nivel: 35, target: 149 },
    152: { nivel: 15, target: 153 }, 153: { nivel: 35, target: 154 }, 155: { nivel: 15, target: 156 }, 156: { nivel: 35, target: 157 }, 158: { nivel: 15, target: 159 }, 159: { nivel: 35, target: 160 }, 161: { nivel: 15, target: 162 }, 163: { nivel: 15, target: 164 }, 165: { nivel: 15, target: 166 }, 167: { nivel: 15, target: 168 }, 170: { nivel: 15, target: 171 }, 172: { nivel: 15, target: 25 }, 175: { nivel: 15, target: 176 }, 177: { nivel: 15, target: 178 }, 179: { nivel: 15, target: 180 }, 180: { nivel: 35, target: 181 }, 183: { nivel: 15, target: 184 }, 187: { nivel: 15, target: 188 }, 188: { nivel: 35, target: 189 }, 194: { nivel: 15, target: 195 }, 216: { nivel: 15, target: 217 }, 218: { nivel: 15, target: 219 }, 220: { nivel: 15, target: 221 }, 223: { nivel: 15, target: 224 }, 228: { nivel: 15, target: 229 }, 231: { nivel: 15, target: 232 }, 246: { nivel: 15, target: 247 }, 247: { nivel: 35, target: 248 },
    252: { nivel: 15, target: 253 }, 253: { nivel: 35, target: 254 }, 255: { nivel: 15, target: 256 }, 256: { nivel: 35, target: 257 }, 258: { nivel: 15, target: 259 }, 259: { nivel: 35, target: 260 }, 261: { nivel: 15, target: 262 }, 263: { nivel: 15, target: 264 }, 265: { nivel: 15, target: 266 }, 266: { nivel: 35, target: 267 }, 268: { nivel: 35, target: 269 }, 270: { nivel: 15, target: 271 }, 271: { nivel: 35, target: 272 }, 273: { nivel: 15, target: 274 }, 274: { nivel: 35, target: 275 }, 276: { nivel: 15, target: 277 }, 278: { nivel: 15, target: 279 }, 280: { nivel: 15, target: 281 }, 281: { nivel: 35, target: 282 }, 283: { nivel: 15, target: 284 }, 285: { nivel: 15, target: 286 }, 287: { nivel: 15, target: 288 }, 288: { nivel: 35, target: 289 }, 290: { nivel: 15, target: 291 }, 293: { nivel: 15, target: 294 }, 294: { nivel: 35, target: 295 }, 296: { nivel: 15, target: 297 }, 298: { nivel: 15, target: 183 }, 304: { nivel: 15, target: 305 }, 305: { nivel: 35, target: 306 }, 307: { nivel: 15, target: 308 }, 309: { nivel: 15, target: 310 }, 316: { nivel: 15, target: 317 }, 318: { nivel: 15, target: 319 }, 320: { nivel: 15, target: 321 }, 322: { nivel: 15, target: 323 }, 325: { nivel: 15, target: 326 }, 328: { nivel: 15, target: 329 }, 329: { nivel: 35, target: 330 }, 331: { nivel: 15, target: 332 }, 333: { nivel: 15, target: 334 }, 339: { nivel: 15, target: 340 }, 341: { nivel: 15, target: 342 }, 343: { nivel: 15, target: 344 }, 345: { nivel: 15, target: 346 }, 347: { nivel: 15, target: 348 }, 349: { nivel: 15, target: 350 }, 353: { nivel: 15, target: 354 }, 355: { nivel: 15, target: 356 }, 360: { nivel: 15, target: 202 }, 361: { nivel: 15, target: 362 }, 363: { nivel: 15, target: 364 }, 364: { nivel: 35, target: 365 }, 371: { nivel: 15, target: 372 }, 372: { nivel: 35, target: 373 }, 374: { nivel: 15, target: 375 }, 375: { nivel: 35, target: 376 },
    387: { nivel: 15, target: 388 }, 388: { nivel: 35, target: 389 }, 390: { nivel: 15, target: 391 }, 391: { nivel: 35, target: 392 }, 393: { nivel: 15, target: 394 }, 394: { nivel: 35, target: 395 }, 396: { nivel: 15, target: 397 }, 397: { nivel: 35, target: 398 }, 399: { nivel: 15, target: 400 }, 401: { nivel: 15, target: 402 }, 403: { nivel: 15, target: 404 }, 404: { nivel: 35, target: 405 }, 406: { nivel: 15, target: 407 }, 408: { nivel: 15, target: 409 }, 410: { nivel: 15, target: 411 }, 412: { nivel: 15, target: 413 }, 415: { nivel: 15, target: 416 }, 417: { nivel: 15, target: 418 }, 420: { nivel: 15, target: 421 }, 422: { nivel: 15, target: 423 }, 425: { nivel: 15, target: 426 }, 427: { nivel: 15, target: 428 }, 431: { nivel: 15, target: 432 }, 434: { nivel: 15, target: 435 }, 436: { nivel: 15, target: 437 }, 443: { nivel: 15, target: 444 }, 444: { nivel: 35, target: 445 }, 447: { nivel: 15, target: 448 }, 449: { nivel: 15, target: 450 }, 451: { nivel: 15, target: 452 }, 453: { nivel: 15, target: 454 }, 456: { nivel: 15, target: 457 }, 458: { nivel: 15, target: 459 },
    495: { nivel: 15, target: 496 }, 496: { nivel: 35, target: 497 }, 498: { nivel: 15, target: 499 }, 499: { nivel: 35, target: 500 }, 501: { nivel: 15, target: 502 }, 502: { nivel: 35, target: 503 }, 504: { nivel: 15, target: 505 }, 506: { nivel: 15, target: 507 }, 507: { nivel: 35, target: 508 }, 509: { nivel: 15, target: 510 }, 519: { nivel: 15, target: 520 }, 520: { nivel: 35, target: 521 }, 522: { nivel: 15, target: 523 }, 524: { nivel: 15, target: 525 }, 525: { nivel: 35, target: 526 }, 527: { nivel: 15, target: 528 }, 529: { nivel: 15, target: 530 }, 532: { nivel: 15, target: 533 }, 533: { nivel: 35, target: 534 }, 535: { nivel: 15, target: 536 }, 536: { nivel: 35, target: 537 }, 540: { nivel: 15, target: 541 }, 541: { nivel: 35, target: 542 }, 543: { nivel: 15, target: 544 }, 544: { nivel: 35, target: 545 }, 551: { nivel: 15, target: 552 }, 552: { nivel: 35, target: 553 }, 557: { nivel: 15, target: 558 }, 559: { nivel: 15, target: 560 }, 564: { nivel: 15, target: 565 }, 566: { nivel: 15, target: 567 }, 568: { nivel: 15, target: 569 }, 570: { nivel: 15, target: 571 }, 572: { nivel: 15, target: 573 }, 574: { nivel: 15, target: 575 }, 575: { nivel: 35, target: 576 }, 577: { nivel: 15, target: 578 }, 578: { nivel: 35, target: 579 }, 580: { nivel: 15, target: 581 }, 582: { nivel: 15, target: 583 }, 583: { nivel: 35, target: 584 }, 585: { nivel: 15, target: 586 }, 587: { nivel: 15, target: 588 }, 590: { nivel: 15, target: 591 }, 592: { nivel: 15, target: 593 }, 595: { nivel: 15, target: 596 }, 597: { nivel: 15, target: 598 }, 599: { nivel: 15, target: 600 }, 600: { nivel: 35, target: 601 }, 602: { nivel: 15, target: 603 }, 603: { nivel: 35, target: 604 }, 605: { nivel: 15, target: 606 }, 607: { nivel: 15, target: 608 }, 608: { nivel: 35, target: 609 }, 610: { nivel: 15, target: 611 }, 611: { nivel: 35, target: 612 }, 613: { nivel: 15, target: 614 }, 619: { nivel: 15, target: 620 }, 622: { nivel: 15, target: 623 }, 624: { nivel: 15, target: 625 }, 627: { nivel: 15, target: 628 }, 629: { nivel: 15, target: 630 }, 633: { nivel: 15, target: 634 }, 634: { nivel: 35, target: 635 }, 636: { nivel: 15, target: 637 }
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
    { piso: 1, nombre: "Entrenador Novato", idPoke: 504, recompensa: 30 },
    { piso: 2, nombre: "Líder Cilan/Chili/Cress", idPoke: 512, recompensa: 50 },
    { piso: 3, nombre: "Líder Lenora", idPoke: 505, recompensa: 75 },
    { piso: 4, nombre: "Líder Burgh", idPoke: 542, recompensa: 100 },
    { piso: 5, nombre: "Líder Elesa", idPoke: 523, recompensa: 140 },
    { piso: 6, nombre: "Líder Clay", idPoke: 530, recompensa: 180 },
    { piso: 7, nombre: "Líder Skyla", idPoke: 581, recompensa: 220 },
    { piso: 8, nombre: "Líder Brycen", idPoke: 615, recompensa: 280 },
    { piso: 9, nombre: "Líder Drayden/Iris", idPoke: 612, recompensa: 350 },
    { piso: 10, nombre: "Rival Cheren", idPoke: 508, recompensa: 450 },
    { piso: 11, nombre: "Líder del Equipo Plasma N", idPoke: 571, recompensa: 550 },
    { piso: 12, nombre: "Dragón Legendario Reshiram", idPoke: 643, recompensa: 650 },
    { piso: 13, nombre: "Dragón Legendario Zekrom", idPoke: 644, recompensa: 750 },
    { piso: 14, nombre: "Dragón Soberano Kyurem", idPoke: 646, recompensa: 850 },
    { piso: 15, nombre: "Mítico Genesect", idPoke: 649, recompensa: 1000 }
];

const DEFINICION_MISIONES_DIARIAS = [
    { id: "m_tiradas", titulo: "🔴 Tirador Novato", desc: "Abre 3 Pokéballs", req: 3, recompensa: 300, getProgreso: () => stats.tiradasHoy || 0 },
    { id: "m_casino", titulo: "🎰 Apostador", desc: "Juega 3 veces al Casino", req: 3, recompensa: 400, getProgreso: () => stats.casinoHoy || 0 },
    { id: "m_arena", titulo: "⚔️ Luchador", desc: "Gana 2 combates en Arena", req: 2, recompensa: 500, getProgreso: () => stats.victoriasHoy || 0 },
    { id: "m_torre", titulo: "🏰 Torre", desc: "Vence 1 piso en Torre", req: 1, recompensa: 600, getProgreso: () => stats.torreHoy || 0 },
    { id: "m_fusion", titulo: "♻️ Alquimista", desc: "Realiza 1 fusión", req: 1, recompensa: 500, getProgreso: () => stats.fusionesHoy || 0 }
];

const DEFINICION_LOGROS = [
    { id: "l_pokedex_20", titulo: "🏅 Coleccionista", desc: "Registra 20 Pokémon", req: 20, recompensa: 1000, getProgreso: () => pokedexDescubiertos.length },
    { id: "l_pokedex_100", titulo: "🏆 Maestro Pokédex", desc: "Registra 100 Pokémon", req: 100, recompensa: 5000, getProgreso: () => pokedexDescubiertos.length },
    { id: "l_shiny_1", titulo: "✨ Cazador Shiny", desc: "Consigue 1 Pokémon Shiny", req: 1, recompensa: 3000, getProgreso: () => stats.shiniesTotales || 0 },
    { id: "l_torre_10", titulo: "🏰 Conquistador Torre", desc: "Alcanza el Piso 10", req: 10, recompensa: 10000, getProgreso: () => pisoTorreActual },
    { id: "l_ganancias_25k", titulo: "💰 Magnate", desc: "Gana 25.000 Pokedólares", req: 25000, recompensa: 5000, getProgreso: () => stats.ganadosTotales || 0 }
];

let audioSilenciado = false, audioCtx = null;

function reproducirSonido(tipo) {
    if (audioSilenciado) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator(), gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    const ah = audioCtx.currentTime;

    if (tipo === 'tirar') { osc.type = 'sine'; osc.frequency.setValueAtTime(300, ah); osc.frequency.exponentialRampToValueAtTime(600, ah + 0.4); gainNode.gain.setValueAtTime(0.08, ah); gainNode.gain.linearRampToValueAtTime(0, ah + 0.4); osc.start(ah); osc.stop(ah + 0.4); }
    else if (tipo === 'golpe') { osc.type = 'square'; osc.frequency.setValueAtTime(150, ah); osc.frequency.exponentialRampToValueAtTime(40, ah + 0.15); gainNode.gain.setValueAtTime(0.2, ah); gainNode.gain.linearRampToValueAtTime(0, ah + 0.15); osc.start(ah); osc.stop(ah + 0.15); }
    else if (tipo === 'super') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(250, ah); osc.frequency.exponentialRampToValueAtTime(600, ah + 0.25); gainNode.gain.setValueAtTime(0.25, ah); gainNode.gain.linearRampToValueAtTime(0, ah + 0.25); osc.start(ah); osc.stop(ah + 0.25); }
    else if (tipo === 'legendario') { osc.type = 'triangle'; osc.frequency.setValueAtTime(400, ah); osc.frequency.setValueAtTime(600, ah + 0.15); osc.frequency.setValueAtTime(800, ah + 0.3); gainNode.gain.setValueAtTime(0.15, ah); gainNode.gain.linearRampToValueAtTime(0, ah + 0.6); osc.start(ah); osc.stop(ah + 0.6); }
}

function alternarAudio() {
    audioSilenciado = !audioSilenciado;
    const btn = document.getElementById('btn-audio');
    if (audioSilenciado) { btn.innerText = "🔇 Música: OFF"; btn.classList.add('muted'); }
    else { btn.innerText = "🔊 Música: ON"; btn.classList.remove('muted'); }
}

function generarIdNumerico() { return Math.floor(10000 + Math.random() * 90000).toString(); }

function inicializarJugadorOnline() {
    if (!idUsuarioActual) { idUsuarioActual = generarIdNumerico(); localStorage.setItem('pokeGachaIdUsuario', idUsuarioActual); }
    usuarioActual = "Entrenador " + idUsuarioActual;
    document.getElementById('nombre-usuario-display').innerText = usuarioActual;
    document.getElementById('id-usuario-display').innerText = `#${idUsuarioActual}`;

    cargarPartida();
    actualizarUI();
    inicializarPeerJS();
}

function inicializarPeerJS() {
    peer = new Peer(`pokegacha-${idUsuarioActual}`);
    peer.on('open', () => { document.getElementById('status-online-badge').innerText = "🌐 ONLINE"; });
    peer.on('connection', (conn) => { conexionPeerActiva = conn; configurarEventosConexion(conn); });
}

function conectarAmigoOnline() {
    const idA = String(document.getElementById('input-nuevo-amigo').value.trim());
    if (!idA || idA.length !== 5 || idA === String(idUsuarioActual)) { alert("❌ ID inválido."); return; }
    document.getElementById('estado-conexion-amigo').innerText = `⏳ Conectando con #${idA}...`;
    configurarEventosConexion(peer.connect(`pokegacha-${idA}`));
}

function configurarEventosConexion(conn) {
    conn.on('open', () => {
        conexionPeerActiva = conn;
        const idA = conn.peer.replace('pokegacha-', '');
        document.getElementById('estado-conexion-amigo').innerText = `🟢 CONECTADO con #${idA}`;
        document.getElementById('msg-sin-amigo-seleccionado').classList.add('hidden');
        document.getElementById('zona-intercambio-amigo').classList.remove('hidden');
        document.getElementById('nombre-amigo-intercambio').innerText = `Entrenador #${idA}`;
        renderizarGridIntercambio();
        alert(`🎉 ¡Conectado con #${idA}!`);
    });

    conn.on('data', (data) => {
        if (data.tipo === 'pokemon_recibido') {
            inventario.push(data.pokemon);
            if (!pokedexDescubiertos.includes(data.pokemon.id)) pokedexDescubiertos.push(data.pokemon.id);
            reproducirSonido('legendario');
            actualizarUI();
            alert(`🎁 ¡Recibiste a ${data.pokemon.nombre}!`);
        } else if (data.tipo === 'gts_sincronizar') {
            gtsGlobalListado = data.lista || [];
            renderizarTablonGTS();
        } else if (data.tipo === 'solicitud_pvp') {
            if (confirm(`⚔️ ¡${data.nombre} te desafía a un combate PvP! ¿Aceptas?`)) {
                iniciarCombatePvpRecibido(data.pokemon);
                conn.send({ tipo: 'aceptar_pvp', pokemon: pokemonLuchador });
            }
        } else if (data.tipo === 'aceptar_pvp') {
            comenzarLuchaPvpSync(data.pokemon);
        } else if (data.tipo === 'ataque_pvp') {
            procesarAtaquePvpRecibido(data.danio);
        }
    });
}

// LÓGICA PVP DIRECTO EN TIEMPO REAL
function enviarDesafioPvp() {
    if (!conexionPeerActiva) { alert("❌ Necesitas estar conectado con un amigo."); return; }
    if (!pokemonLuchador) { alert("❌ Primero selecciona tu Pokémon luchador activo en la pestaña 'Arena 1v1'."); return; }

    conexionPeerActiva.send({
        tipo: 'solicitud_pvp',
        nombre: usuarioActual,
        pokemon: pokemonLuchador
    });
    alert("⏳ Solicitud de PvP enviada a tu amigo...");
}

function iniciarCombatePvpRecibido(pokeRival) {
    if (!pokemonLuchador) pokemonLuchador = inventario[0];
    estadoPvp.enCombate = true;
    estadoPvp.miPokemon = pokemonLuchador;
    estadoPvp.rivalPokemon = pokeRival;

    const multM = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonLuchador.rareza] || 1;
    estadoPvp.hpMaxMiPokemon = Math.round(100 * multM + (pokemonLuchador.nivel * 20));
    estadoPvp.hpMiPokemon = estadoPvp.hpMaxMiPokemon;

    const multR = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokeRival.rareza] || 1;
    estadoPvp.hpMaxRivalPokemon = Math.round(100 * multR + (pokeRival.nivel * 20));
    estadoPvp.hpRivalPokemon = estadoPvp.hpMaxRivalPokemon;

    actualizarUICombatePvp();
}

function comenzarLuchaPvpSync(pokeRival) {
    estadoPvp.enCombate = true;
    estadoPvp.miPokemon = pokemonLuchador;
    estadoPvp.rivalPokemon = pokeRival;

    const multM = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonLuchador.rareza] || 1;
    estadoPvp.hpMaxMiPokemon = Math.round(100 * multM + (pokemonLuchador.nivel * 20));
    estadoPvp.hpMiPokemon = estadoPvp.hpMaxMiPokemon;

    const multR = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokeRival.rareza] || 1;
    estadoPvp.hpMaxRivalPokemon = Math.round(100 * multR + (pokeRival.nivel * 20));
    estadoPvp.hpRivalPokemon = estadoPvp.hpMaxRivalPokemon;

    actualizarUICombatePvp();
    alert("⚔️ ¡Tu amigo aceptó el PvP! ¡Comienza la batalla!");
}

function actualizarUICombatePvp() {
    document.getElementById('arena-pvp-directa').classList.remove('hidden');
    document.getElementById('controles-pvp').classList.remove('hidden');

    document.getElementById('nombre-jugador-pvp').innerText = `Tú (${estadoPvp.miPokemon.nombre})`;
    document.getElementById('display-jugador-pvp').innerHTML = `<img src="${estadoPvp.miPokemon.sprite}">`;
    document.getElementById('text-hp-jugador-pvp').innerText = `${estadoPvp.hpMiPokemon} / ${estadoPvp.hpMaxMiPokemon} HP`;

    document.getElementById('nombre-rival-pvp').innerText = `Amigo (${estadoPvp.rivalPokemon.nombre})`;
    document.getElementById('display-rival-pvp').innerHTML = `<img src="${estadoPvp.rivalPokemon.sprite}">`;
    document.getElementById('text-hp-rival-pvp').innerText = `${estadoPvp.hpRivalPokemon} / ${estadoPvp.hpMaxRivalPokemon} HP`;
}

function ejecutarAtaquePvp() {
    if (!conexionPeerActiva || !estadoPvp.enCombate) return;
    const mult = TABLA_TIPOS[estadoPvp.miPokemon.tipo]?.[estadoPvp.rivalPokemon.tipo] ?? 1.0;
    const danio = Math.round((18 + (estadoPvp.miPokemon.nivel * 5)) * mult);

    estadoPvp.hpRivalPokemon = Math.max(0, estadoPvp.hpRivalPokemon - danio);
    document.getElementById('hp-rival-pvp').style.width = `${(estadoPvp.hpRivalPokemon / estadoPvp.hpMaxRivalPokemon) * 100}%`;
    document.getElementById('text-hp-rival-pvp').innerText = `${estadoPvp.hpRivalPokemon} / ${estadoPvp.hpMaxRivalPokemon} HP`;

    conexionPeerActiva.send({ tipo: 'ataque_pvp', danio: danio });
    reproducirSonido('golpe');

    if (estadoPvp.hpRivalPokemon <= 0) {
        monedas += 1000;
        stats.ganadosTotales += 1000;
        reproducirSonido('legendario');
        alert("🎉 ¡HAS GANADO EL COMBATE PVP EN VIVO! Recompensa: +1.000 💰");
        document.getElementById('controles-pvp').classList.add('hidden');
        actualizarUI();
    }
}

function procesarAtaquePvpRecibido(danio) {
    estadoPvp.hpMiPokemon = Math.max(0, estadoPvp.hpMiPokemon - danio);
    document.getElementById('hp-jugador-pvp').style.width = `${(estadoPvp.hpMiPokemon / estadoPvp.hpMaxMiPokemon) * 100}%`;
    document.getElementById('text-hp-jugador-pvp').innerText = `${estadoPvp.hpMiPokemon} / ${estadoPvp.hpMaxMiPokemon} HP`;

    if (estadoPvp.hpMiPokemon <= 0) {
        alert("😢 Fuiste derrotado por tu amigo en el PvP.");
        document.getElementById('controles-pvp').classList.add('hidden');
    }
}

// NUEVO MINIJUEGO 1: HIGHER OR LOWER
function jugarHighLow(opcion) {
    if (monedas < 150) { alert("❌ Necesitas 150 Pokedólares."); return; }

    if (highLowNivelActual === null) {
        highLowNivelActual = Math.floor(Math.random() * 90) + 10;
        document.getElementById('val-hl-actual').innerText = highLowNivelActual;
        return;
    }

    monedas -= 150;
    stats.gastadosTotales += 150;
    stats.casinoHoy++;

    const nuevoNivel = Math.floor(Math.random() * 90) + 10;
    let acierto = (opcion === 'MAYOR' && nuevoNivel >= highLowNivelActual) || (opcion === 'MENOR' && nuevoNivel <= highLowNivelActual);

    if (acierto) {
        rachaHighLow++;
        const premio = 150 + (rachaHighLow * 100);
        monedas += premio;
        stats.ganadosTotales += premio;
        reproducirSonido('legendario');
        alert(`✨ ¡Acierto! Nivel era ${nuevoNivel}. Racha: ${rachaHighLow} (+${premio} 💰)`);
    } else {
        rachaHighLow = 0;
        reproducirSonido('golpe');
        alert(`❌ Fallaste. Nivel era ${nuevoNivel}. Racha reiniciada.`);
    }

    highLowNivelActual = nuevoNivel;
    document.getElementById('val-hl-actual').innerText = highLowNivelActual;
    document.getElementById('racha-hl-num').innerText = rachaHighLow;
    actualizarUI();
}

// NUEVO MINIJUEGO 2: DIANA VOLTORB
function iniciarTableroVoltorb() {
    if (monedas < 200) { alert("❌ Necesitas 200 Pokedólares."); return; }
    monedas -= 200;
    stats.gastadosTotales += 200;
    stats.casinoHoy++;

    voltorbJugando = true;
    voltorbAcumulado = 0;
    voltorbTablero = [];

    const grid = document.getElementById('grid-voltorb');
    grid.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const esBomba = Math.random() < 0.25;
        const valor = esBomba ? 0 : (Math.floor(Math.random() * 3) + 1) * 100;
        voltorbTablero.push({ esBomba, valor, revelada: false });

        const celda = document.createElement('div');
        celda.className = 'celda-voltorb';
        celda.innerText = '❓';
        celda.onclick = () => abrirCeldaVoltorb(i, celda);
        grid.appendChild(celda);
    }

    document.getElementById('btn-retirar-voltorb').disabled = false;
    actualizarUI();
}

function abrirCeldaVoltorb(idx, celda) {
    if (!voltorbJugando || voltorbTablero[idx].revelada) return;

    const data = voltorbTablero[idx];
    data.revelada = true;

    if (data.esBomba) {
        celda.className = 'celda-voltorb bomba';
        celda.innerText = '💣';
        voltorbJugando = false;
        voltorbAcumulado = 0;
        document.getElementById('btn-retirar-voltorb').disabled = true;
        reproducirSonido('golpe');
        alert("💥 ¡BOOM! Un Voltorb explotó. Perdiste tus ganancias.");
    } else {
        celda.className = 'celda-voltorb revelada';
        celda.innerText = `+${data.valor}`;
        voltorbAcumulado += data.valor;
        reproducirSonido('super');
    }
}

function retirarseVoltorb() {
    if (!voltorbJugando || voltorbAcumulado <= 0) return;
    monedas += voltorbAcumulado;
    stats.ganadosTotales += voltorbAcumulado;
    reproducirSonido('legendario');
    alert(`🎉 ¡Te retiraste a tiempo! Recompensa: +${voltorbAcumulado} 💰`);
    voltorbJugando = false;
    document.getElementById('btn-retirar-voltorb').disabled = true;
    actualizarUI();
}

function comprarObjeto(tipoObj, costo) {
    if (monedas < costo) { alert("❌ No tienes suficientes Pokedólares."); return; }
    monedas -= costo;
    stats.gastadosTotales += costo;
    bolsaObjetos[tipoObj] = (bolsaObjetos[tipoObj] || 0) + 1;
    reproducirSonido('legendario');
    actualizarUI();
    renderizarBolsaObjetos();
    alert(`🎉 ¡Compraste 1 objeto! Añadido a tu bolsa.`);
}

function usarCarameloRaro(instanciaId) {
    if (bolsaObjetos.carameloRaro <= 0) { alert("❌ No tienes Caramelos Raros en tu bolsa."); return; }
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    if (!poke || poke.nivel >= 100) return;

    bolsaObjetos.carameloRaro--;
    poke.nivel++;
    reproducirSonido('legendario');
    actualizarUI();
    renderizarBolsaObjetos();
    alert(`🍬 ¡${poke.nombre} subió al Nivel ${poke.nivel}!`);
}

function equiparEscudoPermaDeath(instanciaId) {
    if (bolsaObjetos.escudoPermaDeath <= 0) { alert("❌ No tienes Escudos en tu bolsa."); return; }
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    if (!poke) return;
    if (poke.tieneEscudo) { alert("🛡️ Este Pokémon ya tiene un escudo equipado."); return; }

    bolsaObjetos.escudoPermaDeath--;
    poke.tieneEscudo = true;
    reproducirSonido('legendario');
    actualizarUI();
    renderizarBolsaObjetos();
    alert(`🛡️ ¡Escudo equipado en ${poke.nombre}! Estará protegido de morir 1 vez.`);
}

function usarPiedraEvolutiva(instanciaId, piedra) {
    if (bolsaObjetos[piedra] <= 0) { alert("❌ No tienes esta piedra en tu bolsa."); return; }
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    if (!poke || !MAPA_EVOLUCIONES[poke.id]) { alert("❌ Este Pokémon no puede evolucionar con esta piedra."); return; }

    bolsaObjetos[piedra]--;
    const datosEvol = MAPA_EVOLUCIONES[poke.id];
    evolucionarPokemonDirecto(poke, datosEvol.target);
    renderizarBolsaObjetos();
}

async function evolucionarPokemonDirecto(poke, targetId) {
    try {
        reproducirSonido('legendario');
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetId}`);
        const datos = await res.json();
        let nuevaRareza = 'Comun', nuevoValor = 40;
        if (POOL_LEGENDARIOS.includes(datos.id)) { nuevaRareza = 'Legendario'; nuevoValor = 500; }
        else if (POOL_EPICOS.includes(datos.id)) { nuevaRareza = 'Epico'; nuevoValor = 180; }
        else if (POOL_RAROS.includes(datos.id)) { nuevaRareza = 'Raro'; nuevoValor = 60; }
        if (poke.esShiny) nuevoValor *= 3;

        poke.id = datos.id; poke.nombre = poke.esShiny ? `✨ ${datos.name}` : datos.name; poke.sprite = datos.sprites.front_default; poke.rareza = nuevaRareza; poke.valorBase = nuevoValor; poke.tipo = datos.types[0].type.name;
        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
        actualizarUI();
        alert(`✨ ¡Tu Pokémon evolucionó a ${poke.nombre}! 🎉`);
    } catch (e) { console.error(e); }
}

function renderizarBolsaObjetos() {
    const box = document.getElementById('bolsa-objetos-display');
    if (!box) return;
    box.innerHTML = '';

    const nombres = {
        carameloRaro: '🍬 Caramelo Raro',
        escudoPermaDeath: '🛡️ Escudo Perma-Death',
        piedraFuego: '🔥 Piedra Fuego',
        piedraAgua: '💧 Piedra Agua',
        piedraTrueno: '⚡ Piedra Trueno',
        pocionMaxima: '🧪 Poción Máxima'
    };

    Object.keys(bolsaObjetos).forEach(k => {
        const cant = bolsaObjetos[k];
        const item = document.createElement('div');
        item.className = 'insignia-card obtenida';
        item.style.fontSize = '0.85rem';
        item.innerHTML = `<strong>${nombres[k]}</strong><br><small>Cantidad: x${cant}</small>`;
        box.appendChild(item);
    });
}

function renderizarGridIntercambio() {
    const grid = document.getElementById('grid-inventario-intercambio'); if (!grid) return; grid.innerHTML = '';
    inventario.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="enviarPokemonIntercambioOnline(${poke.instanciaId})">Enviar 🎁</button>`;
        grid.appendChild(card);
    });
}

function enviarPokemonIntercambioOnline(instanciaId) {
    if (!conexionPeerActiva) return;
    const idx = inventario.findIndex(p => p.instanciaId === instanciaId); if (idx === -1) return;
    const poke = inventario.splice(idx, 1)[0];
    conexionPeerActiva.send({ tipo: 'pokemon_recibido', pokemon: poke });
    reproducirSonido('legendario'); actualizarUI(); renderizarGridIntercambio();
}

function renderizarColeccionGTS() {
    const grid = document.getElementById('grid-gts-coleccion'); if (!grid) return; grid.innerHTML = '';
    const txt = (document.getElementById('input-buscar-gts')?.value || '').toLowerCase();
    inventario.filter(p => p.nombre.toLowerCase().includes(txt)).forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="publicarEnGTS(${poke.instanciaId})">Publicar 🌐</button>`;
        grid.appendChild(card);
    });
}

function publicarEnGTS(instanciaId) {
    const idx = inventario.findIndex(p => p.instanciaId === instanciaId); if (idx === -1) return;
    const poke = inventario.splice(idx, 1)[0];
    gtsGlobalListado.push({ ...poke, duenio: usuarioActual });
    if (conexionPeerActiva) conexionPeerActiva.send({ tipo: 'gts_sincronizar', lista: gtsGlobalListado });
    reproducirSonido('legendario'); actualizarUI(); renderizarColeccionGTS(); renderizarTablonGTS();
}

function renderizarTablonGTS() {
    const grid = document.getElementById('grid-gts-tablon'); if (!grid) return; grid.innerHTML = '';
    if (gtsGlobalListado.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px;">No hay Pokémon en el GTS.</p>`; return; }
    gtsGlobalListado.forEach((poke, i) => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel} (${poke.duenio})</small><button class="btn-card btn-evolucionar" onclick="reclamarDeGTS(${i})">Adquirir 📥</button>`;
        grid.appendChild(card);
    });
}

function reclamarDeGTS(idx) {
    const poke = gtsGlobalListado.splice(idx, 1)[0];
    inventario.push(poke);
    if (!pokedexDescubiertos.includes(poke.id)) pokedexDescubiertos.push(poke.id);
    if (conexionPeerActiva) conexionPeerActiva.send({ tipo: 'gts_sincronizar', lista: gtsGlobalListado });
    reproducirSonido('legendario'); actualizarUI(); renderizarColeccionGTS(); renderizarTablonGTS();
}

function renderizarSeleccionTorneo() {
    const grid = document.getElementById('grid-seleccion-torneo'); if (!grid) return; grid.innerHTML = '';
    const txt = (document.getElementById('input-buscar-torneo')?.value || '').toLowerCase();
    const filtrados = inventario.filter(p => p.nombre.toLowerCase().includes(txt));

    filtrados.forEach(poke => {
        const enEquipo = equipoTorneo.some(p => p.instanciaId === poke.instanciaId);
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card ${enEquipo ? 'btn-vender' : 'btn-subir'}" onclick="toggleEquipoTorneo(${poke.instanciaId})">${enEquipo ? 'Quitar' : 'Añadir 🛡️'}</button>`;
        grid.appendChild(card);
    });
    document.getElementById('count-equipo-torneo').innerText = equipoTorneo.length;
}

function toggleEquipoTorneo(instanciaId) {
    reproducirSonido('normal');
    const idx = equipoTorneo.findIndex(p => p.instanciaId === instanciaId);
    if (idx !== -1) { equipoTorneo.splice(idx, 1); }
    else if (equipoTorneo.length < 3) {
        const poke = inventario.find(p => p.instanciaId === instanciaId);
        if (poke) equipoTorneo.push(poke);
    } else { alert("❌ Tu equipo ya tiene 3 Pokémon."); }
    renderizarSeleccionTorneo();
}

function renderizarMedallero() {
    const grid = document.getElementById('grid-insignias-display'); if (!grid) return; grid.innerHTML = '';
    LIDERES_TORNEO_3V3.forEach(l => {
        const obt = insigniasObtenidas.includes(l.id);
        const el = document.createElement('div');
        el.className = `insignia-card ${obt ? 'obtenida' : ''}`;
        el.innerHTML = `<strong>${l.titulo}</strong><br><small>${obt ? '✔️ Ganada' : 'Bloqueada'}</small>`;
        grid.appendChild(el);
    });
}

function actualizarInfoRivalTorneo() {
    if (rivalTorneoIndex >= LIDERES_TORNEO_3V3.length) rivalTorneoIndex = 0;
    const rival = LIDERES_TORNEO_3V3[rivalTorneoIndex];
    document.getElementById('titulo-rival-torneo').innerText = `Rival ${rivalTorneoIndex + 1}: ${rival.nombre} (${rival.titulo})`;
    document.getElementById('desc-rival-torneo').innerText = `Recompensa: +${rival.recompensa} 💰 e Insignia ${rival.titulo}`;
}

async function iniciarCombateTorneo() {
    if (equipoTorneo.length !== 3) { alert("❌ Selecciona exactamente 3 Pokémon en tu equipo a la izquierda."); return; }
    reproducirSonido('normal');

    const rival = LIDERES_TORNEO_3V3[rivalTorneoIndex];
    const firstRivalId = rival.equipoIds[0];
    const firstRivalNivel = rival.niveles[0];

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${firstRivalId}`);
    const datos = await res.json();

    pokemonRivalActivo = { nombre: datos.name, sprite: datos.sprites.front_default, nivel: firstRivalNivel, tipo: datos.types[0].type.name, indexEquipo: 0 };
    hpRivalTorneoMax = Math.round(100 + (firstRivalNivel * 20));
    hpRivalTorneoActual = hpRivalTorneoMax;

    indexPokeJugadorActivo = 0;
    pokemonJugadorActivo = equipoTorneo[indexPokeJugadorActivo];
    const mult = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonJugadorActivo.rareza] || 1;
    hpJugadorTorneoMax = Math.round(100 * mult + (pokemonJugadorActivo.nivel * 20));
    hpJugadorTorneoActual = hpJugadorTorneoMax;

    document.getElementById('nombre-lider-torneo').innerText = `${rival.nombre} (${pokemonRivalActivo.nombre})`;
    document.getElementById('display-lider-torneo').innerHTML = `<img src="${pokemonRivalActivo.sprite}" alt="Rival">`;
    document.getElementById('text-hp-lider-torneo').innerText = `${hpRivalTorneoActual} / ${hpRivalTorneoMax} HP`;
    document.getElementById('hp-lider-torneo').style.width = '100%';

    document.getElementById('nombre-jugador-torneo').innerText = `Tu Activo (${pokemonJugadorActivo.nombre})`;
    document.getElementById('display-jugador-torneo').innerHTML = `<img src="${pokemonJugadorActivo.sprite}" alt="Tu Pokémon">`;
    document.getElementById('text-hp-jugador-torneo').innerText = `${hpJugadorTorneoActual} / ${hpJugadorTorneoMax} HP`;
    document.getElementById('hp-jugador-torneo').style.width = '100%';

    document.getElementById('arena-torneo').classList.remove('hidden');
    document.getElementById('controles-torneo').classList.remove('hidden');
    document.getElementById('btn-desafiar-torneo').disabled = true;

    mostrarResumenTorneoLiga(`🏆 ¡Comienza el combate 3v3 contra ${rival.nombre}!`, '');
}

async function cargarSiguienteRivalTorneo() {
    const rivalInfo = LIDERES_TORNEO_3V3[rivalTorneoIndex];
    pokemonRivalActivo.indexEquipo++;

    if (pokemonRivalActivo.indexEquipo >= rivalInfo.equipoIds.length) {
        monedas += rivalInfo.recompensa; stats.ganadosTotales += rivalInfo.recompensa;
        if (!insigniasObtenidas.includes(rivalInfo.id)) insigniasObtenidas.push(rivalInfo.id);
        reproducirSonido('legendario');
        mostrarResumenTorneoLiga(`🏆 ¡HAS GANADO EL TORNEO CONTRA ${rivalInfo.nombre}! +${rivalInfo.recompensa} 💰 e Insignia Obtenida 🎉`, 'ganado');
        document.getElementById('controles-torneo').classList.add('hidden');
        document.getElementById('btn-desafiar-torneo').disabled = false;
        rivalTorneoIndex++;
        actualizarInfoRivalTorneo();
        renderizarMedallero();
        actualizarUI();
        return;
    }

    const nextId = rivalInfo.equipoIds[pokemonRivalActivo.indexEquipo];
    const nextNiv = rivalInfo.niveles[pokemonRivalActivo.indexEquipo];
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
    const datos = await res.json();

    pokemonRivalActivo = { nombre: datos.name, sprite: datos.sprites.front_default, nivel: nextNiv, tipo: datos.types[0].type.name, indexEquipo: pokemonRivalActivo.indexEquipo };
    hpRivalTorneoMax = Math.round(100 + (nextNiv * 20));
    hpRivalTorneoActual = hpRivalTorneoMax;

    document.getElementById('nombre-lider-torneo').innerText = `${rivalInfo.nombre} (${pokemonRivalActivo.nombre})`;
    document.getElementById('display-lider-torneo').innerHTML = `<img src="${pokemonRivalActivo.sprite}" alt="Rival">`;
    document.getElementById('text-hp-lider-torneo').innerText = `${hpRivalTorneoActual} / ${hpRivalTorneoMax} HP`;
    document.getElementById('hp-lider-torneo').style.width = '100%';
}

function ejecutarAtaqueTorneo() {
    if (!pokemonJugadorActivo || !pokemonRivalActivo) return;
    const mult = TABLA_TIPOS[pokemonJugadorActivo.tipo]?.[pokemonRivalActivo.tipo] ?? 1.0;
    const danio = Math.round((18 + (pokemonJugadorActivo.nivel * 5)) * mult);

    hpRivalTorneoActual = Math.max(0, hpRivalTorneoActual - danio);
    document.getElementById('hp-lider-torneo').style.width = `${(hpRivalTorneoActual / hpRivalTorneoMax) * 100}%`;
    document.getElementById('text-hp-lider-torneo').innerText = `${hpRivalTorneoActual} / ${hpRivalTorneoMax} HP`;
    reproducirSonido('golpe');

    if (hpRivalTorneoActual <= 0) {
        cargarSiguienteRivalTorneo();
        return;
    }

    setTimeout(() => {
        const multR = TABLA_TIPOS[pokemonRivalActivo.tipo]?.[pokemonJugadorActivo.tipo] ?? 1.0;
        const danioR = Math.round((12 + (pokemonRivalActivo.nivel * 4)) * multR);

        hpJugadorTorneoActual = Math.max(0, hpJugadorTorneoActual - danioR);
        document.getElementById('hp-jugador-torneo').style.width = `${(hpJugadorTorneoActual / hpJugadorTorneoMax) * 100}%`;
        document.getElementById('text-hp-jugador-torneo').innerText = `${hpJugadorTorneoActual} / ${hpJugadorTorneoMax} HP`;

        if (hpJugadorTorneoActual <= 0) {
            indexPokeJugadorActivo++;
            if (indexPokeJugadorActivo >= equipoTorneo.length) {
                mostrarResumenTorre(`☠️ Todo tu equipo fue derrotado por el Líder.`, 'perdido');
                document.getElementById('controles-torneo').classList.add('hidden');
                document.getElementById('btn-desafiar-torneo').disabled = false;
            } else {
                pokemonJugadorActivo = equipoTorneo[indexPokeJugadorActivo];
                const multP = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonJugadorActivo.rareza] || 1;
                hpJugadorTorneoMax = Math.round(100 * multP + (pokemonJugadorActivo.nivel * 20));
                hpJugadorTorneoActual = hpJugadorTorneoMax;
                document.getElementById('nombre-jugador-torneo').innerText = `Tu Activo (${pokemonJugadorActivo.nombre})`;
                document.getElementById('display-jugador-torneo').innerHTML = `<img src="${pokemonJugadorActivo.sprite}" alt="Tu Pokémon">`;
                document.getElementById('text-hp-jugador-torneo').innerText = `${hpJugadorTorneoActual} / ${hpJugadorTorneoMax} HP`;
                document.getElementById('hp-jugador-torneo').style.width = '100%';
            }
        }
    }, 600);
}

function mostrarResumenTorneoLiga(t, c) {
    const box = document.getElementById('resumen-torneo');
    box.className = `resumen-combate-box ${c}`;
    document.getElementById('texto-resumen-torneo').innerHTML = t;
}

function guardarPartida() {
    if (!idUsuarioActual) return;
    const datos = { monedas, inventario, bolsaObjetos, pokedexDescubiertos, logrosReclamados, misionesReclamadas, generacionesReclamadas, insigniasObtenidas, stats, pisoTorreActual, rivalTorneoIndex };
    localStorage.setItem(`pokeGachaDatos_${idUsuarioActual}`, JSON.stringify(datos));
}

function cargarPartida() {
    if (!idUsuarioActual) return;
    const rawData = localStorage.getItem(`pokeGachaDatos_${idUsuarioActual}`);
    if (rawData) {
        const data = JSON.parse(rawData);
        monedas = data.monedas ?? 500;
        inventario = data.inventario ?? [];
        bolsaObjetos = data.bolsaObjetos ?? { carameloRaro: 0, escudoPermaDeath: 0, piedraFuego: 0, piedraAgua: 0, piedraTrueno: 0, pocionMaxima: 0 };
        pokedexDescubiertos = data.pokedexDescubiertos ?? [];
        logrosReclamados = data.logrosReclamados ?? [];
        misionesReclamadas = data.misionesReclamadas ?? [];
        generacionesReclamadas = data.generacionesReclamadas ?? [];
        insigniasObtenidas = data.insigniasObtenidas ?? [];
        pisoTorreActual = data.pisoTorreActual ?? 1;
        rivalTorneoIndex = data.rivalTorneoIndex ?? 0;
        stats = data.stats ?? { tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0, victoriasTotales: 0, fusionesTotales: 0, tiradasHoy: 0, casinoHoy: 0, victoriasHoy: 0, torreHoy: 0, fusionesHoy: 0 };
    }
}

function cambiarPestana(pestana) {
    reproducirSonido('normal');
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('main.vista-seccion').forEach(m => m.classList.add('hidden'));

    if (pestana === 'juego') {
        document.querySelector('button[onclick="cambiarPestana(\'juego\')"]').classList.add('active');
        document.getElementById('vista-juego').classList.remove('hidden');
    } else if (pestana === 'tienda') {
        document.querySelector('button[onclick="cambiarPestana(\'tienda\')"]').classList.add('active');
        document.getElementById('vista-tienda').classList.remove('hidden');
        renderizarBolsaObjetos();
    } else if (pestana === 'misiones') {
        document.querySelector('button[onclick="cambiarPestana(\'misiones\')"]').classList.add('active');
        document.getElementById('vista-misiones').classList.remove('hidden');
        renderizarMisionesYLogros();
    } else if (pestana === 'torneo') {
        document.querySelector('button[onclick="cambiarPestana(\'torneo\')"]').classList.add('active');
        document.getElementById('vista-torneo').classList.remove('hidden');
        renderizarSeleccionTorneo();
        renderizarMedallero();
        actualizarInfoRivalTorneo();
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
    } else if (pestana === 'gts') {
        document.querySelector('button[onclick="cambiarPestana(\'gts\')"]').classList.add('active');
        document.getElementById('vista-gts').classList.remove('hidden');
        renderizarColeccionGTS(); renderizarTablonGTS();
    } else if (pestana === 'pokedex') {
        document.querySelector('button[onclick="cambiarPestana(\'pokedex\')"]').classList.add('active');
        document.getElementById('vista-pokedex').classList.remove('hidden');
        renderizarMaestriaGeneraciones();
        renderizarPokedexCompleta();
    }
}

function renderizarMaestriaGeneraciones() {
    const contenedor = document.getElementById('contenedor-maestria-gens'); if (!contenedor) return; contenedor.innerHTML = '';
    RANGOS_GENERACIONES.forEach(gen => {
        const totalGen = (gen.fin - gen.inicio) + 1;
        const descubiertosGen = pokedexDescubiertos.filter(id => id >= gen.inicio && id <= gen.fin).length;
        const completada = descubiertosGen === totalGen;
        const reclamada = generacionesReclamadas.includes(gen.gen);

        const card = document.createElement('div');
        card.className = `casino-card ${completada ? 'lista' : ''}`;
        card.style.textAlign = 'left'; card.style.padding = '15px';
        card.innerHTML = `<strong style="font-size:0.9rem; color:#facc15;">${gen.nombre}</strong><p style="font-size:0.75rem; color:#9ca3af; margin: 4px 0;">Pokédex: ${descubiertosGen} / ${totalGen}</p><div class="hp-bar-bg" style="height:6px; margin-top:6px;"><div class="hp-bar-fill" style="width:${(descubiertosGen / totalGen) * 100}%;"></div></div><div style="margin-top: 10px; display:flex; justify-content:space-between; align-items:center;"><span style="font-size:0.75rem; color:#38bdf8;">+${gen.recompensa} 💰</span>${reclamada ? '<span class="badge-completado" style="font-size:0.65rem;">Reclamado ✔️</span>' : `<button class="btn-primary" style="font-size:0.65rem; padding:4px 8px;" ${!completada ? 'disabled' : ''} onclick="reclamarMaestriaGen(${gen.gen})">Reclamar</button>`}</div>`;
        contenedor.appendChild(card);
    });
}

function reclamarMaestriaGen(genNum) {
    const gen = RANGOS_GENERACIONES.find(g => g.gen === genNum);
    if (!gen || generacionesReclamadas.includes(genNum)) return;
    const totalGen = (gen.fin - gen.inicio) + 1;
    const descubiertosGen = pokedexDescubiertos.filter(id => id >= gen.inicio && id <= gen.fin).length;

    if (descubiertosGen === totalGen) {
        monedas += gen.recompensa; stats.ganadosTotales += gen.recompensa;
        generacionesReclamadas.push(genNum);
        reproducirSonido('legendario'); actualizarUI(); renderizarMaestriaGeneraciones();
        alert(`🏆 ¡Maestría de ${gen.nombre} completada! Has recibido +${gen.recompensa} Pokedólares.`);
    }
}

function renderizarMisionesYLogros() {
    const containerMisiones = document.getElementById('lista-misiones-diarias'), containerLogros = document.getElementById('lista-logros');
    if (!containerMisiones || !containerLogros) return; containerMisiones.innerHTML = ''; containerLogros.innerHTML = '';

    DEFINICION_MISIONES_DIARIAS.forEach(m => {
        const progre = Math.min(m.req, m.getProgreso()), completada = progre >= m.req, reclamada = misionesReclamadas.includes(m.id);
        const card = document.createElement('div'); card.className = `card-mision ${reclamada ? 'reclamada' : completada ? 'lista' : ''}`;
        card.innerHTML = `<div style="flex-grow: 1;"><strong>${m.titulo}</strong><p style="font-size:0.75rem; color:#9ca3af; margin: 2px 0;">${m.desc}</p><div class="hp-bar-bg" style="height:6px; margin-top:5px;"><div class="hp-bar-fill" style="width:${(progre / m.req) * 100}%;"></div></div></div><div style="margin-left: 15px; text-align: right;"><span style="display:block; font-size:0.8rem; font-weight:bold; color:#facc15; margin-bottom:5px;">+${m.recompensa} 💰</span>${reclamada ? '<span class="badge-completado">Completado ✔️</span>' : `<button class="btn-primary" style="font-size:0.7rem; padding:4px 8px;" ${!completada ? 'disabled' : ''} onclick="reclamarMision('${m.id}')">Reclamar</button>`}</div>`;
        containerMisiones.appendChild(card);
    });

    DEFINICION_LOGROS.forEach(l => {
        const progre = Math.min(l.req, l.getProgreso()), completada = progre >= l.req, reclamada = logrosReclamados.includes(l.id);
        const card = document.createElement('div'); card.className = `card-mision ${reclamada ? 'reclamada' : completada ? 'lista' : ''}`;
        card.innerHTML = `<div style="flex-grow: 1;"><strong>${l.titulo}</strong><p style="font-size:0.75rem; color:#9ca3af; margin: 2px 0;">${l.desc}</p><div class="hp-bar-bg" style="height:6px; margin-top:5px;"><div class="hp-bar-fill" style="width:${(progre / l.req) * 100}%;"></div></div></div><div style="margin-left: 15px; text-align: right;"><span style="display:block; font-size:0.8rem; font-weight:bold; color:#facc15; margin-bottom:5px;">+${l.recompensa} 💰</span>${reclamada ? '<span class="badge-completado">Completado ✔️</span>' : `<button class="btn-primary" style="font-size:0.7rem; padding:4px 8px;" ${!completada ? 'disabled' : ''} onclick="reclamarLogro('${l.id}')">Reclamar</button>`}</div>`;
        containerLogros.appendChild(card);
    });
}

function reclamarMision(misionId) {
    const mision = DEFINICION_MISIONES_DIARIAS.find(m => m.id === misionId); if (!mision || misionesReclamadas.includes(misionId)) return;
    if (mision.getProgreso() >= mision.req) {
        monedas += mision.recompensa; stats.ganadosTotales += mision.recompensa; misionesReclamadas.push(misionId);
        reproducirSonido('legendario'); actualizarUI(); renderizarMisionesYLogros(); alert(`🎯 Recompensa: +${mision.recompensa} Pokedólares.`);
    }
}

function reclamarLogro(logroId) {
    const logro = DEFINICION_LOGROS.find(l => l.id === logroId); if (!logro || logrosReclamados.includes(logroId)) return;
    if (logro.getProgreso() >= logro.req) {
        monedas += logro.recompensa; stats.ganadosTotales += logro.recompensa; logrosReclamados.push(logroId);
        reproducirSonido('legendario'); actualizarUI(); renderizarMisionesYLogros(); alert(`🏆 Logro: +${logro.recompensa} Pokedólares.`);
    }
}

function abrirModalCodigo() { reproducirSonido('normal'); document.getElementById('input-codigo').value = ''; document.getElementById('modal-codigo').classList.remove('hidden'); }
function cerrarModalCodigo() { reproducirSonido('normal'); document.getElementById('modal-codigo').classList.add('hidden'); }

function canjearCodigo() {
    const code = document.getElementById('input-codigo').value.trim().toUpperCase(); if (!code) return;
    if (CODIGOS_VALIDOS[code]) {
        const promo = CODIGOS_VALIDOS[code]; monedas += promo.recompensa; stats.ganadosTotales += promo.recompensa;
        reproducirSonido('legendario'); actualizarUI(); cerrarModalCodigo(); alert(`🎉 ¡Código aceptado! +${promo.recompensa} 💰`);
    } else alert("❌ Código inválido.");
}

async function evolucionarPokemon(instanciaId) {
    const poke = inventario.find(p => p.instanciaId === instanciaId); if (!poke || !MAPA_EVOLUCIONES[poke.id]) return;
    const datosEvol = MAPA_EVOLUCIONES[poke.id]; if (poke.nivel < datosEvol.nivel) return;

    try {
        reproducirSonido('legendario');
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${datosEvol.target}`); const datos = await res.json();
        let nuevaRareza = 'Comun', nuevoValor = 40;
        if (POOL_LEGENDARIOS.includes(datos.id)) { nuevaRareza = 'Legendario'; nuevoValor = 500; }
        else if (POOL_EPICOS.includes(datos.id)) { nuevaRareza = 'Epico'; nuevoValor = 180; }
        else if (POOL_RAROS.includes(datos.id)) { nuevaRareza = 'Raro'; nuevoValor = 60; }
        if (poke.esShiny) nuevoValor *= 3;

        poke.id = datos.id; poke.nombre = poke.esShiny ? `✨ ${datos.name}` : datos.name; poke.sprite = datos.sprites.front_default; poke.rareza = nuevaRareza; poke.valorBase = nuevoValor; poke.tipo = datos.types[0].type.name;
        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
        actualizarUI(); alert(`✨ ¡Evolucionó a ${poke.nombre}! 🎉`);
    } catch (e) { console.error(e); }
}

async function seleccionarLuchador(instanciaId) {
    reproducirSonido('normal');
    pokemonLuchador = inventario.find(p => p.instanciaId === instanciaId); if (!pokemonLuchador) return;
    if (!pokemonLuchador.tipo) { const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonLuchador.id}`); const data = await res.json(); pokemonLuchador.tipo = data.types[0].type.name; }
    const mult = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonLuchador.rareza] || 1;
    hpJugadorMax = Math.round(100 * mult + (pokemonLuchador.nivel * 20)); hpJugadorActual = hpJugadorMax;

    document.getElementById('display-jugador').innerHTML = `<img src="${pokemonLuchador.sprite}" alt="${pokemonLuchador.nombre}">`;
    document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;
    document.getElementById('hp-jugador').style.width = '100%';

    const badge = document.getElementById('badge-tipo-jugador'); badge.className = `badge-tipo tipo-${pokemonLuchador.tipo}`; badge.innerText = pokemonLuchador.tipo;
    document.getElementById('btn-iniciar-batalla').disabled = false; document.getElementById('btn-atacar').disabled = true;
}

async function buscarRival() {
    reproducirSonido('normal');
    const idR = POKEDEX_TOTAL[Math.floor(Math.random() * POKEDEX_TOTAL.length)]; const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idR}`); const datos = await res.json();
    const nivR = Math.max(1, pokemonLuchador.nivel + Math.floor(Math.random() * 3) - 1);
    pokemonRival = { nombre: datos.name, sprite: datos.sprites.front_default, nivel: nivR, tipo: datos.types[0].type.name };
    hpRivalMax = Math.round(90 + (nivR * 18)); hpRivalActual = hpRivalMax;

    document.getElementById('display-rival').innerHTML = `<img src="${pokemonRival.sprite}" alt="${pokemonRival.nombre}">`;
    document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;
    document.getElementById('hp-rival').style.width = '100%';

    const badge = document.getElementById('badge-tipo-rival'); badge.className = `badge-tipo tipo-${pokemonRival.tipo}`; badge.innerText = pokemonRival.tipo;
    document.getElementById('btn-atacar').disabled = false; document.getElementById('btn-iniciar-batalla').disabled = true;
}

function ejecutarAtaque() {
    if (!pokemonLuchador || !pokemonRival || hpJugadorActual <= 0 || hpRivalActual <= 0) return;
    const mult = TABLA_TIPOS[pokemonLuchador.tipo]?.[pokemonRival.tipo] ?? 1.0;
    const danio = Math.round((15 + (pokemonLuchador.nivel * 5)) * mult);

    hpRivalActual = Math.max(0, hpRivalActual - danio);
    document.getElementById('hp-rival').style.width = `${(hpRivalActual / hpRivalMax) * 100}%`;
    document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;
    reproducirSonido(mult > 1.2 ? 'super' : 'golpe');

    if (hpRivalActual <= 0) {
        const premio = 150 + (pokemonRival.nivel * 20);
        monedas += premio; stats.ganadosTotales += premio; stats.victoriasTotales++; stats.victoriasHoy++;
        reproducirSonido('legendario');
        document.getElementById('btn-atacar').disabled = true; document.getElementById('btn-iniciar-batalla').disabled = false;
        actualizarUI(); return;
    }

    document.getElementById('btn-atacar').disabled = true;
    setTimeout(() => {
        if (hpRivalActual <= 0) return;
        const multR = TABLA_TIPOS[pokemonRival.tipo]?.[pokemonLuchador.tipo] ?? 1.0;
        const danioR = Math.round((10 + (pokemonRival.nivel * 4)) * multR);
        hpJugadorActual = Math.max(0, hpJugadorActual - danioR);
        document.getElementById('hp-jugador').style.width = `${(hpJugadorActual / hpJugadorMax) * 100}%`;
        document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;

        if (hpJugadorActual <= 0) {
            if (pokemonLuchador.tieneEscudo) {
                pokemonLuchador.tieneEscudo = false;
                hpJugadorActual = Math.round(hpJugadorMax * 0.3);
                document.getElementById('hp-jugador').style.width = '30%';
                document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;
                alert(`🛡️ ¡EL ESCUDO SALVÓ A TU ${pokemonLuchador.nombre} DE LA MUERTE PERMANENTE!`);
                document.getElementById('btn-atacar').disabled = false;
            } else {
                const idx = inventario.findIndex(p => p.instanciaId === pokemonLuchador.instanciaId);
                if (idx !== -1) inventario.splice(idx, 1);
                document.getElementById('display-jugador').innerHTML = `<p>Elige un Pokémon</p>`;
                document.getElementById('btn-iniciar-batalla').disabled = true; document.getElementById('btn-atacar').disabled = true;
                pokemonLuchador = null; actualizarUI();
            }
        } else document.getElementById('btn-atacar').disabled = false;
    }, 700);
}

function renderizarSeleccionBatalla() {
    const grid = document.getElementById('grid-seleccion-batalla'); if (!grid) return; grid.innerHTML = '';
    const txt = (document.getElementById('input-buscar-luchador')?.value || '').toLowerCase();
    inventario.filter(p => p.nombre.toLowerCase().includes(txt)).forEach(poke => {
        const card = document.createElement('div'); card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="seleccionarLuchador(${poke.instanciaId})">Luchar ⚔️</button>`;
        grid.appendChild(card);
    });
}

function renderizarSeleccionTorre() {
    const grid = document.getElementById('grid-seleccion-torre'); if (!grid) return; grid.innerHTML = '';
    const txt = (document.getElementById('input-buscar-luchador-torre')?.value || '').toLowerCase();
    inventario.filter(p => p.nombre.toLowerCase().includes(txt)).forEach(poke => {
        const card = document.createElement('div'); card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="seleccionarLuchadorTorre(${poke.instanciaId})">Elegir 🏰</button>`;
        grid.appendChild(card);
    });
}

function seleccionarLuchadorTorre(instanciaId) {
    reproducirSonido('normal');
    pokemonLuchadorTorre = inventario.find(p => p.instanciaId === instanciaId); if (!pokemonLuchadorTorre) return;
    const mult = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 }[pokemonLuchadorTorre.rareza] || 1;
    hpJugadorTorreMax = Math.round(100 * mult + (pokemonLuchadorTorre.nivel * 20)); hpJugadorTorreActual = hpJugadorTorreMax;
    document.getElementById('display-jugador-torre').innerHTML = `<img src="${pokemonLuchadorTorre.sprite}" alt="Tu Pokémon">`;
    document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;
    document.getElementById('hp-jugador-torre').style.width = '100%';
}

function cambiarMaquina(tipo, costo, btn) {
    reproducirSonido('normal'); maquinaActual = tipo; costoActual = costo;
    document.querySelectorAll('.btn-maquina').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    document.getElementById('costo-x1').innerText = costo; document.getElementById('costo-x10').innerText = costo * 9;
}

function actualizarUI() {
    document.getElementById('cant-monedas').innerText = monedas;
    document.getElementById('cant-pokemon').innerText = inventario.length;
    document.getElementById('pokedex-count').innerText = `${pokedexDescubiertos.length}/${POKEDEX_TOTAL.length}`;
    aplicarFiltrosInventario(); actualizarSlotsFusion(); verificarEstadoRecompensaDiaria(); guardarPartida();
}

function verificarEstadoRecompensaDiaria() {
    const ultimo = localStorage.getItem(`ultimoReclamoPokeGacha_${idUsuarioActual}`);
    const btn = document.getElementById('btn-diario'); if (!btn) return;
    if (!ultimo) { btn.disabled = false; btn.innerText = "🎁 Diario"; return; }
    const dif = Date.now() - parseInt(ultimo);
    if (dif >= 86400000) { btn.disabled = false; btn.innerText = "🎁 Diario"; }
    else { btn.disabled = true; btn.innerText = `⏳ ${Math.floor((86400000 - dif) / 3600000)}h`; }
}

function reclamarDiario() {
    reproducirSonido('legendario'); monedas += 500; stats.ganadosTotales += 500;
    localStorage.setItem(`ultimoReclamoPokeGacha_${idUsuarioActual}`, Date.now().toString());
    actualizarUI(); alert("🎉 ¡500 Pokedólares diarios!");
}

function obtenerPokemonAleatorioConfig() {
    const prob = Math.random() * 100; let pokemonId, rareza, valorBase, nivelInicial = 1;
    if (maquinaActual === 'master') {
        if (prob < 35) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; nivelInicial = 35; }
        else if (prob < 75) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; nivelInicial = 35; }
        else { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; nivelInicial = 15; }
    } else if (maquinaActual === 'ultra') {
        if (prob < 15) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; nivelInicial = 35; }
        else if (prob < 60) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; nivelInicial = 35; }
        else if (prob < 90) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; nivelInicial = 15; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; nivelInicial = 1; }
    } else if (maquinaActual === 'super') {
        if (prob < 7) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; nivelInicial = 35; }
        else if (prob < 32) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; nivelInicial = 35; }
        else if (prob < 77) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; nivelInicial = 15; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; nivelInicial = 1; }
    } else {
        if (prob < 3) { pokemonId = POOL_LEGENDARIOS[Math.floor(Math.random() * POOL_LEGENDARIOS.length)]; rareza = 'Legendario'; valorBase = 500; nivelInicial = 35; }
        else if (prob < 15) { pokemonId = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; rareza = 'Epico'; valorBase = 180; nivelInicial = 35; }
        else if (prob < 45) { pokemonId = POOL_RAROS[Math.floor(Math.random() * POOL_RAROS.length)]; rareza = 'Raro'; valorBase = 60; nivelInicial = 15; }
        else { pokemonId = POOL_COMUNES[Math.floor(Math.random() * POOL_COMUNES.length)]; rareza = 'Comun'; valorBase = 20; nivelInicial = 1; }
    }
    const esShiny = Math.random() < 0.02; if (esShiny) valorBase *= 3;
    return { pokemonId, rareza, valorBase, esShiny, nivelInicial };
}

async function tirarGacha(cantidad) {
    if (tirandoGacha) return;
    const costo = cantidad === 10 ? costoActual * 9 : costoActual; if (monedas < costo) { alert("¡Insuficientes Pokedólares!"); return; }
    monedas -= costo; stats.gastadosTotales += costo; stats.tiradasTotales += cantidad; stats.tiradasHoy += cantidad;
    tirandoGacha = true; document.getElementById('btn-tirar').disabled = true; document.getElementById('btn-tirar-10').disabled = true;
    actualizarUI(); reproducirSonido('tirar');

    const pantalla = document.getElementById('pantalla-gacha'); pantalla.innerHTML = `<div class="pokeball-grande ${maquinaActual} anim-shake"></div>`;

    try {
        if (cantidad === 1) {
            const conf = obtenerPokemonAleatorioConfig(); const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${conf.pokemonId}`); const datos = await resp.json();
            const poke = { id: datos.id, nombre: conf.esShiny ? `✨ ${datos.name}` : datos.name, rareza: conf.rareza, sprite: datos.sprites.front_default, valorBase: conf.valorBase, esShiny: conf.esShiny, instanciaId: Date.now() + Math.random(), nivel: conf.nivelInicial, tipo: datos.types[0].type.name, tieneEscudo: false };

            setTimeout(() => {
                inventario.push(poke); if (conf.esShiny) stats.shiniesTotales++;
                if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
                reproducirSonido(conf.esShiny ? 'shiny' : conf.rareza === 'Legendario' ? 'legendario' : 'normal');
                pantalla.innerHTML = `<img src="${poke.sprite}" width="75" class="anim-reveal" alt="${poke.nombre}">`;
                tirandoGacha = false; document.getElementById('btn-tirar').disabled = false; document.getElementById('btn-tirar-10').disabled = false;
                actualizarUI();
            }, 1500);
        } else {
            let list = [];
            for (let i = 0; i < 10; i++) {
                const conf = obtenerPokemonAleatorioConfig(); const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${conf.pokemonId}`); const datos = await resp.json();
                const poke = { id: datos.id, nombre: conf.esShiny ? `✨ ${datos.name}` : datos.name, rareza: conf.rareza, sprite: datos.sprites.front_default, valorBase: conf.valorBase, esShiny: conf.esShiny, instanciaId: Date.now() + Math.random() + i, nivel: conf.nivelInicial, tipo: datos.types[0].type.name, tieneEscudo: false };
                if (conf.esShiny) stats.shiniesTotales++; list.push(poke); inventario.push(poke);
                if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
            }
            setTimeout(() => {
                reproducirSonido('legendario'); pantalla.innerHTML = `<span class="placeholder-text">¡x10 Abiertas!</span>`; mostrarModalX10(list);
                tirandoGacha = false; document.getElementById('btn-tirar').disabled = false; document.getElementById('btn-tirar-10').disabled = false;
                actualizarUI();
            }, 1500);
        }
    } catch (e) {
        monedas += costo; stats.gastadosTotales -= costo; tirandoGacha = false;
        document.getElementById('btn-tirar').disabled = false; document.getElementById('btn-tirar-10').disabled = false;
        actualizarUI();
    }
}

function mostrarModalX10(lista) {
    const grid = document.getElementById('grid-x10'); grid.innerHTML = '';
    lista.forEach(poke => {
        const card = document.createElement('div'); card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>${poke.rareza} (Nv. ${poke.nivel})</small>`;
        grid.appendChild(card);
    });
    document.getElementById('modal-x10').classList.remove('hidden');
}

function cerrarModalX10() { reproducirSonido('normal'); document.getElementById('modal-x10').classList.add('hidden'); }

function subirNivel(instanciaId) {
    reproducirSonido('normal'); const poke = inventario.find(p => p.instanciaId === instanciaId); if (!poke || poke.nivel >= 100) return;
    const costo = poke.nivel * 30; if (monedas >= costo) { monedas -= costo; stats.gastadosTotales += costo; poke.nivel++; actualizarUI(); }
}

function venderPokemon(instanciaId) {
    reproducirSonido('normal'); const idx = inventario.findIndex(p => p.instanciaId === instanciaId);
    if (idx !== -1) {
        const poke = inventario[idx]; const v = poke.valorBase + (poke.nivel * 15);
        monedas += v; stats.ganadosTotales += v; seleccionadosFusion = seleccionadosFusion.filter(id => id !== instanciaId);
        inventario.splice(idx, 1); actualizarUI();
    }
}

function venderDuplicados() {
    if (inventario.length === 0) return; reproducirSonido('normal'); const mapas = {};
    inventario.forEach(poke => { const k = `${poke.id}_${poke.esShiny ? 's' : 'n'}`; if (!mapas[k]) mapas[k] = []; mapas[k].push(poke); });
    let ganancia = 0, nuevoInv = [];
    Object.values(mapas).forEach(g => {
        g.sort((a, b) => b.nivel - a.nivel); nuevoInv.push(g[0]);
        for (let i = 1; i < g.length; i++) { ganancia += g[i].valorBase + (g[i].nivel * 15); seleccionadosFusion = seleccionadosFusion.filter(id => id !== g[i].instanciaId); }
    });
    if (ganancia > 0) { monedas += ganancia; stats.ganadosTotales += ganancia; inventario = nuevoInv; actualizarUI(); alert(`Vendidos duplicados por ${ganancia} Pokedólares.`); }
}

function seleccionarParaFusion(instanciaId) {
    reproducirSonido('normal'); const idx = seleccionadosFusion.indexOf(instanciaId);
    if (idx !== -1) seleccionadosFusion.splice(idx, 1); else if (seleccionadosFusion.length < 3) seleccionadosFusion.push(instanciaId);
    actualizarUI();
}

function actualizarSlotsFusion() {
    for (let i = 0; i < 3; i++) {
        const slot = document.querySelector(`[data-slot="${i}"]`); if (!slot) continue;
        const idA = seleccionadosFusion[i];
        if (idA) { const poke = inventario.find(p => p.instanciaId === idA); if (poke) { slot.innerHTML = `<img src="${poke.sprite}" alt="${poke.nombre}">`; slot.style.borderColor = "#8b5cf6"; } }
        else { slot.innerHTML = `Slot ${i + 1}`; slot.style.borderColor = "#4b5563"; }
    }
    document.getElementById('btn-fusionar').disabled = seleccionadosFusion.length !== 3;
}

async function ejecutarFusion() {
    if (seleccionadosFusion.length !== 3) return;
    inventario = inventario.filter(p => !seleccionadosFusion.includes(p.instanciaId)); seleccionadosFusion = [];
    const idA = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)]; const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idA}`); const datos = await res.json();
    const poke = { id: datos.id, nombre: datos.name, rareza: 'Epico', sprite: datos.sprites.front_default, valorBase: 180, esShiny: false, instanciaId: Date.now() + Math.random(), nivel: 35, tipo: datos.types[0].type.name, tieneEscudo: false };
    inventario.push(poke); stats.fusionesTotales++; stats.fusionesHoy++;
    if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
    reproducirSonido('legendario'); actualizarUI(); alert(`¡Fusión exitosa! Obtuviste un ${poke.nombre} (Épico Nv. 35).`);
}

function aplicarFiltrosInventario() {
    const fRar = document.getElementById('filtro-rareza')?.value || 'todas', oOrd = document.getElementById('ordenar-por')?.value || 'recientes';
    let lista = [...inventario];
    if (fRar === 'shiny') lista = lista.filter(p => p.esShiny); else if (fRar !== 'todas') lista = lista.filter(p => p.rareza === fRar);
    if (oOrd === 'nivel') lista.sort((a, b) => b.nivel - a.nivel); else if (oOrd === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (oOrd === 'rareza') { const o = { 'Legendario': 4, 'Epico': 3, 'Raro': 2, 'Comun': 1 }; lista.sort((a, b) => o[b.rareza] - o[a.rareza]); }
    else lista.reverse();
    renderizarInventarioGrid(lista);
}

function renderizarInventarioGrid(lista) {
    const grid = document.getElementById('grid-inventario'); if (!grid) return; grid.innerHTML = '';
    if (lista.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 40px;">No hay Pokémon.</p>`; return; }

    lista.forEach(poke => {
        const sel = seleccionadosFusion.includes(poke.instanciaId), evol = MAPA_EVOLUCIONES[poke.id], puedeEvol = evol && poke.nivel >= evol.nivel, maxL = poke.nivel >= 100;
        const card = document.createElement('div'); card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `
            ${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <strong>${poke.nombre}</strong>
            <small>Nv. ${poke.nivel}${maxL ? ' (MAX)' : ''} (${poke.rareza})</small>
            ${poke.tieneEscudo ? '<span class="badge-escudo">🛡️ ESCUDO ACTIVO</span>' : ''}
            ${puedeEvol ? `<button class="btn-card btn-evolucionar" onclick="evolucionarPokemon(${poke.instanciaId})">Evolucionar (Nv. ${evol.nivel}) 🧬</button>` : ''}
            <button class="btn-card btn-subir" onclick="usarCarameloRaro(${poke.instanciaId})">Usar Caramelo 🍬</button>
            <button class="btn-card btn-subir" onclick="equiparEscudoPermaDeath(${poke.instanciaId})">Poner Escudo 🛡️</button>
            <button class="btn-card btn-subir" ${maxL ? 'disabled' : ''} onclick="subirNivel(${poke.instanciaId})">${maxL ? 'MAX Nv. 100' : `Subir Nv. (${poke.nivel * 30} 💰)`}</button>
            <button class="btn-card btn-vender" onclick="venderPokemon(${poke.instanciaId})">Vender (+${poke.valorBase + (poke.nivel * 15)} 💰)</button>
            <button class="btn-card btn-seleccionar ${sel ? 'seleccionado' : ''}" onclick="seleccionarParaFusion(${poke.instanciaId})">${sel ? 'Quitar' : 'Fusionar'}</button>
        `;
        grid.appendChild(card);
    });
}

function renderizarPokedexCompleta() {
    const grid = document.getElementById('grid-pokedex'); if (!grid) return; grid.innerHTML = '';
    POKEDEX_TOTAL.forEach(id => {
        const desc = pokedexDescubiertos.includes(id);
        const card = document.createElement('div'); card.className = `card-pokemon ${desc ? 'Comun' : 'bloqueado'}`;
        card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="Pokédex"><strong>#${id}</strong><small>${desc ? 'Descubierto' : '???'}</small>`;
        grid.appendChild(card);
    });
}

// TORRE DE BATALLA (1v1)
async function iniciarPisoTorre() {
    if (!pokemonLuchadorTorre) { alert("❌ Selecciona un Pokémon para la Torre."); return; }
    reproducirSonido('normal');
    const dp = LIDERES_TORRE.find(l => l.piso === pisoTorreActual) || LIDERES_TORRE[LIDERES_TORRE.length - 1];

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${dp.idPoke}`); const datos = await res.json();
    liderTorreActual = { nombre: dp.nombre, pokemonNombre: datos.name, sprite: datos.sprites.front_default, nivel: pisoTorreActual * 5, recompensa: dp.recompensa };
    hpLiderTorreMax = Math.round(150 + (pisoTorreActual * 50)); hpLiderTorreActual = hpLiderTorreMax;

    document.getElementById('nombre-lider-torre').innerText = `${liderTorreActual.nombre} (${liderTorreActual.pokemonNombre})`;
    document.getElementById('display-lider-torre').innerHTML = `<img src="${liderTorreActual.sprite}" alt="Líder">`;
    document.getElementById('text-hp-lider-torre').innerText = `${hpLiderTorreActual} / ${hpLiderTorreMax} HP`;
    document.getElementById('hp-lider-torre').style.width = '100%';

    document.getElementById('arena-torre').classList.remove('hidden'); document.getElementById('controles-torre').classList.remove('hidden');
    document.getElementById('btn-enfrentar-piso').disabled = true;
}

function ejecutarAtaqueTorre() {
    if (!pokemonLuchadorTorre || !liderTorreActual || hpJugadorTorreActual <= 0 || hpLiderTorreActual <= 0) return;
    const danio = Math.round(20 + (pokemonLuchadorTorre.nivel * 6));
    hpLiderTorreActual = Math.max(0, hpLiderTorreActual - danio);
    document.getElementById('hp-lider-torre').style.width = `${(hpLiderTorreActual / hpLiderTorreMax) * 100}%`;
    document.getElementById('text-hp-lider-torre').innerText = `${hpLiderTorreActual} / ${hpLiderTorreMax} HP`;
    reproducirSonido('golpe');

    if (hpLiderTorreActual <= 0) {
        monedas += liderTorreActual.recompensa; stats.ganadosTotales += liderTorreActual.recompensa; stats.torreHoy++;
        reproducirSonido('legendario');
        document.getElementById('controles-torre').classList.add('hidden');
        if (pisoTorreActual < LIDERES_TORRE.length) pisoTorreActual++; else pisoTorreActual = 1;
        document.getElementById('piso-actual-num').innerText = pisoTorreActual; document.getElementById('btn-enfrentar-piso').disabled = false;
        actualizarUI(); return;
    }

    setTimeout(() => {
        const danioL = Math.round(15 + (pisoTorreActual * 6));
        hpJugadorTorreActual = Math.max(0, hpJugadorTorreActual - danioL);
        document.getElementById('hp-jugador-torre').style.width = `${(hpJugadorTorreActual / hpJugadorTorreMax) * 100}%`;
        document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;

        if (hpJugadorTorreActual <= 0) {
            if (pokemonLuchadorTorre.tieneEscudo) {
                pokemonLuchadorTorre.tieneEscudo = false;
                hpJugadorTorreActual = Math.round(hpJugadorTorreMax * 0.3);
                document.getElementById('hp-jugador-torre').style.width = '30%';
                document.getElementById('text-hp-jugador-torre').innerText = `${hpJugadorTorreActual} / ${hpJugadorTorreMax} HP`;
                alert(`🛡️ ¡EL ESCUDO SALVÓ A TU ${pokemonLuchadorTorre.nombre} EN LA TORRE!`);
            } else {
                const idx = inventario.findIndex(p => p.instanciaId === pokemonLuchadorTorre.instanciaId);
                if (idx !== -1) inventario.splice(idx, 1);
                document.getElementById('display-jugador-torre').innerHTML = `<p>Selecciona a la izquierda</p>`;
                document.getElementById('controles-torre').classList.add('hidden'); document.getElementById('btn-enfrentar-piso').disabled = false;
                pokemonLuchadorTorre = null; actualizarUI();
            }
        }
    }, 600);
}

// CASINO
function girarRuleta() {
    if (monedas < 200) { alert("❌ Necesitas 200 Pokedólares."); return; }
    monedas -= 200; stats.gastadosTotales += 200; stats.casinoHoy++; reproducirSonido('tirar');
    const r = document.getElementById('ruleta-display'); r.innerText = "🎰 Girando...";
    setTimeout(() => {
        const p = Math.random() * 100; let premio = p < 5 ? 2000 : p < 20 ? 600 : p < 55 ? 250 : 0;
        monedas += premio; if (premio > 0) stats.ganadosTotales += premio;
        r.innerText = premio > 0 ? `🎉 ¡Premio! +${premio} 💰` : `😢 ¡Sin premio!`;
        reproducirSonido(premio >= 600 ? 'legendario' : 'normal'); actualizarUI();
    }, 1200);
}

function jugarTragaperras() {
    if (monedas < 100) { alert("❌ Necesitas 100 Pokedólares."); return; }
    monedas -= 100; stats.gastadosTotales += 100; stats.casinoHoy++; reproducirSonido('tirar');
    const btn = document.getElementById('btn-palanca-slots'); btn.disabled = true;
    const simbolos = ["🔴", "⚡", "💎", "7️⃣", "⭐", "🍇"];
    const r1 = document.getElementById('reel-1'), r2 = document.getElementById('reel-2'), r3 = document.getElementById('reel-3');
    const txt = document.getElementById('texto-resultado-slots'); txt.innerText = "🎰 Girando...";

    let c = 0;
    const timer = setInterval(() => {
        r1.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        r2.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        r3.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
        c++;
        if (c > 12) {
            clearInterval(timer);
            const s1 = simbolos[Math.floor(Math.random() * simbolos.length)], s2 = simbolos[Math.floor(Math.random() * simbolos.length)], s3 = simbolos[Math.floor(Math.random() * simbolos.length)];
            r1.innerText = s1; r2.innerText = s2; r3.innerText = s3;
            let ganancia = s1 === s2 && s2 === s3 ? (s1 === "💎" || s1 === "7️⃣" ? 3000 : 1000) : (s1 === s2 || s2 === s3 || s1 === s3 ? 200 : 0);
            monedas += ganancia; if (ganancia > 0) stats.ganadosTotales += ganancia;
            txt.innerText = ganancia > 0 ? `✨ ¡Premio! +${ganancia} 💰` : `❌ Inténtalo de nuevo.`;
            reproducirSonido(ganancia > 0 ? 'legendario' : 'normal');
            btn.disabled = false; actualizarUI();
        }
    }, 80);
}

inicializarJugadorOnline();
setInterval(verificarEstadoRecompensaDiaria, 60000);