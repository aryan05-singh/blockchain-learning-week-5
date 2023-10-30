// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;



interface ExternalRegistry {
    function Registered(address _user) external view returns (bool);
}

contract ProductSupplyChain  {
    struct Product {
        uint256 productId;
        string name;
        address currentOwner;
        uint256 price;
        string state;
    }

    mapping(uint256 => Product) public productsById;

    address public owner;
    ExternalRegistry externalRegistry;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    event ProductCreated(uint256  productId, string name, address currentOwner, uint256 price, string state);
    event ProductSold(uint256  productId, address newOwner, uint256 newPrice);
    event OwnershipTransferred(address  previousOwner, address  newOwner);

    constructor(address _RegistryAddress) {
        owner = msg.sender;
        externalRegistry = ExternalRegistry(_RegistryAddress);
    }

    function addProduct(uint256 _productId, string memory _name, uint256 _price, string memory _state) public onlyOwner {
        Product memory newProduct = Product({
            productId: _productId,
            name: _name,
            currentOwner: msg.sender,
            price: _price,
            state: _state
        });

        productsById[_productId] = newProduct; 
    }

    function updateProduct(uint256 _productId, string memory _newName) public onlyOwner {
        require(productsById[_productId].productId != 0, "Product ID does not exist");
        productsById[_productId].name = _newName;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function sellProduct(uint256 _productId, address newOwner, uint256 newPrice) public onlyOwner {
        require(productsById[_productId].productId != 0, "Product ID does not exist");

        Product storage product = productsById[_productId];
        product.currentOwner = newOwner;
        product.price = newPrice;

        emit ProductSold(_productId, newOwner, newPrice);
    }

    function checkRegistration() public view returns (bool) {
        return externalRegistry.Registered(tx.origin);
    }
}