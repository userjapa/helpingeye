(async () => {
  const synth  = window.speechSynthesis

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
        lang: 'por',
        data: canvas.toDataURL('image/png')
      })
    })

    const json = await response.json()

    if (!json.valid)
      return alert('Failed to extract text')

    const text = (json.data.text || '').replace(/\n/g, '').trim()

    const voices = synth.getVoices(),
          voice  = voices.filter(v => v.lang == 'pt-BR')

    console.log('Voices:', voices.map(v => v.name))

    const utter = new SpeechSynthesisUtterance(text || 'Texto não reconhecido')

    utter.voice = voice.pop()

    synth.speak(utter)
  })
})(window)
