const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 //1024
canvas.height = 64 * 9 //576

// Variável para controlar se o jogo começou
let gameStarted = false;

// Elementos do menu
const gameMenu = document.getElementById('gameMenu');
const playButton = document.getElementById('playButton');

// Evento para iniciar o jogo
playButton.addEventListener('click', () => {
    gameMenu.style.display = 'none';
    gameStarted = true;
    
    // Inicia o jogo se não estiver rodando
    if (!window.animationRunning) {
        window.animationRunning = true;
        levels[level].init();
        animate();
        
        // Toca o áudio do jogo
        if (!clicked) {
            audio.Map.play();
            clicked = true;
        }
    }
});

let parsedCollisions
let CollisionBlocks
let background
let doors
let enemies = [];

let isDialogActive = false;
const dialogBox = {
    x: 50,
    y: canvas.height - 150,
    width: canvas.width - 100,
    height: 150,
    text: "Boa noite! Vejo que carrega uma bela espada magica, poderia me ajudar a expulsar umas criaturas que atormentam o meu hotel? Nao precisa matar todos >:3 Como recompensa eu te darei uma hospedagem gratis!",
    padding: 20
};


const keyW2 = new Sprite({
    position: {
        x: 830,
        y: 350
    },
    imageSrc: './img/W tecla.png',
    frameRate: 3,
    frameBuffer: 10,
    loop: true
})

const keyW = new Sprite({
    position: {
        x: 150,
        y: 400
    },
    imageSrc: './img/W tecla.png',
    frameRate: 3,
    frameBuffer: 10,
    loop: true
})

const keyA = new Sprite({
    position: {
        x: 100,
        y: 450
    },
    imageSrc: './img/A tecla.png',
    frameRate: 3,
    frameBuffer: 10,
    loop: true
})

const keyD = new Sprite({
    position: {
        x: 200,
        y: 450
    },
    imageSrc: './img/D tecla.png',
    frameRate: 3,
    frameBuffer: 10,
    loop: true
})

const mouseTutorial = new Sprite({
    position: {
        x: 500,
        y: 350
    },
    imageSrc: './img/Mouse.png',
    frameRate: 3,
    frameBuffer: 15,
    loop: true
})

const npc = new Sprite({
    position: {
        x: 435,
        y: 415
    },
    imageSrc: './img/Meow-Knight_Idle.png',
    frameRate: 6,
    frameBuffer: 5,
    loop: true,
    width: 50,  // Largura da hitbox
    height: 80  // Altura da hitbox
})

function checkCollision(player, npc) {
    return (
        player.position.x < npc.position.x + npc.width &&
        player.position.x + player.width > npc.position.x &&
        player.position.y < npc.position.y + npc.height &&
        player.position.y + player.height > npc.position.y
    )
}

function drawDialogBox() {
    // Fundo da caixa de diálogo
    c.fillStyle = 'rgba(0, 0, 0, 0.7)';
    c.fillRect(dialogBox.x, dialogBox.y, dialogBox.width, dialogBox.height);
    
    // Borda da caixa
    c.strokeStyle = 'white';
    c.lineWidth = 2;
    c.strokeRect(dialogBox.x, dialogBox.y, dialogBox.width, dialogBox.height);
    
    // Texto da caixa de diálogo
    c.fillStyle = 'white';
    c.font = '20px "Press Start 2P"';
    wrapText(dialogBox.text, dialogBox.x + dialogBox.padding, dialogBox.y + dialogBox.padding + 20, dialogBox.width - 2*dialogBox.padding, 24);
}

// Função auxiliar para quebrar texto em várias linhas
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = c.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            c.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    c.fillText(line, x, y);
}



const player = new Player({
    imageSrc: './img/B_witch_idleRight_SemContorno.png',
    frameRate: 6, // quantas sprites tem o jogador
    animations: {
        idleRight: { // parado para a direita
            frameRate: 6, //quantos sprites tem
            frameBuffer: 7, // velocidade de atualização dos sprites
            loop: true, // loop para não parar as imagens
            imageSrc: './img/B_witch_idleRight_SemContorno.png' //localização de onde está o sprite na pasta
        },
        idleLeft: {
            frameRate: 6,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_idleLeft_SemContorno.png'
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runRight_SemContorno.png'
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 7,
            loop: true,
            imageSrc: './img/B_witch_runLeft_SemContorno.png'
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 7,
            loop: false,
            imageSrc: './img/B_witch_enterDoor_SemContorno.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++

                        if (level === 14) level = 1 // volta para o level 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    }
                })
            }
        }
    }
})

const sword = new FloatingSword({
    player,
    imageSrc: './img/Espada.png',
})

let level = 2
let levels = {
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            if (player.currentAnimation)
                player.currentAnimation.isActive = false


            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-1.png'
            })

            player.position.x = 140
            player.position.y = 410


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
            //enemy.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 800, y: 310 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 200, y: 310 },
                imageSrc: './img/Esqueleto2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 495
            player.position.y = 390

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-2.png'
            })



            doors = [
                new Sprite({
                    position: {
                        x: 476,
                        y: 145
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
    3: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 500, y: 220 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 350, y: 500 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 700, y: 200 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 100
            player.position.y = 100

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-3.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 850,
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
    4: {
        init: () => {
            parsedCollisions = collisionsLevel4.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 320, y: 220 },
                imageSrc: './img/Esqueleto2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 580, y: 220 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 830, y: 220 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));


            player.position.x = 520
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-4.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 100,
                        y: 80
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
    5: {
        init: () => {
            parsedCollisions = collisionsLevel5.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 290, y: 250 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 690, y: 250 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 480, y: 150 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 865
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-5.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 80,
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
    6: {
        init: () => {
            parsedCollisions = collisionsLevel6.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 390, y: 250 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 600, y: 100 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 865
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-6.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 100,
                        y: 80
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
    7: {
        init: () => {
            parsedCollisions = collisionsLevel7.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 390, y: 250 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 460, y: 250 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 530, y: 250 },
                imageSrc: './img/Esqueleto2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 590, y: 250 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 100
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-7.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 600,
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
    8: {
        init: () => {
            parsedCollisions = collisionsLevel8.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 590, y: 150 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 300, y: 500 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 600, y: 500 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 100
            player.position.y = 100

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-8.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 840,
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
    9: {
        init: () => {
            parsedCollisions = collisionsLevel9.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 490, y: 310 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 690, y: 310 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 250, y: 310 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 100
            player.position.y = 100

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-9.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 850,
                        y: 80
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
    10: {
        init: () => {
            parsedCollisions = collisionsLevel10.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = CollisionBlocks

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 700, y: 310 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 250, y: 310 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 700, y: 400 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 250, y: 400 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.position.x = 500
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-10.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 760,
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
    11: {
        init: () => {
            parsedCollisions = collisionsLevel11.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 700, y: 100 },
                imageSrc: './img/Fantasma2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 400, y: 100 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 130, y: 100 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.collisionBlocks = CollisionBlocks
            player.position.x = 100
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-11.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 830,
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
    12: {
        init: () => {
            parsedCollisions = collisionsLevel12.parse2D()
            CollisionBlocks = parsedCollisions.createObjectsFrom2D()

            // Resetar inimigos
            enemies = [];

            // Adicionar inimigo
            enemies.push(new Enemy({
                position: { x: 100, y: 100 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 300, y: 200 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 490, y: 200 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Esqueleto2.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 670, y: 200 },
                imageSrc: './img/Enemy.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            enemies.push(new Enemy({
                position: { x: 870, y: 400 },
                imageSrc: './img/Esqueleto2.png',
                frameRate: 7,
                frameBuffer: 15,
                animations: {
                    idle: {
                        imageSrc: './img/Enemy.png',
                        frameRate: 7,
                        frameBuffer: 8,
                        loop: true
                    }
                },
                loop: true,
                collisionBlocks: CollisionBlocks
            }));

            player.collisionBlocks = CollisionBlocks
            player.position.x = 100
            player.position.y = 400

            if (player.currentAnimation)
                player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Level-12.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 830,
                        y: 80
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
    13: {
        init: () => {
            
            enemies = [];

            player.position.x = 9999
            player.position.y = 9999

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Tela final.png'
            })

            doors = [
                new Sprite({
                    position: {
                        x: 9999,
                        y: 9999
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
    window.requestAnimationFrame(animate);
    
    // Limpa o frame anterior
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Função de colisão (mantida dentro do animate pois usa variáveis locais)
    function checkPlayerEnemyCollisions() {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue; // Ignora inimigos mortos
            
            if (
                player.hitbox.position.x + player.hitbox.width >= enemy.hitbox.position.x &&
                player.hitbox.position.x <= enemy.hitbox.position.x + enemy.hitbox.width &&
                player.hitbox.position.y + player.hitbox.height >= enemy.hitbox.position.y &&
                player.hitbox.position.y <= enemy.hitbox.position.y + enemy.hitbox.height
            ) {
                player.die();
                break;
            }
        }
    }

    // Função para verificar colisão com NPC
    function checkNPCInteraction() {
        if (level === 1) { // Só verifica no nível 1 onde o NPC existe
            if (
                player.hitbox.position.x + player.hitbox.width >= npc.position.x &&
                player.hitbox.position.x <= npc.position.x + npc.width &&
                player.hitbox.position.y + player.hitbox.height >= npc.position.y &&
                player.hitbox.position.y <= npc.position.y + npc.height
            ) {
                isDialogActive = true;
            } else {
                // Opcional: desativar diálogo quando o jogador sair
                isDialogActive = false;
            }
        }
    }

    // Desenha cenário
    background.draw();
    
    // Desenha blocos de colisão (se necessário para debug)
    CollisionBlocks.forEach(CollisionBlock => {
        CollisionBlock.draw();
    });

    // Desenha portas
    doors.forEach(door => {
        door.draw();
    });

    // Elementos específicos de nível
    if (level === 1) {
        npc.draw();
        keyW.draw();
        keyW2.draw();
        keyA.draw();
        keyD.draw();
    }

    if (level === 2) {
        mouseTutorial.draw();
    }

    // Lógica do jogador
    player.handleInput(keys);
    player.update();
    player.draw();

    // Sistema de combate
    sword.update();

    // Inimigos
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            enemy.update();
            enemy.checkSwordCollision(sword);
        }
    });

    // Verificação de colisões (agora depois de atualizar todas as posições)
    checkPlayerEnemyCollisions();
    checkNPCInteraction(); // Adicionada a verificação de interação com NPC

    // Desenha caixa de diálogo se ativa
    if (isDialogActive) {
        drawDialogBox();
    }

    // Overlay (para transições)
    c.save();
    c.globalAlpha = overlay.opacity;
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
}

levels[level].init()
animate()

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})