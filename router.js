const express = require("express");
const db = require('./data/dbConfig.js');

const router = express.Router({ mergeParams: true });

// GET all accounts
router.get('/', (req, res, next) => {
  db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(err => next(err))
})

// GET account by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params
  db('accounts').where({ id })
    .then(account => {
      if (!account.length) {
        res.status(404).json({ message: 'Could not find the account with the specified ID.' })
      } else {
        res.status(200).json(account)
      }
    })
    .catch(err => next(err))
})

// POST a new account
router.post('/', (req, res, next) => {
  const { name, budget } = req.body
  if (!name || !budget) {
    res.status(400).json({ message: 'Please include a name and budget in your request body.' })
  } else {
    db('accounts').insert({ name, budget })
      .then(newAccountId => res.status(201).json(newAccountId))
      .catch(err => next(err))
  }
})

// PUT an account
router.put('/:id', (req, res, next) => {
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
            .catch(err => next(err))
        }})
        .catch(err => next(err))
  }
})

// DELETE an account
router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  db('accounts').where({ id }).del()
    .then(numOfAccountsDeleted => res.status(200).json({ numOfAccountsDeleted }))
    .catch(err => next(err))
})

module.exports = router;