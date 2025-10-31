import { useEffect, useState } from 'react'
import api from '../api/axios'

function Perfis() {
  const [perfis, setPerfis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await api.get('/perfis/')
        setPerfis(response.data.results || response.data)
      } catch (err) {
        setError('Erro ao carregar perfis: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfis()
  }, [])

  if (loading) return <div className="loading">Carregando perfis...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h2>Perfis de Escrita</h2>
      <p style={{ marginBottom: '2rem' }}>
        Total de {perfis.length} autor(es) cadastrado(s)
      </p>

      {perfis.length === 0 ? (
        <div className="card">
          <p>Nenhum perfil cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid">
          {perfis.map((perfil) => (
            <div key={perfil.id} className="card">
              <h3>{perfil.nick}</h3>

              {perfil.bio && (
                <p style={{ margin: '1rem 0', fontSize: '0.9em' }}>{perfil.bio}</p>
              )}

              {perfil.perfil_valete && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Valete:</strong>{' '}
                  {perfil.url_valete ? (
                    <a href={perfil.url_valete} target="_blank" rel="noopener noreferrer">
                      {perfil.perfil_valete}
                    </a>
                  ) : (
                    perfil.perfil_valete
                  )}
                </div>
              )}

              {perfil.perfil_substack && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Substack:</strong>{' '}
                  {perfil.url_substack ? (
                    <a href={perfil.url_substack} target="_blank" rel="noopener noreferrer">
                      {perfil.perfil_substack}
                    </a>
                  ) : (
                    perfil.perfil_substack
                  )}
                </div>
              )}

              {perfil.topicos_lista && perfil.topicos_lista.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Tópicos:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {perfil.topicos_lista.map((topico, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#2a2a2a',
                          borderRadius: '4px',
                          fontSize: '0.85em'
                        }}
                      >
                        {topico}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1rem', fontSize: '0.85em', color: '#888' }}>
                Total de postagens: {perfil.total_postagens || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Perfis
