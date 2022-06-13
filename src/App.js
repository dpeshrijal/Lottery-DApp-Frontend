import React from "react"
import abi from "./utils/Lottery.json"
import { ethers } from "ethers"
import "./App.css"

function App() {

  const contractAddress = "0xAF8bD6027E37231e4BCCa892b31A9d73eb027FD1";
  const ABI = abi.abi;

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [connectText, setConnectText] = React.useState("Connect Wallet");
  const [displayText, setDisplayText] = React.useState("Please Connect To Metamask");
  const [balance, setBalance] = React.useState("X.XX");
  const [prevWinner, setPrevWinner] = React.useState("");


  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
        setDisplayText("Please Connect To Metamask");

      }
    } catch (error) {
      console.log("error: ", error);
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);

      setConnectText(`Connected: ${currentAccount}`);

      getBalance();
      getWinners();


    } catch (error) {
      console.log(error);
    }
  }


  const getBalance = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Lottery = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        );

        console.log("Getting Lottery Balance");
        setDisplayText("Getting Lottery Balance");
        setBalance(Number(await Lottery.getBalance()) / 1000000000000000000);
        console.log("fetched!");
        setDisplayText("");
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getWinners = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Lottery = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        );

        setPrevWinner(await Lottery.winner());
        console.log(`Previous winner is: ${prevWinner}`)
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };


  const enterLottery = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Lottery = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        );

        console.log("Entering the Lottery! Please Wait!");
        setDisplayText("Entering the Lottery! Please Wait!");
        const enterLotteryTxn = await Lottery.enter({ value: ethers.utils.parseEther("0.01") });
        setTimeout(() => setDisplayText("Ethereum is SLOW! Still mining your request"), 5000)
        await enterLotteryTxn.wait();
        console.log("fetched!");
        setDisplayText("");
        getBalance();
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
      setDisplayText("Not Enough Funds to Play Lottery!");

    }
  };

  const pickWinner = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Lottery = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        );

        console.log("Picking Winner of the Lottery! Please Wait!");
        setDisplayText("Picking Winner of the Lottery! Please Wait!");
        const pickWinnerTxn = await Lottery.pickWinner();
        setTimeout(() => setDisplayText("Ethereum is SLOW! Still mining your request"), 5000)
        await pickWinnerTxn.wait();
        console.log("fetched!");
        getBalance();
        getWinners();
        setDisplayText("");
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
      setDisplayText(("You are not allowed to Pick Winner!"), 3000);
    }
  };


  React.useEffect(() => {
    isWalletConnected();
  })


  return (
    <div className="main-div">
      <h1 className="logo">Lottery DApp</h1>
      <button className="connect-wallet" onClick={connectWallet}>{connectText}</button>

      <h2 className="status">{displayText}</h2>
      <div className="center-div">
        <h1 className="title">Let's Play!</h1>
        <h1 className="lottery-balance">Lottery Balance <p className="balance-amount">{balance}<br />ETH</p></h1>
        <h2 className="network-name">You need Rinkeby ETH!</h2>
        <button className="enter-lottery" onClick={enterLottery}>Enter Lottery</button>
        <p className="notice">*Fee to enter the lottery is 0.01 ETH</p>

      </div>

      <button className="pick-winner" onClick={pickWinner}>Pick Winner</button>
      <h2 className="prev-winner">Previous Winner: {prevWinner}</h2>
    </div>
  )
}

export default App;