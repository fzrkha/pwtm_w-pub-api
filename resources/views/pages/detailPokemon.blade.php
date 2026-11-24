@extends('layouts.app')
@section('content')
<div class="container py-3">
    <button type="button" id="backButton" class="btn btn-outline-dark">
        <i class="bi bi-arrow-left"></i> Kembali
    </button>
</div>

<div class="container py-3">
    <div id="detailLoading" class="text-center py-5">
        <div class="spinner-border text-danger"></div>
        <p class="text-muted mt-2">Memuat detail Pokémon...</p>
    </div>

    <div id="detailError" class="alert alert-danger d-none">
        <h5>Pokémon tidak ditemukan</h5>
        <p id="errorMessage">
            Gagal mengambil data Pokémon.
        </p>
    </div>

    <div id="pokemonDetail"
         data-pokemon-id="{{ $id }}"
         class="d-none">

        <div class="row align-items-center mb-4">

            <div class="col-md-5 text-center">
                <div class="bg-light rounded-4 p-4">
                    <img
                        id="pokemonImage"
                        src=""
                        alt="Pokemon"
                        class="img-fluid"
                        style="max-height: 350px; object-fit: contain;"
                    >
                </div>
            </div>

            <div class="col-md-7 mt-3 mt-md-0">

                <p class="text-muted mb-1" id="pokemonId"></p>

                <h1 class="fw-bold text-capitalize"
                    id="pokemonName">
                </h1>

                <div id="pokemonTypes" class="mb-3"></div>

                <h5 id="pokemonGenus"
                    class="text-muted mb-3">
                </h5>

                <p id="pokemonDescription"
                   class="text-secondary">
                </p>

                <div class="row g-3 mt-2">
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <p class="text-muted mb-1">Generasi</p>
                                <h5 id="pokemonGeneration" class="fw-bold mb-0">
                                    -
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <p class="text-muted mb-1">Habitat</p>
                                <h5 id="pokemonHabitat" class="fw-bold mb-0">
                                    -
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <hr>

        <h4 class="fw-bold mb-3">Informasi Pokémon</h4>

        <div class="row g-3 mb-4">

            <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <p class="text-muted mb-1">Tinggi</p>
                        <h5 id="pokemonHeight" class="fw-bold"></h5>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <p class="text-muted mb-1">Berat</p>
                        <h5 id="pokemonWeight" class="fw-bold"></h5>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <p class="text-muted mb-1">Base Experience</p>
                        <h5 id="pokemonExperience" class="fw-bold"></h5>
                    </div>
                </div>
            </div>

        </div>

        <h4 class="fw-bold mb-3">Abilities</h4>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div id="pokemonAbilities"></div>
            </div>
        </div>

        <h4 class="fw-bold mb-3">Base Stats</h4>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div id="pokemonStats"></div>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h4 class="fw-bold mb-0">Moveset per Level</h4>

            <select id="movesetVersion"
                    class="form-select w-auto"
                    aria-label="Pilih versi game">
            </select>
        </div>

        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
                <div id="movesetLoading" class="text-center text-muted py-4">
                    <div class="spinner-border spinner-border-sm text-danger me-2"></div>
                    Memuat moveset...
                </div>

                <p id="movesetEmpty" class="text-center text-muted py-4 mb-0 d-none">
                    Pokémon ini tidak mempelajari move lewat level.
                </p>

                <div class="table-responsive">
                    <table id="movesetTable" class="table table-hover align-middle mb-0 d-none">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4" style="width: 90px;">Level</th>
                                <th>Move</th>
                                <th>Tipe</th>
                                <th>Kategori</th>
                                <th class="text-end">Power</th>
                                <th class="text-end">Akurasi</th>
                                <th class="text-end pe-4">PP</th>
                            </tr>
                        </thead>
                        <tbody id="movesetBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between gap-3 mt-5">

            <button id="previousPokemon"
                    class="btn btn-outline-danger">
                &larr; Pokémon Sebelumnya
            </button>

            <button id="nextPokemon"
                    class="btn btn-danger">
                Pokémon Berikutnya &rarr;
            </button>

        </div>

    </div>
</div>

<script src="{{ asset('js/typecolors.js') }}" defer></script>
<script src="{{ asset('js/detailPokemon.js') }}" defer></script>
@endsection