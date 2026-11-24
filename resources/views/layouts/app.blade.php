<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Osol | Pokédex</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    @stack('styles')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger sticky-top">
        <div class="container-fluid px-5">
            <a class="navbar-brand" href="/"><b>Osol Pokédex</b></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="bi bi-three-dots"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('/') ? 'active' : '' }}" aria-current="page" href="/">Beranda</a>
                    </li>
                    
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('pokemon*') ? 'active' : '' }}" href="/pokemon">Pokémon</a>
                    </li>
                    
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('tipe*') ? 'active' : '' }}" href="/tipe">Tipe Elemen</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('gen*') ? 'active' : '' }}" href="/gen">Generasi</a>
                    </li>
            
                    <!-- <li class="nav-item">
                        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                    </li> -->
                </ul>
        
                <div class="d-flex">
                    <button class="btn btn-dark" type="button">
                        <a href="https://pokeapi.co/" style="text-decoration:none; color:white" target="_blank">
                            Source
                        </a>
                    </button>
                </form>
            </div>
        </div>
    </nav>

    @yield('content')

    @stack('scripts')
</body>
</html>