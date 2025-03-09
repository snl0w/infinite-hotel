class Player extends Sprite {
    constructor({
        collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
        super({ imageSrc, frameRate, animations, loop })
        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1

        this.collisionBlocks = collisionBlocks

    }

    update() {
        this.position.x += this.velocity.x

        this.updateHitbox()

        this.checkForHorizontalCollisions()
        this.applayGravity()

        this.updateHitbox()

        //c.fillRect(
        //    this.hitbox.position.x, 
        //    this.hitbox.position.y, 
        //    this.hitbox.width, 
        //    this.hitbox.height
        //)
        this.checkForVerticalCollisions()
    }

    handleInput(keys) {
        if (this.preventInput) return
        this.velocity.x = 0
        if (keys.d.pressed) {
            this.switchSprite('runRight')
            this.velocity.x = 5
            this.lastDirection = 'right'
        } else if (keys.a.pressed) {
            this.switchSprite('runLeft')
            this.velocity.x = -5
            this.lastDirection = 'left'
        }
        else {
            if (this.lastDirection === 'left') {
                this.switchSprite('idleLeft')
            } else this.switchSprite('idleRight')

        }
    }

    // metodo para trocar de sprite quando o jogador se movimentar para esquerda e direita
    switchSprite(name) { // name vai pegar o nome da imagem que estamos usando no momento
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0 // isso evita que o código quebre caso o jogador mude de direção sem ter passado por todos os sprites associados ao seu movimento
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]

    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 6,
                y: this.position.y + 30
            },
            width: 50,
            height: 51
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // se uma colisão existe
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                // colisão do x indo para a esquerda
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
            }
        }
    }

    applayGravity() {
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // se uma colisão existe
            if (
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {

                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset =
                        this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }
            }
        }
    }

    attack() {
        if (this.currentAnimation?.name === 'attackRight' || this.currentAnimation?.name === 'attackLeft') {
            return // Se já estiver atacando, não interrompe a animação
        }

        this.preventInput = true; // Impede o movimento enquanto ataca

        if (this.lastDirection === 'right') {
            this.switchSprite('attackRight')
        } else {
            this.switchSprite('attackLeft')
        }

        let attackHitbox = {
            position: {
                x: this.lastDirection === 'right' ? this.position.x + 50 : this.position.x - 50,
                y: this.position.y
            },
            width: 40,
            height: 40
        }

        if (this.lastDirection === 'right') {
            this.switchSprite('attackRight')
        } else {
            this.switchSprite('attackLeft')
        }

        // Checa se o ataque atingiu algum inimigo
        enemies.forEach(enemy => {
            if (
                attackHitbox.position.x < enemy.hitbox.position.x + enemy.hitbox.width &&
                attackHitbox.position.x + attackHitbox.width > enemy.hitbox.position.x &&
                attackHitbox.position.y < enemy.hitbox.position.y + enemy.hitbox.height &&
                attackHitbox.position.y + attackHitbox.height > enemy.hitbox.position.y
            ) {
                enemy.takeDamage()
            }
        })

        // Após a animação terminar, volta para idle e permite input novamente
        this.currentAnimation.onComplete = () => {
            this.preventInput = false
            this.switchSprite(this.lastDirection === 'right' ? 'idleRight' : 'idleLeft')
        }

    }

}