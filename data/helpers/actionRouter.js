const express = require('express');

const Actions = require('./actionModel.js');

const router = express.Router();

router.use((req, res, next) => {
    console.log('Inside Actions Router');
    next();
});

router.get('/', async (req, res) => {
    try {
        const actions = Actions.get();
        if (actions) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({ message: 'No actions found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving the actions' });
    }
})

router.get('/:id', validateID, async (req, res) => {
    res.status(200).json(res.action);
});

router.put('/:id', validateID, validateAction, async (req, res) => {
    try {
        const actions = Actions.update(req.params.id, req.body);
        res.status(200).json(actions);
    } catch (err) {
        res.status(500).json({ message: 'Error updating the action' })
    }
})
router.delete('/:id', validateID, (req, res) => {
    Actions.delete(req.params.id)
        .then(() => {
            res.status(200).json(req.body);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error deleting the action' })
        })
})

function validateID (req, res, next) {
    const id = req.params.id;
    if(!typeof(id) == Number){
      res.status(400).json({ message: 'Invalid ID'})
    } else {
      Actions.get(id)
        .then(action => {
          if (action) {
            req.action = action;
            next();
          } else {
            res.status(404).json({ message: 'action id not found' });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: 'Error retreiving the action'
          });
        });    
    }
}

function validateAction (req, res, next) {
    if(!req.body || Object.keys(req.body).length == 0){
        res.status(400).json({ message: 'missing action data' });
      } else {
        if (!req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('notes')) {
          res.status(400).json({ message: 'Please provide notes and description for action'});
        } else {
          next();
        }
      }
}

module.exports = router;