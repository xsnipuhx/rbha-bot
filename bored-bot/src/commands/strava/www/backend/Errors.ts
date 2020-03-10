import * as express from 'express'

export const Unauthorized = (res: express.Response, message: string) =>
  res.status(401).json({ error: message })