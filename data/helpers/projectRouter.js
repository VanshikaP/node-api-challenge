const express = require('express');

const Projects = require('./projectModel.js');
const Actions = require('./actionModel.js');

const router = express.Router();

router.use((req, res, next) => {
    console.log('Inside Projects Router');
    next();
});

router.get('/', async (req, res) => {
    try {
        const projects = await Projects.get();
        if(projects) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({ message: 'No Projects found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving the projects' });
    }
});

router.get('/:id', validateID, async (req, res) => {
    res.status(200).json(req.project);
});

router.get('/:id/actions', validateID, async (req, res) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id);
        if (actions) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({ message: 'No action found for the project' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving the actions' });
    }
})

router.post('/', validateProject, async (req, res) => {
    try {
        const projects = await Projects.insert(req.body);
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Error adding the project' });
    }
})

router.post('/:id/actions', validateID, validateAction, async(req, res) => {
    try {
        const actions = await Actions.insert({...req.body, project_id : req.params.id});
        res.status(200).json({ ...req.body, project_id : req.params.id });
    } catch (err) {
        res.status(500).json({message: 'Error adding the action' });
    }
});

router.put('/:id', validateID, validateProject, async (req, res) => {
    try {
        const projects = await Projects.update(req.params.id, req.body);
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error updating the project' });
    }
})


router.put('/:id', validateID, validateAction, async (req, res) => {
    try {
        const actions = Actions.update(req.body.id, {...req.body, project_id : req.params.id});
        res.status(200).json(actions);
    } catch (err) {
        res.status(500).json({ message: 'Error updating the action' })
    }
})

router.delete('/:id', validateID, async (req, res) => {
    try {
        const projects = await Projects.remove(req.params.id);
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting the project' });
    }
})

function validateID (req, res, next) {
    const id = req.params.id;
    if(!typeof(id) == Number){
      res.status(400).json({ message: 'Invalid ID'})
    } else {
      Projects.get(id)
        .then(project => {
          if (project) {
            req.project = project;
            next();
          } else {
            res.status(404).json({ message: 'project id not found' });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: 'Error retreiving the project'
          });
        });    
    }
}

function validateProject (req, res, next) {
    if(!req.body || Object.keys(req.body).length == 0){
        res.status(400).json({ message: 'missing project data' });
      } else {
        if (!req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('name')) {
          res.status(400).json({ message: 'Please provide name and description for action'});
        } else {
          next();
        }
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