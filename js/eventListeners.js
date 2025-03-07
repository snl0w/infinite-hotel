window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            if (player.velocity.y === 0) player.velocity.y = -20

            break
        case 'a':

            //mover jogador para a esquerda
            keys.a.pressed = true
            break

        case 'd':
            //mover jogador para a direita
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            //mover jogador para a esquerda
            keys.a.pressed = false
            break

        case 'd':
            //mover jogador para a direita
            keys.d.pressed = false
            break
    }
})