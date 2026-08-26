// ==UserScript==
// @name        moomoo client
// @namespace   Violentmonkey Scripts
// @version     12345
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @grant       none
// @author      zzzxx
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/@msgpack/msgpack/dist.es5+umd/msgpack.min.js
// ==/UserScript==

(() => {

  let _send = WebSocket.prototype.send

  WebSocket.prototype.send = function(buffer) {

    let data = buffer.slice(6)
    let Packet = MessagePack.decode(data)

    handlePacket(Packet, "Client")

    return _send.call(this, buffer)

  }

    Object.defineProperty(WebSocket.prototype, 'onmessage', {

        configurable: true,

        set(listener) {

            this.addEventListener('message', event => {

                const Packet = MessagePack.decode(new Uint8Array(event.data))

                handlePacket(Packet, "Server")

                if (listener) listener.call(this, event)

            })

        }

    })

})()

let Io = 1
let jt = 6
let Ht = 1
let bo = ["M", "D", "9", "e", "F", "z", "H", "K", "L", "N", "b", "P", "Q", "c", "6", "S", "0"]
let To = ["A", "B", "C", "D", "E", "a", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z", "g", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

function Co(e) {

    return function() {

        e |= 0,
        e = e + 1831565813 | 0

        let t = Math.imul(e ^ e >>> 15, 1 | e)

        return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t,
        ((t ^ t >>> 14) >>> 0) / 4294967296

    }

}

function Oi(e, t) {

    const i = e.length
      , s = e.map( (d, l) => l)
      , n = Co(t >>> 0)

    for (let d = i - 1; d > 0; d--) {

        const l = Math.floor(n() * (d + 1))
          , c = s[d]
        s[d] = s[l],
        s[l] = c

    }

    const a = {}
      , o = {}

    for (let d = 0; d < i; d++)

        a[e[d]] = s[d],
        o[s[d]] = e[d]

    return {
        enc: a,
        dec: o
    }

}

function Po(e) {

    const t = (e ^ Math.imul(Io, 2654435761)) >>> 0

    window.Tables.c2s = Oi(bo, t),
    window.Tables.s2c = Oi(To, (t ^ 2246822507) >>> 0)

}

function handlePacket(Packet, Type) {

  switch (Type) {

    case "Client":

      Packet[0] = Tables.c2s.dec[Packet[0]]

      switch (Packet[0]) {

          case "M":

            window.playerInfo.name = Packet[1][0].name
            window.playerInfo.skin = Packet[1][0].skin
            window.playerInfo.moofoll = Packet[1][0].moofoll

          break

          case "D":

            window.playerInfo.angle = Packet[1][0]

          break

          case "c":

            window.playerInfo.hatId = Packet[1][0][1]

          break

          case "z":

            window.playerInfo.itemId = Packet[1][0]

          break

          case "L":

            window.playerInfo.teamName = Packet[1][0]

          break

          case "b":

            console.log(`Trying to join ${Packet[1][0]} clan`)

          break

          case "9":

            window.lastAngle = Packet[1][0] > 0 ? Packet[1][0] - Math.PI : Packet[1][0] + Math.PI

          break

          case "H":

          if (Packet[1][0] === 17) {

            window.foodType = 1

          }

          break

      }

      break

      case "Server":

        if (Packet[0] === "io-init") {

          let io_initData = Packet[1]
          Po(io_initData[1])

        }

        Packet[0] = Tables.s2c.dec[Packet[0]]

        switch (Packet[0]) {

          case "A":

            let teamsData = Packet[1][0].teams

            for (let team of teamsData) {

              let id = team.owner
              let sid = team.sid

              window.Teams.set(sid, id)

            }

          break

          case "B":

            console.log(Packet)

            // have never seen B header before so just log it :marcino:

          break

          case "M":

            let turretShootData = Packet[1]

            if (!window.staticEntities.get(turretShootData[0]).shootLogs) {

              window.staticEntities.get(turretShootData[0]).shootLogs = []

            }

            window.staticEntities.get(turretShootData[0]).shootLogs.push({ angle: turretShootData[1] })

          break

          case "V":

            let inventoryIdsData = Packet[1]

            switch (inventoryIdsData.length === 2) {

              case true:

                window.playerInfo.toolIds = inventoryIdsData[0]

                break

              case false:

                window.playerInfo.invIds = inventoryIdsData[0]

                break
            }

          break

          case "X":

            let projectileData = Packet[1]

            window.projectilesLogs.set(window.projectileCount, {
              xpos: projectileData[0],
              ypos: projectileData[1],
              angle: projectileData[2],
              range: projectileData[3],
              speed: projectileData[4],
              type: projectileData[5],
              invul: projectileData[6],
              layer: projectileData[7]
            })

            window.projectileCount += 1

          break

          case "4":

            window.teamMembers.clear()

            let teamMembersData = Packet[1][0]

            for (let i = 0; i < teamMembersData.length; i += 2) {

              let playerId = teamMembersData[i]
              let name = teamMembersData[i + 1]

              window.teamMembers.set(playerId, name)

            }

          break

          case "7":

            let Coords = []

            let minimapPlayersCoords = Packet[1][0]

            if (minimapPlayersCoords === 0) return

              for (let i = 0; i < minimapPlayersCoords.length; i += 2) {

                Coords.push([minimapPlayersCoords[i],
                            minimapPlayersCoords[i + 1]])

              }

            window.minimapPlayersCoords = Coords

          break

          case "G":

            window.Leaderboard.clear()

            let leaderboardData = Packet[1][0]

            let counter = 1

            for (let i = 0; i < leaderboardData.length; i += 3) {

              let entryId = leaderboardData[i]

              let entry = {
                  name: leaderboardData[i + 1],
                  score: leaderboardData[i + 2],
                  place: counter
              }

              window.Leaderboard.set(entryId, entry)
              counter += 1

          }

          break

          case "a":

            window.Players.clear()

            let playersData = Packet[1][0]

            for (let i = 0; i < playersData.length; i += 13) {

              let playerId = playersData[i]

              let Player = {
                xpos: playersData[i + 1],
                ypos: playersData[i + 2],
                angle: playersData[i + 3],
                itemId: playersData[i + 4],
                teamName: playersData[i + 7],
                isTeamOwner: playersData[i + 8],
                hatId: playersData[i + 9],
                accessoryId: playersData[i + 10]
              }

              if (playerId === window.playerInfo.playerId) {

                  Object.assign(window.playerInfo, Player)

              }

            window.Players.set(playerId, Player)

          }

          break

          case "I":

            let Entities = []

            if (!Packet[1][0]) {

              window.Entities = Entities

              break

            }

            let entitiesData = Packet[1][0]

            for (let i = 0; i < entitiesData.length; i += 7) {

              Entities.push({
                entityId: entitiesData[i],
                entityType: entityNames[entitiesData[i + 1]],
                xpos: entitiesData[i + 2],
                ypos: entitiesData[i + 3],
                angle: entitiesData[i + 4],
                health: entitiesData[i + 5],
                nameId: entitiesData[i + 6]
              })

            }

            window.Entities = Entities

          break

          case "H":

            let staticEntitiesData = Packet[1][0]

            for (let i = 0; i < staticEntitiesData.length; i += 8) {

              let entityId = staticEntitiesData[i]

              let staticEntity = {
                xpos: staticEntitiesData[i + 1],
                ypos: staticEntitiesData[i + 2],
                angle: staticEntitiesData[i + 3],
                size: staticEntitiesData[i + 4],
                idk: staticEntitiesData[i + 5],
                entityType: staticEntitiesData[i + 6],
                ownerId: staticEntitiesData[i + 7]
              }

              window.staticEntities.set(entityId, staticEntity)

            }

          break

          case "g":

            let teamsData2 = Packet[1]

            for (let i of teamsData2) {

              window.Teams.set(i.sid, i.owner)

            }

          break

          case "1":

            window.Teams.delete(Packet[1][0])

          break

          case "3":

            if (!Packet[1][0]) {

              for (let id of window.teamMembers.keys()) {

                window.teamMembers.delete(id)

              }

            }

          break

          case "N":

            let r = Packet[1][0]
            window.playerInfo[r] = Packet[1][1]

          break

          case "Q":

            window.staticEntities.delete(Packet[1][0])

          break

          case "C":

            window.playerInfo.playerId = Packet[1][0]

          break

        }

      break

    }

}

window.Leaderboard = new Map()
window.minimapPlayersCoords = []
window.Teams = new Map()
window.teamMembers = new Map()
window.playerInfo = {}
window.Players = new Map()
window.Entities = []
window.staticEntities = new Map()
window.chatMessages = []
window.lastAngle = 1
window.foodType = 0
window.projectileCount = 1
window.projectilesLogs = new Map()
window.Tables = {
  c2s: { dec: {}, enc: {} },
  s2c: { dec: {}, enc: {} }
}

let entityNames = {
  0: "Cow",
  1: "Pig",
  2: "Bull",
  3: "Bully",
  4: "Wolf",
  5: "Quack",
  6: "MOOSTAFA",
  7: "Treasure",
  8: "MOOFIE"
}
