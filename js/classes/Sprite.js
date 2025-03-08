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
        

        if(this.animations){
            for(let key in this.animations){
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
        }
        // recorta o sheet do personagem
        c.drawImage(this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        this.updateFrames()
    }

    play(){
        this.autoplay = true
    }

    updateFrames() {
        if(!this.autoplay) return // se autoplay é falso, ele nao vai animar o que foi estabelecido como false

        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else if (this.loop) this.currentFrame = 0
        }
    }
}