/* CONFIGURAÇÃO DO CANVAS */

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/*------------------------------------*/

/* VARIÁVEIS GLOBAIS */
let stage;
let etapaGame
let projeteis = []
let projeteisInimigos = []
let inimigos = []

let intervaloDisparos;

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

/*---------------------------------*/


/* Event listeners */

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

/*------------------------------------------*/


/* CLASSES */

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

    resetarPosicao() {
        this.posicao = {
            x: canvas.width / 2 - (this.largura / 2),
            y: canvas.height - this.altura - 15
        }
    }

    atirar() {
        projeteis.push(new Projetil(0, -10, 'blue', jogador.posicao.x + (jogador.largura / 2), jogador.posicao.y, 3))
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
            this.velocidade.x = this.posicao.y % 10 === 0 ? 2 : -2
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
}

class InimigoNivel2 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
    }

    updateVelocidade(){
        if(this.posicao) {         
            this.velocidade.x = this.posicao.y % 10 === 0 ? 3 : -3
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

            if (Math.random() < 0.0003) {
                this.atirar();
            }
            
            this.updateVelocidade();
            this.desenhar()
            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }

    atirar() {
        projeteisInimigos.push(new Projetil(0, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
    }
}

class InimigoNivel3 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
        this.velocidade.x = 2
    }

    updateVelocidade(){
        if(this.posicao) {         

            if (this.posicao.x < 0 || this.posicao.x > canvas.width - this.largura) {
                this.velocidade.x = -this.velocidade.x
            }

            if(this.posicao.x < canvas.width / 4){
                this.velocidade.y = 2
            } else if(this.posicao.x < canvas.width / 2){
                this.velocidade.y = -1
            } else if(this.posicao.x < 3*canvas.width / 4){
                this.velocidade.y = 1
            } else {
                this.velocidade.y = -1
            }
        }

    }

    update() {
        if(this.imagem && this.posicao){

            if (Math.random() < 0.0003) {
                this.atirar();
            }
            
            this.updateVelocidade();
            this.desenhar()

            

            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }

    atirar() {
        projeteisInimigos.push(new Projetil(0, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(3, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(-3, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
    }
}


class bossFinal extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
        this.velocidade.x = 7
        this.intervaloMovimentos = setInterval(() => (this.currentMov = Math.random() > 0.5 ? 1 : 2),5000)
    }

    currentMov = 1;
    intervaloMovimentos;
    vida = 10;

    atingido() {
        this.vida -= 1

        if(this.vida < 1) {
            clearInterval(intervaloMovimentos);
        }
    }

    updateVelocidade1(){
        if(this.posicao) {         

            if (this.posicao.x < 0 || this.posicao.x > canvas.width - this.largura) {
                this.velocidade.x = -this.velocidade.x
            }

            if (this.posicao.y > canvas.height) {
                this.velocidade.y = -canvas.height
            }

            else if(this.posicao.x < canvas.width / 4){
                this.velocidade.y = 4
            } else if(this.posicao.x < canvas.width / 2){
                this.velocidade.y = -2
            } else if(this.posicao.x < 3*canvas.width / 4){
                this.velocidade.y = 2
            } else {
                this.velocidade.y = -2
            }
        }

    }

    updateVelocidade2(){
        if(this.posicao) {  
            if(this.posicao.y >= canvas.height) {
                this.velocidade.y = -canvas.height
            }       
            else if (this.posicao.x < 0 || this.posicao.x > canvas.width - this.largura){
                this.velocidade.y = 100;
                this.velocidade.x = -this.velocidade.x
            } else {
                this.velocidade.y = 0;
            }
        }

    }



    update() {
        if(this.imagem && this.posicao){

            if (Math.random() < 0.025) {  
                this.atirar1();
            }

            if (Math.random() < 0.025) {
                this.atirar2();
            }

            if (Math.random() < 0.025) {
                this.atirar3();
            }
            
            this.currentMov === 1 ? this.updateVelocidade1() : this.updateVelocidade2();
            this.desenhar()

            

            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }

    atirar1() {
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2) + 20, this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2) -20, this.posicao.y, 3))
    }

    atirar2() {
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2) + 20, this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2) -20, this.posicao.y, 3))
    }

    atirar3() {
        projeteisInimigos.push(new Projetil(5, 0, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y + (this.altura / 2), 3))
        projeteisInimigos.push(new Projetil(-5, 0, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y + (this.altura / 2), 3))
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

/* FUNÕES PRINCIPAIS */

async function fasesDoJogo(){
    switch(stage) {
        case 1:
            limpaCanvas();
            carregarInimigos('./img/enemy1.png', 'red', InimigoNivel1, 10, 20);
            fase1Tela();
            break;
        case 2:
            limpaCanvas();
            carregarInimigos('./img/enemy2.png', 'red', InimigoNivel2, 10, 20);
            fase2Tela();
            break;
        case 3:
            limpaCanvas();
            carregarInimigos('./img/enemy3.png', 'red', InimigoNivel3, 4, 30);
            fase3Tela();
            break;
        case 4:
            limpaCanvas();
            carregarInimigos('./img/finalboss.png', 'green', bossFinal, 1, 1);
            fase4Tela();
            break;
        case 5:
            limpaCanvas();
            etapaGame = 'gamewin';
            etapasGame();
            break;
        case 0:
            limpaCanvas(); 
            etapaGame = 'gameover';
            etapasGame();
            break;
        default:
            break;
    }
}

async function fase1Tela(){
    writeMessage("FASE 1")
    await delay(5000)
    fase1()
}

function fase1() {
    
    let requestID = requestAnimationFrame(fase1)
    if (inimigos.length < 1) {
        stage = stage += 1;
        cancelAnimationFrame(requestID)
        fasesDoJogo()
        return 
    }

    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    jogador.update()

    for (let [indice, projetil] of projeteis.entries()) {
        
        if (projetilForaCanvas(projetil)) {
            projeteis.splice(indice,1)
        } 
        else {
            let inimigoAtingido = inimigos.find((inimigo) => objetoAtingido(inimigo, projetil))
    
            if (inimigoAtingido) {
                projeteis.splice(indice, 1)

                if (inimigoAtingido instanceof bossFinal) {
                    inimigoAtingido.atingido()
                    if (inimigoAtingido.vida < 1) {
                        inimigos.splice(inimigos.indexOf(inimigoAtingido), 1)
                    }
                } else {
                    inimigos.splice(inimigos.indexOf(inimigoAtingido), 1)
                }
            }
            else {
                projetil.update()
            }
        }
        
    }

    for (let [indice, projetilInimigo] of projeteisInimigos.entries()) {

        if (projetilForaCanvas(projetilInimigo)) {
            projeteisInimigos.splice(indice,1)
        } 

        else if (objetoAtingido(jogador, projetilInimigo)) {
            stage = 0;
            cancelAnimationFrame(requestID)
            fasesDoJogo()
            return
        } else {
            projetilInimigo.update()
        }
    }

    for (let inimigo of inimigos){
        if (navesColididas(jogador, inimigo)) {
                stage = 0;
                cancelAnimationFrame(requestID)
                fasesDoJogo()
                return
        } else {
            inimigo.update()
        }
    }    
    
    controlaNave();
}

async function fase2Tela(){
    writeMessage('Fase 1 Concluida')
    await delay(3000);
    writeMessage('Fase 2')
    await delay(3000);
    fase1()
}

async function fase3Tela(){
    writeMessage('Fase 2 Concluida')
    await delay(3000);
    writeMessage('Fase 3')
    await delay(3000);
    fase1()
}

async function fase4Tela(){
    writeMessage('Fase 3 Concluida')
    await delay(3000);
    writeMessage('Fase 4 Chefe final')
    await delay(3000);
    fase1()
}

async function telaInicial() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.textAlign = "center";
    context.font = "60px fantasy";
    context.fillStyle = "white";
    context.fillText("SPACE INVADERS JS", canvas.width/2, canvas.height/2);
    context.font = "30px fantasy";
    context.fillText("Pressione espaço para iniciar", canvas.width/2, canvas.height/2 + 60);
    while(!teclas.space.pressionado) {
        await delay(50);
    }

    etapaGame = 'jogo'
    stage = 1

    etapasGame();
}

async function fimDoJogo(condição){
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.textAlign = "center";
    context.font = "60px fantasy";
    context.fillStyle = "white";
    if (condição === 'lose') context.fillText("VOCE PERDEU", canvas.width/2, canvas.height/2);
    else context.fillText("VOCE VENCEU", canvas.width/2, canvas.height/2);
    context.font = "30px fantasy";
    context.fillText("Pressione espaço para reiniciar", canvas.width/2, canvas.height/2 + 60);
    while(!teclas.space.pressionado) {
        await delay(50);
    }

    etapaGame = 'jogo'
    stage = 1

    etapasGame();
}

function etapasGame(){
    switch(etapaGame){
        case 'inicio': 
            telaInicial();
            break;
        case 'jogo': 
            fasesDoJogo();
            break;
        case 'gameover': 
            fimDoJogo('lose');
            break;
        case 'gamewin': 
            fimDoJogo('win');
            break;
        default: break
    }
}

/* FUNÕES AUXILIARES */

function projetilForaCanvas (projetil) {
    return (projetil.posicao.x > canvas.width || projetil.posicao.x < 0 || projetil.posicao.y > canvas.height + projetil.raio || projetil.posicao.y < 0)
}

function objetoAtingido(objeto, projetil) {
    return (objeto.posicao.x < projetil.posicao.x - projetil.raio && objeto.posicao.x + objeto.largura > projetil.posicao.x 
            && objeto.posicao.y < projetil.posicao.y - projetil.raio && objeto.posicao.y + objeto.altura > projetil.posicao.y)
}

function navesColididas (nave1, nave2) {
    return (nave1.posicao.x + nave1.largura > nave2.posicao.x && nave1.posicao.x < nave2.posicao.x + nave2.largura
            && nave1.posicao.y < nave2.posicao.y + nave2.altura && nave1.posicao.y > nave2.posicao.y - nave2.altura)
}

function controlaNave() {
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

function writeMessage(msg) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "30px fantasy";
    context.fillText(msg, canvas.width/2, canvas.height/2);
}

function carregarInimigos(imgPath, corTiro, objInimigo, linhas, colunas) {

    for (let x = 1; x < colunas + 1; x++) {
        for (let y = 1; y < linhas + 1; y++) {
            inimigos.push(new objInimigo(imgPath, x * 30, y * 30, corTiro))
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function limpaCanvas() {
    projeteis = []
    projeteisInimigos = []
    inimigos = []
    jogador.resetarPosicao();
};

/* INICIO DO JOGO */

const jogador = new NavePrincipal();

stage = 1;

etapaGame = 'inicio';

etapasGame();