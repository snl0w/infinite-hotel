class FloatingSword extends Sprite {
    constructor({ player, imageSrc, frameRate = 1, frameBuffer = 7, enemies = [] }) {
        super({
            position: { x: player.position.x, y: player.position.y },
            imageSrc,
            frameRate,
            frameBuffer
        });

        this.player = player;
        this.enemies = enemies;

        this.offsetRight = { x: -35, y: -20 };
        this.offsetLeft = { x: 35, y: -20 };
        this.floatSpeed = 0.003;
        this.horizontalFloatSpeed = 0.002;

        this.isAttacking = false;
        this.isActive = false; // Estado principal de atividade
        this.attackTarget = null;
        this.returning = false;
        this.attackSpeed = 8;
        this.cooldown = false;

        this.rotation = 0;
        this.rotationSpeed = 15;

        // Hitbox mais precisa
        this.hitbox = {
            position: { x: 0, y: 0 },
            width: 20,
            height: 40,
        };
    }

    update() {
        if (this.isAttacking) {
            this.moveToTarget();
        } else {
            this.floatAroundPlayer();
        }

        // Atualiza hitbox baseado na direção
        const offsetX = this.player.lastDirection === "left" ? -10 : 10;
        this.hitbox.position.x = this.position.x + offsetX;
        this.hitbox.position.y = this.position.y + 5;

        // Garante que está ativa durante o ataque
        this.isActive = this.isAttacking;

        this.draw()
    }

    floatAroundPlayer() {
        const offset = this.player.lastDirection === "left" ? this.offsetLeft : this.offsetRight;
        this.position.x = this.player.position.x + offset.x + Math.sin(performance.now() * this.horizontalFloatSpeed) * 15;
        this.position.y = this.player.position.y + offset.y + Math.sin(performance.now() * this.floatSpeed) * 5;
    }

    attack(targetX, targetY) {
        if (this.cooldown) return;

        this.isAttacking = true;
        this.isActive = true;
        this.attackTarget = { x: targetX, y: targetY };
        this.returning = false;
        this.rotation = 0;
    }

    moveToTarget() {
        if (!this.attackTarget) return;

        const dx = this.attackTarget.x - this.position.x;
        const dy = this.attackTarget.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5 && !this.returning) {
            this.position.x += (dx / distance) * this.attackSpeed;
            this.position.y += (dy / distance) * this.attackSpeed;
            this.rotation += this.rotationSpeed;

            this.checkEnemyCollision();
        } else {
            this.returning = true;
            this.attackTarget = { 
                x: this.player.position.x + (this.player.lastDirection === "left" ? this.offsetLeft.x : this.offsetRight.x),
                y: this.player.position.y + (this.player.lastDirection === "left" ? this.offsetLeft.y : this.offsetRight.y)
            };
        }

        if (this.returning) {
            const dxReturn = this.attackTarget.x - this.position.x;
            const dyReturn = this.attackTarget.y - this.position.y;
            const returnDistance = Math.sqrt(dxReturn * dxReturn + dyReturn * dyReturn);

            if (returnDistance > 5) {
                this.position.x += (dxReturn / returnDistance) * (this.attackSpeed * 0.8);
                this.position.y += (dyReturn / returnDistance) * (this.attackSpeed * 0.8);
            } else {
                this.resetSword();
            }
        }
    }

    resetSword() {
        this.isAttacking = false;
        this.isActive = false;
        this.returning = false;
        this.cooldown = true;
        this.rotation = 0;

        setTimeout(() => {
            this.cooldown = false;
        }, 500);
    }

    checkEnemyCollision() {
        if (!this.isActive) return;

        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;

            if (this.checkHitboxCollision(enemy)) {
                enemy.die();
                this.returning = true;
                break;
            }
        }
    }

    checkHitboxCollision(enemy) {
        return (
            this.hitbox.position.x < enemy.hitbox.position.x + enemy.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width > enemy.hitbox.position.x &&
            this.hitbox.position.y < enemy.hitbox.position.y + enemy.hitbox.height &&
            this.hitbox.position.y + this.hitbox.height > enemy.hitbox.position.y
        );
    }
}