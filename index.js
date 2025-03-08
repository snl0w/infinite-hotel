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
        idleRight:{
            frameRate: 6,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_idleRight.png'
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
        }
    }
})

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

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('runRight')
        player.velocity.x = 5
        player.lastDirection = 'right'
    } else if (keys.a.pressed) {
        player.switchSprite('runLeft')
        player.velocity.x = -5
        player.lastDirection = 'left'
    }
    else {
        if(player.lastDirection === 'left'){
            player.switchSprite('idleLeft')
        } else player.switchSprite('idleRight')
        
    }
    player.draw()
    player.update()


}
animate()

