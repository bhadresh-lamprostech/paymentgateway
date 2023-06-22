// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PaymentGateway {
    address public owner;
    mapping(address => uint256) public balances;
    Payment[] public payments;
    
    event PaymentReceived(address indexed from, uint256 amount);
    event PaymentSent(address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    struct Payment {
        address sender;
        uint256 amount;
        uint256 timestamp;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
        
        payments.push(Payment({
            sender: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit PaymentSent(msg.sender, amount);
    }
    
    function getBalance(address account) public view returns(uint256) {
        return balances[account];
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    
    function getAllPayments() public view returns(Payment[] memory) {
        return payments;
    }
}
