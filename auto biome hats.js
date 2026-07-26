let wch = false
let sch = false

setInterval(() => {

    if (playerInfo.ypos >= 6830 && playerInfo.ypos <= 7570) {

        if (!sch) {
            sendPacket("c", 0, 31, 0)
            sch = true
        }

    } else {

        if (sch) {
            sendPacket("c", 0, 0, 0)
            sch = false
        }

    }

    if (playerInfo.ypos >= 1000 && playerInfo.ypos <= 2395) {

        if (!wch) {
            sendPacket("c", 0, 15, 0)
            wch = true
        }

    } else {

        if (wch) {
            sendPacket("c", 0, 0, 0)
            wch = false
        }
    }

}, 300)
