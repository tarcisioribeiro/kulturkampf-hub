import { useEffect, useState } from 'react'
import api from '../api/axios'

function Home() {
  const [stats, setStats] = useState({
    perfis: 0,
    postagens: 0,
    metricas: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [perfisRes, postagensRes, metricasRes] = await Promise.all([
          api.get('/perfis/'),
          api.get('/postagens/'),
          api.get('/metricas/')
        ])

        setStats({
          perfis: perfisRes.data.count || perfisRes.data.length || 0,
          postagens: postagensRes.data.count || postagensRes.data.length || 0,
          metricas: metricasRes.data.count || metricasRes.data.length || 0
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div>
      <h2>Bem-vindo ao KulturKampf</h2>
      <p style={{ marginBottom: '2rem' }}>
        Plataforma para centralizar, analisar e compartilhar perfis e publicações
        dos escritores (valeteiros) das comunidades Valete e Substack.
      </p>

      <div className="grid">
        <div className="card">
          <h3>Perfis de Escrita</h3>
          <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{stats.perfis}</p>
          <p>Autores cadastrados na plataforma</p>
        </div>

        <div className="card">
          <h3>Postagens</h3>
          <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{stats.postagens}</p>
          <p>Publicações registradas</p>
        </div>

        <div className="card">
          <h3>Métricas</h3>
          <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{stats.metricas}</p>
          <p>Análises de produção</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Funcionalidades</h3>
        <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <li>Gestão de perfis de autores com integração Valete e Substack</li>
          <li>Registro e visualização de postagens</li>
          <li>Métricas de produção e frequência de escrita</li>
          <li>API REST completa para integração</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
