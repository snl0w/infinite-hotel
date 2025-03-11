class FloatingWeapon extends Sprite {
    constructor({ player, offset, imageSrc, frameRate = 1, frameBuffer = 7 }) {
        super({ position: { x: player.position.x + offset.x, y: player.position.y + offset.y }, imageSrc, frameRate, frameBuffer });

        this.player = player; // Referência ao jogador para seguir
        this.offset = offset; // Distância em relação ao jogador
        this.attacking = false; // Estado de ataque
        this.attackSpeed = 10; // Velocidade do ataque
        this.originalPosition = { ...this.position }; // Guarda a posição inicial para voltar após o ataque
    }

    update() {
        if (!this.attacking) {
            // Se não estiver atacando, segue o jogador suavemente
            this.position.x += (this.player.position.x + this.offset.x - this.position.x) * 0.1;
            this.position.y += (this.player.position.y + this.offset.y - this.position.y) * 0.1;
        }
    }

    attack(target) {
        if (this.attacking) return; // Impede ataques múltiplos simultâneos
        this.attacking = true;

        const attackInterval = setInterval(() => {
            // Move a espada em direção ao inimigo
            this.position.x += (target.position.x - this.position.x) * 0.2;
            this.position.y += (target.position.y - this.position.y) * 0.2;

            const distance = Math.hypot(this.position.x - target.position.x, this.position.y - target.position.y);
            if (distance < 5) { // Se estiver perto o suficiente, atinge o inimigo
                clearInterval(attackInterval);
                this.returnToPlayer();
            }
        }, 16); // Aproximadamente 60 FPS
    }

    returnToPlayer() {
        const returnInterval = setInterval(() => {
            this.position.x += (this.originalPosition.x - this.position.x) * 0.2;
            this.position.y += (this.originalPosition.y - this.position.y) * 0.2;

            const distance = Math.hypot(this.position.x - this.originalPosition.x, this.position.y - this.originalPosition.y);
            if (distance < 5) {
                clearInterval(returnInterval);
                this.attacking = false;
            }
        }, 16);
    }
}