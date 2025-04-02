class CollisionBlock{
    constructor({position}){
        this.position = position
        this.width = 64
        this.height = 64
    }

    // metodo para criar e poder visualizar a colisão
    draw(){
        // colisão tem a cor vermelha, é transparente por 0.2
        c.fillStyle = 'rgb(255, 0, 0, 0.5)'

        // código refatorado para melhor legibilidade, sendo o primeiro argumento a posição x, em seguida a posição y, a largura e a altura em sequência
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

}