const hatsInfo = [
  { n: "Wc h", id: 15, price: 600, type: 0, bought: false },
  { n: "Mt a", id: 11, price: 2000, type: 1, bought: false },
  { n: "F h", id: 31, price: 2500, type: 0, bought: false },
  { n: "S h", id: 6, price: 4000, type: 0, bought: false },
  { n: "B h", id: 7, price: 6000, type: 0, bought: false },
  { n: "Tg h", id: 53, price: 10000, type: 0, bought: false },
  { n: "Tg h2", id: 40, price: 15000, type: 0, bought: false },
  { n: "Bw a", id: 18, price: 20000, type: 1, bought: false },
  { n: "Cxw a", id: 21, price: 20000, type: 1, req: "Bw a", bought: false }
]

setInterval(() => {

  if (!window.playerInfo) return
  const score = window.playerInfo.points

  for (const hat of hatsInfo) {
    
    if (score >= hat.price && !hat.bought) {
      
      if (hat.req && !hatsInfo.find(h => h.n === hat.req).bought) continue

      sendPacket("c", 1, hat.id, hat.type)
      hat.bought = true
      
    }

  }

}, 1000)
