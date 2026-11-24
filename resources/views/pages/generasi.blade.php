
@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="mb-4">
        <h2 class="fw-bold">Generasi Pokémon</h2>
        <p class="text-muted">
            Jelajahi Pokémon berdasarkan generasinya.
        </p>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-7">
            <input
                type="text"
                id="searchGeneration"
                class="form-control"
                placeholder="Cari nama wilayah generasi Pokémon..."
            >
        </div>

        <div class="col-md-5">
            <select id="sortGeneration" class="form-select">
                <option value="default">Urutan Default</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
            </select>
        </div>
    </div>

    <div id="generationEmpty" class="text-center text-muted py-5 d-none">
        Generasi tidak ditemukan.
    </div>

    <div id="generationList" class="row g-3"></div>

    <div id="generationLoading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="text-muted mt-3">Memuat daftar generasi...</p>
    </div>

    <div id="generationError" class="alert alert-danger d-none">
        Gagal memuat daftar generasi.
        <button id="retryGeneration" class="btn btn-sm btn-danger ms-2">
            Coba Lagi
        </button>
    </div>
</div>

@push('styles')
<style>
    .region-card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 250px;
        padding: 1.5rem;
        border-radius: 1.25rem;
        overflow: hidden;
        color: #fff;
        text-decoration: none;
        background:
            radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.22), transparent 55%),
            linear-gradient(135deg, var(--region-from), var(--region-to));
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        isolation: isolate;
    }

    .region-card:hover {
        color: #fff;
        transform: translateY(-4px);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
    }

    .region-card:focus-visible {
        outline: 3px solid #212529;
        outline-offset: 3px;
    }

    .region-map {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .region-card:hover .region-map {
        transform: scale(1.06);
    }

    .region-overlay {
        position: absolute;
        inset: 0;
        background:
            linear-gradient(90deg, var(--region-to) 0%, color-mix(in srgb, var(--region-from) 85%, transparent) 35%, transparent 75%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, transparent 45%);
    }

    .region-body,
    .region-footer {
        position: relative;
        z-index: 1;
    }

    .region-gen {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.8;
    }

    .region-name {
        margin: 0.15rem 0 0.6rem;
        font-size: 2.1rem;
        font-weight: 800;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .region-count {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(4px);
    }

    .region-footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 1.25rem;
    }

    .region-starters {
        display: flex;
    }

    .region-starter {
        width: 52px;
        height: 52px;
        margin-right: -0.5rem;
        padding: 4px;
        border-radius: 50%;
        object-fit: contain;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }

    .region-cta {
        padding: 0.3rem 0.8rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(4px);
    }

    .region-card:hover .region-cta .bi {
        transform: translateX(3px);
    }

    .region-cta .bi {
        display: inline-block;
        transition: transform 0.2s ease;
    }

    @media (max-width: 575.98px) {
        .region-card {
            min-height: 210px;
        }

        .region-name {
            font-size: 1.7rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .region-card,
        .region-map,
        .region-cta .bi {
            transition: none;
        }
    }
</style>
@endpush

@push('scripts')
    <script src="{{ asset('js/generasi.js') }}" defer></script>
@endpush
@endsection