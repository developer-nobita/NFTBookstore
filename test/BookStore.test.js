const truffleAssert = require('truffle-assertions');

const BookStore =artifacts.require('BookStore')
const StoreFront =artifacts.require('StoreFront')
const PurchaseToken =artifacts.require('PurchaseToken')

contract('BookStore',(accounts)=>{
    describe('Publishing',async()=>{
        it("gives the author the specfied amount of book version copies,",async()=>{
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await book_store.setStoreFront(store_front.address)

            //const book_id=1
            const price=web3.utils.toWei('50','ether')  // take 50 and add number of zeros behind it
            const currency='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'//==USDC
            const quantity=100

            const author=accounts[5]

            await book_store.publish(quantity,price,currency,{from:author})

            let author_balance =await book_store.balanceOf(author ,1)
            author_balance=parseInt(author_balance)
            assert.equal(author_balance,100)

        })

     it("increases the book ID",async()=>{
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await book_store.setStoreFront(store_front.address)       

            const author=accounts[3]
             
            //NOTE:Decimals incorrect for usdc
            const price=web3.utils.toWei('50','ether')
            const currency='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'//==USDC
           

            await book_store.publish(75,price,currency,{from:author})

            await book_store.publish(50,price,currency,{from:author})

            let author_balance =await book_store.balanceOf(author ,2)
            author_balance=parseInt(author_balance)

            assert.equal(author_balance,50)
     })
     it("correctly sets the price and currency for a book version ,",async()=>{
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await   store_front.setBookStore(book_store.address)
            await   book_store.setStoreFront(store_front.address)

        //const book_id=1
            let price=web3.utils.toWei('50','ether')  // take 50 and add number of zeros behind it
            const currency='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'//==USDC
            const quantity=100

            const author=accounts[5]

            await book_store.publish(quantity,price,currency,{from:author})

            let book_version_price =await book_store.bookVersionPrice(1)
        //console.log(book_version_price)
            book_version_price=web3.utils.fromWei(book_version_price,'ether')
            assert.equal(book_version_price,'50')
 
            price=web3.utils.toWei('100','ether')  // take 50 and add number of zeros behind it

            await book_store.publish(quantity,price,currency,{from:author})

            book_version_price =await book_store.bookVersionPrice(2)
        //console.log(book_version_price)
           book_version_price=web3.utils.fromWei(book_version_price,'ether')
            assert.equal(book_version_price,'100')

       let book_version_currency =await book_store.bookVersionCurrency(2)
        //console.log(book_version_price)
        let expected = web3.utils.toChecksumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
         //book_version_currency=web3.utils.fromWei(book_version_price,'ether')
         // assert address directy without checking still it passes the test
         assert.equal(book_version_currency,expected)
    })

    })

    describe ('Purchasing from the author' , async()=>{
        it("transfers the purchase token to the author",async()=>{
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await book_store.setStoreFront(store_front.address)

            const buyer =accounts[1]
            const purchase_token =await PurchaseToken.new(web3.utils.toWei('1000000','ether'),{from:buyer})
            
            let balance = await purchase_token.balanceOf(buyer)
            balance = web3.utils.fromWei(balance,'ether')
            assert.equal(balance,'1000000')

           await purchase_token.approve(store_front.address, web3.utils.toWei('1000000','ether'),{from :
           buyer})

            // const book_id = 1
            let price=web3.utils.toWei('5000','ether')  // take 50 and add number of zeros behind it
            const currency=purchase_token.address  //==USDC
            const quantity=10
    
            const author=accounts[5]
    
            await book_store.publish(quantity,price,currency,{from:author})
            
            await book_store.setApprovalForAll(store_front.address,true,{from:author })

            await store_front.purchaseFromAuthor(1,{from : buyer})

             balance =web3.utils.fromWei((await purchase_token.balanceOf(author)),'ether')
            assert.equal(balance,'5000')

            
        })
        it("transfers a book version to buyer",async()=>{
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await book_store.setStoreFront(store_front.address)

            store_front.setBookStore(book_store.address)

            const buyer = accounts[1]
            const purchase_token =await PurchaseToken.new(web3.utils.toWei('1000000','ether'),{from:buyer})

            purchase_token.transfer(accounts[9], web3.utils.toWei('500000', 'ether'),{ from:buyer })
             
          // NOTE : This test is failing ;;;;

            await purchase_token.approve(store_front.address, web3.utils.toWei('1000000', 'ether'),{ from: 
            buyer})
            await purchase_token.approve(store_front.address, web3.utils.toWei('1000000', 'ether'),{ from:
            accounts[9] })


            // const book_id = 1
            let price=web3.utils.toWei('50','ether')  // take 50 and add number of zeros behind it
            const currency=purchase_token.address//==USDC
            const quantity=100
    
            const author=accounts[5]
    
            await book_store.publish(quantity,price,currency,{from:author})
            
            await book_store.setApprovalForAll(store_front.address,true,{from:author })

            await store_front.purchaseFromAuthor(1,{from : buyer})

            let book_version_balance =parseInt(await book_store.balanceOf(buyer,1))
            assert.equal(book_version_balance,1)

            await store_front.purchaseFromAuthor(1,{from : accounts[9]})

             book_version_balance =parseInt(await book_store.balanceOf(accounts[9],1))
            assert.equal(book_version_balance,1)

            //todo :check the balance of the author
        })
    })

    describe("Security", async() => {
        it("won't allow anyone but the storefront to call BookStore#transferFromAuthor",async()=>{
           
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await book_store.setStoreFront(store_front.address)

            //const book_id=1
            const price=web3.utils.toWei('50','ether')  // take 50 and add number of zeros behind it
            const currency='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'//==USDC
            const quantity=100

            const author=accounts[5]

            await book_store.publish(quantity,price,currency,{from:author})

            await truffleAssert.reverts(book_store.transferFromAuthor(accounts[3],1,{from : accounts[3]}),
            "Method can only be called from Store Front contract.")
        })

        it("won't allow anyone but the contract owner to set the storefront",async()=>{
           
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            await store_front.setBookStore(book_store.address)
            await truffleAssert.reverts(book_store.setStoreFront(store_front.address, {from: accounts[7] }),
            "BookStore : only contract owner can set storefront")

        })

        it("won't allow anyone but the contract owner to set the BookStore",async()=>{
           
            const store_front = await StoreFront.new()
            const book_store=await BookStore.new()

            //await store_front.setBookStore(book_store.address)
            await truffleAssert.reverts(store_front.setBookStore(book_store.address, {from: accounts[7] }),
            "Storefront : only contract owner can set BookStore")

        })

    })

})
