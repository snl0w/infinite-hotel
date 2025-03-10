/*class Enemy extends Sprite {
    constructor({ position, imageSrc, frameRate, animations, speed = 2, health = 3 }) {
        super({ position, imageSrc, frameRate, animations })

        this.velocity = {
            x: speed,
            y: 0
        };
        this.health = health
        this.alive = true
    }

    update() {
        if (!this.alive) return

        this.position.x += this.velocity.x

        // Simples IA para mudar de direção se atingir os limites da tela
        if (this.position.x < 50 || this.position.x > 600) {
            this.velocity.x *= -1
        }

        

        this.updateHitbox()
    }

    takeDamage() {
        this.health--

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false
        console.log("Inimigo derrotado!")
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 50,
            height: 50
        }
    }
}*/
