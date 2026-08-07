import { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [formulario, setFormulario] = useState({

    numero: '',
    tipo: 'Single',
    precioBase: '',
    estado: 'Disponible'

  });

  const [modalCheckInAbierto, setModalCheckInAbierto] = useState(false);
  const [habitacionCheckIn, setHabitacionCheckIn] = useState(null); // Guarda el ID de la habitación
  const [formularioHuesped, setFormularioHuesped] = useState({

    tipoDocumento: 'Cédula',
    numeroDocumento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaCheckOut: '',
    descuento: ''

  });

  const [filtroActual, setFiltroActual] = useState('Todas');
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null); // Para el modal de detalles

  const [vistaActual, setVistaActual] = useState(() => {

    return localStorage.getItem('vistaActual') || 'inicio';

  });

  const [huespedes, setHuespedes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [huespedSeleccionado, setHuespedSeleccionado] = useState(null); // Para el modal de historial

  const [facturaVisible, setFacturaVisible] = useState(false);
  const [datosFactura, setDatosFactura] = useState(null);

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [sidebarColapsado, setSidebarColapsado] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);

  const [cargandoAccion, setCargandoAccion] = useState(false); // Para botones de check-in/out
  const [actualizandoDash, setActualizandoDash] = useState(false); // Para el dashboard

  const [toast, setToast] = useState(null);

  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [formularioReserva, setFormularioReserva] = useState({
    habitacionId: '',
    fechaCheckIn: '',
    fechaCheckOut: '',
    tipoDocumento: 'Cédula',
    numeroDocumento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    descuento: '',
    estado: 'Confirmada'
  });

  const [simulacionCheckIn, setSimulacionCheckIn] = useState({ noches: 1, total: 0 });
  const [simulacionReserva, setSimulacionReserva] = useState({ noches: 0, total: 0 });

  const [cargandoCheckOutId, setCargandoCheckOutId] = useState(null);

  const [modalEgresoAbierto, setModalEgresoAbierto] = useState(false);
  const [formularioEgreso, setFormularioEgreso] = useState({ concepto: '', monto: '', categoria: 'Servicios', estado: 'Pagado' });
  const [gastosPendientes, setGastosPendientes] = useState([]);

  const [llegadasHoy, setLlegadasHoy] = useState([]);
  const [todasReservas, setTodasReservas] = useState([]);
  const [salidasHoy, setSalidasHoy] = useState([]);

  const [busquedaReserva, setBusquedaReserva] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroEstadoReserva, setFiltroEstadoReserva] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [datosCancelacion, setDatosCancelacion] = useState({ password: '', motivo: '' });
  const [configHotel, setConfigHotel] = useState({ horaCheckIn: '13:00', horaCheckOut: '12:00' });
  const [dashFechaInicio, setDashFechaInicio] = useState('');
  const [dashFechaFin, setDashFechaFin] = useState('');
  const [modalNotasAbierto, setModalNotasAbierto] = useState(false);
  const [huespedNotas, setHuespedNotas] = useState(null);
  const [textoNota, setTextoNota] = useState('');

  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('modoOscuro') === 'true';
  });

  // ----------------------------------------------------------------------------------------------

  // Función para obtener huéspedes desde el backend    
  const obtenerHuespedes = (textoBusqueda = '') => {

    const url = textoBusqueda 
      ? `https://myhotel-rvdu.onrender.com/api/huespedes?q=${textoBusqueda}` 
      : 'https://myhotel-rvdu.onrender.com/api/huespedes';
    
    fetch(url)
      .then(res => res.json())
      .then(data => setHuespedes(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {

    if (vistaActual === 'huespedes') {

      obtenerHuespedes(busqueda);

    }

  }, [vistaActual, busqueda]);

  // Función para obtener habitaciones desde el backend
  const obtenerHabitaciones = () => {

    fetch('https://myhotel-rvdu.onrender.com/api/habitaciones')
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {

          data.sort((a, b) => (parseInt(a.numero) || 0) - (parseInt(b.numero) || 0));
          setHabitaciones(data);

        }

        setCargando(false);

      })

      .catch(err => console.error(err));

  };

  // Cargar habitaciones al iniciar la app
  useEffect(() => {

    obtenerHabitaciones();

  }, []);

  // Función para manejar los cambios en los inputs del formulario
  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

  };

  // Función para enviar el formulario al Backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página recargue
    
    try {

      const response = await fetch('https://myhotel-rvdu.onrender.com/api/habitaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)

      });

      if (response.ok) {

        // Si todo sale bien, cerramos el modal, limpiamos el formulario y recargamos los datos
        setModalAbierto(false);
        setFormulario({ numero: '', tipo: 'Single', precioBase: '', estado: 'Disponible' });
        obtenerHabitaciones(); // ¡Recarga automática!

      } else {

        console.error('Error al guardar la habitación');

      }
    } catch (error) {

      console.error('Error de red:', error);

    }
  };

  // Función para cambiar estado de una habitacion
  const handleCambiarEstado = async (id, nuevoEstado) => {

    try {

      const repsonse = await fetch(`https://myhotel-rvdu.onrender.com/api/habitaciones/${id}`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })

      });

      if (repsonse.ok) {

        obtenerHabitaciones(); //Refrescar la lista para ver el nuevo color

      }

    } catch (error) {

      console.error('Error al actualizar el estado:', error);

    }
  };

  // Función para abrir el modal de Check-in
  const abrirCheckIn = (id) => {

    setHabitacionCheckIn(id);
    setModalCheckInAbierto(true);

  };

  // Función para enviar el Check-in
    const handleSubmitCheckIn = async (e) => {

    e.preventDefault();
    setCargandoAccion(true);

    try {

      const response = await fetch('https://myhotel-rvdu.onrender.com/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formularioHuesped, habitacionId: habitacionCheckIn })

      });

      if (response.ok) {

        setModalCheckInAbierto(false);
        setFormularioHuesped({ tipoDocumento: 'Cédula', numeroDocumento: '', nombre: '', apellido: '', email: '', telefono: '', fechaCheckOut: '', descuento: '' });
        obtenerHabitaciones();
        mostrarToast('Check-in relaizado con éxito', 'exito');

      } else {

        const errorData = await response.json();
        mostrarToast('Error al hacer Check-in: ' + (errorData.detalle || errorData.error), 'error');

      }

    } catch (error) {

      console.error('Error de red:', error);
      alert('Error de conexión con el servidor.');

    } finally {

      setCargandoAccion(false);

    }

  };

  // Enviar Reserva Futura
  const handleSubmitReserva = async (e) => {

    e.preventDefault();
    setCargandoAccion(true);

    try {

      const response = await fetch('https://myhotel-rvdu.onrender.com/api/reservas', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioReserva)

      });

      if (response.ok) {

        mostrarToast('Reserva agendada con éxito', 'exito');
        setModalReservaAbierto(false);
        setFormularioReserva({ habitacionId: '', fechaCheckIn: '', fechaCheckOut: '', tipoDocumento: 'Cédula', numeroDocumento: '', nombre: '', apellido: '', email: '', telefono: '', descuento: '', estaodo: 'Pendiente' });
        obtenerTodasReservas();

      } else {

        const errorData = await response.json();
        mostrarToast('Error: ' + (errorData.detalle || errorData.error), 'error');

      }

    } catch (error) {

      mostrarToast('Error de conexión', 'error');

    } finally {

      setCargandoAccion(false);

    }
    
  };

  // Enviar Egreso a la BD
  const handleSubmitEgreso = async (e) => {

    e.preventDefault();
    setCargandoAccion(true);

    try {

      const response = await fetch('https://myhotel-rvdu.onrender.com/api/gastos', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioEgreso)

      });

      if (response.ok) {

        mostrarToast('Egreso registrado con éxito', 'exito');
        setModalEgresoAbierto(false);
        setFormularioEgreso({ concepto: '', monto: '', categoria: 'Servicios', estado: 'Pagado' });
        obtenerGastosPendientes(); // Actualizamos las alertas

      } else {

        const errorData = await response.json();
        mostrarToast('Error: ' + errorData.error, 'error');

      }

    } catch (error) {

      mostrarToast('Error de conexión', 'error');

    } finally {

      setCargandoAccion(false);

    }

  };

  // Marcar gasto como pagado
  const handlePagarGasto = async (id) => {

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/gastos/${id}/pagar`, { method: 'PUT' });

      if (response.ok) {

        mostrarToast('Gasto marcado como pagado', 'exito');
        obtenerGastosPendientes(); // Actualizamos la lista de alertas (desaparece de la pantalla)

      } else {

        mostrarToast('Error al actualizar el gasto', 'error');

      }

    } catch (error) {

      console.error('Error al pagar gasto:', error);

    }

  };

  // Función autocompletar huésped
  const buscarHuespedExistente = async (documento, setFormulario) => {

    if (documento.length < 5) return;

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/huespedes/documento/${documento}`);

      if (response.ok) {

        const huesped = await response.json();
        
        setFormulario(prev => ({

          ...prev,
          tipoDocumento: huesped.tipoDocumento,
          numeroDocumento: huesped.numeroDocumento,
          nombre: huesped.nombre,
          apellido: huesped.apellido,
          email: huesped.email,
          telefono: huesped.telefono || ''

        }));

      } else {
        
        setFormulario(prev => ({
          
          ...prev,
          nombre: '',
          apellido: '',
          email: '',
          telefono: ''

        }));

      }

    } catch (error) {

      console.error('Error al autocompletar:', error);

    }

  };

  // Simulación de Check-in en tiempo real
  useEffect(() => {
    if (habitacionCheckIn && formularioHuesped.fechaCheckOut) {

      const hab = habitaciones.find(h => h.id === habitacionCheckIn);

      if (hab) {
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Igualamos a medianoche
        
        const [y, m, d] = formularioHuesped.fechaCheckOut.split('-').map(Number);
        const salida = new Date(y, m - 1, d, 0, 0, 0); // Medianoche
        
        let diffTime = salida - hoy;
        let noches = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (noches <= 0) noches = 1; // Mínimo 1 noche
        
        let total = noches * hab.precioBase;
        if (formularioHuesped.descuento && !isNaN(parseFloat(formularioHuesped.descuento))) {

          total -= parseFloat(formularioHuesped.descuento);

        }
        if (total < 0) total = 0;
        
        setSimulacionCheckIn({ noches, total });

      }

    }

  }, [habitacionCheckIn, formularioHuesped.fechaCheckOut, formularioHuesped.descuento, habitaciones]);

  // Simulación de Reserva en tiempo real
  useEffect(() => {

    if (formularioReserva.habitacionId && formularioReserva.fechaCheckIn && formularioReserva.fechaCheckOut) {

      const hab = habitaciones.find(h => h.id === parseInt(formularioReserva.habitacionId));

      if (hab) {

        const [y1, m1, d1] = formularioReserva.fechaCheckIn.split('-').map(Number);
        const [y2, m2, d2] = formularioReserva.fechaCheckOut.split('-').map(Number);
        const entrada = new Date(y1, m1 - 1, d1, 0, 0, 0);
        const salida = new Date(y2, m2 - 1, d2, 0, 0, 0);
        
        let diffTime = salida - entrada;
        let noches = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (noches <= 0) noches = 1;
        
        let total = noches * hab.precioBase;
        if (formularioReserva.descuento && !isNaN(parseFloat(formularioReserva.descuento))) {

          total -= parseFloat(formularioReserva.descuento);

        }

        if (total < 0) total = 0;
        setSimulacionReserva({ noches, total });
      }

    }

  }, [formularioReserva.habitacionId, formularioReserva.fechaCheckIn, formularioReserva.fechaCheckOut, formularioReserva.descuento, habitaciones]);

  // Obtener llegadas de hoy
  const obtenerLlegadasHoy = () => {

    fetch('https://myhotel-rvdu.onrender.com/api/reservas/hoy')
      .then(res => res.json())
      .then(data => setLlegadasHoy(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  };

  // Obtener salidas de hoy
  const obtenerSalidasHoy = () => {

    fetch('https://myhotel-rvdu.onrender.com/api/reservas/salidas-hoy')
      .then(res => res.json())
      .then(data => setSalidasHoy(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  };

  // Guardar nota del huésped
  const handleGuardarNota = async () => {

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/huespedes/${huespedNotas.id}/notas`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: textoNota })

      });

      if (response.ok) {

        mostrarToast('Nota guardada con éxito', 'exito');
        setModalNotasAbierto(false);
        obtenerHuespedes(busqueda); // Actualizamos la lista

      }

    } catch (error) {

      mostrarToast('Error al guardar la nota', 'error');

    }

  };

  // Función para hacer Check-out y Facturar
    const handleCheckOut = async (id) => {

    setCargandoCheckOutId(id);

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/checkout/${id}`, { method: 'PUT' });
      const data = await response.json(); 
      
      if (response.ok) {

        if (data.factura) {

          setDatosFactura(data.factura);
          setFacturaVisible(true);
          obtenerHabitaciones();
          obtenerTodasReservas();
          obtenerLlegadasHoy();
          obtenerSalidasHoy();
          mostrarToast('Factura generada con éxito', 'exito');

        }

      } else {

        mostrarToast("Error: " + (data.detalle || data.error), 'error');
        
      }

    } catch (error) {

      console.error('Error en check-out:', error);

    } finally {

      setCargandoCheckOutId(null);

    }

  };


  // Actualizar llegadas de hoy cada vez que se entra a la vista de inicio
  useEffect(() => {

    if (vistaActual === 'inicio') {

      obtenerLlegadasHoy();
      obtenerSalidasHoy();
      fetch('https://myhotel-rvdu.onrender.com/api/configuracion')
        .then(res => res.json())
        .then(data => setConfigHotel(data))
        .catch(err => console.error(err));

    }

  }, [vistaActual]);

  // Obtener todas las reservas
  const obtenerTodasReservas = () => {

    fetch('https://myhotel-rvdu.onrender.com/api/reservas')
      .then(res => res.json())
      .then(data => setTodasReservas(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

  };

  // Actualizar todas las reservas cada vez que se entra a la vista de reservas
  useEffect(() => {

    if (vistaActual === 'reservas') {

      obtenerTodasReservas();

    }

  }, [vistaActual]);

  // Check-in Mágico desde Reserva
  const handleMagicCheckin = async (id) => {

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/reservas/${id}/checkin`, { method: 'PUT' });
      const data = await response.json();
      
      if (response.ok) {

        mostrarToast('Check-in realizado con éxito', 'exito');
        obtenerTodasReservas(); // Actualizamos la lista de reservas
        obtenerHabitaciones(); // Actualizamos el estado de las habitaciones
        obtenerLlegadasHoy(); // Actualizamos la lista de llegadas de hoy
        obtenerSalidasHoy(); // Actualizamos la lista de salidas de hoy

      } else {

        mostrarToast('Error: ' + data.error, 'error');

      }

    } catch (error) {

      mostrarToast('Error de conexión', 'error');

    }
  };

    // Confirmar reserva rápida
  const handleConfirmarReserva = async (id) => {

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/reservas/${id}/estado`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Confirmada' })

      });

      if (response.ok) {

        mostrarToast('Reserva confirmada con éxito', 'exito');
        obtenerTodasReservas();

      }

    } catch (error) {

      mostrarToast('Error al confirmar', 'error');

    }

  };

  // Helper: Saber si una fecha es hoy
  const esHoy = (fechaISO) => {

    if (!fechaISO) return false;
    const date = new Date(fechaISO);
    const today = new Date();

    // Comparamos usando los componentes de la fecha local
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
           
  };

  // Helper: Formatear período
  const formatearPeriodo = (periodo) => {

    if (!periodo) return 'Mes Actual';
    const [anio, mes] = periodo.split('-');
    const fecha = new Date(anio, mes - 1, 1);
    return fecha.toLocaleString('es-CO', { month: 'long', year: 'numeric' });

  };

  // Formatear fecha y hora
  const formatearFechaHora = (fechaISO) => {

    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-CO', {

      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true

    });
    
  };

  // Formatear fecha con hora
  const formatearFechaReserva = (fechaISO, estado) => {

    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);

    if (estado === 'En Casa' || estado === 'Finalizada') {

      return fecha.toLocaleString('es-CO', { 

        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true

       });

    }

    return fecha.toLocaleDateString('es-CO', { 
      
      day: '2-digit', month: '2-digit', year: 'numeric' 
    
    });
    
  };

  // Lógica de filtrado y paginación
  const reservasPorPagina = 10;

  const reservasFiltradas = todasReservas.filter(r => {

    // 1. Filtro de texto (Nombre, doc, hab)
    const matchBusqueda = busquedaReserva === '' || 
      r.huesped.nombre.toLowerCase().includes(busquedaReserva.toLowerCase()) ||
      r.huesped.apellido.toLowerCase().includes(busquedaReserva.toLowerCase()) ||
      r.huesped.numeroDocumento.includes(busquedaReserva) ||
      r.habitacion.numero.includes(busquedaReserva);

    // 2. Filtro de fechas
    let matchFecha = true;
    if (filtroFechaInicio && filtroFechaFin) {

      const checkInReserva = new Date(r.fechaCheckIn);
      const inicio = new Date(filtroFechaInicio);
      const fin = new Date(filtroFechaFin);
      fin.setHours(23, 59, 59, 999); // Incluimos todo el día final
      
      // Si el check-in de la reserva está dentro del rango seleccionado
      matchFecha = checkInReserva >= inicio && checkInReserva <= fin;
      
    }

    const matchEstado = filtroEstadoReserva === 'Todas' || r.estado === filtroEstadoReserva;

    return matchBusqueda && matchFecha && matchEstado;

  });

  // Confirmar Cancelación Segura
  const handleConfirmarCancelacion = async (e) => {

    e.preventDefault();
    setCargandoAccion(true);

    try {

      const response = await fetch(`https://myhotel-rvdu.onrender.com/api/reservas/${reservaACancelar.id}/cancelar`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          email: usuarioLogueado.email,
          password: datosCancelacion.password,
          motivo: datosCancelacion.motivo

        })

      });

      const data = await response.json();

      if (response.ok) {

        mostrarToast('Reserva cancelada con éxito', 'exito');
        setModalCancelarAbierto(false);
        setDatosCancelacion({ password: '', motivo: '' });
        obtenerTodasReservas(); // Actualizamos la lista

      } else {

        mostrarToast('Error: ' + data.error, 'error');

      }

    } catch (error) {

      mostrarToast('Error de conexión', 'error');

    } finally {

      setCargandoAccion(false);

    }

  };

  const totalPaginas = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const reservasPaginadas = reservasFiltradas.slice((paginaActual - 1) * reservasPorPagina, paginaActual * reservasPorPagina);
  
  // Función segura para asignar colores
  const obtenerClaseEstado = (estado) => {

    if (!estado) return ''; // Si el estado no viene, no rompas la app
    switch (estado.toLowerCase()) {

      case 'disponible': return 'disponible';
      case 'ocupada': return 'ocupada';
      case 'limpieza': return 'limpieza';
      case 'mantenimiento': return 'mantenimiento';
      default: return '';

    }
  };

  // Función segura para traducir tipo
  const traducirTipo = (tipo) => {

    if (!tipo) return 'Habitación';
    switch (tipo.toLowerCase()) {

      case 'single': return 'Individual';
      case 'double': return 'Doble';
      case 'suite': return 'Suite Deluxe';
      default: return tipo;

    }

  }


  // Semáforo de ocupación
  const claseOcupacion = (porcentaje) => {

    if (porcentaje > 80) return 'semaforo verde';
    if (porcentaje >= 60) return 'semaforo amarillo';
    return 'semaforo rojo';

  };

  // Función Formatear Número de Teléfono en Timepo Real
  const formatearTelefono = (valor) => {

    let soloNumeros = valor.replace(/\D/g, '');

    if (soloNumeros.startsWith('57')) {

      soloNumeros = soloNumeros.substring(0, 12);

    } else {

      soloNumeros = soloNumeros.substring(0, 10);

    }

    let formateado = '';

    if (soloNumeros.length > 0) {

      if (soloNumeros.startsWith('57')){

        formateado = '+57 ';
        let resto = soloNumeros.substring(2);
        if (resto.length > 0) formateado += resto.substring(0, 3);
        if (resto.length > 3) formateado += ' ' + resto.substring(3, 6);
        if (resto.length > 6) formateado += ' ' + resto.substring(6, 8);
        if (resto.length > 8) formateado += ' ' + resto.substring(8, 10);

      } else {

        formateado = soloNumeros.substring(0, 3);
        if (soloNumeros.length > 3) formateado += ' ' + soloNumeros.substring(3, 6);
        if (soloNumeros.length > 6) formateado += ' ' + soloNumeros.substring(6, 8);
        if (soloNumeros.length > 8) formateado += ' ' + soloNumeros.substring(8, 10);

      }     

    } 
    
    return formateado;

  };

  // Cargar usuario desde memoria al recargar la página
  useEffect(() => {

    const guardado = localStorage.getItem('usuarioHotel');

    if (guardado) {

      setUsuarioLogueado(JSON.parse(guardado));

    }

  }, []);

  // Función Enviar credenciales al backend
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch('https://myhotel-rvdu.onrender.com/api/auth/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)

      });

      if (response.ok) {

        const data = await response.json();
        setUsuarioLogueado(data.usuario);
        localStorage.setItem('usuarioHotel', JSON.stringify(data.usuario));
        localStorage.setItem('tokenHotel', data.token);
        mostrarToast('¡Bienvenido!', 'exito');

      } else {

        const err = await response.json();
        mostrarToast('Error: ' + err.error, 'error');

      }
    } catch (error) {

      alert('Error de conexión');

    }
  };

  // Función Cerrar sesión
  const handleLogout = () => {

    setUsuarioLogueado(null);
    localStorage.removeItem('usuarioHotel');
    localStorage.removeItem('tokenHotel');
    setVistaActual('inicio');

  };

  // Guardar pestaña actual en memoria
  useEffect(() => {

    localStorage.setItem('vistaActual', vistaActual);

  }, [vistaActual]);

  // Obtener datos del dashboard cuando se entra a la vista
    useEffect(() => {

    if (vistaActual === 'dashboard' && usuarioLogueado?.rol === 'Gerente') {

      setActualizandoDash(true);
      let url = 'https://myhotel-rvdu.onrender.com/api/dashboard';
      if (dashFechaInicio && dashFechaFin) {

        url += `?inicio=${dashFechaInicio}&fin=${dashFechaFin}`;

      }
        
      fetch(url)
        .then(res => { if (!res.ok) throw new Error('Error'); return res.json(); })
        .then(data => { if (data && data.kpis) setDashboardData(data); })
        .catch(err => console.error(err))
        .finally(() => setActualizandoDash(false));

    }

  }, [vistaActual, usuarioLogueado, dashFechaInicio, dashFechaFin]);

  // Obtener gastos pendientes (Solo Gerente)
  const obtenerGastosPendientes = () => {

    if (usuarioLogueado?.rol === 'Gerente') {

      fetch('https://myhotel-rvdu.onrender.com/api/gastos/pendientes')
        .then(res => res.json())
        .then(data => setGastosPendientes(data))
        .catch(err => console.error(err));

    }

  };

  // Actualizar gastos pendientes cada vez que cambia el usuario logueado
  useEffect(() => {

    obtenerGastosPendientes();

  }, [usuarioLogueado]);

  // Función para mostrar notificaciones
  const mostrarToast = (mensaje, tipo = 'exito') => {

    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 5000); // Se oculta en 5 segundos

  };

  // Cierre de sesión por inactividad (15 minutos)
  useEffect(() => {

    if (!usuarioLogueado) return;

    let timer;
    const resetTimer = () => {

      clearTimeout(timer);
      timer = setTimeout(() => {

        handleLogout();
        mostrarToast('Sesión cerrada por inactividad', 'error');

      }, 15 * 60 * 1000); // 15 minutos

    };

    // Eventos que reinician el contador
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer(); // Iniciamos el contador

    // Limpiamos al desmontar
    return () => {

      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);

    };

  }, [usuarioLogueado]);

  const totalDisponibles = habitaciones.filter(h => h.estado === 'Disponible').length;
  const totalOcupadas = habitaciones.filter(h => h.estado === 'Ocupada').length;
  const totalLimpieza = habitaciones.filter(h => h.estado === 'Limpieza').length;
  const totalMantenimiento = habitaciones.filter(h => h.estado === 'Mantenimiento').length;

  const habitacionesFiltradas = filtroActual === 'Todas' 
    ? habitaciones 
    : habitaciones.filter(h => h.estado === filtroActual);

  const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Aplicar Modo Oscuro
  useEffect(() => {

    if (modoOscuro) {

      document.body.classList.add('dark-mode');
      localStorage.setItem('modoOscuro', 'true');

    } else {

      document.body.classList.remove('dark-mode');
      localStorage.setItem('modoOscuro', 'false');

    }

  }, [modoOscuro]);


  // Si no hay usuario logueado, mostramos el Login
  if (!usuarioLogueado) {
      return (
        <div className="login-container">
          <form className="login-box" onSubmit={handleLogin}>
            <h1>🏨 HotelCRM</h1>
            <p className="login-subtitle">Sistema de Gestión Hotelera</p>
            
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                required 
                value={loginData.email} 
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                required 
                value={loginData.password} 
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="btn-primario btn-full">Ingresar</button>
            
            <div className="login-hint">
              <p><strong>Gerente:</strong> gerente@hotel.com / gerente123</p>
              <p><strong>Recepción:</strong> recepcion@hotel.com / recep123</p>
            </div>
          </form>

          {/* Notificación Toast */}
          {toast && (
            <div className={`toast-notification ${toast.tipo}`}>
              <span className="toast-icon">
                {toast.tipo === 'exito' ? '✅' : '❌'}
              </span>
              <span className="toast-message">{toast.mensaje}</span>
            </div>
          )}
        </div>
      );
    }


  // Si sí está logueado, mostramos el sistema normal
  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarColapsado ? 'colapsado' : ''}`}>
        <button className="btn-collapse" onClick={() => setSidebarColapsado(!sidebarColapsado)}>
          {sidebarColapsado ? '➡️' : '⬅️'}
        </button>

        {!sidebarColapsado && (
          <div className="logo">
            <h2>🏨 MyHotel</h2>
          </div>
        )}

        <nav className="nav-menu">
          <button className={`nav-item ${vistaActual === 'inicio' ? 'active' : ''}`} onClick={() => setVistaActual('inicio')}>
            🏠 {!sidebarColapsado && 'Inicio'}
          </button>
          <button className={`nav-item ${vistaActual === 'habitaciones' ? 'active' : ''}`} onClick={() => setVistaActual('habitaciones')}>
            🚪 {!sidebarColapsado && 'Habitaciones'}
          </button>
          <button className={`nav-item ${vistaActual === 'huespedes' ? 'active' : ''}`} onClick={() => setVistaActual('huespedes')}>
            👥 {!sidebarColapsado && 'Huéspedes'}
          </button>
          <button className={`nav-item ${vistaActual === 'reservas' ? 'active' : ''}`} onClick={() => setVistaActual('reservas')}>
            📅 {!sidebarColapsado && 'Reservas'}
          </button>
          {/* SOLO GERENTE VE ESTO */}
          {usuarioLogueado.rol === 'Gerente' && (
            <button className={`nav-item ${vistaActual === 'dashboard' ? 'active' : ''}`} onClick={() => setVistaActual('dashboard')}>
              📊 {!sidebarColapsado && 'Dashboard'}
            </button>
          )}
          <button className={`nav-item ${vistaActual === 'configuracion' ? 'active' : ''}`} onClick={() => setVistaActual('configuracion')}>
            ⚙️ {!sidebarColapsado && 'Configuración'}
          </button>
        </nav>
                
        {!sidebarColapsado ? (
          <div className="sidebar-footer">
            <p className="user-role">👤 {usuarioLogueado.nombre}</p>
            <p className="user-role-tag">{usuarioLogueado.rol}</p>
            <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        ) : (
          <div className="sidebar-footer">
            <button className="btn-logout" onClick={handleLogout}>❌</button>
          </div>
        )}
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        {vistaActual === 'inicio' ? (
          <>
            <header className="top-bar">
              <div>
                <h1>Centro de Mando</h1>
                <p className="fecha">{fechaHoy} | 🕐 Entradas: {configHotel.horaCheckIn} | 🕛 Salidas: {configHotel.horaCheckOut}</p>
              </div>
            </header>

            {/* Resumen Rápido del Día */}
            <div className="metrics-bar">
              <div className="metric-card disponible">
                <span className="metric-number">{totalDisponibles}</span>
                <span className="metric-label">Listas para Vender</span>
              </div>
              <div className="metric-card ocupada">
                <span className="metric-number">{totalOcupadas}</span>
                <span className="metric-label">Ocupadas</span>
              </div>
              <div className="metric-card limpieza">
                <span className="metric-number">{totalLimpieza}</span>
                <span className="metric-label">Pendientes de Limpieza</span>
              </div>
            </div>

            {/* Accesos Rápidos y Alertas */}
            <div className="dashboard-grid">
              {/* Llegadas de Hoy */}
              <div className="alerts-card">
                <h3>🛬 Llegadas Programadas para Hoy</h3>
                <p className="alert-subtitle">Huéspedes con reserva para la fecha actual</p>
                <div className="alerts-list">
                  {llegadasHoy.length > 0 ? (
                    llegadasHoy.map(reserva => (
                      <div key={reserva.id} className="alert-item limpieza">
                        <div className="deuda-info">
                          <span>{reserva.huesped.nombre} {reserva.huesped.apellido}</span>
                          <span className="alert-status">Hab {reserva.habitacion.numero}</span>
                        </div>
                        <button className="btn-magic-checkin" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => { handleMagicCheckin(reserva.id); obtenerSalidasHoy(); }}>
                          🛎️ Check-in
                        </button>
                        <span className="alert-status">{reserva.estado}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-alerts">No hay llegadas programadas para hoy.</p>
                  )}
                </div>
              </div>
              {/* Salidas de Hoy */}
              <div className="alerts-card">
                <h3>🛫 Salidas Programadas para Hoy</h3>
                <p className="alert-subtitle">Huéspedes que deben dejar la habitación hoy</p>
                <div className="alerts-list">
                  {salidasHoy.length > 0 ? (
                    salidasHoy.map(reserva => (
                      <div key={reserva.id} className="alert-item mantenimiento">
                        <div className="deuda-info">
                          <span>{reserva.huesped.nombre} {reserva.huesped.apellido}</span>
                          <span className="alert-status">Hab {reserva.habitacion.numero}</span>
                        </div>
                        <button className="btn-salida-rapida" onClick={() => handleCheckOut(reserva.habitacionId)}>
                          💳 Check-out
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-alerts">No hay salidas programadas para hoy.</p>
                  )}
                </div>
              </div>
              <div className="alerts-card">
                <h3>Acciones Rápidas</h3>
                <div className="quick-actions-buttons">
                  <button className="quick-btn primary" onClick={() => setVistaActual('habitaciones')}>
                    🛎️ Ir a Check-in
                  </button>
                  <button className="quick-btn secondary" onClick={() => setVistaActual('huespedes')}>
                    🔍 Buscar Huésped
                  </button>
                  <button className="quick-btn secondary" onClick={() => setVistaActual('reservas')}>
                    📅 Nueva Reserva
                  </button>
                </div>
              </div>

              <div className="alerts-card">
                <h3>🚨 Alertas Operativas</h3>
                <p className="alert-subtitle">Habitaciones que requieren atención inmediata</p>
                <div className="alerts-list">
                  {habitaciones.filter(h => h.estado === 'Limpieza' || h.estado === 'Mantenimiento').length > 0 ? (
                    habitaciones.filter(h => h.estado === 'Limpieza' || h.estado === 'Mantenimiento').map(hab => (
                      <div key={hab.id} className={`alert-item ${hab.estado.toLowerCase()}`}>
                        <span>Habitación {hab.numero}</span>
                        <span className="alert-status">{hab.estado}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-alerts">✅ Todo en orden. No hay alertas.</p>
                  )}
                </div>
              </div>
            </div>

              {/* Módulo Exclusivo para Gerente */}
              {usuarioLogueado.rol === 'Gerente' && (
                <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
                  <div className="alerts-card">
                    <h3>💰 Gestión Financiera</h3>
                    <div className="quick-actions-buttons">
                      <button className="quick-btn primary" onClick={() => setModalEgresoAbierto(true)}>
                        ➕ Registrar Egreso
                      </button>
                    </div>
                  </div>

                  <div className="alerts-card">
                    <h3>⚠️ Pagos Pendientes</h3>
                    <p className="alert-subtitle">Gastos registrados que aún no se han pagado</p>
                    <div className="alerts-list">
                      {gastosPendientes.length > 0 ? (
                        gastosPendientes.map(gasto => (
                          <div key={gasto.id} className="alert-item deuda">
                            <div className="deuda-info">
                              <span>{gasto.concepto}</span>
                              <span className="alert-status">${gasto.monto.toLocaleString('es-CO')}</span>
                            </div>
                            <button className="btn-pagar-gasto" onClick={() => handlePagarGasto(gasto.id)}>✅ Pagar</button>
                          </div>
                        ))
                      ) : (
                        <p className="no-alerts">✅ No tienes deudas pendientes. Todo al día.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </>
        ) : vistaActual === 'habitaciones' ? (
          <>
            <header className="top-bar">
              <div>
                <h1>Vista de Habitaciones</h1>
                <p className="fecha">{fechaHoy}</p>
              </div>
              <div className="actions-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className='btn-primario' onClick={() => setModalAbierto(true)}>+ Nueva Habitación</button>                               
              </div>
            </header>

            <div className="metrics-bar">
              <div className="metric-card disponible">
                <span className="metric-number">{totalDisponibles}</span>
                <span className="metric-label">Disponibles</span>
              </div>
              <div className="metric-card ocupada">
                <span className="metric-number">{totalOcupadas}</span>
                <span className="metric-label">Ocupadas</span>
              </div>
              <div className="metric-card limpieza">
                <span className="metric-number">{totalLimpieza}</span>
                <span className="metric-label">Limpieza</span>
              </div>
              <div className="metric-card mantenimiento">
                <span className="metric-number">{totalMantenimiento}</span>
                <span className="metric-label">Mantenimiento</span>
              </div>
            </div>

            <div className="filters-bar">
              {['Todas', 'Disponible', 'Ocupada', 'Limpieza', 'Mantenimiento'].map(estado => (
                <button 
                  key={estado}
                  className={`btn-filter ${filtroActual === estado ? 'active' : ''}`}
                  onClick={() => setFiltroActual(estado)}
                >
                  {estado}
                </button>
              ))}
            </div>

            {cargando ? (
              <p className="cargando">Cargando estado del hotel...</p>
            ) : habitaciones.length === 0 ? (
              <p className="cargando">No hay habitaciones registradas en el sistema.</p>
            ) : (
              <div className="grid-habitaciones">
                {habitacionesFiltradas.map(hab => (
                  <div key={hab.id} className={`card card-status-${hab.estado.toLowerCase()}`}>
                    <div className="card-header">
                      <h2 className="room-number">{hab.numero}</h2>
                      <select className={`badge-select ${obtenerClaseEstado(hab.estado)}`} value={hab.estado} onChange={(e) => handleCambiarEstado(hab.id, e.target.value)}>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupada">Ocupada</option>
                        <option value="Limpieza">Limpieza</option>
                        <option value="Mantenimiento">Mant.</option>
                      </select>
                    </div>
                    <div className="card-body">
                      <p className="room-type">{traducirTipo(hab.tipo)}</p>
                      <p className="precio">${hab.precioBase.toLocaleString('es-CO')} <span>/ noche</span></p>
                      
                      <div className="card-actions">
                        {hab.estado === 'Disponible' && (
                          <button className="btn-checkin" onClick={() => abrirCheckIn(hab.id)}>Registrar Entrada</button>
                        )}
                        {hab.estado === 'Ocupada' && (
                          <button className="btn-checkout" onClick={() => handleCheckOut(hab.id)} disabled={cargandoCheckOutId === hab.id}>
                            {cargandoCheckOutId === hab.id ? '⏳ Generando...' : 'Registrar Salida'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : vistaActual === 'huespedes' ? (
          <>
            <header className="top-bar">
              <div>
                <h1>Directorio de Huéspedes</h1>
                <p className="fecha">Busca y revisa el historial de tus clientes</p>
              </div>
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por nombre, documento o email..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button className="btn-clear-search" onClick={() => setBusqueda('')}>
                    ✖
                  </button>
                )}
              </div>
            </header>

            <div className="guest-list">
              {huespedes.length === 0 ? (
                <p className="cargando">No se encontraron huéspedes...</p>
              ) : (
                huespedes.map(huesped => (
                  <div key={huesped.id} className="guest-card" onClick={() => setHuespedSeleccionado(huesped)}>
                    <div className="guest-avatar">
                      {huesped.nombre.charAt(0)}{huesped.apellido.charAt(0)}
                    </div>
                    <div className="guest-info">
                      <h3>{huesped.nombre} {huesped.apellido}</h3>
                      <p>{huesped.tipoDocumento}: {huesped.numeroDocumento}</p>
                      <p>✉️ {huesped.email}</p>
                    </div>
                    <div className="guest-stats">
                      <span className="stat-badge">{huesped.reservas.length} Reservas</span>
                      <button className="btn-icon" onClick={(e) => { 
                        e.stopPropagation();
                        setHuespedNotas(huesped); 
                        setTextoNota(huesped.notas || ''); 
                        setModalNotasAbierto(true); }}
                      >
                        📝
                      </button>
                    </div>
                  </div>                  
                ))
              )}
            </div>
          </>
        ) : vistaActual === 'dashboard' ? (
          <>
            <header className="top-bar">
              <div>
                <h1>📊 Dashboard Gerencial</h1>
                <p className="fecha">
                  Mostrando: {
                    dashFechaInicio && dashFechaFin 
                      ? `Del ${new Date(dashFechaInicio + 'T12:00:00').toLocaleDateString('es-CO')} al ${new Date(dashFechaFin + 'T12:00:00').toLocaleDateString('es-CO')}` 
                      : 'Mes Actual'
                  }
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="date" className="date-filter" value={dashFechaInicio} onChange={(e) => setDashFechaInicio(e.target.value)} />
                <span style={{ color: '#64748b' }}>hasta</span>
                <input type="date" className="date-filter" value={dashFechaFin} onChange={(e) => setDashFechaFin(e.target.value)} />
                {(dashFechaInicio || dashFechaFin) && (
                  <button className="btn-limpiar" onClick={() => { setDashFechaInicio(''); setDashFechaFin(''); }}>
                    Ver Mes Actual
                  </button>
                )}
              </div>
            </header>

              {!dashboardData || !dashboardData.kpis ? (
                <p className="cargando">Calculando métricas...</p>
              ) : (
                <>
                  {/* MÓDULO FINANCIERO */}
                  <h3 className="section-title">💰 Resumen Financiero</h3>
                  <div className="metrics-bar">
                    <div className="metric-card disponible">
                      <span className="metric-number">${dashboardData.kpis.totalIngresos.toLocaleString('es-CO')}</span>
                      <span className="metric-label">Ingresos del Mes</span>
                    </div>
                    <div className="metric-card ocupada">
                      <span className="metric-number">${dashboardData.kpis.totalEgresos.toLocaleString('es-CO')}</span>
                      <span className="metric-label">Egresos del Mes</span>
                    </div>
                    <div className="metric-card utilidad">
                      <span className="metric-number">${dashboardData.kpis.utilidadEstimada.toLocaleString('es-CO')}</span>
                      <span className="metric-label">Utilidad Estimada</span>
                    </div>
                  </div>

                  {/* MÓDULO OPERATIVO Y KPIs */}
                  <h3 className="section-title">📈 Indicadores Operativos</h3>
                  <div className="metrics-bar">
                    <div className={`metric-card ${claseOcupacion(dashboardData.kpis.porcentajeOcupacion)}`}>
                      <span className="metric-number">{dashboardData.kpis.porcentajeOcupacion}%</span>
                      <span className="metric-label">Ocupación Actual</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-number">{dashboardData.kpis.habitacionesOcupadas}</span>
                      <span className="metric-label">Hab. Ocupadas</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-number">{dashboardData.kpis.habitacionesDisponibles}</span>
                      <span className="metric-label">Hab. Disponibles</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-number">${dashboardData.kpis.adr.toLocaleString('es-CO')}</span>
                      <span className="metric-label">ADR (Tarifa Prom.)</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-number">${dashboardData.kpis.revPAR.toLocaleString('es-CO')}</span>
                      <span className="metric-label">RevPAR</span>
                    </div>
                  </div>

                  {/* MÓDULO HUÉSPEDES VIP */}
                  <h3 className="section-title">⭐ Top 5 Huéspedes VIP</h3>
                  <div className="vip-table-container">
                    <table className="vip-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Documento</th>
                          <th>Reservas Totales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.topHuespedes.map((h, index) => (
                          <tr key={h.documento}>
                            <td className="vip-name">
                              <span className="vip-medal">{index + 1}</span>
                              {h.nombre}
                            </td>
                            <td>{h.documento}</td>
                            <td><span className="vip-badge">{h.totalReservas}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
          </>
        ) : vistaActual === 'reservas' ? (
          <>
            {/* VISTA DE RESERVAS: BANDEJA DE ENTRADA */}
            <header className="top-bar">
              <div>
                <h1>📅 Reservas Agendadas</h1>
                <p className="fecha">
                  Mostrando: {
                    filtroFechaInicio && filtroFechaFin 
                      ? `Reservas del ${new Date(filtroFechaInicio).toLocaleDateString('es-CO')} al ${new Date(filtroFechaFin).toLocaleDateString('es-CO')}` 
                      : busquedaReserva 
                        ? `Resultados para "${busquedaReserva}"` 
                        : 'Todas las Reservas'
                  }
                </p>                
              </div>
              <button className="btn-primario" style={{ marginLeft: 'auto' }} onClick={() => setModalReservaAbierto(true)}>+ Nueva Reserva</button>
            </header>

            <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
              <div className="search-bar" style={{ width: '300px' }}>
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por nombre, doc, hab..." 
                  value={busquedaReserva}
                  onChange={(e) => { setBusquedaReserva(e.target.value); setPaginaActual(1); }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={filtroFechaInicio} 
                  onChange={(e) => { setFiltroFechaInicio(e.target.value); setPaginaActual(1); }}
                  className="date-filter"
                />
                <span style={{ color: '#64748b' }}>hasta</span>
                <input 
                  type="date" 
                  value={filtroFechaFin} 
                  onChange={(e) => { setFiltroFechaFin(e.target.value); setPaginaActual(1); }}
                  className="date-filter"
                />
              </div> 

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select value={filtroEstadoReserva} onChange={(e) => setFiltroEstadoReserva(e.target.value)} className="date-filter">
                  <option value="Todas">Todos los estados</option>
                  <option value="Pendiente">Pendientes</option>
                  <option value="Confirmada">Confirmadas</option>
                  <option value="En Casa">En Casa</option>
                  <option value="Finalizada">Finalizadas</option>
                  <option value="Cancelada">Canceladas</option>
                </select>
                
                {(filtroFechaInicio || filtroFechaFin || busquedaReserva || filtroEstadoReserva !== 'Todas') && (
                  <button className="btn-limpiar" onClick={() => { setFiltroFechaInicio(''); setFiltroFechaFin(''); setBusquedaReserva(''); setFiltroEstadoReserva('Todas'); }}>
                    ✖ Limpiar
                  </button>
                )}
              </div>             
            </div>

            <div className="reservations-list" style={{ marginTop: '1.5rem' }}>
              {reservasPaginadas.length === 0 ? (
                <p className="cargando">No se encontraron reservas...</p>
              ) : (
                reservasPaginadas.map(reserva => (
                  <div key={reserva.id} className="reservation-card">
                    {/* Columna 1: Huésped */}
                    <div className="res-info">
                      <div className="res-avatar">
                        {reserva.huesped.nombre.charAt(0)}{reserva.huesped.apellido.charAt(0)}
                      </div>
                      <div>
                        <h3>{reserva.huesped.nombre} {reserva.huesped.apellido}</h3>
                        <p>Doc: {reserva.huesped.numeroDocumento} | Hab: {reserva.habitacion.numero}</p>
                      </div>
                    </div>

                    {/* Columna 2: Fechas */}
                    <div className="res-dates">
                      <span>📅 {formatearFechaReserva(reserva.fechaCheckIn, reserva.estado)}</span>
                      <span>➡️ {formatearFechaReserva(reserva.fechaCheckOut, reserva.estado)}</span>
                    </div>

                    {/* Columna 3: Precio */}
                    <div className="res-price">
                      ${reserva.precioTotal.toLocaleString('es-CO')}
                    </div>

                    {/* Columna 4: Estado */}
                    <div className="res-status" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                      
                      {/* Si es Pendiente -> Botón de Confirmar */}
                      {reserva.estado === 'Pendiente' ? (
                        <button className="btn-limpiar" style={{ color: '#059669', borderColor: '#86efac' }} onClick={() => handleConfirmarReserva(reserva.id)}>
                          ✅ Confirmar
                        </button>
                      ) : esHoy(reserva.fechaCheckIn) && reserva.estado === 'Confirmada' ? (
                        /* Si es Hoy y Confirmada -> Botón Mágico */
                        <button className="btn-magic-checkin" onClick={() => handleMagicCheckin(reserva.id)}>
                          🛎️ Hacer Check-in
                        </button>
                      ) : (
                        /* Si no -> Muestra el estado normal */
                        <span className={`badge-select ${obtenerClaseEstado(reserva.estado === 'Confirmada' || reserva.estado === 'En Casa' ? 'Disponible' : 'Ocupada')}`} style={{ minWidth: 'auto' }}>
                          {reserva.estado}
                        </span>
                      )}

                      {/* Botón de Cancelar */}
                      {['Pendiente', 'Confirmada'].includes(reserva.estado) && (
                        <button className="btn-limpiar btn-cancelar-reserva" onClick={() => { setReservaACancelar(reserva); setModalCancelarAbierto(true); }}>
                          ✖
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Controles de Paginación */}
            {totalPaginas > 1 && (
              <div className="pagination-controls">
                <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>
                  ⬅️ Anterior
                </button>
                <span>Página {paginaActual} de {totalPaginas}</span>
                <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>
                  Siguiente ➡️
                </button>
              </div>
            )}
          </>
        ) : vistaActual === 'configuracion' ? (
          <>
            <header className="top-bar">
              <div>
                <h1>⚙️ Configuración del Sistema</h1>
                <p className="fecha">Personaliza tu experiencia</p>
              </div>
            </header>

            <div className="config-container">
              <div className="config-card">
                <h3>Apariencia</h3>
                <div className="config-item">
                  <div>
                    <p className="config-title">Modo Oscuro 🌙</p>
                    <p className="config-desc">Reduce la fatiga visual durante turnos nocturnos.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={modoOscuro} onChange={() => setModoOscuro(!modoOscuro)} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="config-card">
                <h3>Próximas Funciones</h3>
                <div className="config-item">
                  <div>
                    <p className="config-title">Gestión de Usuarios 👥</p>
                    <p className="config-desc">Crear, editar y eliminar recepcionistas y gerentes.</p>
                  </div>
                  <span className="badge-select mantenimiento" style={{ minWidth: 'auto' }}>Próximamente</span>
                </div>
                <div className="config-item">
                  <div>
                    <p className="config-title">Configuración de Impuestos 💰</p>
                    <p className="config-desc">Ajustar el porcentaje de IVA aplicado a las facturas.</p>
                  </div>
                  <span className="badge-select mantenimiento" style={{ minWidth: 'auto' }}>Próximamente</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
                
      </main>

      {/* El Modal (Ventana Emergente) */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Nueva Habitación</h2>
              <button className="btn-cerrar" onClick={() => setModalAbierto(false)}>✖</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Número de Habitación</label>
                <input type="text" name="numero" value={formulario.numero} onChange={handleInputChange} required placeholder="Ej: 103" />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select name="tipo" value={formulario.tipo} onChange={handleInputChange}>
                  <option value="Single">Individual</option>
                  <option value="Double">Doble</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div className="form-group">
                <label>Precio Base por Noche ($)</label>
                <input type="number" name="precioBase" value={formulario.precioBase} onChange={handleInputChange} required placeholder="Ej: 19900" />
              </div>
              <div className="form-group">
                <label>Estado Inicial</label>
                <select name="estado" value={formulario.estado} onChange={handleInputChange}>
                  <option value="Disponible">Disponible</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <button type="submit" className="btn-primario btn-full">Guardar Habitación</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Check-in */}
      {modalCheckInAbierto && (
        <div className="modal-overlay">
          <div className="modal-content modal-checkin">
            <div className="modal-header">
              <h2>Registrar Huésped (Check-in)</h2>
              <button className="btn-cerrar" onClick={() => setModalCheckInAbierto(false)}>✖</button>
            </div>
            
            <form onSubmit={handleSubmitCheckIn} className="checkin-form-grid">
              
              {/* COLUMNA IZQUIERDA: Datos del Huésped */}
              <div className="checkin-col">
                <h3>Datos del Huésped</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>💡 Escribe la cédula y presiona Tab.</p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="form-group" style={{ flex: '0.4' }}>
                    <label>Tipo Doc.</label>
                    <select value={formularioHuesped.tipoDocumento} onChange={(e) => setFormularioHuesped({...formularioHuesped, tipoDocumento: e.target.value})}>
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: '0.6' }}>
                    <label>Número</label>
                    <input type="text" required value={formularioHuesped.numeroDocumento} onChange={(e) => setFormularioHuesped({...formularioHuesped, numeroDocumento: e.target.value})} onBlur={(e) => buscarHuespedExistente(e.target.value, setFormularioHuesped)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombres</label>
                  <input type="text" required value={formularioHuesped.nombre} onChange={(e) => setFormularioHuesped({...formularioHuesped, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" required value={formularioHuesped.apellido} onChange={(e) => setFormularioHuesped({...formularioHuesped, apellido: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" required value={formularioHuesped.email} onChange={(e) => setFormularioHuesped({...formularioHuesped, email: e.target.value})} placeholder="huésped@correo.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" value={formularioHuesped.telefono} onChange={(e) => setFormularioHuesped({...formularioHuesped, telefono: formatearTelefono(e.target.value)})} placeholder="+57 312 345 67 89" maxLength="18" />
                </div>
              </div>

              {/* COLUMNA DERECHA: Detalles de Cobro */}
              <div className="checkin-col">
                <h3>Detalles de Estadía</h3>
                <div className="form-group">
                  <label>Fecha de Salida (Check-out)</label>
                  <input type="date" required value={formularioHuesped.fechaCheckOut} onChange={(e) => setFormularioHuesped({...formularioHuesped, fechaCheckOut: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Descuento (Opcional)</label>
                  <input type="number" value={formularioHuesped.descuento} onChange={(e) => setFormularioHuesped({...formularioHuesped, descuento: e.target.value})} placeholder="Ej: 50000" />
                </div>

                {/* Simulador en Vivo */}
                {formularioHuesped.fechaCheckOut && (
                  <div className="simulador-caja">
                    <div className="simulador-fila">
                      <span>{simulacionCheckIn.noches} Noche(s) × ${habitaciones.find(h => h.id === habitacionCheckIn)?.precioBase.toLocaleString('es-CO') || 0}</span>
                      <span>${((habitaciones.find(h => h.id === habitacionCheckIn)?.precioBase || 0) * simulacionCheckIn.noches).toLocaleString('es-CO')}</span>
                    </div>
                    {formularioHuesped.descuento && (
                      <div className="simulador-fila descuento">
                        <span>Descuento</span>
                        <span>-${parseFloat(formularioHuesped.descuento).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    <div className="simulador-fila total">
                      <span>Total a Cobrar</span>
                      <span>${simulacionCheckIn.total.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÓN ABAJO (Ocupa todo el ancho) */}
              <div className="checkin-footer">
                <button type="submit" className="btn-primario btn-full" disabled={cargandoAccion}>
                  {cargandoAccion ? '⏳ Procesando...' : 'Confirmar Check-in y Cobrar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {habitacionSeleccionada && (
        <div className="modal-overlay" onClick={() => setHabitacionSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Habitación {habitacionSeleccionada.numero}</h2>
              <button className="btn-cerrar" onClick={() => setHabitacionSeleccionada(null)}>✖</button>
            </div>
            <div className="guest-details">
              <h3>Huésped Actual</h3>
              {habitacionSeleccionada.reservas && habitacionSeleccionada.reservas.length > 0 ? (
                <div>
                  <p><strong>Nombre:</strong> {habitacionSeleccionada.reservas[0].huesped.nombre} {habitacionSeleccionada.reservas[0].huesped.apellido}</p>
                  <p><strong>Documento:</strong> {habitacionSeleccionada.reservas[0].huesped.tipoDocumento} {habitacionSeleccionada.reservas[0].huesped.numeroDocumento}</p>
                  <p><strong>Email:</strong> {habitacionSeleccionada.reservas[0].huesped.email}</p>
                  <p><strong>Check-in:</strong> {formatearFechaHora(habitacionSeleccionada.reservas[0].fechaCheckIn)}</p>
                </div>
              ) : (
                <p>No hay huésped registrado.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NUEVO: Modal de Historial del Huésped */}
      {huespedSeleccionado && (
        <div className="modal-overlay" onClick={() => setHuespedSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Historial de Huésped</h2>
              <button className="btn-cerrar" onClick={() => setHuespedSeleccionado(null)}>✖</button>
            </div>
            <div className="guest-profile">
              <h3>{huespedSeleccionado.nombre} {huespedSeleccionado.apellido}</h3>
              <p>📄 {huespedSeleccionado.tipoDocumento}: {huespedSeleccionado.numeroDocumento}</p>
              <p>✉️ {huespedSeleccionado.email}</p>
              <p>📞 {huespedSeleccionado.telefono || 'No registrado'}</p>
            </div>
            <div className="reservation-history">
              <h4>Reservas Anteriores</h4>
              {huespedSeleccionado.reservas.length > 0 ? (
                huespedSeleccionado.reservas.map(reserva => (
                  <div key={reserva.id} className="history-item">
                    <span className="history-room">Habitación {reserva.habitacion.numero}</span>
                    <span className="history-date">
                      📅 {new Date(reserva.fechaCheckIn).toLocaleDateString('es-CO')} - 
                      {new Date(reserva.fechaCheckOut).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                ))
              ) : (
                <p>Este huésped aún no tiene reservas registradas.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Factura / Recibo */}
      {facturaVisible && datosFactura && (
        <div className="modal-overlay" onClick={() => setFacturaVisible(false)}>
          <div className="modal-content invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <h2>🏨 HotelCRM</h2>
              <button className="btn-cerrar" onClick={() => setFacturaVisible(false)}>✖</button>
            </div>
            
            <div className="invoice-title">
              <h3>Recibo de Pago</h3>
              <p>Factura generada con éxito</p>
            </div>

            <div className="invoice-guest">
              <p><strong>Cliente:</strong> {datosFactura.huesped.nombre} {datosFactura.huesped.apellido}</p>
              <p><strong>Documento:</strong> {datosFactura.huesped.numeroDocumento}</p>
              <p><strong>Habitación:</strong> {datosFactura.numeroHabitacion}</p>
              <p><strong>Entrada:</strong> {formatearFechaHora(datosFactura.fechaCheckIn)}</p>
              <p><strong>Salida:</strong> {formatearFechaHora(datosFactura.fechaCheckOut)}</p>
            </div>

            <div className="invoice-table">
              <div className="invoice-row header">
                <span>Descripción</span>
                <span>Monto</span>
              </div>
              <div className="invoice-row">
                <span>{datosFactura.noches} Noche(s) × ${datosFactura.precioPorNoche.toLocaleString('es-CO')}</span>
                <span>${datosFactura.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="invoice-row">
                <span>IVA (19%)</span>
                <span>${datosFactura.iva.toLocaleString('es-CO')}</span>
              </div>
              <div className="invoice-row total">
                <span>TOTAL A PAGAR</span>
                <span>${datosFactura.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <button className="btn-primario btn-full" onClick={() => window.print()}>
              🖨️ Imprimir Recibo
            </button>
          </div>
        </div>
      )}

      {/* Modal de Reserva Futura */}
      {modalReservaAbierto && (
        <div className="modal-overlay" onClick={() => setModalReservaAbierto(false)}>
          <div className="modal-content modal-reserva" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar Nueva Reserva</h2>
              <button className="btn-cerrar" onClick={() => setModalReservaAbierto(false)}>✖</button>
            </div>
            <form onSubmit={handleSubmitReserva} className="reserva-form-grid">
              
              {/* COLUMNA IZQUIERDA: Detalles de la Reserva */}
              <div className="reserva-col">
                <h3>Detalles de la Estadía</h3>
                <div className="form-group">
                  <label>Habitación</label>
                  <select required value={formularioReserva.habitacionId} onChange={(e) => setFormularioReserva({...formularioReserva, habitacionId: e.target.value})}>
                    <option value="">Selecciona una habitación...</option>
                    {habitaciones.map(hab => (
                      <option key={hab.id} value={hab.id}>Hab {hab.numero} - {traducirTipo(hab.tipo)} (${hab.precioBase.toLocaleString('es-CO')})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fecha Check-In</label>
                  <input type="date" required value={formularioReserva.fechaCheckIn} onChange={(e) => setFormularioReserva({...formularioReserva, fechaCheckIn: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label>Fecha Check-Out</label>
                  <input type="date" required value={formularioReserva.fechaCheckOut} onChange={(e) => setFormularioReserva({...formularioReserva, fechaCheckOut: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Descuento (Opcional)</label>
                  <input type="number" value={formularioReserva.descuento} onChange={(e) => setFormularioReserva({...formularioReserva, descuento: e.target.value})} placeholder="Ej: 50000" />
                </div>

                <div className="form-group">
                  <label>Estado de la Reserva</label>
                  <select value={formularioReserva.estado} onChange={(e) => setFormularioReserva({...formularioReserva, estado: e.target.value})}>
                    <option value="Pendiente">Pendiente (No confirmada)</option>
                    <option value="Confirmada">Confirmada</option>
                  </select>
                </div>

                {formularioReserva.fechaCheckIn && formularioReserva.fechaCheckOut && (
                  <div className="simulador-caja">
                    <div className="simulador-fila">
                      <span>{simulacionReserva.noches} Noche(s) × ${habitaciones.find(h => h.id === parseInt(formularioReserva.habitacionId))?.precioBase.toLocaleString('es-CO') || 0}</span>
                      <span>${((habitaciones.find(h => h.id === parseInt(formularioReserva.habitacionId))?.precioBase || 0) * simulacionReserva.noches).toLocaleString('es-CO')}</span>
                    </div>
                    {formularioReserva.descuento && (
                      <div className="simulador-fila descuento">
                        <span>Descuento</span>
                        <span>-${parseFloat(formularioReserva.descuento).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    <div className="simulador-fila total">
                      <span>Total a Cobrar</span>
                      <span>${simulacionReserva.total.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA: Datos del Huésped */}
              <div className="reserva-col">
                <h3>Datos del Huésped</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>💡 Escribe la cédula y presiona Tab para autocompletar.</p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="form-group" style={{ flex: '0.4' }}>
                    <label>Tipo Doc.</label>
                    <select value={formularioReserva.tipoDocumento} onChange={(e) => setFormularioReserva({...formularioReserva, tipoDocumento: e.target.value})}>
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: '0.6' }}>
                    <label>Número</label>
                    <input 
                      type="text" 
                      required 
                      value={formularioReserva.numeroDocumento} 
                      onChange={(e) => setFormularioReserva({...formularioReserva, numeroDocumento: e.target.value})} 
                      onBlur={(e) => buscarHuespedExistente(e.target.value, setFormularioReserva)} // <-- CAMBIO AQUÍ
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombres</label>
                  <input type="text" required value={formularioReserva.nombre} onChange={(e) => setFormularioReserva({...formularioReserva, nombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" required value={formularioReserva.apellido} onChange={(e) => setFormularioReserva({...formularioReserva, apellido: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" required value={formularioReserva.email} onChange={(e) => setFormularioReserva({...formularioReserva, email: e.target.value})} placeholder="huésped@correo.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" value={formularioReserva.telefono} onChange={(e) => setFormularioReserva({...formularioReserva, telefono: formatearTelefono(e.target.value)})} placeholder="+57 312 345 67 89" maxLength="18" />
                </div>
              </div>

              {/* BOTÓN ABAJO */}
              <div className="reserva-footer">
                <button type="submit" className="btn-primario btn-full" disabled={cargandoAccion}>
                  {cargandoAccion ? '⏳ Agendando...' : 'Confirmar Reserva'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal de Registro de Egresos */}
      {modalEgresoAbierto && (
        <div className="modal-overlay" onClick={() => setModalEgresoAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Egreso / Gasto</h2>
              <button className="btn-cerrar" onClick={() => setModalEgresoAbierto(false)}>✖</button>
            </div>
            <form onSubmit={handleSubmitEgreso}>
              <div className="form-group">
                <label>Concepto del Gasto</label>
                <input type="text" required value={formularioEgreso.concepto} onChange={(e) => setFormularioEgreso({...formularioEgreso, concepto: e.target.value})} placeholder="Ej: Pago de luz, Mantenimiento, Nómina" />
              </div>
              <div className="form-group">
                <label>Monto Total ($)</label>
                <input type="number" required value={formularioEgreso.monto} onChange={(e) => setFormularioEgreso({...formularioEgreso, monto: e.target.value})} placeholder="Ej: 500000" />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={formularioEgreso.categoria} onChange={(e) => setFormularioEgreso({...formularioEgreso, categoria: e.target.value})}>
                  <option value="Servicios">Servicios Públicos</option>
                  <option value="Nomina">Nómina</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Arrendamiento">Arrendamiento</option>
                  <option value="Insumos">Insumos</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado del Pago</label>
                <select value={formularioEgreso.estado} onChange={(e) => setFormularioEgreso({...formularioEgreso, estado: e.target.value})}>
                  <option value="Pagado">Pagado (Resta de inmediato de la utilidad)</option>
                  <option value="Pendiente">Pendiente (Genera alerta de deuda)</option>
                </select>
              </div>
              <button type="submit" className="btn-primario btn-full" disabled={cargandoAccion}>
                {cargandoAccion ? '⏳ Guardando...' : 'Guardar Egreso'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cancelación Segura */}
      {modalCancelarAbierto && reservaACancelar && (
        <div className="modal-overlay" onClick={() => setModalCancelarAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Cancelar Reserva</h2>
              <button className="btn-cerrar" onClick={() => setModalCancelarAbierto(false)}>✖</button>
            </div>
            
            <div className="alert-item deuda" style={{ marginBottom: '1rem' }}>
              <div className="deuda-info">
                <span>Estás por cancelar la reserva de:</span>
                <span className="alert-status">{reservaACancelar.huesped.nombre} {reservaACancelar.huesped.apellido} (Hab {reservaACancelar.habitacion.numero})</span>
              </div>
            </div>

            <form onSubmit={handleConfirmarCancelacion}>
              <div className="form-group">
                <label>Motivo de Cancelación</label>
                <select required value={datosCancelacion.motivo} onChange={(e) => setDatosCancelacion({...datosCancelacion, motivo: e.target.value})}>
                  <option value="">Selecciona un motivo...</option>
                  <option value="No-show">No-show (No llegó)</option>
                  <option value="Cancelacion Cliente">Cancelación por parte del cliente</option>
                  <option value="Fuerza Mayor">Fuerza Mayor / Emergencia</option>
                  <option value="Error Registro">Error de Registro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contraseña de Autorización</label>
                <input type="password" required value={datosCancelacion.password} onChange={(e) => setDatosCancelacion({...datosCancelacion, password: e.target.value})} placeholder="Ingresa tu contraseña para confirmar" />
              </div>
              <button type="submit" className="btn-checkout btn-full" disabled={cargandoAccion}>
                {cargandoAccion ? '⏳ Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Notas de Huésped */}
      {modalNotasAbierto && huespedNotas && (
        <div className="modal-overlay" onClick={() => setModalNotasAbierto(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Notas de {huespedNotas.nombre}</h2>
              <button className="btn-cerrar" onClick={() => setModalNotasAbierto(false)}>✖</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Registra preferencias, alergias o solicitudes especiales. Esto quedará guardado en el perfil del huésped para sus próximas visitas.
            </p>
            <textarea 
              className="textarea-notas" 
              value={textoNota} 
              onChange={(e) => setTextoNota(e.target.value)} 
              rows="5" 
              placeholder="Ej: Alérgico al polvo. Pidió despertador a las 5 AM. Prefiere habitaciones en piso alto."
            />
            <button className="btn-primario btn-full" style={{ marginTop: '1rem' }} onClick={handleGuardarNota}>
              💾 Guardar Nota
            </button>
          </div>
        </div>
      )}

      {/* Notificación Toast */}
      {toast && (
        <div className={`toast-notification ${toast.tipo}`}>
          <span className="toast-icon">
            {toast.tipo === 'exito' ? '✅' : '❌'}
          </span>
          <span className="toast-message">{toast.mensaje}</span>
        </div>
      )}
    </div>    
  );
}

export default App;