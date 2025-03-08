const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 //1024
canvas.height = 64 * 9 //576

const parsedCollisions = collisionsLevel1.parse2D()
const CollisionBlocks = parsedCollisions.createObjectsFrom2D()

const backgroundLevel1 = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/faseTeste.png'
})

const player = new Player({
    collisionBlocks: CollisionBlocks,
    imageSrc: './img/B_witch_idleRight.png',
    frameRate: 6, // quantas sprites tem o jogador
    animations: {
        idleRight:{ // parado para a direita
            frameRate: 6, //quantos sprites tem
            frameBuffer: 7, // velocidade de atualização dos sprites
            loop: true, // loop para não parar as imagens
            imageSrc: './img/B_witch_idleRight.png' //localização de onde está o sprite na pasta
        },
        idleLeft:{
            frameRate: 6,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_idleLeft.png'
        },
        runRight:{
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runRight.png'
        },
        runLeft:{
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runLeft.png'
        },
        enterDoor:{
            frameRate: 8,
            frameBuffer: 7,
            loop: false,
            imageSrc: './img/B_witch_enterDoor.png'
        }
    }
})

const doors = [
    new Sprite({
        position:{
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


function animate() {
    window.requestAnimationFrame(animate)

    backgroundLevel1.draw()
    CollisionBlocks.forEach(CollisionBlock => {
        CollisionBlock.draw()
    })

    doors.forEach(door => {
        door.draw()
    })

    player.handleInput(keys)
    player.draw()
    player.update()


}
animate()

