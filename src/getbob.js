import getWeb3 from "./getWeb3";
// export a javaScript instance connecting to the smart contract that stores/retrieves IPFS hash

async function getbob() { 
    // Your contract address as deployed by Remix
    const address = '0x75d7541b0d569bf8796bd6c87be27106fffafff7';   // address deployed in Remix
    // Your contract ABI as copied from Remix
    const abi = [
		{
		   "inputs":[
			  
		   ],
		   "stateMutability":"nonpayable",
		   "type":"constructor"
		},
		{
			"inputs":[
			   {
				  "internalType":"address[]",
				  "name":"accounts",
				  "type":"address[]"
			   },
			   {
				  "internalType":"uint256[]",
				  "name":"ids",
				  "type":"uint256[]"
			   }
			],
			"name":"balanceOfBatch",
			"outputs":[
			   {
				  "internalType":"uint256[]",
				  "name":"",
				  "type":"uint256[]"
			   }
			],
			"stateMutability":"view",
			"type":"function"
		},
		{
		   "inputs":[
			  {
				 "internalType":"address",
				 "name":"account",
				 "type":"address"
			  },
			  {
				 "internalType":"uint256",
				 "name":"id",
				 "type":"uint256"
			  }
		   ],
		   "name":"balanceOf",
		   "outputs":[
			  {
				 "internalType":"uint256",
				 "name":"",
				 "type":"uint256"
			  }
		   ],
		   "stateMutability":"view",
		   "type":"function"
		}
	 ];
	
    const web3 = await getWeb3();
    return new web3.eth.Contract(abi, address);
}
getbob();

export default getbob;