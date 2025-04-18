class Enemy extends Sprite {
  constructor({
      position,
      collisionBlocks = [],
      imageSrc,
      frameRate,
      frameBuffer,
      animations,
      loop
  }) {
      super({
          position,
          imageSrc,
          frameRate,
          frameBuffer,
          animations,
          loop
      });

      this.velocity = {
          x: 0,
          y: 0
      };

      this.sides = {
          bottom: this.position.y + this.height
      };

      this.gravity = 0.9;
      this.collisionBlocks = collisionBlocks;

      this.isAlive = true; // <- novo!
  }

  update() {
      if (!this.isAlive) return; // <- impede inimigo morto de continuar sendo atualizado

      this.position.x += this.velocity.x;

      this.updateHitbox();
      this.checkForHorizontalCollisions();

      this.applayGravity();

      this.updateHitbox();
      this.checkForVerticalCollisions();

      this.draw();
  }

  die() {
      this.isAlive = false;

      // 1. Faz ele desaparecer do mapa (pode trocar por animação de morte depois):
      this.position = { x: -9999, y: -9999 };

  }

  switchSprite(name) {
      if (this.image === this.animations[name].image) return;

      this.currentFrame = 0;
      this.image = this.animations[name].image;
      this.frameRate = this.animations[name].frameRate;
      this.frameBuffer = this.animations[name].frameBuffer;
      this.loop = this.animations[name].loop;
      this.currentAnimation = this.animations[name];
  }

  updateHitbox() {
      this.hitbox = {
          position: {
              x: this.position.x + 6,
              y: this.position.y + 30
          },
          width: 50,
          height: 51
      };
  }

  checkForHorizontalCollisions() {
      for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];

          if (
              this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
              this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
              this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
              this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
          ) {
              if (this.velocity.x < 0) {
                  const offset = this.hitbox.position.x - this.position.x;
                  this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                  break;
              }

              if (this.velocity.x > 0) {
                  const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                  this.position.x = collisionBlock.position.x - offset - 0.01;
                  break;
              }
          }
      }
  }

  applayGravity() {
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
      for (let i = 0; i < this.collisionBlocks.length; i++) {
          const collisionBlock = this.collisionBlocks[i];

          if (
              this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
              this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
              this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
              this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
          ) {
              if (this.velocity.y < 0) {
                  this.velocity.y = 0;
                  const offset = this.hitbox.position.y - this.position.y;
                  this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                  break;
              }

              if (this.velocity.y > 0) {
                  this.velocity.y = 0;
                  const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                  this.position.y = collisionBlock.position.y - offset - 0.01;
                  break;
              }
          }
      }
  }

  checkSwordCollision(sword) {
    if (!this.isAlive || !sword.isActive) return false; // Se inimigo já morreu ou espada não está ativa, ignora

    // Verifica colisão entre a hitbox da espada e do inimigo
    if (
        sword.hitbox.position.x + sword.hitbox.width >= this.hitbox.position.x &&
        sword.hitbox.position.x <= this.hitbox.position.x + this.hitbox.width &&
        sword.hitbox.position.y + sword.hitbox.height >= this.hitbox.position.y &&
        sword.hitbox.position.y <= this.hitbox.position.y + this.hitbox.height
    ) {
      console.log('espada atingiu inimigo')
        this.die(); // Mata o inimigo se houve colisão
        return true;
    }
    return false;
}
}
