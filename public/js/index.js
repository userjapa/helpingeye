(async () => {
  const video  = document.getElementById('camera'),
        canvas = document.getElementById('picture'),
        button = document.getElementById('capture')

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
      facingMode: 'environment'
    }
  })

  video.srcObject = stream

  button.addEventListener('click', async event => {
    event.preventDefault()

    button.disabled = true
    button.classList.add('opacity-50')
    button.classList.add('cursor-not-allowed')

    video.pause()

    const context = canvas.getContext('2d')

    const height = video.videoHeight,
          width  = video.videoWidth

    canvas.width = width
    canvas.height = height

    context.drawImage(video, 0, 0, width, height)

    const response = await fetch(`${location.origin}/api/text-recognition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang: 'pt-BR',
        data: canvas.toDataURL('image/png')
      })
    })

    const json = await response.json()

    if (!json.valid) {
      return alert('Failed to extract text')

      video.play()
      button.disabled = false
      button.classList.remove('opacity-50')
      button.classList.remove('cursor-not-allowed')
    }

    const speech = json.data.speech

    if (speech) {
      const audio = new Audio('data:audio/mp3;base64,' + speech)

      audio.play()
    }

    video.play()
    button.disabled = false
    button.classList.remove('opacity-50')
    button.classList.remove('cursor-not-allowed')
  })
})(window)
