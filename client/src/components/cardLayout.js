import React from 'react';
const CardLayout = (props) => {

    async function handleCLick(e) {
        console.log(props.book)
        try {
            console.log(props);
            const price = await props.bookStore.methods.bookVersionPrice(props.book.tokenId).call();
            const currency = props.book.FormBookPriceCurrency
            const weiValue = props.web3.utils.toWei(props.book.FormBookPrice, currency)
            console.log(weiValue)
            console.log(price)
            const expected = await props.book
            await props.storeFront.methods.
                purchaseFromAuthor(props.book.tokenId).
                send({ from: props.user, value: price });
        }
        catch (error) {
            alert("ERROR WHILE PURCHASING: " + error)
        }
    }

    return (
        <>
            <div class="card my-3">
                <div class="d-flex bd-highlight">
                    <div class="p-2 bd-highlight">
                        <img class="card-img w-20 h-20" src="https://covers.zlibcdn2.com/covers100/books/8e/9e/2e/8e9e2e017499c2a15fffc7b58dca9da7.jpg" alt="Card image cap" />
                    </div>
                    <div class="p-2 bd-highlight flex-grow-1 center">
                        <div class="card-body col-sm">
                            <h5 class="card-title">{props.book.FormBookTitle}</h5>
                            <cite title="Source Title">{props.book.FormBookAuthor}</cite>
                            <p class="card-text">{props.book.FormBookDescription}</p>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex bd-highlight">
                        <div class="p-2 flex-grow-1 bd-highlight">
                            {props.pageName === "My Books" ? null : <button className="btn btn-secondary me-2" onClick={handleCLick}>Purchase</button>}
                        </div>
                        <div class="p-2 bd-highlight center">Price: {props.book.FormBookPrice + " " + props.book.FormBookPriceCurrency}</div>
                        <div class="p-2 bd-highlight">Editon: {props.book.FormBookEdition}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardLayout;

