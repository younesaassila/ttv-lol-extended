import chalk from "chalk"
import compression from "compression"
import cors from "cors"
import express from "express"
import fetch, { Response } from "node-fetch"
import fetchSubOnlyVod from "./lib/fetchSubOnlyVod"
import helmet from "helmet"
import ip from "ip"
import morgan from "morgan"

const app = express()
const port = 38565

const morganFormatFn: morgan.FormatFn = (tokens, req, res) =>
  [
    tokens.method(req, res),
    decodeURIComponent(tokens.url(req, res) || "").replace(/\?.*$/, ""),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ")

app.use(morgan(morganFormatFn))
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/ping", (_req, res) => {
  return res.status(200).send()
})

app.get("/playlist/:m3u8_filename", (req, res) => {
  return res.redirect(`https://api.ttv.lol${req.url}`)
})

app.get("/vod/:m3u8_filename", async (req, res) => {
  // @ts-ignore
  const response: Response = await fetch(`https://api.ttv.lol${req.url}`, {
    headers: {
      "X-Donate-To": "https://ttv.lol/donate",
    },
  }).catch(error => res.status(500).send(error))

  if (response.status === 403) {
    // Sub-only VOD
    const vodIdRegex = /\/vod\/([a-z0-9-_]+)\.m3u8/i
    const vodIdMatch = vodIdRegex.exec(req.url)
    if (vodIdMatch != null && vodIdMatch[1] != null) {
      const vodId = vodIdMatch[1]
      try {
        const manifest = await fetchSubOnlyVod(vodId)
        res.contentType("application/vnd.apple.mpegurl")
        return res.status(200).send(manifest)
      } catch (error) {
        return res.status(403).send(error)
      }
    }
  }

  const body = await response.text()
  return res.status(response.status).send(body)
})

app.listen(port, () => {
  console.log(chalk.bold("TTV LOL extended"))
  console.log("by Younes Aassila")
  console.log("")
  const url = `http://${ip.address()}:${port}`
  console.log(`Running at ${chalk.blueBright(url)}`)
  console.log("")
})
