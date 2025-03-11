class FloatingSword extends Sprite {
    constructor({ player, imageSrc, frameRate = 1, frameBuffer = 7 }) {
        super({ 
            position: { x: player.position.x, y: player.position.y }, 
            imageSrc, 
            frameRate, 
            frameBuffer 
        })

        this.player = player
        this.offsetRight = { x: -35, y: -20 }
        this.offsetLeft = { x: 35, y: -20 }
        this.floatSpeed = 0.003 // flutuaçao vertical
        this.horizontalFloatSpeed = 0.002 // flutuaçao horizontal

        this.isAttacking = false // estado de ataque
        this.attackTarget = null // posiçao do ataque
        this.returning = false // se está voltando para o jogador
        this.attackSpeed = 8 // velocidade da espada ao atacar
        this.cooldown = false // controle de cooldown

        // controle de rotaçao
        this.rotation = 0 // Valor inicial da rotaçao
        this.rotationSpeed = 15 // Velocidade de rotaçao ao ser arremessada
    }

    update() {
        if (this.isAttacking) {
            this.moveToTarget()
        } else {
            this.floatAroundPlayer()
        }
        this.draw()
    }

    floatAroundPlayer() {
        if (!this.isAttacking) {
            // determina a direçao da flutuaçao com base na direçao do jogador
            const offset = this.player.lastDirection === "left" ? this.offsetLeft : this.offsetRight

            // movimento horizontal adicionado (oscilaçao)
            this.position.x = this.player.position.x + offset.x + Math.sin(performance.now() * this.horizontalFloatSpeed) * 15 // Aumenta o valor 15 para mais amplitude

            // movimento vertical (já existe)
            this.position.y = this.player.position.y + offset.y + Math.sin(performance.now() * this.floatSpeed) * 5
        }
    }

    attack(targetX, targetY) {
        if (this.isAttacking || this.cooldown) return

        this.isAttacking = true
        this.attackTarget = { x: targetX, y: targetY }
        this.returning = false
        this.rotation = 0 // reseta a rotaçao quando começa o ataque
    }

    moveToTarget() {
        if (!this.attackTarget) return

        const dx = this.attackTarget.x - this.position.x
        const dy = this.attackTarget.y - this.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 5 && !this.returning) {
            // move em direçao ao alvo
            this.position.x += (dx / distance) * this.attackSpeed
            this.position.y += (dy / distance) * this.attackSpeed

            // a espada gira enquanto se move
            this.rotation += this.rotationSpeed // incrementa a rotaçao
        } else {
            // começa a retornar para o jogador
            this.returning = true
            this.attackTarget = { x: this.player.position.x, y: this.player.position.y }
        }

        // se ja voltou, termina o ataque
        if (this.returning) {
            const dxReturn = this.attackTarget.x - this.position.x
            const dyReturn = this.attackTarget.y - this.position.y
            const returnDistance = Math.sqrt(dxReturn * dxReturn + dyReturn * dyReturn)

            if (returnDistance > 5) {
                this.position.x += (dxReturn / returnDistance) * this.attackSpeed
                this.position.y += (dyReturn / returnDistance) * this.attackSpeed
            } else {
                this.isAttacking = false
                this.returning = false
                this.cooldown = true

                this.rotation = 0

                // reseta apos o cooldown
                setTimeout(() => {
                    this.cooldown = false
                }, 500)
            }
        }
    }
}
