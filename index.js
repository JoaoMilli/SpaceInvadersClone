/* CONFIGURAÇÃO DO CANVAS */

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

/* OBTENÇÃO DO TAMANHO DA TELA */
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/*------------------------------------*/

/* VARIÁVEIS GLOBAIS */
let stage;                      //Fase atual do jogo
let etapaGame                   //Etapa atual do jogo
let projeteis = []
let projeteisInimigos = []
let inimigos = []
let particulas = []

/* INSTÂNCIA DO INTERVALO DE DISPAROS DA NAVE DO JOGADOR */
let intervaloDisparos;


/* VARIÁVEL REPRESENTADO O ESTADO DAS TECLAS */
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


/* Event listeners, são ativadas ao pressionar as teclas, muda o estado das teclas a depender da tecla digitada */

window.addEventListener('keydown', (evento) => {
    switch (evento.key) {
        case 'a':
            teclas.a.pressionado = true
            break

        case 'A':
            teclas.a.pressionado = true
            break

        case 's':
            teclas.s.pressionado = true
            break

        case 'S':
            teclas.s.pressionado = true
            break

        case 'w':
            teclas.w.pressionado = true
            break

        case 'W':
        teclas.w.pressionado = true
        break

        case 'd':
            teclas.d.pressionado = true
            break

        case 'D':
            teclas.d.pressionado = true
            break

        case ' ':

        if (!teclas.space.pressionado){
            jogador.atirar()

            /* Ao manter pressionado o espaço, a nave do jogador irá atirar um projétil de meio em meio segundo */

            intervaloDisparos = setInterval(() => jogador.atirar(), 500);
        }
        teclas.space.pressionado = true
            
        break

        default:
            break
    }
})

/* Event listeners, são ativadas ao soltar as teclas, muda o estado das teclas a depender da tecla solta */

window.addEventListener('keyup', (evento) => {
    switch (evento.key) {
        case 'a':
            teclas.a.pressionado = false
            break

        case 'A':
            teclas.a.pressionado = false
            break


        case 's':
            teclas.s.pressionado = false
            break

        case 'S':
            teclas.s.pressionado = false
            break
    

        case 'w':
            teclas.w.pressionado = false
            break

        case 'W':
            teclas.w.pressionado = false
            break
    

        case 'd':
            teclas.d.pressionado = false
            break

        case 'D':
            teclas.d.pressionado = false
            break
    

        case ' ':

            /* Ao soltar o espaço, o intervalo de disparos é desativado e a nave para de atirar */

            clearInterval(intervaloDisparos)
            teclas.space.pressionado = false
            break

        default:
            break
    }
})

/*------------------------------------------*/


/* CLASSES */


/* Nave principal do jogador */

class NavePrincipal {
    constructor() {

        this.velocidade = {
            x: 0,
            y: 0
        }

        this.pontos = 0;

        this.imagem = new Image()

        this.imagem.src = './img/navePrincipal.png'
        
        this.imagem.onload = () => {

            const scale = 0.15
            this.largura = this.imagem.width * scale
            this.altura = this.imagem.height * scale

            /* Ao carregar a imagem da nave, seta sua posição para o centro do canvas */

            this.posicao = {
                x: canvas.width / 2 - (this.largura / 2),
                y: canvas.height - this.altura - 15
            }
        }
    }

    /* Reseta posição da nave para o centro do canvas */
    resetarPosicao() {
        this.posicao = {
            x: canvas.width / 2 - (this.largura / 2),
            y: canvas.height - this.altura - 15
        }
    }

    /* Atira um projétil */
    atirar() {
        projeteis.push(new Projetil(0, -10, 'blue', jogador.posicao.x + (jogador.largura / 2), jogador.posicao.y, 3))
    }


    /* Desenha a nave no canvas */
    desenhar() {

        context.drawImage(this.imagem, this.posicao.x, this.posicao.y,
            this.largura, this.altura ) 
    }


    /* Função a ser chamada a cada atualização de quadros, atualiza a posição da nave a depender da velocidade e redesenha a nave no canvas */
    update() {
        if(this.imagem && this.posicao){
            this.desenhar()
            this.posicao.x += this.velocidade.x
            this.posicao.y += this.velocidade.y
        }
    }
}


/* Classe representando inimigos, os métodos e atributos são semelhantes a Nave principal */
/* Construtor >  imageSrc: Path para a imagem da nave, posX e posY: posição x e y inicial da nave */

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

/* Classe representando inimigos do primeiro nível que herdam da classe Inimigo, os métodos e atributos são semelhantes a Nave principal */
/* Construtor >  imageSrc: Path para a imagem da nave, posX e posY: posição x e y inicial da nave, corProjetil: cor do projétil lançado pela nave */

class InimigoNivel1 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
    }


    /* Função chamada toda atualização de quadros, controla a velocidade do inimigo de forma que se movimente da esquerda para direita, indo de cima para baixo */
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

/* Classe representando inimigos do segundo nível que herdam da classe Inimigo, os métodos e atributos são semelhantes a Nave principal */
/* Construtor >  imageSrc: Path para a imagem da nave, posX e posY: posição x e y inicial da nave, corProjetil: cor do projétil lançado pela nave */

class InimigoNivel2 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
    }

    /* Função chamada toda atualização de quadros, controla a velocidade do inimigo de forma que se movimente da esquerda para direita, indo de cima para baixo */

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

            /* Em cada quadro, o inimigo tem a chance de atirar um projétil */
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

/* Classe representando inimigos do terceiro nível que herdam da classe Inimigo, os métodos e atributos são semelhantes a Nave principal */
/* Construtor >  imageSrc: Path para a imagem da nave, posX e posY: posição x e y inicial da nave, corProjetil: cor do projétil lançado pela nave */

class InimigoNivel3 extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
        this.velocidade.x = 2
    }

    /* Função chamada toda atualização de quadros, controla a velocidade do inimigo de forma que se movimente da esquerda para direita em diagonais
    triangulares, indo de cima para baixo */

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

    /* Este inimigo atira 3 projéteis simultâneos, um reto para baixo, e os outros dois nas duas diagonais para baixo */


    atirar() {
        projeteisInimigos.push(new Projetil(0, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(3, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(-3, 3, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
    }
}

/* Classe representando o chefe final que herda da classe Inimigo, os métodos e atributos são semelhantes a Nave principal */
/* Construtor >  imageSrc: Path para a imagem da nave, posX e posY: posição x e y inicial da nave, corProjetil: cor do projétil lançado pela nave */

class bossFinal extends Inimigo {
    constructor(imageSrc, posX, posY, corProjetil){
        super(imageSrc, posX, posY)
        this.corProjetil = corProjetil
        this.velocidade.x = 7

        /* Este intervalo irá executar de 5 em 5 segundos, definindo qual dos dois tipos de movimento o chefe terá, tendo 50% de chance de realizar cada */
        this.intervaloMovimentos = setInterval(() => {
            this.currentMov = Math.random() > 0.5 ? 1 : 2
        },5000)
    }

    /* Movimento atual do chefe, pode ser 1 ou 2 */
    currentMov = 1;

    /* Instância do intervalo para mudança de movimentos do chefe */
    intervaloMovimentos;

    /* Vida total do chefe */
    vida = 50;

    /* Ao ser atingido, sua vida é subtraída */
    atingido() {
        this.vida -= 1

        /* Ao morrer, o intervalo de alteração de movimentos é interrompido */
        if(this.vida < 1 && this.intervaloMovimentos) {
            clearInterval(this.intervaloMovimentos);
        }
    }

    /* Primeiro padrão de movimento, semelhante ao do inimigo do nível 3 */
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

    /* Segundo padrão de movimento, semelhante aos dos inimigo dos níveis 1 e 2 */
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


    /* O chefe tem 3 tipos de disparos, e tem a chance de executar cada um em cada quadro*/
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

    /* Disparo com 3 projéteis frontais */

    atirar1() {
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2) + 20, this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, 5, this.corProjetil, this.posicao.x + (this.largura / 2) -20, this.posicao.y, 3))
    }

    /* Disparo com 3 projéteis traseiros */

    atirar2() {
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2) + 20, this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y, 3))
        projeteisInimigos.push(new Projetil(0, -5, this.corProjetil, this.posicao.x + (this.largura / 2) -20, this.posicao.y, 3))
    }

    /* Disparo com 2 projéteis laterais, um de cada lado */

    atirar3() {
        projeteisInimigos.push(new Projetil(5, 0, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y + (this.altura / 2), 3))
        projeteisInimigos.push(new Projetil(-5, 0, this.corProjetil, this.posicao.x + (this.largura / 2), this.posicao.y + (this.altura / 2), 3))
    }
}

/* Classe representando o projétil */
/* Construtor >  velocidadeX e velocidadeY: velocidades x e y inicial do projétil, posicaoX e posicaoY: posição x e y inicial do projétil, 
    cor: cor do projétil, raio: raio do projétil*/

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

/* Classe representando a partícula */
/* Construtor >  velocidadeX e velocidadeY: velocidades x e y inicial da partícula, posicaoX e posicaoY: posição x e y inicial da partícula, 
    cor: cor da partícula, raio: raio da partícula, estrela: define se a partícula é estrela, nesse caso era não irá desaparecer no canvas com o passar do tempo*/

class Particula {
    constructor(velocidadeX, velocidadeY, posicaoX, posicaoY, raio, estrela, cor){
        this.velocidade = {
            x: velocidadeX,
            y: velocidadeY
        }
        this.estrela = estrela
        this.raio = raio
        this.posicao = {
            x: posicaoX,
            y: posicaoY
        }
        this.raio = raio
        this.cor = cor 
        this.opacidade = 1;
    }

    desenhar() {
        context.save()
        context.globalAlpha = this.opacidade
        context.beginPath()
        context.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI * 2)
        context.fillStyle = this.cor
        context.fill()
        context.closePath()
        context.restore()
    }

    update() {
        this.desenhar()
        this.posicao.x += this.velocidade.x
        this.posicao.y += this.velocidade.y

        /* Se não for estrela, diminui a opacidade a cada frame, até chegar em 0 e a partícula desaparecer */

        if (this.opacidade > 0 && !this.estrela) this.opacidade -= 0.01
    }
}

/* FUNÇÕES PRINCIPAIS */

/* Função que carrega cada fase de acordo com a variável global stage, para cada caso o canvas é limpado, os inimigos são carregados e a mensagem
de cada fase é exibida, a depender da fase, o jogador é premiado com pontos*/

async function fasesDoJogo(){
    switch(stage) {
        case 1:
            limpaCanvas();
            carregarInimigos('./img/enemy1.png', 'red', InimigoNivel1, 10, 20);
            fase1Tela();
            break;
        case 2:
            jogador.pontos += 50;
            limpaCanvas();
            carregarInimigos('./img/enemy2.png', 'yellow', InimigoNivel2, 10, 20);
            fase2Tela();
            break;
        case 3:
            jogador.pontos += 150;
            limpaCanvas();
            carregarInimigos('./img/enemy3.png', 'red', InimigoNivel3, 4, 30);
            fase3Tela();
            break;
        case 4:
            jogador.pontos += 300
            limpaCanvas();
            carregarInimigos('./img/finalboss.png', 'green', bossFinal, 1, 1);
            fase4Tela();
            break;
        case 5:
            jogador.pontos += 1000;
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

/* Telas iniciais de cada fase, simplesmente escrevem mensagens na tela antes de iniciar cada fase*/

async function fase1Tela(){
    writeMessage("FASE 1")
    await delay(5000)
    fase()
}

async function fase2Tela(){
    writeMessage('Fase 1 Concluida')
    await delay(3000);
    writeMessage('Fase 2')
    await delay(3000);
    fase()
}

async function fase3Tela(){
    writeMessage('Fase 2 Concluida')
    await delay(3000);
    writeMessage('Fase 3')
    await delay(3000);
    fase()
}

async function fase4Tela(){
    writeMessage('Fase 3 Concluida')
    await delay(3000);
    writeMessage('Fase 4 Chefe final')
    await delay(3000);
    fase()
}

/* Função que irá atualizar todo o estado da fase, sendo chamada recursivamente a cada frame */

function fase() {
    
    /* Cria a recursão, para chamar continuamente essa função */

    let requestID = requestAnimationFrame(fase)

    /* Ao acabar todos os inimigos, a variável global que representa o estágio é atualizada, a recursão é interrompida e retorna para a função fasesDoJogo */
    if (inimigos.length < 1) {
        stage = stage += 1;
        cancelAnimationFrame(requestID)
        fasesDoJogo()
        return 
    }


    /* Desenha o fundo do canvas, mostrando a posição do jogador */
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'white'
    context.textAlign = 'start';
    context.fillText(`Pontos: ${jogador.pontos}` , 20, 50);


    /* Mostra a vida do chefe caso esteja na fase final */
    if(stage === 4) {
        context.textAlign = 'end';
        context.fillText(`Vida Boss: ${inimigos[0].vida}` , canvas.width - 20, 50);
    }

    /* Atualiza a nave do jogador */
    jogador.update()

    /* Atualiza as partículas, caso as estrelas estejam fora do canvas, elas são recolocadas */
    particulas.forEach(particula => {
        if (particula.opacidade <= 0) particulas.splice(particulas.indexOf(particula),1)
        else if (particula.posicao.y - particula.raio > canvas.height ){
            particula.posicao.x = Math.random() * canvas.width
            particula.posicao.y = Math.random() * canvas.height
        }
        else particula.update();
    })

    /* Atualiza os projéteis */
    for (let [indice, projetil] of projeteis.entries()) {
        
        /* Remove projeteis fora do canvas */
        if (projetilForaCanvas(projetil)) {
            projeteis.splice(indice,1)
        } 
        else {

            /* Verifica se algum inimigo foi atingido, em caso positivo, remove o inimigo do array de inimigos e o projetil que acertou
                do array de projeteis*/

            let inimigoAtingido = inimigos.find((inimigo) => objetoAtingido(inimigo, projetil))
    
            if (inimigoAtingido) {
                projeteis.splice(indice, 1)

                /* Cria efeito de partículas ao atingir um inimigo */
                for (let i = 0; i < 3; i++){
                    particulas.push(new Particula((Math.random() - 0.5)*2, (Math.random() - 0.5)*2,inimigoAtingido.posicao.x, inimigoAtingido.posicao.y, Math.random()*2,false,inimigoAtingido.corProjetil))
                }

                if (inimigoAtingido instanceof bossFinal) {
                    inimigoAtingido.atingido()
                    if (inimigoAtingido.vida < 1) {
                        inimigos.splice(inimigos.indexOf(inimigoAtingido), 1)
                    }
                } else {
                    inimigos.splice(inimigos.indexOf(inimigoAtingido), 1)

                    switch( inimigoAtingido.constructor.name ) {
                        case 'InimigoNivel1': 
                            jogador.pontos += 1
                            break;
                        case 'InimigoNivel2': 
                            jogador.pontos += 2
                            break;
                        case 'InimigoNivel3': 
                            jogador.pontos += 3
                            break;
                        default:
                            break
                    }
                }
            }
            else {
                projetil.update()
            }
        }
        
    }

    /* Verifica se algum projetil inimigo atingiu a nave do jogador, em caso positivo, o jogo é encerrado */

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

    /* Verifica se a nave do jogador colidiu com uma nave inimiga, em caso positivo o jogo acaba, verifica se um inimigo atravessou o canvas,
        nesse caso o jogador é penalizado perdendo pontos */

    for (let inimigo of inimigos){
        if (navesColididas(jogador, inimigo)) {
                stage = 0;
                cancelAnimationFrame(requestID)
                fasesDoJogo()
                return
        } else if (inimigo.posicao.y - inimigo.altura > canvas.height ) {
            inimigos.splice(inimigos.indexOf(inimigo), 1)
            jogador.pontos -= 1
        } else {
            inimigo.update()
        }
    }    
    
    /* Verifica o estado dos botões para atualizar a nave */

    controlaNave();
}


/* Imprime tela inicial do jogo */

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


/* Imprime tela final do jogo, imprimindo a mensagem a depender se o jogador ganhou ou perdeu,
    reseta os pontos do jogador e volta para o inicio*/

async function fimDoJogo(condição){
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.textAlign = "center";
    context.font = "60px fantasy";
    context.fillStyle = "white";
    if (condição === 'lose') context.fillText("VOCE PERDEU", canvas.width/2, canvas.height/2);
    else context.fillText("VOCE VENCEU", canvas.width/2, canvas.height/2);
    context.font = "30px fantasy";

    context.fillText(`Pontuação: ${jogador.pontos}`, canvas.width/2, canvas.height/2 + 60);
    context.fillText("Pressione espaço para reiniciar", canvas.width/2, canvas.height/2 + 120);
    while(!teclas.space.pressionado) {
        await delay(50);
    }

    if(jogador){
        jogador.pontos = 0
    }

    etapaGame = 'jogo'
    stage = 1

    etapasGame();
}

/* Acessa os estados do jogo a depender da variavel global etapaGame*/

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

/* Verifica se um projetil esta fora do canvas */

function projetilForaCanvas (projetil) {
    return (projetil.posicao.x > canvas.width || projetil.posicao.x < 0 || projetil.posicao.y > canvas.height + projetil.raio || projetil.posicao.y < 0)
}

/* Verifica se uma entidade foi atingida por um projetil */

function objetoAtingido(objeto, projetil) {
    return (objeto.posicao.x < projetil.posicao.x - projetil.raio && objeto.posicao.x + objeto.largura > projetil.posicao.x 
            && objeto.posicao.y < projetil.posicao.y - projetil.raio && objeto.posicao.y + objeto.altura > projetil.posicao.y)
}

/* Verifica se duas naves colidiram */

function navesColididas (nave1, nave2) {
    return (nave1.posicao.x + nave1.largura > nave2.posicao.x && nave1.posicao.x < nave2.posicao.x + nave2.largura
            && nave1.posicao.y < nave2.posicao.y + nave2.altura && nave1.posicao.y > nave2.posicao.y - nave2.altura)
}

/* Atualiza a velocidade da nave do jogador a depender do estados dos botões de input */

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

/* Escreve uma mensagem no centro do canvas */

function writeMessage(msg) {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "30px fantasy";
    context.fillText(msg, canvas.width/2, canvas.height/2);
}

/* Carrega inimigos no vetor de inimigos */

function carregarInimigos(imgPath, corTiro, objInimigo, linhas, colunas) {

    for (let x = 1; x < colunas + 1; x++) {
        for (let y = 1; y < linhas + 1; y++) {
            inimigos.push(new objInimigo(imgPath, x * 30, y * 30, corTiro))
        }
    }
}

/* Função que simula um delay na aplicação */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Limpa o canvas, zerando os vetores de projeteis e inimigos, assim como a posicao do jogador */

function limpaCanvas() {
    projeteis = []
    projeteisInimigos = []
    inimigos = []
    jogador.resetarPosicao();
};

/* INICIO DO JOGO */


/* Instancia a nave do jogador */
const jogador = new NavePrincipal();

/* Carrega as estrelas no ceu */
for (let i = 0; i < 100; i++){
    particulas.push(new Particula(0,1, canvas.width * Math.random(), canvas.height * Math.random(), Math.random()*3, true, 'white'))
}

/* Inicia o jogo  */

etapaGame = 'inicio';

etapasGame();