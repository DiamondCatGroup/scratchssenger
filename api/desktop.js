import { releaseStart, sobuildStart } from "../src/help/data.js"

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const { path } = req.query

  let URL = `${releaseStart}${path}`

  if (path.startsWith("sosirsOS/")) {
    URL = `${sobuildStart}${path.replace("sosirsOS/", "")}`
  }

  const response = await fetch(URL)

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  res.setHeader('Content-Type', contentType);

  res.status(200).send(buffer);
}
