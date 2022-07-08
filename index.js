const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

    desenhar() {

        context.save()

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

function animacao() {
    requestAnimationFrame(animacao)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    jogador.update()

    if (teclas.a.pressionado && jogador.posicao.x >= 0) {
        jogador.velocidade.x = -5
    } else if (teclas.d.pressionado && jogador.posicao.x + jogador.largura <= canvas.width){
        jogador.velocidade.x = 5
    } else {
        jogador.velocidade.x = 0
    }
}

const jogador = new NavePrincipal();


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
            teclas.space.pressionado = false
            break

        default:
            break
    }
})