// Create web server

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const Comments = require('../models/comments');

// Import authenticate module
const authenticate = require('../authenticate');

// Set up comments router
const commentsRouter = express.Router();

// Use body-parser
commentsRouter.use(bodyParser.json());

// Route '/'
commentsRouter.route('/')
    // GET
    .get((req, res, next) => {
        Comments.find({})
            .populate('author')
            .then((comments) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comments);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // POST
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comments.create(req.body)
            .then((comment) => {
                Comments.findById(comment._id)
                    .populate('author')
                    .then((comment) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(comment);
                    })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // PUT
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /comments');
    })
    // DELETE
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Comments.deleteMany({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// Route '/:commentId'
commentsRouter.route('/:commentId')
    // GET
    .get((req, res, next) => {
        Comments.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // POST
    .post(authenticate)