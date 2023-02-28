import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connect-Btn")
const fundButton = document.getElementById("fund-Btn")
const balanceButton = document.getElementById("balance-Btn")
const withdrawButton = document.getElementById("withdraw-Btn")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
	if (typeof window.ethereum !== "undefined") {
		try {
			await window.ethereum.request({method: "eth_requestAccounts"})
		} catch (error) {
			console.log(error)
		}
		connectButton.innerText = "Connected!"
		const accounts = await ethereum.request({method: "eth_accounts"})
		console.log(accounts)
	} else {
		connectButton.innerText = "Please Install Metamask"
	}
}
async function withdraw() {
	if (typeof window.ethereum !== "undefined") {
		console.log("Withdrawing....")
		const provider = new ethers.providers.Web3Provider(window.ethereum)

		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, abi, signer)
		try {
			const transactionResponse = await contract.withdraw()
			await listenForTransactionMine(transactionResponse, provider)
		} catch (error) {
			console.log(error)
		}
	}
}
async function getBalance() {
	if (typeof window.ethereum != "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contractAddress)
		console.log(ethers.utils.formatEther(balance))
	}
}
async function fund() {
	const ethAmount = document.getElementById("ethAmount").value

	console.log(`Funding with ${ethAmount}....`)
	if (typeof window.ethereum !== "undefined") {
		//? What we need to send a transaction
		//* provider/connection to blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		//*signer/wallet/someone with some gas
		const signer = provider.getSigner()
		//* contract that we are interacting with
		const contract = new ethers.Contract(contractAddress, abi, signer)
		//* ABI & Address
		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount)
			})
			// Hey wait for this TX to finish
			// listen for the tx to be mined
			await listenForTransactionMine(transactionResponse, provider) // await' says we're gonna stop till this function completely finished
			console.log("done!!")
		} catch (error) {
			console.log(error)
		}
	}
}

function listenForTransactionMine(transactionResponse, provider) {
	console.log(`Mining... ${transactionResponse.hash}`)

	// return new Promise() // Create Listener for the blockchain
	// Listen for this transaction to finish
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Completed with ${transactionReceipt.confirmations} confirmations`
			)
			// Place resolve() inside 'provider.once() function,  ONLY resolve() once 'transaction.hash' is FOUND!!!
			resolve()
		})
	})
}
