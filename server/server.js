const express = require('express')
const api = express()
const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
require('dotenv').config('../.env')

// AWS s3 config
aws
  .config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: 'us-west-2'
  });

// create an instance of the s3 bucket
const s3 = new aws.S3();

// require Clarifai library
const Clarifai = require('clarifai');

let clarifai = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

// body parser config
const bodyParser = require('body-parser')
api
  .use(bodyParser.json({ limit: '50mb', extended: true }))
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// multer middleware to configure the upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'powwow123',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log('filename: ', file.originalname)
      cb(null, Date.now().toString() + '.png')
    }
  })
})

// helper function to upload the image in post request below
const singleUpload = upload.single('image')

// post req api endpoint for image uploading to s3
api
  .post('/image-upload', (req, res) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
      }
      // pass image data to clarifai api workflow
      clarifai.workflow
        // specify the model, and pass in the url from the s3 hosted image as a parameter
        .predict('General', req.file.location)
        // .predict('TestMural', req.file.location)
        .then((response) => {
          // destructure clarifai data response
          let data = response.results[0]
          let clarifaiAnalysis = data.outputs[0].data
          console.log('CLARIFAI ANALYSIS: ', clarifaiAnalysis)
          console.log('CLARIFAI GENERAL: ', clarifaiAnalysis[0].name)
          res.json(clarifaiAnalysis)
        },
          (err) => {
            // another error catch
            console.log('WORKFLOW ERROR: ', err)
          })
    });
  })

// sanity check for post request
api
  .post('/post-sanity', (req, res) => {
    console.log('test post request body: ', req.body)
    res.json(req.body)
  })

// sanity check for get request
api
  .get('/', (req, res) => {
    console.log('server is running')
    res.json('server is running')
  })

api
  .listen(process.env.EXPRESS_PORT)
console.log(`SERVER LISTENING ON ${process.env.EXPRESS_PORT}`)