class Sprite {
    constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 7, loop = true, autoplay = true }) {
        this.position = position
        this.image = new Image()
        this.image.onload = () => {
            this.loaded = true
            this.width = this.image.width
            this.height = this.image.height / this.frameRate // dividindo por 6 ele corta em 6 partes a altura, quando o sprite está na vertical
        }
        this.image.src = imageSrc
        this.loaded = false
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapsedFrames = 0
        this.frameBuffer = frameBuffer // define a velocidade que o sprite atualiza
        this.animations = animations
        this.loop = loop
        this.autoplay = autoplay
        this.currentAnimation


        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }

        }
    }
    draw() {
        if (!this.loaded) return
    
        const cropbox = {
            position: {
                x: 0,
                y: this.height * this.currentFrame
            },
            width: this.width,
            height: this.height
        };
    
        // salva o contexto para não afetar outras operações
        c.save()
    
        // move o contexto para a posição da espada (centro da espada)
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
    
        // aplica a rotação
        c.rotate(this.rotation * Math.PI / 180) // converte a rotação de graus para radianos
    
        // desenha a espada (recortando a imagem da sprite sheet)
        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            -this.width / 2, // desenha a partir do centro da espada
            -this.height / 2,
            this.width,
            this.height
        )
    
        // restaura o contexto para evitar afetar outros desenhos
        c.restore()
    
        this.updateFrames() // atualiza os quadros da animação, se necessário
    }
    

    play() {
        this.autoplay = true
    }

    updateFrames() {
        if (!this.autoplay) return // se autoplay é falso, ele nao vai animar o que foi estabelecido como false

        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else if (this.loop) this.currentFrame = 0
        }

        if (this.currentAnimation?.onComplete) {
            if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                this.currentAnimation.onComplete()
                this.currentAnimation.isActive = true
            }
        }
    }
}