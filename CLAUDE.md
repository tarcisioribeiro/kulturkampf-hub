# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KulturKampf is a content hub platform for writers ("valeteiros") from the Valete and Substack communities. The platform centralizes, analyzes, and shares author profiles and publications, providing production metrics and intelligent interaction via group bot.

**Current Status**: Early-stage project with documentation only. Python-based implementation (indicated by .gitignore).

**Language**: Brazilian Portuguese (documentation and likely user-facing content)

## Data Models

The platform is designed around three core data models:

### 1. Perfil de Escrita (Writing Profile)
Represents an author's identity and style across integrated platforms:
- Nick/Pseudônimo (nickname/pseudonym used in the community)
- Perfil Valete (Valete platform identifier and link)
- Perfil Substack (Substack identifier and link)
- Tópicos Abordados (recurring topics in the author's posts)

### 2. Postagens (Posts)
Stores publication information:
- Data (publication date)
- Horário (publication time)
- Título (post title)
- Tópico (main topic)
- Coautores (co-authors, field reserved for future integration if platforms support it)

### 3. Métricas (Metrics)
Consolidates production and writing frequency statistics:
- Postagens por mês (posts per month)
- Frequência média (average posting interval, e.g., posts/week or posts/month)

## Key Requirements

### Automation
- Implement scheduled sharing of profiles and posts to designated channels/groups
- Periodic execution for content distribution

### LLM Integration
- Integrate a language model into the group bot
- Enable playful and analytical interactions
- Generate insights about writing style, thinking patterns, and worldview of members

## Architecture Considerations

When implementing this project:

1. **Data Integration**: Design scrapers/APIs to pull data from Valete and Substack platforms
2. **Storage**: Database schema should reflect the three core models with relationships between profiles, posts, and metrics
3. **Bot Framework**: Consider Telegram/Discord bot frameworks for group integration
4. **Scheduling**: Use cron jobs or task schedulers for automated content sharing
5. **LLM Integration**: Plan for API integration with language models for conversational analysis

## Development Environment

The .gitignore indicates support for multiple Python package managers and tools:
- Standard Python tools (pip, poetry, pdm, uv, pipenv)
- Abstra framework (AI-powered process automation)
- Testing with pytest
- Type checking with mypy
- Linting with ruff

When setting up the project, choose one primary package manager and document setup instructions in README.md.
- Sempre me responda em português.
- Preciso que não crie arquivos .md aleatoriamente. Se for necessário, atualize o README.md e CLAUDE.md.