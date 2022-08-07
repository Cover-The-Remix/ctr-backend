import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.NFT_STORAGE_API_KEY

export async function storeAsset(name, description, image) {
   const client = new NFTStorage({ token: API_KEY })
   const metadata = await client.store({
       name: name,
       description: description,
       image: new File(
           [await fs.promises.readFile(image)],
           image.name,
           image.mimeType
       ),
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
}

storeAsset()
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });