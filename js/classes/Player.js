class Player {
    constructor({
        collisionBlocks = []
    }) {
        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 50
        this.height = 50
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1

        this.collisionBlocks = collisionBlocks

    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.position.x += this.velocity.x
        // Verifica por colisões horizontais
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // se uma colisão existe
            if (this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                // colisão do x indo para a esquerda
                if (this.velocity.x < 0) {
                    this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01
                    break
                }
                if (this.velocity.x > 0) {
                    this.position.x = collisionBlock.position.x - this.width - 0.01
                    break
                }
            }
        }

        // aplica gravidade
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
        this.sides.bottom = this.position.y + this.height

        // verifica por colisões verticais
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // se uma colisão existe
            if (this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01
                    break
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    this.position.y = collisionBlock.position.y - this.height - 0.01
                    break
                }
            }
        }
    }

}