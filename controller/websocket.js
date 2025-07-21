const { Server } = require('socket.io');

let io;

function initWebSocket(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        const idphiendg = socket.handshake.query.idphiendg;
        if (idphiendg) {
            socket.join(idphiendg);
            console.log(`Client joined room ${idphiendg}`);
        }

        socket.on('disconnect', () => {
            console.log(`Client disconnected from room ${idphiendg}`);
        });
    });
}

function broadcastBidUpdate(idphiendg, bidData) {
    io.to(idphiendg).emit('bidUpdate', bidData);
}

function broadcastHighestBidUpdate(idphiendg, highestBid) {
    io.to(idphiendg).emit('highestBidUpdate', highestBid);
}

function broadcastStatusUpdate(idphiendg, trangthai) {
    io.to(idphiendg).emit('statusUpdate', trangthai);
}

function broadcastProcessingUpdate(idphiendg, isProcessing) {
    if (idphiendg === 'all') {
        io.emit('processingUpdate', isProcessing);
    } else {
        io.to(idphiendg).emit('processingUpdate', isProcessing);
    }
}

module.exports = {
    initWebSocket,
    broadcastBidUpdate,
    broadcastHighestBidUpdate,
    broadcastStatusUpdate,
    broadcastProcessingUpdate
};