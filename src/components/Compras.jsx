import React from 'react';

// Este componente solo recibe las compras (props) y las muestra.
const MisComprasVista = ({ compras }) => {
  // Datos de ejemplo por si no se le pasa la propiedad 'compras'
  const listaCompras = compras || [
    {
      id: "VTA-00102",
      fecha: "15 de Julio, 2026",
      total: 1250.00,
      estado: "Entregado",
      cantidadArticulos: 3
    },
    {
      id: "VTA-00105",
      fecha: "18 de Julio, 2026",
      total: 899.50,
      estado: "En Camino",
      cantidadArticulos: 1
    },
    {
      id: "VTA-00108",
      fecha: "20 de Julio, 2026",
      total: 450.00,
      estado: "Procesando",
      cantidadArticulos: 2
    }
  ];

  // Función sencilla para dar color al estado de la compra
  const colorEstado = (estado) => {
    switch (estado) {
      case 'Entregado': return { bg: '#d4edda', text: '#155724' };
      case 'En Camino': return { bg: '#cce5ff', text: '#004085' };
      case 'Procesando': return { bg: '#fff3cd', text: '#856404' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        Historial de Compras
      </h2>

      {listaCompras.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p>Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {listaCompras.map((compra) => {
            const estiloBadge = colorEstado(compra.estado);

            return (
              <div key={compra.id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px 20px', 
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                
                {/* Información Principal */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                    Pedido: <strong style={{ color: '#333' }}>{compra.id}</strong>
                  </p>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                    Fecha: {compra.fecha}
                  </p>
                  <p style={{ margin: '0', fontSize: '13px', color: '#888' }}>
                    {compra.cantidadArticulos} artículo(s)
                  </p>
                </div>

                {/* Precio y Estado */}
                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>
                    ${compra.total.toFixed(2)}
                  </p>
                  <span style={{ 
                    backgroundColor: estiloBadge.bg, 
                    color: estiloBadge.text, 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {compra.estado}
                  </span>
                </div>

                {/* Botón de Acción */}
                <div style={{ width: '100%', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
                  <button style={{ 
                    padding: '8px 15px', 
                    backgroundColor: 'transparent', 
                    color: '#0056b3', 
                    border: '1px solid #0056b3', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    Ver Detalles
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisComprasVista;