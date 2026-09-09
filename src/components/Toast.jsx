export function Toast({ toast }) {
    if (!toast) return null;

    return (
        <div className={`toast-notification ${toast.tipo}`}>
          <span className="toast-icon">
            {toast.tipo === 'exito' ? '✅' : '❌'}
          </span>
          <span className="toast-message">{toast.mensaje}</span>
        </div>
    );
}