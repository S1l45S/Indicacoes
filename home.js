document.getElementById('sortear-tipo').addEventListener('click', function() {
    const tipos = ['filmes.html', 'series.html', 'livros.html'];
    const tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
    window.location.href = tipoSorteado;
});