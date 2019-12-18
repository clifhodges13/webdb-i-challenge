const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('<h1 style="display: block; width: 100vw; text-align: center;">Welcome!</h1>')
})

// GET all accounts
server.get('/accounts', (req, res) => {
  db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(err => res.status(500).json({ message: 'Failed to retrieve the accounts from the database.' }))
})

// GET account by id
server.get('/accounts/:id', (req, res) => {
  const { id } = req.params
  db('accounts').where({ id })
    .then(account => {
      if (!account.length) {
        res.status(404).json({ message: 'Could not find the account with the specified ID.' })
      } else {
        res.status(200).json(account)
      }
    })
    .catch(err => res.status(500).json({ message: 'Failed to retrieve the account from the database.' }))
})

// POST a new account
server.post('/accounts', (req, res) => {
  const { name, budget } = req.body
  if (!name || !budget) {
    res.status(400).json({ message: 'Please include a name and budget in your request body.' })
  } else {
    db('accounts').insert({ name, budget })
      .then(newAccountId => res.status(201).json(newAccountId))
      .catch(err => res.status(500).json({ message: 'Failed to add the new account to the database.' }))
  }
})

// PUT an account
server.put('/accounts/:id', (req, res) => {
  const { name, budget } = req.body
  const { id } = req.params
  if (!name || !budget) {
    res.status(400).json({ message: 'Please include a name and budget in your request body.' })
  } else {
    db('accounts').where({ id })
      .then(account => {
        if (!account.length) {
          res.status(404).json({ message: 'Could not find the account with the specified ID.' })
        } else {
          db('accounts').where({ id }).update({ name, budget })
            .then(numOfAccountsUpdated => res.status(200).json({ numOfAccountsUpdated, id }))
            .catch(err => res.status(500).json({ message: 'Failed to update the account in the database.' }))
        }})
      .catch(err => res.status(500).json({ message: 'Failed to update the account in the database.' }))
  }
})

// DELETE an account
server.delete('/accounts/:id', (req, res) => {
  const { id } = req.params
  db('accounts').where({ id }).del()
    .then(numOfAccountsDeleted => res.status(200).json({ numOfAccountsDeleted }))
    .catch(err => res.status(500).json({ message: 'Failed to delete the account from the database.' }))
})

module.exports = server;