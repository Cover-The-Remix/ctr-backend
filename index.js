const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.post('/mint-nft-image', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let nft = req.files.nft;
            
            nft.mv('./uploads/' + nft.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: nft.name,
                    mimetype: nft.mimetype,
                    size: nft.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/mint-ctr-nft', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let ctr = req.files.ctr[key];
                
                //move photo to uploads directory
                ctr.mv('./uploads/' + ctr.name);

                //push file details
                data.push({
                    name: ctr.name,
                    mimetype: ctr.mimetype,
                    size: ctr.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.use(express.static('uploads'));