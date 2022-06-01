import React, { useEffect, useState } from "react";
import { Web3Storage } from 'web3.storage';
import CardLayout from './cardLayout';

const BookList = (props) => {
    const [booksData, setBooksData] = useState();
    var tempData = []

    useEffect(async () => {
        setBooksData(null)
        try {
            const x = await props.bookStore.methods.tokenCount().call();
            console.log(x);
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

            const bookCount = await props.bookStore.methods.tokenCount().call();
            console.log(bookCount)

            for (var tokenId = 0; tokenId < bookCount; tokenId++) {
                console.log("here")
                var uri = await props.bookStore.methods.tokenURI(tokenId).call({ from: props.user });
                const owner = await props.bookStore.methods.ownerOf(tokenId).call();
                // console.log(uri);
                const cid = uri.substring(29);
                // console.log(cid);
                const res1 = await client.get(cid)
                if (!res1.ok) {
                    throw new Error(`failed to get ${cid} - [${res1.status}] ${res.statusText}`)
                }

                // unpack File objects from the response
                const files = await res1.files()
                // console.log(res1)
                for (const file of files) {
                    var apiUrl = uri + "/" + file.name;
                    console.log(apiUrl);
                    var res;
                    fetch(apiUrl)
                        .then(res => res.json())
                        .then((out) => {
                            console.log(out);
                            out.nftData.tokenId = tokenId;
                            if (props.pageName === "My Books") {
                                console.log("my books" + props.user +" "+ owner)
                                if (props.user === owner) {
                                    tempData.push(out.nftData)
                                }
                            } else {
                                tempData.push(out.nftData)
                            }
                            // setBooksData({ booksData: [...this.booksData, out.nftData] })
                            // setBooksData(prevState => ({
                            //     booksData: [...prevState.booksData, out.nftData]
                            //   }))
                        })
                        .catch(err => { throw err });
                }

            }

            setBooksData(tempData)

        }
        catch (error) {
            alert("ERROR WHILE LOADING DATA: " + error)
        }
    }, []);

    return (
        <>
            <div className="container">
                <h3>{props.pageName}</h3>
                {booksData && booksData.map((bookData) => (
                    <CardLayout book={bookData} pageName={props.pageName} storeFront={props.storeFront} user={props.user} web3={props.web3} bookStore={props.bookStore}/>
                ))}
            </div>
        </>
    );
};

export default BookList;

