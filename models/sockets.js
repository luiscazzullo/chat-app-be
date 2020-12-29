const { checkToken } = require('../helpers/token');
const { userConnected, userDisconnected, getUsers, saveMessages } = require('../controllers/sockets');

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async ( socket ) => {
            const [ isValid, id ] = checkToken(socket.handshake.query['x-token']);
            if(!isValid) {
                console.log('socket no identificado');
                return socket.disconnect();
            }
            await userConnected(id);
            socket.join(id);
            //TODO: validar el JWT, si el token es válido, puede continuar.

            //TODO: Saber qué usuario está activo, mediante el UID del token

            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsers())
            //TODO: Unirme a una sala específica

            //TODO: Escuchar cuando el cliente manda un mensaje
            socket.on('mensaje-personal', async (payload) => {
                const message = await saveMessages(payload);
                this.io.to(payload.to).emit('mensaje-personal', message);
                this.io.to(payload.from).emit('mensaje-personal', message);
            })
            //TODO: Disconnect. Marcar que el usuario se desconectó.
            //TODO: Emitir todos los usuarios conectados
            socket.on('disconnect', async () => {
                await userDisconnected(id);
                this.io.emit('lista-usuarios', await getUsers())
            })
        
        });
    }


}


module.exports = Sockets;