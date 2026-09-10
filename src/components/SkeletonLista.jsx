export function SkeletonLista({ lineas = 3 }) {
    return (
        <div className="skeleton-lista">
            {Array.from({ length: lineas}).map((_, i) => (
                <div key={i} className="skeleton-item"></div>
            ))}
        </div>
    );
}