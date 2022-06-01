import React, { useEffect, useState } from "react";
import { Web3Storage } from 'web3.storage';
const DataForm = ({ bookStore, web3, user }) => {

    const [selectedFile, setSelectedFile] = useState();
    const [fileUrl, setFileUrl] = useState("");
    const [nftData, setnftData] = useState({
        FormBookTitle: "",
        FormBookAuthor: "",
        FormBookEdition: "",
        FormBookDescription: "",
        FormBookPrice: "",
        FormBookPriceCurrency: "Ether",
    });

    const client = makeStorageClient()

    function getAccessToken() {
        // If you're just testing, you can paste in a token
        // and uncomment the following line:
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGM3ODRiZTc2ZTI1NDk3QjdDMjRlMTA2QWMzMGJFYTAzYjRjNzM2MWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIxMDEzMDk0MjcsIm5hbWUiOiJuZnRCb29rU3RvcmUifQ.FN_48yTTOnwSrTUo3trVMTrb_GahicbJ9zBTiqQweSc'

        // In a real app, it's better to read an access token from an
        // environement variable or other configuration that's kept outside of
        // your code base. For this to work, you need to set the
        // WEB3STORAGE_TOKEN environment variable before you run your code.
        // return process.env.WEB3STORAGE_TOKEN
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
    }

    useEffect(() => {
        createNFT();
    }, [fileUrl]);

    function handleSubmit(event) {
        event.preventDefault();
        uploadBookToIPFS(event);
    }

    const uploadBookToIPFS = async (event) => {
        event.preventDefault()
        const file = [
            selectedFile
        ]
        console.log(file)
        if (typeof file !== 'undefined') {
            try {
                const result = await client.put(file)//.then(()=>{
                console.log(result)
                let fileName = file[0].name;
                fileName = fileName.replace(/ /g, '');
                console.log(fileName)
                const _url = `https://gateway.ipfs.io/ipfs/${result}/${fileName}`;
                setFileUrl(_url)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
    }

    const createNFT = async () => {
        console.log(nftData)
        if (!nftData.FormBookAuthor || !nftData.FormBookPrice || !nftData.FormBookPriceCurrency || !fileUrl) return

        console.log("createNFT")
        try {
            const blob = new Blob([JSON.stringify({ nftData, fileUrl })], { type: 'application/json' });
            const fileId = await bookStore.methods.tokenCount().call();
            const files = [
                new File([blob], `${fileId}.json`)
            ]
            const result = await client.put(files)
            console.log(result)
            mintThenList(result)
        } catch (error) {
            console.log("ipfs uri upload error: ", error)
        }
    }

    const mintThenList = async (result) => {
        try{
        console.log(result)
        const uri = `https://gateway.ipfs.io/ipfs/${result}`
        const price = web3.utils.toWei(nftData.FormBookPrice, nftData.FormBookPriceCurrency.toLowerCase());
        console.log(price);
        // mint nft 
        await bookStore.methods.publish(price, uri).send({from: user})
        const nftCount = await bookStore.methods.tokenCount().call();
        alert("PDF" + nftCount + "UPLOADED SUCCESSFULLY")
        }
        catch(error){
            alert(error.message);
        }
    }

    const handleFileChange = (e) => {
        const newFiles = e.target.files;
        if(!newFiles){
            alert("select a file")
            return
        }
        console.log(newFiles[0])
        const fileName = newFiles[0].name;
        const extension = fileName.split(".").pop();
        const isSupported = ["txt", "pdf"].includes(extension);
        // TODO: add more file extensions 
        if (!isSupported) {
            alert("not supported");
            setSelectedFile(null);
            e.target.value = null;
        } else {
            setSelectedFile(newFiles[0]);
        }
    }

    // TODO: add status bar 
    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group my-2">
                        <label htmlFor="BookFile">Upload Your Book</label><br />
                        <input
                            type="file"
                            className="form-control-file"
                            id="BookFile"
                            accept=".txt, .pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="FormBookTitle">Book Title</label>
                        <input
                            type="text"
                            className="form-control"
                            label="FormBookTitle"
                            value={nftData.FormBookTitle}
                            onChange={(e) => setnftData({ ...nftData, FormBookTitle: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="FormBookAuthor">Book Author</label>
                        <input
                            type="text"
                            className="form-control"
                            id="FormBookAuthor"
                            value={nftData.FormBookAuthor}
                            onChange={(e) => setnftData({ ...nftData, FormBookAuthor: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="FormBookEdition">Book Edition (numbers only)</label>
                        <input type="number"
                            min="1"
                            className="form-control"
                            id="FormBookEdition"
                            placeholder="1"
                            value={nftData.FormBookEdition}
                            onChange={(e) => setnftData({ ...nftData, FormBookEdition: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="FormBookDescription">Description</label>
                        <textarea
                            className="form-control"
                            id="FormBookDescription"
                            rows="4"
                            value={nftData.FormBookDescription}
                            onChange={(e) => setnftData({ ...nftData, FormBookDescription: e.target.value })}
                        />
                    </div>
                    <div className="form-group my-2">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="FormBookPrice">Price</label>
                                <input className="form-control"
                                    id="FormBookPrice"
                                    value={nftData.FormBookPrice}
                                    onChange={(e) => setnftData({ ...nftData, FormBookPrice: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="FormBookPriceCurrency">Select Currency</label>
                                <select class="form-control"
                                    id="FormBookPriceCurrency"
                                    value={nftData.FormBookPriceCurrency}
                                    onChange={(e) => setnftData({ ...nftData, FormBookPriceCurrency: e.target.value })}
                                    required
                                >
                                    <option>Select Currency</option>
                                    <option>ether</option>
                                    <option>wei</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Publish</button>
                </form>
            </div>
        </>
    );
};

export default DataForm;