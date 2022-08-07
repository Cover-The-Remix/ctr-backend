import { NFTStorage, File } from "nft.storage"
import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import _ from 'lodash'
import hre from 'hardhat'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const API_KEY = process.env.NFT_STORAGE_API_KEY
const contractAddress = "0x0CC88dd26F8b14300DD69bBe7e5E7a74FbC3beBd"

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

            const client = new NFTStorage({ token: API_KEY })
            const imageFile = new File([ nft.data ], nft.name, { type: nft.mimetype })
            const metadata = await client.store({
                name: req.body.name,
                description: req.body.description,
                image: imageFile,
            })
            console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)

            const CtRNFT = await hre.ethers.getContractFactory("CtRNFT")
            const [owner] = await hre.ethers.getSigners()
            await CtRNFT.attach(contractAddress).mintNFT(owner.address, metadata.url)
            console.log("NFT minted to: ", owner.address)

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