const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 //1024
canvas.height = 64 * 9 //576

let parsedCollisions
let CollisionBlocks
let background
let doors

const player = new Player({
    imageSrc: './img/B_witch_idleRight.png',
    frameRate: 6, // quantas sprites tem o jogador
    animations: {
        idleRight: { // parado para a direita
            frameRate: 6, //quantos sprites tem
            frameBuffer: 7, // velocidade de atualização dos sprites
            loop: true, // loop para não parar as imagens
            imageSrc: './img/B_witch_idleRight.png' //localização de onde está o sprite na pasta
        },
        idleLeft: {
            frameRate: 6,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_idleLeft.png'
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runRight.png'
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runLeft.png'
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 7,
            loop: false,
            imageSrc: './img/B_witch_enterDoor.png',
            onComplete: () => {
                console.log('animaçao completa')
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++

                        if(level === 3) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay,{
                            opacity: 0
                        })
                    }
                })
            }
        }
    }
})

let level = 1
let levels = {
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            if(player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-1.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 800,
                        y: 400
                    },
                    imageSrc: './img/Elevator Opening (46x56).png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false
                })
            ]
        }
    },
    2: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks
            player.position.x = 250
            player.position.y = 250

            if(player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/faseTeste.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 480,
                        y: 273
                    },
                    imageSrc: './img/Elevator Opening (46x56).png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false
                })
            ]
        }
    }
}







// teclas "w, a, d" são iniciadas como não pressionadas
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const overlay = {
    opacity: 0
}

function animate() {
    window.requestAnimationFrame(animate)

    background.draw()
    CollisionBlocks.forEach(CollisionBlock => {
        CollisionBlock.draw()
    })

    doors.forEach(door => {
        door.draw()
    })

    player.handleInput(keys)
    player.draw()
    player.update()


    // save() salva o estado atual do contexto (como cor de preenchimento, transparencia, transforamçoes, etc.) em uma pilha
    c.save() // salva o estado atual do contexto
    c.globalAlpha = overlay.opacity // torna tudo invisivel (transparencia total)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height) // preenche a tela de preto
    // restore() restaura o ultimo estado salvo do contexto removendo-o da pilha
    c.restore()
}

levels[level].init()
animate()

