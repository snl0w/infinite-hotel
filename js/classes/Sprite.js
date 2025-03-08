class Sprite {
    constructor({ position, imageSrc, frameRate = 1, animations }) {
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
        this.frameBuffer = 7 // define a velocidade que o sprite atualiza
        this.animations = animations

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

    updateFrames() {
        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else this.currentFrame = 0
        }
    }
}