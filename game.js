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
    tiradasHoy: 0
};

// ESTADO DE COMBATE
let pokemonLuchador = null;
let pokemonRival = null;
let hpJugadorActual = 0, hpJugadorMax = 0;
let hpRivalActual = 0, hpRivalMax = 0;

const CODIGOS_VALIDOS = {
    "0711": { recompensa: 1000, tipo: "monedas", descripcion: "1.000 Pokedólares" }
};

const POKEDEX_TOTAL = Array.from({ length: 251 }, (_, i) => i + 1);
const POOL_LEGENDARIOS = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251];
const POOL_EPICOS = [3, 6, 9, 12, 15, 18, 31, 34, 59, 62, 65, 68, 71, 76, 94, 103, 115, 130, 131, 134, 135, 136, 139, 141, 142, 143, 149, 154, 157, 160, 169, 178, 181, 182, 186, 196, 197, 199, 208, 212, 214, 217, 227, 229, 230, 232, 242, 248];
const POOL_RAROS = [2, 5, 8, 11, 14, 17, 22, 24, 26, 28, 30, 33, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 58, 61, 64, 67, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 97, 99, 101, 105, 107, 109, 110, 112, 117, 119, 121, 123, 125, 126, 127, 128, 138, 140, 153, 156, 159, 162, 164, 166, 171, 176, 180, 184, 185, 190, 192, 195, 202, 203, 205, 207, 210, 211, 213, 215, 219, 221, 224, 226, 233, 234, 237, 241];
const POOL_COMUNES = POKEDEX_TOTAL.filter(id => !POOL_LEGENDARIOS.includes(id) && !POOL_EPICOS.includes(id) && !POOL_RAROS.includes(id));

// MISIONES DIARIAS
const MISIONES = [
    { id: 'mision_tirar_3', titulo: 'Abre 3 Pokéballs', desc: 'Realiza al menos 3 tiradas hoy.', recompensa: 250, condicion: () => stats.tiradasHoy >= 3 },
    { id: 'mision_fusion', titulo: 'Maestro de la Fusión', desc: 'Realiza al menos 1 fusión de Pokémon.', recompensa: 350, condicion: () => stats.fusionesTotales >= 1 },
    { id: 'mision_combate', titulo: 'Primer Combate Victorioso', desc: 'Gana al menos 1 batalla en la Arena.', recompensa: 400, condicion: () => stats.victoriasTotales >= 1 }
];

const LOGROS = [
    { id: 'primer_paso', titulo: '¡Primeros Pasos!', desc: 'Abre al menos 1 Pokéball.', recompensa: 150, condicion: () => stats.tiradasTotales >= 1 },
    { id: 'coleccion_10', titulo: 'Entrenador Novato', desc: 'Acumula al menos 10 Pokémon en tu inventario.', recompensa: 300, condicion: () => inventario.length >= 10 },
    { id: 'suerte_shiny', titulo: '¡Destello Divino!', desc: 'Consigue tu primer Pokémon Shiny.', recompensa: 600, condicion: () => stats.shiniesTotales >= 1 },
    { id: 'campeon_arena', titulo: 'Gladiador Pokémon', desc: 'Gana 5 batallas en la Arena de Combate.', recompensa: 800, condicion: () => stats.victoriasTotales >= 5 },
    { id: 'pokedex_50', titulo: 'Explorador de Kanto y Johto', desc: 'Descubre 50 Pokémon distintos en tu Pokédex.', recompensa: 800, condicion: () => pokedexDescubiertos.length >= 50 },
    { id: 'leyenda_viva', titulo: 'Suerte Legendaria', desc: 'Consigue o posee un Pokémon Legendario.', recompensa: 1200, condicion: () => inventario.some(p => p.rareza === 'Legendario') }
];

let audioSilenciado = false;
let musicaIniciada = false;
let audioCtx = null;
let bgmTimer = null;

// AUDIO
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

// LOCALSTORAGE
function guardarPartida() {
    const datosPartida = { monedas, inventario, pokedexDescubiertos, logrosReclamados, misionesReclamadas, stats };
    localStorage.setItem('pokeGachaSaveData', JSON.stringify(datosPartida));
}

function cargarPartida() {
    const guardado = localStorage.getItem('pokeGachaSaveData');
    if (guardado) {
        try {
            const data = JSON.parse(guardado);
            monedas = data.monedas ?? 500;
            inventario = data.inventario ?? [];
            pokedexDescubiertos = data.pokedexDescubiertos ?? [];
            logrosReclamados = data.logrosReclamados ?? [];
            misionesReclamadas = data.misionesReclamadas ?? [];
            stats = data.stats ?? { tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0, victoriasTotales: 0, fusionesTotales: 0, tiradasHoy: 0 };
        } catch (e) { console.error("Error al cargar guardado", e); }
    }
}

// CÓDIGOS PROMOCIONALES
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

// SISTEMA DE BATALLA / COMBATE POR TURNOS
function seleccionarLuchador(instanciaId) {
    reproducirSonido('normal');
    pokemonLuchador = inventario.find(p => p.instanciaId === instanciaId);
    if (!pokemonLuchador) return;

    const multiplicadorRareza = { 'Comun': 1, 'Raro': 1.5, 'Epico': 2.2, 'Legendario': 3.5 };
    const baseMult = multiplicadorRareza[pokemonLuchador.rareza] || 1;

    hpJugadorMax = Math.round(100 * baseMult + (pokemonLuchador.nivel * 20));
    hpJugadorActual = hpJugadorMax;

    document.getElementById('display-jugador').innerHTML = `<img src="${pokemonLuchador.sprite}" alt="${pokemonLuchador.nombre}">`;
    document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;
    document.getElementById('hp-jugador').style.width = '100%';

    document.getElementById('btn-iniciar-batalla').disabled = false;
    document.getElementById('btn-atacar').disabled = true;

    logBatalla(`¡Has seleccionado a ${pokemonLuchador.nombre} (Nv. ${pokemonLuchador.nivel})! Pulsa "Buscar Rival".`);
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
            nivel: nivelRival
        };

        hpRivalMax = Math.round(90 + (nivelRival * 18));
        hpRivalActual = hpRivalMax;

        document.getElementById('display-rival').innerHTML = `<img src="${pokemonRival.sprite}" alt="${pokemonRival.nombre}">`;
        document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;
        document.getElementById('hp-rival').style.width = '100%';

        document.getElementById('btn-atacar').disabled = false;
        document.getElementById('btn-iniciar-batalla').disabled = true;

        logBatalla(`⚠️ Un ${pokemonRival.nombre} salvaje (Nv. ${nivelRival}) ha aparecido. ¡A luchar!`);
    } catch (e) { console.error(e); }
}

function ejecutarAtaque() {
    if (!pokemonLuchador || !pokemonRival || hpJugadorActual <= 0 || hpRivalActual <= 0) return;

    reproducirSonido('normal');

    // Turno Jugador
    const danyoJugador = Math.round(15 + (pokemonLuchador.nivel * 5) + Math.random() * 10);
    hpRivalActual = Math.max(0, hpRivalActual - danyoJugador);
    const pctRival = Math.round((hpRivalActual / hpRivalMax) * 100);
    document.getElementById('hp-rival').style.width = `${pctRival}%`;
    document.getElementById('text-hp-rival').innerText = `${hpRivalActual} / ${hpRivalMax} HP`;

    logBatalla(`⚡ Tu ${pokemonLuchador.nombre} ataca y causa ${danyoJugador} de daño.`);

    if (hpRivalActual <= 0) {
        const premio = 150 + (pokemonRival.nivel * 20);
        monedas += premio;
        stats.ganadosTotales += premio;
        stats.victoriasTotales++;

        reproducirSonido('legendario');
        logBatalla(`🏆 ¡VICTORIA! Has derrotado a ${pokemonRival.nombre} y ganado ${premio} Pokedólares.`, 'victoria');
        document.getElementById('btn-atacar').disabled = true;
        document.getElementById('btn-iniciar-batalla').disabled = false;
        actualizarUI();
        return;
    }

    // Turno Rival
    setTimeout(() => {
        const danyoRival = Math.round(10 + (pokemonRival.nivel * 4) + Math.random() * 8);
        hpJugadorActual = Math.max(0, hpJugadorActual - danyoRival);
        const pctJugador = Math.round((hpJugadorActual / hpJugadorMax) * 100);
        document.getElementById('hp-jugador').style.width = `${pctJugador}%`;
        document.getElementById('text-hp-jugador').innerText = `${hpJugadorActual} / ${hpJugadorMax} HP`;

        logBatalla(`💥 ${pokemonRival.nombre} contraataca y te inflige ${danyoRival} de daño.`);

        if (hpJugadorActual <= 0) {
            logBatalla(`☠️ Tu ${pokemonLuchador.nombre} ha sido debilitado. ¡Inténtalo de nuevo!`, 'derrota');
            document.getElementById('btn-atacar').disabled = true;
            document.getElementById('btn-iniciar-batalla').disabled = false;
        }
    }, 600);
}

function logBatalla(msg, tipo = '') {
    const logBox = document.getElementById('log-batalla');
    const p = document.createElement('p');
    p.className = `log-line ${tipo}`;
    p.innerText = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

// LOGROS Y MISIONES
function reclamarLogro(idLogro) {
    const logro = LOGROS.find(l => l.id === idLogro);
    if (!logro || logrosReclamados.includes(idLogro)) return;
    if (!logro.condicion()) return;

    monedas += logro.recompensa;
    stats.ganadosTotales += logro.recompensa;
    logrosReclamados.push(idLogro);
    reproducirSonido('legendario');
    actualizarUI();
    alert(`🏆 ¡Logro completado! Has ganado ${logro.recompensa} Pokedólares.`);
}

function reclamarMision(idMision) {
    const mision = MISIONES.find(m => m.id === idMision);
    if (!mision || misionesReclamadas.includes(idMision)) return;
    if (!mision.condicion()) return;

    monedas += mision.recompensa;
    stats.ganadosTotales += mision.recompensa;
    misionesReclamadas.push(idMision);
    reproducirSonido('legendario');
    actualizarUI();
    alert(`📜 ¡Misión diaria completada! Has ganado ${mision.recompensa} Pokedólares.`);
}

function renderizarMisiones() {
    const grid = document.getElementById('grid-misiones');
    grid.innerHTML = '';

    MISIONES.forEach(mision => {
        const completada = mision.condicion();
        const reclamada = misionesReclamadas.includes(mision.id);

        const card = document.createElement('div');
        card.className = `card-logro ${reclamada ? 'completado' : ''}`;
        card.innerHTML = `
            <div class="logro-info">
                <h3>${mision.titulo}</h3>
                <p>${mision.desc}</p>
            </div>
            <div class="logro-footer">
                <span class="logro-recompensa">+${mision.recompensa} 💰</span>
                <button class="btn-reclamar-logro" ${!completada || reclamada ? 'disabled' : ''} onclick="reclamarMision('${mision.id}')">
                    ${reclamada ? '✔️ Reclamado' : completada ? '🎁 Reclamar' : '🔒 En progreso'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// NAVEGACIÓN
function cambiarPestana(pestana) {
    reproducirSonido('normal');
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('vista-juego').classList.add('hidden');
    document.getElementById('vista-batalla').classList.add('hidden');
    document.getElementById('vista-misiones').classList.add('hidden');
    document.getElementById('vista-pokedex').classList.add('hidden');
    document.getElementById('vista-logros').classList.add('hidden');
    document.getElementById('vista-stats').classList.add('hidden');

    if (pestana === 'juego') {
        document.querySelector('button[onclick="cambiarPestana(\'juego\')"]').classList.add('active');
        document.getElementById('vista-juego').classList.remove('hidden');
    } else if (pestana === 'batalla') {
        document.querySelector('button[onclick="cambiarPestana(\'batalla\')"]').classList.add('active');
        document.getElementById('vista-batalla').classList.remove('hidden');
        renderizarSeleccionBatalla();
    } else if (pestana === 'misiones') {
        document.querySelector('button[onclick="cambiarPestana(\'misiones\')"]').classList.add('active');
        document.getElementById('vista-misiones').classList.remove('hidden');
        renderizarMisiones();
    } else if (pestana === 'pokedex') {
        document.querySelector('button[onclick="cambiarPestana(\'pokedex\')"]').classList.add('active');
        document.getElementById('vista-pokedex').classList.remove('hidden');
        renderizarPokedexCompleta();
    } else if (pestana === 'logros') {
        document.querySelector('button[onclick="cambiarPestana(\'logros\')"]').classList.add('active');
        document.getElementById('vista-logros').classList.remove('hidden');
        renderizarLogros();
    } else if (pestana === 'stats') {
        document.querySelector('button[onclick="cambiarPestana(\'stats\')"]').classList.add('active');
        document.getElementById('vista-stats').classList.remove('hidden');
        actualizarEstadisticasVisuales();
    }
}

function cambiarMaquina(tipo, costo, elementoBtn) {
    reproducirSonido('normal');
    maquinaActual = tipo; costoActual = costo;
    document.querySelectorAll('.btn-maquina').forEach(b => b.classList.remove('active'));
    elementoBtn.classList.add('active');
    document.getElementById('costo-x1').innerText = costo;
    document.getElementById('costo-x10').innerText = costo * 9;
    const minis = document.querySelectorAll('.pokeball-mini');
    minis.forEach(m => { m.className = `pokeball-mini ${tipo === 'super' ? 'super-ball' : tipo === 'ultra' ? 'ultra-ball' : ''}`; });
}

function actualizarUI() {
    document.getElementById('cant-monedas').innerText = monedas;
    document.getElementById('cant-pokemon').innerText = inventario.length;
    document.getElementById('pokedex-count').innerText = `${pokedexDescubiertos.length}/${POKEDEX_TOTAL.length}`;
    aplicarFiltrosInventario();
    actualizarSlotsFusion();
    verificarEstadoRecompensaDiaria();
    if (!document.getElementById('vista-logros').classList.contains('hidden')) renderizarLogros();
    if (!document.getElementById('vista-misiones').classList.contains('hidden')) renderizarMisiones();
    guardarPartida();
}

function actualizarEstadisticasVisuales() {
    document.getElementById('stat-tiradas').innerText = stats.tiradasTotales;
    document.getElementById('stat-shinies').innerText = `${stats.shiniesTotales} ✨`;
    document.getElementById('stat-victorias').innerText = `${stats.victoriasTotales} ⚔️`;
    document.getElementById('stat-gastados').innerText = `${stats.gastadosTotales} 💰`;
    document.getElementById('stat-ganados').innerText = `${stats.ganadosTotales} 💰`;
    const porcentaje = Math.round((pokedexDescubiertos.length / POKEDEX_TOTAL.length) * 100);
    document.getElementById('stat-porcentaje').innerText = `${porcentaje}%`;
}

// RECOMPENSA DIARIA
function verificarEstadoRecompensaDiaria() {
    const ultimoReclamo = localStorage.getItem('ultimoReclamoPokeGacha');
    const btnDiario = document.getElementById('btn-diario');
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
    const ultimoReclamo = localStorage.getItem('ultimoReclamoPokeGacha');
    const ahora = Date.now(); const veinticuatroHoras = 24 * 60 * 60 * 1000;
    if (ultimoReclamo && (ahora - parseInt(ultimoReclamo)) < veinticuatroHoras) { alert("¡Ya has reclamado tu recompensa!"); return; }
    monedas += 500; stats.ganadosTotales += 500;
    localStorage.setItem('ultimoReclamoPokeGacha', ahora.toString());
    actualizarUI();
    alert("🎉 ¡Has recibido tus 500 Pokedólares diarios!");
}

// GACHA
function obtenerPokemonAleatorioConfig() {
    const prob = Math.random() * 100;
    let pokemonId, rareza, valorBase;

    if (maquinaActual === 'ultra') {
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

    monedas -= costoTotal; stats.gastadosTotales += costoTotal; stats.tiradasTotales += cantidad; stats.tiradasHoy += cantidad;
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
            const nuevoPokemon = { id: datos.id, nombre: config.esShiny ? `✨ ${datos.name}` : datos.name, rareza: config.rareza, sprite: spriteFinal, valorBase: config.valorBase, esShiny: config.esShiny, instanciaId: Date.now() + Math.random(), nivel: 1 };

            setTimeout(() => {
                inventario.push(nuevoPokemon);
                if (config.esShiny) stats.shiniesTotales++;
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
                const poke = { id: datos.id, nombre: conf.esShiny ? `✨ ${datos.name}` : datos.name, rareza: conf.rareza, sprite: spriteFinal, valorBase: conf.valorBase, esShiny: conf.esShiny, instanciaId: Date.now() + Math.random() + i, nivel: 1 };
                if (conf.esShiny) stats.shiniesTotales++;
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
        const idActual = seleccionadosFusion[i];
        if (idActual) {
            const poke = inventario.find(p => p.instanciaId === idActual);
            if (poke) { slotEl.innerHTML = `<img src="${poke.sprite}" alt="${poke.nombre}">`; slotEl.style.borderStyle = "solid"; slotEl.style.borderColor = "#8b5cf6"; }
        } else { slotEl.innerHTML = `Slot ${i + 1}`; slotEl.style.borderStyle = "dashed"; slotEl.style.borderColor = "#4b5563"; }
    }
    document.getElementById('btn-fusionar').disabled = seleccionadosFusion.length !== 3;
}

async function ejecutarFusion() {
    if (seleccionadosFusion.length !== 3) return;
    inventario = inventario.filter(p => !seleccionadosFusion.includes(p.instanciaId));
    seleccionadosFusion = [];

    const idAleatorio = POOL_EPICOS[Math.floor(Math.random() * POOL_EPICOS.length)];
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
        const datos = await respuesta.json();
        const nuevoPokemon = { id: datos.id, nombre: datos.name, rareza: 'Epico', sprite: datos.sprites.front_default, valorBase: 180, esShiny: false, instanciaId: Date.now() + Math.random(), nivel: 1 };
        inventario.push(nuevoPokemon);
        stats.fusionesTotales++;
        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
        reproducirSonido('legendario');
        actualizarUI();
        alert(`¡Fusión exitosa! Obtuviste un ${nuevoPokemon.nombre} (Épico).`);
    } catch (e) { console.error(e); }
}

// RENDERIZADO LOGROS Y SELECCIÓN COMBATE
function renderizarLogros() {
    const grid = document.getElementById('grid-logros');
    grid.innerHTML = '';
    LOGROS.forEach(logro => {
        const completado = logro.condicion();
        const reclamado = logrosReclamados.includes(logro.id);
        const card = document.createElement('div');
        card.className = `card-logro ${reclamado ? 'completado' : ''}`;
        card.innerHTML = `<div class="logro-info"><h3>${logro.titulo}</h3><p>${logro.desc}</p></div><div class="logro-footer"><span class="logro-recompensa">+${logro.recompensa} 💰</span><button class="btn-reclamar-logro" ${!completado || reclamado ? 'disabled' : ''} onclick="reclamarLogro('${logro.id}')">${reclamado ? '✔️ Reclamado' : completado ? '🎁 Reclamar' : '🔒 En progreso'}</button></div>`;
        grid.appendChild(card);
    });
}

function renderizarSeleccionBatalla() {
    const grid = document.getElementById('grid-seleccion-batalla');
    grid.innerHTML = '';
    if (inventario.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563;">Abre Pokéballs para conseguir Pokémon y luchar.</p>`; return; }

    inventario.forEach(poke => {
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel}</small><button class="btn-card btn-subir" onclick="seleccionarLuchador(${poke.instanciaId})">Luchar ⚔️</button>`;
        grid.appendChild(card);
    });
}

// FILTRADO Y RENDERIZADO INVENTARIO Y POKÉDEX
function aplicarFiltrosInventario() {
    const filtroRareza = document.getElementById('filtro-rareza').value;
    const ordenarPor = document.getElementById('ordenar-por').value;
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
    grid.innerHTML = '';
    if (lista.length === 0) { grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563; padding: 40px;">No hay Pokémon en esta vista.</p>`; return; }

    lista.forEach(poke => {
        const estaSeleccionado = seleccionadosFusion.includes(poke.instanciaId);
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}<img src="${poke.sprite}" alt="${poke.nombre}"><strong>${poke.nombre}</strong><small>Nv. ${poke.nivel} (${poke.rareza})</small><button class="btn-card btn-subir" onclick="subirNivel(${poke.instanciaId})">Subir Nv. (${poke.nivel * 30} 💰)</button><button class="btn-card btn-vender" onclick="venderPokemon(${poke.instanciaId})">Vender (+${poke.valorBase + (poke.nivel * 15)} 💰)</button><button class="btn-card btn-seleccionar ${estaSeleccionado ? 'seleccionado' : ''}" onclick="seleccionarParaFusion(${poke.instanciaId})">${estaSeleccionado ? 'Quitar' : 'Fusionar'}</button>`;
        grid.appendChild(card);
    });
}

function renderizarPokedexCompleta() {
    const grid = document.getElementById('grid-pokedex');
    grid.innerHTML = '';
    POKEDEX_TOTAL.forEach(id => {
        const descubierto = pokedexDescubiertos.includes(id);
        const card = document.createElement('div');
        card.className = `card-pokemon ${descubierto ? 'Comun' : 'bloqueado'}`;
        card.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="Pokédex"><strong>#${id}</strong><small>${descubierto ? 'Descubierto' : '???'}</small>`;
        grid.appendChild(card);
    });
}

// Inicialización
cargarPartida();
setInterval(verificarEstadoRecompensaDiaria, 60000);
actualizarUI();