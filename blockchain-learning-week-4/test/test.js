const { expect } = require('chai');

describe('ProductSupplyChain', function () {
  let productSupplyChain;

  before(async () => {
   [owner] = await ethers.getSigners();
      const ExternalRegistry = await ethers.getContractFactory('ExternalRegistry');
      externalRegistry = await ExternalRegistry.deploy(owner.address);
      await externalRegistry.deployed();

      const ProductSupplyChain = await ethers.getContractFactory('ProductSupplyChain');
      productSupplyChain = await ProductSupplyChain.deploy(owner.address);
      await productSupplyChain.deployed();
  });

  describe('Deployment', function () {
    it('Should set the owner and externalRegistry', async function () {
      expect(await productSupplyChain.owner()).to.equal(owner.address);
      expect(await productSupplyChain.externalRegistry()).to.equal(owner.address);
    });
  });
})

  describe('Add Product', function () {
    it('Should allow the owner to add a product', async function () {
      const productId = 1;
      const name = 'Product 1';
      const price = 100;
      const state = 'New';

      await productSupplyChain.addProduct(productId, name, price, state);

      const product = await productSupplyChain.productsById(productId);
      expect(product.productId).to.equal(productId);
      expect(product.name).to.equal(name);
      expect(product.currentOwner).to.equal(owner.address);
      expect(product.price).to.equal(price);
      expect(product.state).to.equal(state);
    });
  });

  describe('Update Product', function () {
    it('Should allow the owner to update a product', async function () {
      const productId = 1;
      const newName = 'Updated Product 1';

      await productSupplyChain.updateProduct(productId, newName);

      const product = await productSupplyChain.productsById(productId);
      expect(product.name).to.equal(newName);
    });

  })

  describe('Transfer Ownership', function () {
    it('Should allow the owner to transfer ownership', async function () {
      const newOwner = ethers.Wallet.createRandom().address;

      const tx = await productSupplyChain.transferOwnership(newOwner);
      await tx.wait();

      expect(await productSupplyChain.owner()).to.equal(newOwner);
    });
  });

  describe('Sell Product', function () {
    it('Should allow the owner to sell a product', async function () {
      const productId = 1;
      const newOwner = ethers.Wallet.createRandom().address;
      const newPrice = 150;

      const tx = await productSupplyChain.sellProduct(productId, newOwner, newPrice);
      await tx.wait();

      const product = await productSupplyChain.productsById(productId);
      expect(product.currentOwner).to.equal(newOwner);
      expect(product.price).to.equal(newPrice);
    });
  });









