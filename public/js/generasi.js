
const GENERATION_API_URL = 'https://pokeapi.co/api/v2/generation';
const ARTWORK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const MAP_URL = 'https://static.wikia.nocookie.net/pokemon/images';

// Starter, peta wilayah (Pokémon Wiki di Fandom), dan warna khas setiap wilayah
const regionThemes = {
    kanto:  { starters: [1, 4, 7],       map: "8/85/Kanto_Let%27s_Go%2C_Pikachu%21_and_Let%27s_Go%2C_Eevee%21.png", colors: ['#c0392b', '#7b1e15'] },
    johto:  { starters: [152, 155, 158], map: 'f/fe/Johto_HGSS.png',                   colors: ['#b5832a', '#6b4510'] },
    hoenn:  { starters: [252, 255, 258], map: '8/85/Hoenn_ORAS.png',                   colors: ['#1e8a5c', '#0d4a33'] },
    sinnoh: { starters: [387, 390, 393], map: 'f/f8/Sinnoh_BDSP.png',                  colors: ['#3d5a9e', '#1d2c55'] },
    unova:  { starters: [495, 498, 501], map: '8/81/Unova_Black_2_and_White_2.png',    colors: ['#4b4f58', '#1c1e23'] },
    kalos:  { starters: [650, 653, 656], map: 'f/f1/Kalos.jpg',                        colors: ['#2a7fbf', '#123f66'] },
    alola:  { starters: [722, 725, 728], map: '6/6c/Alola.png',                        colors: ['#d9692a', '#8a3412'] },
    galar:  { starters: [810, 813, 816], map: 'a/a4/Galar_map.png',                    colors: ['#8e3fa8', '#46185a'] },
    paldea: { starters: [906, 909, 912], map: 'a/a1/Paldea.jpg',                       colors: ['#c2364f', '#5e1426'] }
};

const defaultTheme = { starters: [], map: null, colors: ['#6c757d', '#343a40'] };

// Elemen HTML
const generationList = document.getElementById('generationList');
const generationLoading = document.getElementById('generationLoading');
const generationError = document.getElementById('generationError');
const retryButton = document.getElementById('retryGeneration');
const generationEmpty = document.getElementById('generationEmpty');
const searchInput = document.getElementById('searchGeneration');
const sortSelect = document.getElementById('sortGeneration');

// Data generasi Pokémon
let allGenerations = [];
let searchKeyword = '';
let currentSort = 'default';

// Mengambil data API
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Gagal mengambil data dari PokéAPI.');
    }

    return await response.json();
}

// Mengubah angka Romawi menjadi format kapital
function formatGeneration(name) {
    return `Generasi ${name.split('-')[1].toUpperCase()}`;
}

function artworkUrl(id) {
    return `${ARTWORK_URL}/${id}.png`;
}

function mapUrl(path) {
    return `${MAP_URL}/${path}/revision/latest/scale-to-width-down/800`;
}

function formatRegion(region) {
    return region.charAt(0).toUpperCase() + region.slice(1);
}

// Mengambil daftar generasi
async function loadGenerations() {
    generationLoading.classList.remove('d-none');
    generationError.classList.add('d-none');
    generationList.innerHTML = '';

    try {
        const data = await fetchData(`${GENERATION_API_URL}?limit=100`);

        allGenerations = await Promise.all(
            data.results.map(async generation => {
                const detail = await fetchData(generation.url);

                const id = Number(
                    generation.url.match(/\/generation\/(\d+)\/?$/)[1]
                );

                return {
                    id: id,
                    name: generation.name,
                    region: detail.main_region.name,
                    speciesCount: detail.pokemon_species.length
                };
            })
        );

        renderGenerations();

    } catch (error) {
        console.error('Gagal memuat generasi:', error);
        generationError.classList.remove('d-none');

    } finally {
        generationLoading.classList.add('d-none');
    }
}

// Filter dan sorting generasi
function getFilteredGenerations() {
    let result = allGenerations.filter(generation => {
        return generation.region
            .toLowerCase()
            .includes(searchKeyword);
    });

    switch (currentSort) {
        case 'name-asc':
            result.sort((a, b) => a.region.localeCompare(b.region));
            break;

        case 'name-desc':
            result.sort((a, b) => b.region.localeCompare(a.region));
            break;

        default:
            result.sort((a, b) => a.id - b.id);
    }

    return result;
}

// Menampilkan daftar generasi
function renderGenerations() {
    const filteredGenerations = getFilteredGenerations();

    generationList.innerHTML = '';
    generationEmpty.classList.toggle(
        'd-none',
        filteredGenerations.length > 0
    );

    generationList.innerHTML = filteredGenerations.map(generation => {
        const theme = regionThemes[generation.region] || defaultTheme;
        const regionName = formatRegion(generation.region);

        // Jika peta gagal dimuat, kartu tetap tampil dengan gradien warna wilayah
        const map = theme.map
            ? `<img class="region-map" src="${mapUrl(theme.map)}" alt="" loading="lazy" onerror="this.remove()">`
            : '';

        const starters = theme.starters.map(id => `
            <img class="region-starter" src="${artworkUrl(id)}" alt="" loading="lazy">
        `).join('');

        return `
            <div class="col-md-6">
                <a href="/gen/${generation.id}"
                   class="region-card"
                   style="--region-from: ${theme.colors[0]}; --region-to: ${theme.colors[1]};"
                   aria-label="${regionName}, ${formatGeneration(generation.name)}">

                    ${map}
                    <span class="region-overlay"></span>

                    <div class="region-body">
                        <span class="region-gen">${formatGeneration(generation.name)}</span>
                        <h3 class="region-name">${regionName}</h3>
                        <span class="region-count">
                            <i class="bi bi-collection"></i>
                            ${generation.speciesCount} Pokémon
                        </span>
                    </div>

                    <div class="region-footer">
                        <div class="region-starters">${starters}</div>
                        <span class="region-cta">
                            Jelajahi <i class="bi bi-arrow-right"></i>
                        </span>
                    </div>
                </a>
            </div>
        `;
    }).join('');
}

// Event pencarian
searchInput.addEventListener('input', function () {
    searchKeyword = this.value.toLowerCase().trim();
    renderGenerations();
});

// Event sorting
sortSelect.addEventListener('change', function () {
    currentSort = this.value;
    renderGenerations();
});

// Event tombol coba lagi
retryButton.addEventListener('click', loadGenerations);

// Jalankan
loadGenerations();
