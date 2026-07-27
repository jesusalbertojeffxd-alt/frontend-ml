import React from 'react';

// Este componente solo recibe las propiedades (props) y las muestra.
const PerfilVista = ({ usuario }) => {
  // Datos de ejemplo por si no se le pasa la propiedad 'usuario'
  const datos = usuario || {
    nombre: "Juan Pérez",
    username: "juan.perez@correo.com",
    direccion: "Calle Principal 123, Ciudad",
    telefono: "555-987-6543",
    rol: "ROLE_CLIENTE"
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
        
        <h2 style={{ textAlign: 'center', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          Mi Perfil
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#666', fontSize: '14px' }}>Nombre completo:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{datos.nombre}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#666', fontSize: '14px' }}>Correo (Username):</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{datos.username}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#666', fontSize: '14px' }}>Dirección de envío:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{datos.direccion}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong style={{ color: '#666', fontSize: '14px' }}>Teléfono:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>{datos.telefono}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong style={{ color: '#666', fontSize: '14px' }}>Rol de la cuenta:</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>
            {datos.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
          </p>
        </div>

        <button style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#0056b3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer' 
        }}>
          Editar Perfil
        </button>

      </div>
    </div>
  );
};

export default PerfilVista;