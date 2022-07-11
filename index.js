const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight


let intervaloDisparos

const teclas = {
    a: {
        pressionado: false
    },

    d: {
        pressionado: false
    },

    w: {
        pressionado: false
    },

    s: {
        pressionado: false
    },

    space: {
        pressionado: false
    }
}


class NavePrincipal {
    constructor() {

        this.velocidade = {
            x: 0,
            y: 0
        }

        this.imagem = new Image()

        this.imagem.src = './img/navePrincipal.png'
        
        this.imagem.onload = () => {

            const scale = 0.15
            this.largura = this.imagem.width * scale
            this.altura = this.imagem.height * scale

            this.posicao = {
                x: canvas.width / 2 - (this.largura / 2),
                y: canvas.height - this.altura - 15
            }
        }
    }

    atirar() {
        projeteis.push(new Projetil(0, -10, 'red', jogador.posicao.x + (jogador.largura / 2), jogador.posicao.y, 3))
    }
    
    desenhar() {

        context.drawImage(this.imagem, this.posicao.x, this.posicao.y,
            this.largura, this.altura ) 
    }

    update() {
        if(this.imagem && this.posicao){
            this.desenhar()
            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }
}

class Inimigo {
    constructor(imageSrc, posX, posY) {

        this.velocidade = {
            x: 0,
            y: 0
        }

        this.imagem = new Image()

        this.imagem.src = imageSrc
        
        this.imagem.onload = () => {

            const scale = 0.15
            this.largura = this.imagem.width * scale
            this.altura = this.imagem.height * scale

            this.posicao = {
                x: posX,
                y: posY
            }
        }
    }
    

    desenhar() {

        context.drawImage(this.imagem, this.posicao.x, this.posicao.y,
            this.largura, this.altura ) 
    }

    update() {
        if(this.imagem && this.posicao){
            this.desenhar()
            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }
}


class InimigoNivel1 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
    }

    updateVelocidade(){
        if(this.posicao) {         
            this.velocidade.x = this.posicao.y % 10 === 0 ? 5 : -5
            if (this.posicao.x === 0 || this.posicao.x > canvas.width - this.largura){
                this.velocidade.y = 5;
                this.velocidade.x = -this.velocidade.x
            } else {
                this.velocidade.y = 0;
            }
        }
    }

    update() {
        if(this.imagem && this.posicao){
            this.updateVelocidade();
            this.desenhar()
            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }

    atirar() {
        projeteis.push(new Projetil(0, 10, this.corProjetil, inimigo.posicao.x + (inimigo.largura / 2), inimigo.posicao.y, 3))
    }
}

class Projetil {
    constructor(velocidadeX, velocidadeY, cor, posicaoX, posicaoY, raio){
        this.velocidade = {
            x: velocidadeX,
            y: velocidadeY
        }
        this.cor = cor
        this.posicao = {
            x: posicaoX,
            y: posicaoY
        }
        this.raio = raio
    }

    desenhar() {
        context.beginPath()
        context.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI * 2)
        context.fillStyle = this.cor
        context.fill()
        context.closePath()
    }

    update() {
        this.desenhar()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y
    }
}

function animacao() {
    requestAnimationFrame(animacao)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()

    projeteis.forEach((projetil, indice) => {
        if (projetil.posicao.x > canvas.width || projetil.posicao.x < 0 || projetil.posicao.y > canvas.height + projetil.raio || projetil.posicao.y < 0) {
            projeteis.splice(indice,1)
        } else {

            let inimigoAtingido = inimigosNivel1.find((inimigo) => inimigo.posicao.x < projetil.posicao.x - projetil.raio && inimigo.posicao.x + inimigo.largura > projetil.posicao.x 
            && inimigo.posicao.y < projetil.posicao.y - projetil.raio && inimigo.posicao.y + inimigo.altura > projetil.posicao.y)
    
            if (inimigoAtingido) {
                projeteis.splice(indice, 1)
                inimigosNivel1.splice(inimigosNivel1.indexOf(inimigoAtingido), 1)
            }
            else {
                projetil.update()
            }
        }
    })

    inimigosNivel1.forEach((inimigo) => inimigo.update())

    if (teclas.a.pressionado && jogador.posicao.x >= 0) {
        jogador.velocidade.x = -5
    } else if (teclas.d.pressionado && jogador.posicao.x + jogador.largura <= canvas.width){
        jogador.velocidade.x = 5
    } else {
        jogador.velocidade.x = 0
    }

    if (teclas.s.pressionado && jogador.posicao.y + jogador.altura <= canvas.height) {
        jogador.velocidade.y = 5
    } else if (teclas.w.pressionado && jogador.posicao.y >= 0){
        jogador.velocidade.y = -5
    } else {
        jogador.velocidade.y = 0
    }


}

let projeteis = []

const jogador = new NavePrincipal();

const inimigosNivel1 = []

for (let x = 1; x < 11; x++) {
    for (let y = 1; y < 6; y++) {
        inimigosNivel1.push(new InimigoNivel1('./img/enemy1.png', x * 30, y * 30, 'blue'))
    }
}


animacao()

window.addEventListener('keydown', (evento) => {
    switch (evento.key) {
        case 'a':
            teclas.a.pressionado = true
            break

        case 's':
            teclas.s.pressionado = true
            break

        case 'w':
            teclas.w.pressionado = true
            break

        case 'd':
            teclas.d.pressionado = true
            break

        case ' ':

        if (!teclas.space.pressionado){
            jogador.atirar()
            intervaloDisparos = setInterval(() => jogador.atirar(), 500);
        }
        teclas.space.pressionado = true
            
        break

        default:
            break
    }
})

window.addEventListener('keyup', (evento) => {
    switch (evento.key) {
        case 'a':
            teclas.a.pressionado = false
            break

        case 's':
            teclas.s.pressionado = false
            break

        case 'w':
            teclas.w.pressionado = false
            break

        case 'd':
            teclas.d.pressionado = false
            break

        case ' ':
            clearInterval(intervaloDisparos)
            teclas.space.pressionado = false
            break

        default:
            break
    }
})