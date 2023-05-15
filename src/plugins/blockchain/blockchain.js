import Block from './block'
import { push, set } from '@/plugins/blockchain/firebasedb'

class Blockchain {
  constructor(chain){
    this.chain = chain
  }

  static async createGenesis(database){
    await push(database, '/', Block.genesis())
  }

  async addBlock(database, mineBlock){    
    let key = await push(database, '/', mineBlock);
    return key;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  isValidChain(blockchain = this){
    // console.log(blockchain.chain)
    if (JSON.stringify(blockchain.chain[0]) !== JSON.stringify(Block.genesis())) return false;
    for (let i = 1; i < blockchain.chain.length; i++) {
      const block = blockchain.chain[i];
      const lastBlock = blockchain.chain[i - 1];
      
      if (
        block.lastHash !== lastBlock.hash 
        || block.hash !== Block.blockHash(block) // gagal di kode ini
      ){
        return false;
      }
    }
    return true;
  }

  static async convertFirebasetoBlockchain(db, result){
    let arr_chain = [];

    if(!result){
      await this.createGenesis(db)
      return new this([Block.genesis()])
    }
    Object.keys(result).forEach(function(key) {
      arr_chain.push(Object.assign({}, result[key]))
    });
    
    for(let i=0; i<arr_chain.length; i++){
      arr_chain[i] = new Block(arr_chain[i].timestamp, arr_chain[i].lastHash, arr_chain[i].hash, arr_chain[i].data)
    }
    if(arr_chain.length === 0){
      await this.createGenesis(db)
      return new this([Block.genesis()])
    }

    return new this(arr_chain);
  }
}

export default Blockchain;