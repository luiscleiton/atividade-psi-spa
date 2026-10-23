'use strict'

const API_URL = 'https://potterapi-fedeperin.vercel.app/pt'

const casasContainer = document.getElementById('casas-container')
const galeria = document.getElementById('galeria-container')
const detalhes = document.getElementById('detalhes-container')
const titulo = document.getElementById('titulo')
const tituloPrincipal = document.getElementById('titulo-principal')

async function buscarCasas() {
    const response = await fetch(`${API_URL}/houses`)
    const data = await response.json()

    return data
}

function criarCardCasa(casa) {
    const card = document.createElement('div')
    card.classList.add('card-casa')

    const emoji = document.createElement('h2')
    emoji.textContent = casa.emoji || '🏰'

    const nome = document.createElement('h3')
    nome.textContent = casa.house

    const animal = document.createElement('p')
    animal.textContent = `Animal: ${casa.animal || 'Não informado'}`

    const botao = document.createElement('button')
    botao.textContent = 'Ver personagens'

    botao.onclick = function() {
        preencherGaleria(casa.house)
    }

    card.append(emoji, nome, animal, botao)

    return card
}

async function preencherCasas() {
    try {
        const casas = await buscarCasas()
        const cards = casas.map(criarCardCasa)

        casasContainer.replaceChildren(...cards)
    } catch (erro) {
        casasContainer.textContent = 'Erro ao carregar as casas.'
    }
}

async function buscarPersonagens() {
    const response = await fetch(`${API_URL}/characters`)

    if (!response.ok) {
        throw new Error('Erro ao buscar personagens')
    }

    return await response.json()
}

function criarCardPersonagem(personagem) {
    const card = document.createElement('div')
    card.classList.add('card-personagem')

    const foto = document.createElement('img')
    foto.src = personagem.image ||
        'https://placehold.co/300x400?text=Sem+imagem'
    foto.alt = personagem.fullName || 'Personagem'

    const nome = document.createElement('h3')
    nome.textContent = personagem.fullName || 'Nome não informado'

    card.append(foto, nome)

    card.onclick = function() {
        mostrarDetalhes(personagem)
    }

    return card
}

async function preencherGaleria(casa) {
    casasContainer.hidden = true
    galeria.hidden = false
    detalhes.hidden = true

    tituloPrincipal.textContent = 'Personagens de Hogwarts'
    titulo.textContent = `Casa: ${casa}`

    galeria.replaceChildren()

    const botaoVoltar = document.createElement('button')
    botaoVoltar.textContent = 'Voltar para as casas'
    botaoVoltar.onclick = voltarCasas

    galeria.appendChild(botaoVoltar)

    const carregando = document.createElement('p')
    carregando.textContent = 'Carregando personagens...'
    galeria.appendChild(carregando)

    try {
        const personagens = await buscarPersonagens()

        const filtrados = personagens.filter(function(personagem) {
            return personagem.hogwartsHouse === casa
        })

        const cards = filtrados.map(criarCardPersonagem)

        galeria.replaceChildren(botaoVoltar, ...cards)

        if (cards.length === 0) {
            const mensagem = document.createElement('p')
            mensagem.textContent = 'Nenhum personagem encontrado.'
            galeria.appendChild(mensagem)
        }
    } catch (erro) {
        galeria.replaceChildren(botaoVoltar)

        const mensagem = document.createElement('p')
        mensagem.textContent = 'Erro ao carregar personagens.'

        galeria.appendChild(mensagem)
    }
}

function mostrarDetalhes(personagem) {
    casasContainer.hidden = true
    galeria.hidden = true
    detalhes.hidden = false

    tituloPrincipal.textContent = 'Detalhes do personagem'
    titulo.textContent = ''

    detalhes.replaceChildren()

    const botaoVoltar = document.createElement('button')
    botaoVoltar.textContent = 'Voltar para os personagens'

    botaoVoltar.onclick = function() {
        detalhes.hidden = true
        galeria.hidden = false

        tituloPrincipal.textContent = 'Personagens de Hogwarts'
        titulo.textContent = `Casa: ${personagem.hogwartsHouse || 'Não informada'}`
    }

    const nome = document.createElement('h2')
    nome.textContent = personagem.fullName || 'Nome não informado'

    const foto = document.createElement('img')
    foto.src = personagem.image ||
        'https://placehold.co/300x400?text=Sem+imagem'
    foto.alt = personagem.fullName || 'Personagem'

    const ator = document.createElement('p')
    ator.textContent =
        `Ator: ${personagem.interpretedBy || 'Não informado'}`

    const casa = document.createElement('p')
    casa.textContent =
        `Casa: ${personagem.hogwartsHouse || 'Não informada'}`

    const nascimento = document.createElement('p')
    nascimento.textContent =
        `Nascimento: ${personagem.birthdate || 'Não informado'}`

    const apelido = document.createElement('p')
    apelido.textContent =
        `Apelido: ${personagem.nickname || 'Não informado'}`

    detalhes.append(botaoVoltar, nome, foto, ator, casa, nascimento, apelido)
}

function voltarCasas() {
    casasContainer.hidden = false
    galeria.hidden = true
    detalhes.hidden = true

    tituloPrincipal.textContent = 'Casas de Hogwarts'
    titulo.textContent = ''
}

preencherCasas()