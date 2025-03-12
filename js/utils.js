Array.prototype.parse2D = function(){
    const rows = []
    // loop para criar a colisão do cenario, o mapa é 16 blocos de largura
    for(let i = 0; i < this.length; i+=16){ // i começa em 0 que seria a posição 0 do mapa no canto superior esquerdo
        rows.push(this.slice(i, i + 16))    // slice vai recortar bloco por bloco
    }
    // retorna as linhas, que seria 9 já que o mapa é 16 blocos por 9 blocos
    return rows
}

Array.prototype.createObjectsFrom2D = function (){
    const objects = []
    this.forEach((row, y) => {
        row.forEach((symbol, x) => {
            // seleciona os dados de do bloco de colisão
            if(symbol === 332 || symbol === 374){
                // cria uma nova colisão dentro do array de colisão de blocos
                objects.push(new CollisionBlock({
                    position:{
                        x: x * 64,
                        y: y * 64
                    }
                }))
            }
        })
    })
    return objects
}