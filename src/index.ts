import express from 'express'

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  res.json({gitara: 'siema'})
})

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:8000`)
})
