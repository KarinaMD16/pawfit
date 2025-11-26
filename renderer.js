window.addEventListener('DOMContentLoaded', async () => {
  const categories = ['headwear', 'hair', 'face', 'accessory', 'clothing', 'body']

  for (const category of categories) {
    const optionsContainer = document.getElementById(`options-${category}`)
    const chosenImg = document.getElementById(`chosen-${category}`)
    if (!optionsContainer) continue
    let imgs = window.assets?.list(category) || []
    if ((!imgs || imgs.length === 0) && !window.assets) {
      try {
        const res = await fetch('assets/manifest.json')
        if (res.ok) {
          const list = await res.json()
          imgs = list.filter(f => f.toLowerCase().includes(category)).map(f => `assets/${f}`)
        }
      } catch (e) {
        // ignore
      }
    }
    const line = document.createElement('div')
    line.textContent = `${category}: ${imgs.length} file(s)`

    optionsContainer.querySelectorAll('img').forEach(n => n.remove())

    imgs.forEach((src, idx) => {
      const img = document.createElement('img')
      img.src = src
      img.alt = `${category} option`
      img.className = 'option-thumb'
      img.style.cursor = 'pointer'
      img.addEventListener('click', () => {
        const alreadySelected = img.classList.contains('selected')

        if (alreadySelected) {
          img.classList.remove('selected')
          if (chosenImg) chosenImg.src = ""
          return
        }

        optionsContainer.querySelectorAll('img').forEach(i => i.classList.remove('selected'))
        img.classList.add('selected')
        if (chosenImg) chosenImg.src = src
      })

      optionsContainer.appendChild(img)
    })

    if (imgs.length > 0 && chosenImg) {
      chosenImg.src = imgs[0]
      const firstThumb = optionsContainer.querySelector('img.option-thumb')
      if (firstThumb) firstThumb.classList.add('selected')
    }
  }
  const navItems = document.querySelectorAll("aside nav li")
  const sections = document.querySelectorAll("aside section")

  navItems.forEach((li, index) => {
    li.addEventListener("click", () => {
      navItems.forEach(l => l.classList.remove("active"))
      li.classList.add("active")

      sections.forEach(s => s.classList.remove("active"))
      sections[index].classList.add("active")
    })
  })

  navItems[0].classList.add("active")
  sections[0].classList.add("active")


})
