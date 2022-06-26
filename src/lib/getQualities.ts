import { Video, Quality } from "../types"

export default function getQualities(
  resolutions: Video["resolutions"],
  fps: Video["fps"]
) {
  const qualities: Quality[] = []

  let highestFrameRate = Math.max(...Object.values(fps))
  const getFrameRate = (streamName: string) => {
    let frameRate = fps[streamName]
    if (!frameRate) {
      // Try to retrieve the frame rate from the stream name.
      const match = /p([0-9]+)$/gi.exec(streamName)
      if (match != null && match[1] != null) frameRate = parseInt(match[1])
    }
    if (frameRate != null && frameRate > highestFrameRate) {
      // Retrieved frame rate is greater than all specified frame rates by the Twitch API.
      // This is because the Twitch API sometimes assigns a frame rate of 0 to a stream name.
      highestFrameRate = frameRate
    }
    if (!frameRate) {
      // Fall back to the highest frame rate value.
      frameRate = highestFrameRate
    }
    return frameRate
  }

  const getLabel = (
    streamName: string,
    resolution: string,
    frameRate: number
  ) => {
    let label = streamName
    if (label === "chunked") {
      // This is the source stream variant.
      const height = resolution.split(/x|×/)[1]
      const roundedFrameRate = Math.round(frameRate)
      if (height != null) label = `${height}p${roundedFrameRate}`
    }
    label = label.replace(/(p(?:[0-9]|[0-2][0-9]|30))$/gi, "p")
    return label
  }

  for (const [streamName, resolution] of Object.entries(resolutions)) {
    if (streamName === "audio_only") continue
    const frameRate = getFrameRate(streamName)
    const label = getLabel(streamName, resolution, frameRate)
    qualities.push({
      streamName,
      resolution,
      frameRate: frameRate.toFixed(3),
      label,
    })
  }

  // Sort the qualities from highest to lowest.
  qualities.reverse()

  return qualities
}
