// Replace with your deployed contract address
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Replace with your contract ABI (only relevant parts included here)
const contractABI = [
    "function awardBadge(address recipient, string memory tokenURI) public returns (uint256)",
    "function totalBadgesIssued() public view returns (uint256)",
    "function revokeBadge(uint256 tokenId) public",
    "function ownsBadge(address user, uint256 tokenId) public view returns (bool)",
    "function updateTokenURI(uint256 tokenId, string memory newTokenURI) public",
    "function badgesOfOwner(address owner) public view returns (uint256[] memory)",
    "function balanceOf(address owner) public view returns (uint256)"
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        const userAddress = await signer.getAddress();
        document.getElementById("walletAddress").innerText = `Connected: ${userAddress}`;
    } else {
        alert("Please install MetaMask to use this app.");
    }
}

async function mintBadge() {
    const recipient = document.getElementById("recipient").value;
    const tokenURI = document.getElementById("tokenURI").value;

    try {
        const tx = await contract.awardBadge(recipient, tokenURI);
        await tx.wait();
        alert("Badge minted successfully!");
    } catch (error) {
        console.error("Minting failed:", error);
        alert("Error minting badge. See console for details.");
    }
}

async function getUserBadges() {
    const userAddress = document.getElementById("ownerAddress").value;

    try {
        const badges = await contract.badgesOfOwner(userAddress);
        document.getElementById("badgesList").innerText = `Badges owned: ${badges.join(", ")}`;
    } catch (error) {
        console.error("Error fetching badges:", error);
        alert("Failed to retrieve badges.");
    }
}
