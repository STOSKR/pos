import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase/firebase.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para actualizar el estado del pedido
async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
        const pedidoRef = doc(db, 'pedidos', pedidoId);
        await updateDoc(pedidoRef, {
            estado: nuevoEstado
        });
        console.log(`Pedido ${pedidoId} actualizado a ${nuevoEstado}`);
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
    }
}

// Hacer la función disponible globalmente
window.actualizarEstadoPedido = actualizarEstadoPedido;

// Función para crear una tarjeta de pedido
function crearTarjetaPedido(pedido) {
    const div = document.createElement('div');
    div.className = `pedido-card ${pedido.estado}`;
    div.innerHTML = `
        <div class="pedido-resumen">
            <div class="pedido-info">
                <strong>Teléfono:</strong> ${pedido.telefono}
            </div>
            <div class="pedido-info">
                <strong>Dirección:</strong> ${pedido.direccionEntrega || 'Recoger en local'}
            </div>
            <div class="pedido-info">
                <strong>Total:</strong> €${pedido.total}
            </div>
            <button class="btn-expandir">Ver más</button>
        </div>
        <div class="pedido-detalles oculto">
            <div class="pedido-info">
                <strong>Cliente:</strong> ${pedido.nombre}
            </div>
            <div class="pedido-info">
                <strong>Email:</strong> ${pedido.email}
            </div>
            <div class="pedido-info">
                <strong>Tipo:</strong> ${pedido.tipo}
            </div>
            ${pedido.estado === 'pendiente' ? `
                <div class="pedido-acciones">
                    <button class="btn-aceptar" onclick="actualizarEstadoPedido('${pedido.id}', 'aceptado')">
                        Aceptar
                    </button>
                    <button class="btn-cancelar" onclick="actualizarEstadoPedido('${pedido.id}', 'cancelado')">
                        Cancelar
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    // Agregar evento de clic para expandir/contraer
    const btnExpandir = div.querySelector('.btn-expandir');
    const detalles = div.querySelector('.pedido-detalles');

    btnExpandir.addEventListener('click', () => {
        detalles.classList.toggle('oculto');
        btnExpandir.textContent = detalles.classList.contains('oculto') ? 'Ver más' : 'Ver menos';
    });

    return div;
}

// Función para escuchar cambios en los pedidos
function escucharPedidos() {
    const pedidosRef = collection(db, 'pedidos');

    // Crear queries para cada estado
    const estados = ['pendiente', 'aceptado', 'cancelado'];

    estados.forEach(estado => {
        const q = query(pedidosRef, where('estado', '==', estado));

        onSnapshot(q, (snapshot) => {
            const contenedor = document.getElementById(`pedidos-${estado}s`);
            contenedor.innerHTML = '';

            console.log(`Pedidos ${estado}:`, snapshot.size);

            snapshot.forEach(doc => {
                const pedido = { id: doc.id, ...doc.data() };
                console.log(`Procesando pedido:`, pedido);
                contenedor.appendChild(crearTarjetaPedido(pedido));
            });
        });
    });
}

// Iniciar la escucha de pedidos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando aplicación...');
    escucharPedidos();
}); 