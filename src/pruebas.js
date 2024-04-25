const io = require('socket.io-client');

const numClients = 5; // Número total de clientes que deseas simular
let hostSocket; // Variable para almacenar el socket del cliente anfitrión
let codigoReunion; // Variable para almacenar el código de la reunión
let contrasenaReunion; // Variable para almacenar la contraseña de la reunión

// Cliente anfitrión
hostSocket = io.connect('http://localhost:3001/reuniones');

// hostSocket.on('connect', () => {
//   console.log(`Cliente anfitrión ${hostSocket.id} conectado`);

//   // Crea la reunión cuando el cliente anfitrión se conecta
//   hostSocket.emit('crearReunion', { data: { usuarioId: 1 } });
// });

// hostSocket.on('reunionCreada', reunion => {
//   // Almacena el código y la contraseña de la reunión creada
//   codigoReunion = reunion.codigo;
//   contrasenaReunion = reunion.password;
//   console.log(`Reunión creada - Código: ${codigoReunion}, Contraseña: ${contrasenaReunion}`);
// });

// hostSocket.on('actualizarDiagrama', cambios => {
//   console.log(`Cliente anfitrión ${hostSocket.id} recibió cambios en el diagrama:`, cambios);
// });

// Otros clientes que se unen a la reunión del anfitrión
const clientes = [ "umQknSwSunQpeo9JAAA4",
   "AYfyRPZ5rmqeSx_5AAA5",
   "yMGgkmaSSVpqSLtIAAA6",
   "HLaA3pTytPimVMpxAAA7"]
for (let i = 1; i < clientes.length; i++) {
  const clientSocket = io.connect('http://localhost:3001/reuniones');

  clientSocket.on('connect', () => {

    // Cliente se une a la reunión del anfitrión usando el código y la contraseña
    clientSocket.emit('unirseReunion', { codigo: "u0cO72RI", contrasena: "6440f9259e" });
    console.log(`Cliente ${clientes[i]} conectado`);

  });

  // Puedes simular movimientos de nodos, etc., enviando mensajes 'actualizarDiagrama' al servidor
    const randomNodeKey = Math.floor(Math.random() * 1000).toString();
    const randomLeft = Math.floor(Math.random() * 500);
    const randomTop = Math.floor(Math.random() * 500);
    const change = {
      type: 'moveNodes',
      nodes: [{ key: randomNodeKey, left: randomLeft, top: randomTop }],
    };
    clientSocket.emit('actualizarDiagrama', [change]);
    console.log(`Cliente ${clientes[i]} hizo el cambio`, `el cambio fue ${change.type}`);
  


  clientSocket.on('disconnect', () => {
    console.log(`Cliente ${clientSocket.id} desconectado`);
  });
}