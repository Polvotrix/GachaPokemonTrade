let monedas = 500;
let inventario = [];
let pokedexDescubiertos = [];
let tirandoGacha = false;
let seleccionadosFusion = [];

let maquinaActual = 'normal';
let costoActual = 100;

let stats = {
    tiradasTotales: 0,
    shiniesTotales: 0,
    gastadosTotales: 0,
    ganadosTotales: 0
};

const POOL_COMUNES = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 108, 111, 116, 118, 120, 129, 133];
const POOL_RAROS = [2, 5, 8, 11, 14, 17, 20, 24, 26, 28, 30, 33, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 58, 61, 64, 67, 70, 75, 78, 82, 85, 87, 89, 93, 97, 99, 103, 105, 109, 112, 117, 119, 121, 123, 125, 126, 128, 130, 138, 140];
const POOL_EPICOS = [3, 6, 9, 12, 15, 18, 31, 34, 62, 65, 68, 71, 76, 83, 94, 95, 107, 110, 113, 114, 115, 122, 124, 127, 131, 134, 135, 136, 139, 141, 142, 149, 154, 157, 160];
const POOL_LEGENDARIOS = [144, 145, 146, 150, 151, 249, 250, 251, 380, 381, 382, 383, 384, 385, 386, 483, 484, 487, 488, 493];
const POKEDEX_TOTAL = [...POOL_COMUNES.slice(0, 25), ...POOL_RAROS.slice(0, 15), ...POOL_EPICOS.slice(0, 12), ...POOL_LEGENDARIOS.slice(0, 8)];

// AUDIO SINTETIZADOR
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function reproducirSonido(tipo) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const ahora = audioCtx.currentTime;

    if (tipo === 'tirar') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, ahora); osc.frequency.exponentialRampToValueAtTime(600, ahora + 0.4);
        gainNode.gain.setValueAtTime(0.1, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.4);
        osc.start(ahora); osc.stop(ahora + 0.4);
    } else if (tipo === 'shiny') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(500, ahora); osc.frequency.setValueAtTime(800, ahora + 0.1); osc.frequency.setValueAtTime(1200, ahora + 0.25);
        gainNode.gain.setValueAtTime(0.25, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.5);
        osc.start(ahora); osc.stop(ahora + 0.5);
    } else if (tipo === 'legendario') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, ahora); osc.frequency.setValueAtTime(600, ahora + 0.15); osc.frequency.setValueAtTime(800, ahora + 0.3);
        gainNode.gain.setValueAtTime(0.2, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.6);
        osc.start(ahora); osc.stop(ahora + 0.6);
    } else {
        osc.type = 'square'; osc.frequency.setValueAtTime(200, ahora); gainNode.gain.setValueAtTime(0.08, ahora); gainNode.gain.linearRampToValueAtTime(0, ahora + 0.15);
        osc.start(ahora); osc.stop(ahora + 0.15);
    }
}

// LOCALSTORAGE
function guardarPartida() {
    const datosPartida = { monedas, inventario, pokedexDescubiertos, stats };
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
            stats = data.stats ?? { tiradasTotales: 0, shiniesTotales: 0, gastadosTotales: 0, ganadosTotales: 0 };
        } catch (e) { console.error("Error al cargar guardado", e); }
    }
}

// NAVEGACIÓN
function cambiarPestana(pestana) {
    reproducirSonido('normal');
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('vista-juego').classList.add('hidden');
    document.getElementById('vista-pokedex').classList.add('hidden');
    document.getElementById('vista-stats').classList.add('hidden');

    if (pestana === 'juego') {
        document.querySelector('button[onclick="cambiarPestana(\'juego\')"]').classList.add('active');
        document.getElementById('vista-juego').classList.remove('hidden');
    } else if (pestana === 'pokedex') {
        document.querySelector('button[onclick="cambiarPestana(\'pokedex\')"]').classList.add('active');
        document.getElementById('vista-pokedex').classList.remove('hidden');
        renderizarPokedexCompleta();
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
    guardarPartida();
}

function actualizarEstadisticasVisuales() {
    document.getElementById('stat-tiradas').innerText = stats.tiradasTotales;
    document.getElementById('stat-shinies').innerText = `${stats.shiniesTotales} ✨`;
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

// OBTENCIÓN GACHA CON MECÁNICA SHINY (2% Probabilidad)
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

    // Un 2% de probabilidad de que sea Shiny
    const esShiny = Math.random() < 0.02;
    if (esShiny) {
        valorBase = valorBase * 3; // Triplica el valor si es Shiny
    }

    return { pokemonId, rareza, valorBase, esShiny };
}

async function tirarGacha(cantidad) {
    if (tirandoGacha) return;
    const costoTotal = cantidad === 10 ? costoActual * 9 : costoActual;

    if (monedas < costoTotal) { alert("¡No suficientes Pokedólares!"); return; }

    monedas -= costoTotal; stats.gastadosTotales += costoTotal; stats.tiradasTotales += cantidad;
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

            const spriteFinal = config.esShiny 
                ? (datos.sprites.front_shiny || datos.sprites.front_default)
                : (datos.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${datos.id}.png`);

            const nuevoPokemon = {
                id: datos.id,
                nombre: config.esShiny ? `✨ ${datos.name}` : datos.name,
                rareza: config.rareza,
                sprite: spriteFinal,
                valorBase: config.valorBase,
                esShiny: config.esShiny,
                instanciaId: Date.now() + Math.random(),
                nivel: 1
            };

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

                const spriteFinal = conf.esShiny 
                    ? (datos.sprites.front_shiny || datos.sprites.front_default)
                    : (datos.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${datos.id}.png`);

                const poke = {
                    id: datos.id,
                    nombre: conf.esShiny ? `✨ ${datos.name}` : datos.name,
                    rareza: conf.rareza,
                    sprite: spriteFinal,
                    valorBase: conf.valorBase,
                    esShiny: conf.esShiny,
                    instanciaId: Date.now() + Math.random() + i,
                    nivel: 1
                };
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
        monedas += costoTotal; stats.gastadosTotales -= costoTotal; stats.tiradasTotales -= cantidad;
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
        card.innerHTML = `
            ${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <strong>${poke.nombre}</strong>
            <small>${poke.rareza}</small>
        `;
        grid.appendChild(card);
    });
    document.getElementById('modal-x10').classList.remove('hidden');
}

function cerrarModalX10() {
    reproducirSonido('normal');
    document.getElementById('modal-x10').classList.add('hidden');
}

// ACCIONES INVENTARIO
function subirNivel(instanciaId) {
    reproducirSonido('normal');
    const poke = inventario.find(p => p.instanciaId === instanciaId);
    const costoSubir = poke.nivel * 30;

    if (monedas >= costoSubir) {
        monedas -= costoSubir; stats.gastadosTotales += costoSubir;
        poke.nivel++;
        actualizarUI();
    } else { alert(`Necesitas ${costoSubir} Pokedólares para subir de nivel.`); }
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
            const duplicado = grupo[i];
            gananciaTotal += duplicado.valorBase + (duplicado.nivel * 15);
            seleccionadosFusion = seleccionadosFusion.filter(id => id !== duplicado.instanciaId);
        }
    });

    if (gananciaTotal > 0) {
        monedas += gananciaTotal; stats.ganadosTotales += gananciaTotal;
        inventario = nuevosInventario;
        actualizarUI();
        alert(`¡Has vendido tus duplicados y ganado ${gananciaTotal} Pokedólares!`);
    } else { alert("No tienes Pokémon duplicados para vender."); }
}

// FUSIÓN
function seleccionarParaFusion(instanciaId) {
    reproducirSonido('normal');
    const index = seleccionadosFusion.indexOf(instanciaId);
    if (index !== -1) { seleccionadosFusion.splice(index, 1); } 
    else {
        if (seleccionadosFusion.length < 3) seleccionadosFusion.push(instanciaId);
        else alert("Ya tienes 3 Pokémon seleccionados para fusionar.");
    }
    actualizarUI();
}

function actualizarSlotsFusion() {
    for (let i = 0; i < 3; i++) {
        const slotEl = document.querySelector(`[data-slot="${i}"]`);
        const idActual = seleccionadosFusion[i];
        if (idActual) {
            const poke = inventario.find(p => p.instanciaId === idActual);
            if (poke) {
                slotEl.innerHTML = `<img src="${poke.sprite}" alt="${poke.nombre}">`;
                slotEl.style.borderStyle = "solid"; slotEl.style.borderColor = "#8b5cf6";
            }
        } else {
            slotEl.innerHTML = `Slot ${i + 1}`;
            slotEl.style.borderStyle = "dashed"; slotEl.style.borderColor = "#4b5563";
        }
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
        const nuevoPokemon = {
            id: datos.id,
            nombre: datos.name,
            rareza: 'Epico',
            sprite: datos.sprites.front_default,
            valorBase: 180,
            esShiny: false,
            instanciaId: Date.now() + Math.random(),
            nivel: 1
        };
        inventario.push(nuevoPokemon);
        if (!pokedexDescubiertos.includes(datos.id)) pokedexDescubiertos.push(datos.id);
        reproducirSonido('legendario');
        actualizarUI();
        alert(`¡Fusión exitosa! Has obtenido un ${nuevoPokemon.nombre} (Épico).`);
    } catch (e) { console.error(e); }
}

// FILTRADO Y ORDENADO
function aplicarFiltrosInventario() {
    const filtroRareza = document.getElementById('filtro-rareza').value;
    const ordenarPor = document.getElementById('ordenar-por').value;

    let listaFiltrada = [...inventario];

    // Aplicar Filtro de Rareza o Shiny
    if (filtroRareza === 'shiny') {
        listaFiltrada = listaFiltrada.filter(p => p.esShiny);
    } else if (filtroRareza !== 'todas') {
        listaFiltrada = listaFiltrada.filter(p => p.rareza === filtroRareza);
    }

    // Aplicar Criterio de Orden
    if (ordenarPor === 'nivel') {
        listaFiltrada.sort((a, b) => b.nivel - a.nivel);
    } else if (ordenarPor === 'nombre') {
        listaFiltrada.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (ordenarPor === 'rareza') {
        const ordenRarezas = { 'Legendario': 4, 'Epico': 3, 'Raro': 2, 'Comun': 1 };
        listaFiltrada.sort((a, b) => ordenRarezas[b.rareza] - ordenRarezas[a.rareza]);
    } else {
        // 'recientes' (orden natural por ID de instancia)
        listaFiltrada.reverse();
    }

    renderizarInventarioGrid(listaFiltrada);
}

function renderizarInventarioGrid(lista) {
    const grid = document.getElementById('grid-inventario');
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #4b5563; padding: 40px;">No hay Pokémon que coincidan con los filtros seleccionados.</p>`;
        return;
    }

    lista.forEach(poke => {
        const estaSeleccionado = seleccionadosFusion.includes(poke.instanciaId);
        const card = document.createElement('div');
        card.className = `card-pokemon ${poke.rareza} ${poke.esShiny ? 'is-shiny' : ''}`;
        card.innerHTML = `
            ${poke.esShiny ? '<span class="badge-shiny">SHINY</span>' : ''}
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <strong>${poke.nombre}</strong>
            <small>Nv. ${poke.nivel} (${poke.rareza})</small>
            <button class="btn-card btn-subir" onclick="subirNivel(${poke.instanciaId})">Subir Nv. (${poke.nivel * 30} 💰)</button>
            <button class="btn-card btn-vender" onclick="venderPokemon(${poke.instanciaId})">Vender (+${poke.valorBase + (poke.nivel * 15)} 💰)</button>
            <button class="btn-card btn-seleccionar ${estaSeleccionado ? 'seleccionado' : ''}" onclick="seleccionarParaFusion(${poke.instanciaId})">${estaSeleccionado ? 'Quitar' : 'Fusionar'}</button>
        `;
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
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="Pokédex">
            <strong>#${id}</strong>
            <small>${descubierto ? 'Descubierto' : '???'}</small>
        `;
        grid.appendChild(card);
    });
}

// Inicialización
cargarPartida();
setInterval(verificarEstadoRecompensaDiaria, 60000);
actualizarUI();