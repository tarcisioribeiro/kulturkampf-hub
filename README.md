# kulturkampf
Hub de escritores do KulturKampf.

Hub do Kulturkampf

Descrição geral

Plataforma para centralizar, analisar e compartilhar perfis e publicações dos membros do Valete e Substack, promovendo integração de conteúdo, métricas de produção e interação inteligente via bot do grupo.

Modelos de Dados
1. Perfil de Escrita

Representa a identidade e o estilo de um autor dentro das plataformas integradas.

Campos:

Nick/Pseudônimo - Alcunha pela qual o valeteiro é conhecido na bolha.

Perfil Valete — Identificador e link do autor no portal Valete.

Perfil Substack — Identificador e link do autor no Substack.

Tópicos Abordados — Lista de temas recorrentes nas postagens do autor.

2. Postagens

Armazena informações sobre cada publicação associada a um autor.

Campos:

Data — Dia da publicação.

Horário — Hora exata da postagem.

Título — Nome ou manchete do post.

Tópico — Assunto principal abordado.

Coautores — Lista de coautores (campo previsto para futura integração, caso Substack e Valete passem a suportar essa feature).

3. Métricas

Consolida estatísticas de produção e frequência de escrita dos autores.

Campos:

Postagens por mês — Número total de publicações mensais.

Frequência média — Intervalo médio entre postagens (ex.: posts/semana ou posts/mês).

Requisitos Não Funcionais

Automação e compartilhamento:
Implementar agendamento periódico para compartilhamento automático de perfis e postagens em canais/grupos designados.

Integração com modelo de linguagem:
Incorporar um modelo de linguagem ao bot do grupo, permitindo interações lúdicas e analíticas — para gerar insights sobre o estilo, pensamento e visão dos membros (“valeteiros”).
