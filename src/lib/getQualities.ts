import { Video, Quality } from "../types"

export default function getQualities(
  resolutions: Video["resolutions"],
  fps: Video["fps"]
) {
  let qualities: Quality[] = []

  const getName = (resolution: string, fps: number = 30) => {
    const frameRate = Math.round(fps)
    return `${resolution.split(/x|×/)[1]}p${
      frameRate > 30 ? frameRate.toString() : ""
    }`
  }

  for (const [video, resolution] of Object.entries(resolutions)) {
    const frameRate = fps[video] ?? 30
    const name = getName(resolution, frameRate)
    qualities.push({
      name,
      video,
      resolution,
      frameRate: frameRate.toFixed(3),
    })
  }

  qualities.reverse()

  return qualities
}
