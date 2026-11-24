
const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const detailContainer = document.getElementById('pokemonDetail');
const loadingElement = document.getElementById('detailLoading');
const errorElement = document.getElementById('detailError');

const pokemonId = Number(detailContainer.dataset.pokemonId);

const previousButton = document.getElementById('previousPokemon');
const nextButton = document.getElementById('nextPokemon');


// Mengambil data API
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}


// Mengubah nama menjadi format yang lebih rapi
function formatName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


// Menghindari HTML injection
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}


// Mengambil deskripsi Pokémon
async function getSpeciesData(url) {
    try {
        const species = await fetchData(url);
        let generationData = null;

        // Mengambil genus
        const genus = species.genera.find(
            item => item.language.name === 'en'
        );

        // Mengambil deskripsi
        const description = species.flavor_text_entries.find(
            item => item.language.name === 'en'
        );

        // Mengambil informasi generasi
        let generation = 'Unknown';

        if (species.generation?.url) {
            generationData = await fetchData(
                species.generation.url
            );

            const generationName = species.generation.name
                .replace('generation-', '')
                .toUpperCase();

            const region = generationData.main_region?.name;

            generation = region
                ? `Generasi ${generationName} - ${formatName(region)}`
                : `Generasi ${generationName}`;
        }

        // Mengambil habitat
        const habitat = species.habitat
            ? formatName(species.habitat.name)
            : 'Unknown';

        return {
            genus: genus?.genus || 'Unknown Species',

            description: description?.flavor_text
                ?.replace(/[\n\f\r]+/g, ' ') ||
                'No description available.',

            generation: generation,
            habitat: habitat,

            rawData: {
                species: species,
                generation: generationData
            }
        };

    } catch (error) {
        console.error('Species error:', error);

        return {
            genus: 'Unknown Species',
            description: 'Description unavailable.',
            generation: 'Unknown',
            habitat: 'Unknown'
        };
    }
}


// Menampilkan tipe Pokémon
function renderTypes(types) {
    const container = document.getElementById('pokemonTypes');

    container.innerHTML = types.map(item => {
        const typeName = item.type.name;
        const color = getTypeColor(typeName);
        const textColor = getTypeTextColor(typeName);

        return `
            <span class="badge me-1 fs-6"
                  style="background: ${color}; color: ${textColor};">
                ${escapeHTML(formatName(typeName))}
            </span>
        `;
    }).join('');
}


// Menampilkan abilities
function renderAbilities(abilities) {
    const container = document.getElementById('pokemonAbilities');

    container.innerHTML = abilities.map(item => `
        <div class="d-flex justify-content-between align-items-center
                    border-bottom py-2">

            <span class="fw-semibold">
                ${escapeHTML(formatName(item.ability.name))}
            </span>

            <span class="badge ${item.is_hidden
                ? 'bg-warning text-dark'
                : 'bg-secondary'}">
                ${item.is_hidden ? 'Hidden Ability' : 'Normal Ability'}
            </span>

        </div>
    `).join('');
}


// Menampilkan base stats
function renderStats(stats) {
    const container = document.getElementById('pokemonStats');

    const maxStat = Math.max(
        100,
        ...stats.map(item => item.base_stat)
    );

    container.innerHTML = stats.map(item => {
        const statName = item.stat.name
            .replace('special-attack', 'Sp. Atk')
            .replace('special-defense', 'Sp. Def')
            .replace('hp', 'HP')
            .replace('attack', 'Attack')
            .replace('defense', 'Defense')
            .replace('speed', 'Speed');

        const percentage = Math.min(
            (item.base_stat / maxStat) * 100,
            100
        );

        return `
            <div class="mb-3">

                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold">
                        ${escapeHTML(statName)}
                    </span>

                    <span class="fw-bold">
                        ${item.base_stat}
                    </span>
                </div>

                <div class="progress" style="height: 10px;">
                    <div
                        class="progress-bar bg-danger"
                        role="progressbar"
                        style="width: ${percentage}%"
                        aria-valuenow="${item.base_stat}"
                        aria-valuemin="0"
                        aria-valuemax="${maxStat}">
                    </div>
                </div>

            </div>
        `;
    }).join('');
}


// Moveset per level
const movesetVersion = document.getElementById('movesetVersion');
const movesetBody = document.getElementById('movesetBody');
const movesetTable = document.getElementById('movesetTable');
const movesetLoading = document.getElementById('movesetLoading');
const movesetEmpty = document.getElementById('movesetEmpty');

const moveCache = {};

const damageClassStyles = {
    physical: { label: 'Fisik', icon: 'bi-lightning-charge-fill', color: '#C92112' },
    special: { label: 'Spesial', icon: 'bi-stars', color: '#4F5870' },
    status: { label: 'Status', icon: 'bi-circle-half', color: '#8C888C' }
};

// Urutan rilis dari terbaru, karena ID version group di PokéAPI tidak kronologis
const versionGroupLabels = [
    ['legends-za', 'Legends: Z-A'],
    ['the-indigo-disk', 'Scarlet / Violet: The Indigo Disk'],
    ['the-teal-mask', 'Scarlet / Violet: The Teal Mask'],
    ['scarlet-violet', 'Scarlet / Violet'],
    ['legends-arceus', 'Legends: Arceus'],
    ['brilliant-diamond-shining-pearl', 'Brilliant Diamond / Shining Pearl'],
    ['sword-shield', 'Sword / Shield'],
    ['lets-go-pikachu-lets-go-eevee', "Let's Go Pikachu / Eevee"],
    ['ultra-sun-ultra-moon', 'Ultra Sun / Ultra Moon'],
    ['sun-moon', 'Sun / Moon'],
    ['omega-ruby-alpha-sapphire', 'Omega Ruby / Alpha Sapphire'],
    ['x-y', 'X / Y'],
    ['black-2-white-2', 'Black 2 / White 2'],
    ['black-white', 'Black / White'],
    ['heartgold-soulsilver', 'HeartGold / SoulSilver'],
    ['platinum', 'Platinum'],
    ['diamond-pearl', 'Diamond / Pearl'],
    ['firered-leafgreen', 'FireRed / LeafGreen'],
    ['emerald', 'Emerald'],
    ['xd', 'XD: Gale of Darkness'],
    ['colosseum', 'Colosseum'],
    ['ruby-sapphire', 'Ruby / Sapphire'],
    ['crystal', 'Crystal'],
    ['gold-silver', 'Gold / Silver'],
    ['yellow', 'Yellow'],
    ['red-blue', 'Red / Blue'],
    ['blue-japan', 'Blue (Jepang)'],
    ['red-green-japan', 'Red / Green (Jepang)']
];

const versionGroupOrder = versionGroupLabels.map(([name]) => name);
const versionGroupLabelMap = Object.fromEntries(versionGroupLabels);
const DEFAULT_VERSION_GROUP = 'scarlet-violet';

let levelUpMovesByVersion = {};

function getIdFromUrl(url) {
    return Number(url.match(/\/(\d+)\/?$/)[1]);
}

async function getMoveDetail(url) {
    if (!moveCache[url]) {
        moveCache[url] = fetchData(url);
    }

    return moveCache[url];
}

function groupLevelUpMoves(moves) {
    const groups = {};

    moves.forEach(item => {
        item.version_group_details.forEach(detail => {
            if (detail.move_learn_method.name !== 'level-up') {
                return;
            }

            const version = detail.version_group;

            if (!groups[version.name]) {
                groups[version.name] = {
                    id: getIdFromUrl(version.url),
                    name: version.name,
                    moves: []
                };
            }

            groups[version.name].moves.push({
                level: detail.level_learned_at,
                name: item.move.name,
                url: item.move.url
            });
        });
    });

    return groups;
}

function renderMoveRows(moves) {
    movesetBody.innerHTML = moves.map(({ level, move }) => {
        const typeName = move.type.name;
        const damageClass = damageClassStyles[move.damage_class?.name] || damageClassStyles.status;

        // Level 0 di game baru berarti move dipelajari saat berevolusi
        const levelLabel = level === 0
            ? '<span class="badge bg-dark">Evo</span>'
            : `<span class="fw-bold">${level}</span>`;

        return `
            <tr>
                <td class="ps-4">${levelLabel}</td>
                <td class="fw-semibold">${escapeHTML(formatName(move.name))}</td>
                <td>
                    <span class="badge"
                          style="background: ${getTypeColor(typeName)}; color: ${getTypeTextColor(typeName)};">
                        ${escapeHTML(formatName(typeName))}
                    </span>
                </td>
                <td>
                    <span class="small fw-semibold" style="color: ${damageClass.color};">
                        <i class="bi ${damageClass.icon}"></i> ${damageClass.label}
                    </span>
                </td>
                <td class="text-end">${move.power ?? '—'}</td>
                <td class="text-end">${move.accuracy ? `${move.accuracy}%` : '—'}</td>
                <td class="text-end pe-4">${move.pp ?? '—'}</td>
            </tr>
        `;
    }).join('');
}

async function showMovesetVersion(versionName) {
    const group = levelUpMovesByVersion[versionName];

    movesetLoading.classList.remove('d-none');
    movesetTable.classList.add('d-none');

    try {
        const moves = await Promise.all(
            group.moves.map(async item => ({
                level: item.level,
                move: await getMoveDetail(item.url)
            }))
        );

        moves.sort((a, b) => a.level - b.level || a.move.name.localeCompare(b.move.name));

        // Abaikan hasil lama jika pengguna sudah memilih versi lain
        if (movesetVersion.value !== versionName) {
            return;
        }

        renderMoveRows(moves);
        movesetTable.classList.remove('d-none');

    } catch (error) {
        console.error('Moveset error:', error);
        movesetBody.innerHTML = '';
        movesetEmpty.textContent = 'Gagal memuat moveset.';
        movesetEmpty.classList.remove('d-none');

    } finally {
        if (movesetVersion.value === versionName) {
            movesetLoading.classList.add('d-none');
        }
    }
}

function renderMoveset(moves) {
    levelUpMovesByVersion = groupLevelUpMoves(moves);

    const rank = name => {
        const index = versionGroupOrder.indexOf(name);
        return index === -1 ? versionGroupOrder.length : index;
    };

    const versions = Object.values(levelUpMovesByVersion)
        .sort((a, b) => rank(a.name) - rank(b.name) || b.id - a.id);

    if (versions.length === 0) {
        movesetLoading.classList.add('d-none');
        movesetVersion.classList.add('d-none');
        movesetEmpty.classList.remove('d-none');
        return;
    }

    movesetVersion.innerHTML = versions.map(version => `
        <option value="${escapeHTML(version.name)}">
            ${escapeHTML(versionGroupLabelMap[version.name] || formatName(version.name))}
        </option>
    `).join('');

    const defaultVersion = levelUpMovesByVersion[DEFAULT_VERSION_GROUP]
        ? DEFAULT_VERSION_GROUP
        : versions[0].name;

    movesetVersion.value = defaultVersion;
    showMovesetVersion(defaultVersion);
}

movesetVersion.addEventListener('change', function () {
    showMovesetVersion(this.value);
});


// Mengisi informasi Pokémon
async function renderPokemon(data, maxPokemonId) {

    const species = await getSpeciesData(data.species.url);

    console.log('[Osol Pokédex] Data Detail Pokémon:', {
        pokemon: data,
        species: species.rawData,
        totalPokemon: maxPokemonId
    });

    // Identitas
    document.getElementById('pokemonId').textContent =
        `#${String(data.id).padStart(4, '0')}`;

    document.getElementById('pokemonName').textContent =
        formatName(data.name);

    document.getElementById('pokemonImage').src =
        data.sprites.other['official-artwork'].front_default ||
        data.sprites.front_default;

    document.getElementById('pokemonImage').alt =
        formatName(data.name);

    document.getElementById('pokemonGenus').textContent =
        species.genus;

    document.getElementById('pokemonDescription').textContent =
        species.description;

    document.getElementById('pokemonGeneration').textContent =
        species.generation;

    document.getElementById('pokemonHabitat').textContent =
        species.habitat;

    document.title = `${formatName(data.name)} | Osol Pokédex`;

    // Tipe
    renderTypes(data.types);

    // Informasi fisik
    document.getElementById('pokemonHeight').textContent =
        `${data.height / 10} m`;

    document.getElementById('pokemonWeight').textContent =
        `${data.weight / 10} kg`;

    document.getElementById('pokemonExperience').textContent =
        data.base_experience ?? 'Unknown';

    // Abilities
    renderAbilities(data.abilities);

    // Stats
    renderStats(data.stats);

    // Moveset
    renderMoveset(data.moves);

    // Navigasi
    previousButton.disabled = data.id <= 1;
    nextButton.disabled = data.id >= maxPokemonId;

    detailContainer.classList.remove('d-none');
}


// Memuat halaman detail
async function loadPokemonDetail() {

    loadingElement.classList.remove('d-none');
    errorElement.classList.add('d-none');
    detailContainer.classList.add('d-none');

    try {
        if (!Number.isInteger(pokemonId) || pokemonId < 1) {
            throw new Error('ID Pokémon tidak valid.');
        }

        // Ambil detail dan jumlah Pokémon
        const [data, meta] = await Promise.all([
            fetchData(`${API_URL}/${pokemonId}`),
            fetchData(`${API_URL}?limit=1`)
        ]);

        await renderPokemon(data, meta.count);

    } catch (error) {
        console.error(error);

        document.getElementById('errorMessage').textContent =
            error.message || 'Terjadi kesalahan saat memuat data.';

        errorElement.classList.remove('d-none');

    } finally {
        loadingElement.classList.add('d-none');
    }
}


// Navigasi Pokémon sebelumnya
previousButton.addEventListener('click', function () {
    if (pokemonId > 1) {
        window.location.href = `/pokemon/${pokemonId - 1}`;
    }
});


// Navigasi Pokémon berikutnya
nextButton.addEventListener('click', function () {
    window.location.href = `/pokemon/${pokemonId + 1}`;
});


// Jalankan
loadPokemonDetail();

const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    const previousUrl = document.referrer;

    if (
        previousUrl &&
        new URL(previousUrl).origin === window.location.origin
    ) {
        history.back();
    } else {
        window.location.href = '/pokemon';
    }
});