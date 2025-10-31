import { useEffect, useState } from 'react'
import api from '../api/axios'

function Postagens() {
  const [postagens, setPostagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        const response = await api.get('/postagens/')
        setPostagens(response.data.results || response.data)
      } catch (err) {
        setError('Erro ao carregar postagens: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPostagens()
  }, [])

  if (loading) return <div className="loading">Carregando postagens...</div>
  if (error) return <div className="error">{error}</div>

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <h2>Postagens</h2>
      <p style={{ marginBottom: '2rem' }}>
        Total de {postagens.length} postagem(ns) registrada(s)
      </p>

      {postagens.length === 0 ? (
        <div className="card">
          <p>Nenhuma postagem registrada ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {postagens.map((postagem) => (
            <div key={postagem.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>
                    <a href={postagem.url} target="_blank" rel="noopener noreferrer">
                      {postagem.titulo}
                    </a>
                  </h3>

                  <div style={{ fontSize: '0.9em', color: '#888', marginBottom: '0.5rem' }}>
                    Por <strong>{postagem.perfil_nick}</strong> • {formatDate(postagem.data_publicacao)}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#2a2a2a',
                      borderRadius: '4px',
                      fontSize: '0.85em'
                    }}>
                      {postagem.plataforma}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#2a2a2a',
                      borderRadius: '4px',
                      fontSize: '0.85em'
                    }}>
                      {postagem.topico}
                    </span>
                  </div>

                  {postagem.conteudo_preview && (
                    <p style={{ marginTop: '1rem', fontSize: '0.9em', color: '#ccc' }}>
                      {postagem.conteudo_preview}
                    </p>
                  )}

                  {postagem.coautores_details && postagem.coautores_details.length > 0 && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85em' }}>
                      <strong>Coautores:</strong> {postagem.coautores_details.map(c => c.nick).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Postagens
