import fetch from "node-fetch"
import getQualities from "./getQualities"
import { Video, BroadcastType } from "../types"

export default async function fetchSubOnlyVod(vodId: string) {
  const video: Video = await fetch(
    `https://api.twitch.tv/kraken/videos/${vodId}`,
    {
      headers: {
        Accept: "application/vnd.twitchtv.v5+json",
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "User-Agent": "Mozilla/5.0",
      },
    }
  )
    .then(response => {
      if (response.ok) return response.json()
      throw new Error(`${response.status} ${response.statusText}`)
    })
    .catch(error => {
      throw new Error(error)
    })

  if (!video) throw new Error(`'${Object.keys({ video })[0]}' is not defined.`)
  if (video.broadcast_type === BroadcastType.Upload) {
    throw new Error("Uploads are not supported.")
  }

  const urlRegex =
    /^https:\/\/([a-z0-9]*)\.cloudfront\.net\/([a-z0-9_]*)\/storyboards\/[0-9]*-info\.json$/i
  const match = urlRegex.exec(video.seek_previews_url)
  if (match == null) {
    throw new Error(`'${Object.keys({ match })[0]}' is not defined.`)
  }

  const [_, subdomain, token] = match
  if (!subdomain || !token) {
    throw new Error(
      `'${Object.keys({ subdomain })[0]}' or '${
        Object.keys({ token })[0]
      }' is not defined.`
    )
  }

  let manifest = "#EXTM3U\n"
  const qualities = getQualities(video.resolutions, video.fps)

  let filename: string
  if (video.broadcast_type === BroadcastType.Highlight) {
    filename = `highlight-${vodId}.m3u8`
  } else {
    filename = "index-dvr.m3u8"
  }

  for (const quality of qualities) {
    // TODO: Set accurate codecs.
    manifest +=
      `#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="${quality.streamName}",NAME="${quality.label}",AUTOSELECT=YES,DEFAULT=YES\n` +
      `#EXT-X-STREAM-INF:CODECS="avc1.64002A,mp4a.40.2",RESOLUTION=${quality.resolution},VIDEO="${quality.streamName}",FRAME-RATE=${quality.frameRate}\n` +
      `https://${subdomain}.cloudfront.net/${token}/${quality.streamName}/${filename}\n`
  }

  return manifest
}
