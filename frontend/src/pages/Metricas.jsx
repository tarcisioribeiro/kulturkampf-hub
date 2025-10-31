import { useEffect, useState } from 'react'
import api from '../api/axios'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function Metricas() {
  const [metricas, setMetricas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await api.get('/metricas/')
        setMetricas(response.data.results || response.data)
      } catch (err) {
        setError('Erro ao carregar métricas: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetricas()
  }, [])

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Carregando métricas...</p>
    </div>
  )
  if (error) return <div className="error">{error}</div>

  const formatMes = (mesRef) => {
    if (!mesRef) return ''
    const [ano, mes] = mesRef.split('-')
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]
    return `${meses[parseInt(mes) - 1]}/${ano.slice(2)}`
  }

  const formatMesFull = (mesRef) => {
    if (!mesRef) return ''
    const [ano, mes] = mesRef.split('-')
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return `${meses[parseInt(mes) - 1]} ${ano}`
  }

  // Prepare data for charts
  const chartData = metricas
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(metrica => ({
      mes: formatMes(metrica.month),
      postagens: metrica.month_posts,
      frequencia: metrica.days_frequency || 0,
      nome: metrica.profile_nick
    }))

  // Group by month for aggregated view
  const aggregatedByMonth = chartData.reduce((acc, item) => {
    const existing = acc.find(x => x.mes === item.mes)
    if (existing) {
      existing.postagens += item.postagens
    } else {
      acc.push({ mes: item.mes, postagens: item.postagens })
    }
    return acc
  }, [])

  return (
    <div>
      <h2>Métricas de Produção</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Análises de frequência e volume de publicações
      </p>

      {metricas.length === 0 ? (
        <div className="card">
          <p>Nenhuma métrica registrada ainda.</p>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Posts por Mês</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="mes" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="postagens"
                    fill="var(--color-link)"
                    name="Postagens"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Frequência Mensal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="mes" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" label={{ value: 'Posts', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="postagens"
                    stroke="var(--color-link)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-link)', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Postagens"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Cards */}
          <h3 style={{ marginBottom: '1rem' }}>Detalhes por Autor</h3>
          <div className="grid">
            {metricas.map((metrica) => (
              <div key={metrica.id} className="card">
                <h3>{metrica.profile_nick}</h3>
                <div style={{ fontSize: '1.1em', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  {formatMesFull(metrica.month)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Postagens no mês:</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-link)' }}>
                      {metrica.month_posts}
                    </strong>
                  </div>

                  {metrica.week_posts > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Por semana:</span>
                      <strong>{metrica.week_posts.toFixed(2)}</strong>
                    </div>
                  )}

                  {metrica.days_frequency && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Intervalo médio:</span>
                      <strong>{metrica.days_frequency.toFixed(1)} dias</strong>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '0.5rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-color)'
                    }}
                  >
                    <span>Total acumulado:</span>
                    <strong style={{ color: 'var(--tg-success)' }}>
                      {metrica.total_posts}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Metricas
