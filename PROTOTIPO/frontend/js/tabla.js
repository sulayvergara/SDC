document.addEventListener('DOMContentLoaded', function() {
  fetch('/usuario', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
      // Mostrar los datos del usuario y el puntaje
      mostrarResultado(data);
      // Leer el puntaje de localStorage y actualizar la tabla
      const score = localStorage.getItem('score');
      if (score) {
          updateTable(score);
      }
  })
  .catch(error => console.error('Error:', error));
});

function mostrarResultado(data) {
  const tablaCuerpo = document.querySelector('#puntuaciones-table tbody');
  tablaCuerpo.innerHTML = ''; // Limpiar cualquier contenido previo

  if (data && data.body && data.body.nombre && data.body.apellido && data.body.paralelo) {
      // Crear una nueva fila y celdas para cada campo
      const fila = document.createElement('tr');

      const celdaNombre = document.createElement('td');
      celdaNombre.textContent = data.body.nombre;
      fila.appendChild(celdaNombre);

      const celdaApellido = document.createElement('td');
      celdaApellido.textContent = data.body.apellido;
      fila.appendChild(celdaApellido);

      const celdaParalelo = document.createElement('td');
      celdaParalelo.textContent = data.body.paralelo;
      fila.appendChild(celdaParalelo);

      // Obtener el puntaje del localStorage
      const score = localStorage.getItem('score') || 'No disponible';
      const celdaPuntaje = document.createElement('td');
      celdaPuntaje.textContent = score;
      fila.appendChild(celdaPuntaje);

      // Agregar la fila a la tabla
      tablaCuerpo.appendChild(fila);
  } else {
      // Mostrar un mensaje si no se encontraron datos
      const fila = document.createElement('tr');
      const celdaMensaje = document.createElement('td');
      celdaMensaje.textContent = 'No se encontraron datos.';
      celdaMensaje.colSpan = 4; // Abarca todas las columnas
      fila.appendChild(celdaMensaje);
      tablaCuerpo.appendChild(fila);
  }
}
