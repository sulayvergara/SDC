// Manejo del formulario de registro
document.getElementById('insertar-maestro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const clave = document.getElementById('clave').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    
  fetch('/maestros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellido, email, clave, fecha_nacimiento})
    })
    .then(response => response.json())
    .then(data => mostrarResultado('Ingreso satisfactorio',data))
    .catch(error => console.error('Error:', error));

 // Muestra el modal de Bootstrap
    $('#success-modal').modal('show');
});

// Manejo del formulario de inicio de sesión
document.getElementById('inicio-sesion').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const clave = document.getElementById('clave').value;

  // Enviar la solicitud al backend
  fetch('/maestros/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, clave })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error en las credenciales. Verifica tu email o contraseña.');
      }
      return response.json();
  })
  .then(data => {
      alert('Inicio de sesión exitoso.');
      // Muestra el modal de Bootstrap
      $('#success-modal').modal('show');
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error al iniciar sesión: ' + error.message);
  });
  
});

function mostrarFormulario(formulario) {
    const formInicio = document.getElementById('form-inicio-sesion');
    const formRegistro = document.getElementById('form-registro');

    if (formulario === 'inicio') {
        formInicio.classList.remove('hidden');
        formRegistro.classList.add('hidden');
    } else if (formulario === 'registro') {
        formInicio.classList.add('hidden');
        formRegistro.classList.remove('hidden');
    }
}


