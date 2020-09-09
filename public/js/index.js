(async () => {
  const video  = document.getElementById('camera'),
        canvas = document.getElementById('picture'),
        button = document.getElementById('capture')

  const stream = await navigator.mediaDevices.getUserMedia({ video: true })

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

    console.log(json)
    if (!json.valid)
      alert('Failed to extract text')
    else
      alert(json.data.text)
  })
})(window)
