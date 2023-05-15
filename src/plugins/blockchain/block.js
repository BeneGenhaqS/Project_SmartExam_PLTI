import { SHA256, enc } from 'crypto-js'
import stringify from 'json-stable-stringify';

class Block {
  constructor(timestamp, lastHash, hash, data){
    this.data = data
    this.hash = hash
    this.lastHash = lastHash;
    this.timestamp = timestamp;
  }
  toString(){
    return `Block - 
    Timestamp     : ${this.timestamp}
    Last Hash     : ${this.lastHash.substring(0, 10)}
    Hash          : ${this.hash.substring(0, 10)}
    Data          : ${this.data}`
  }
  static genesis(){
    return new this('2023-04-07', 'There is no last hash', 'BlockChain Smart Exam', 'First Data');
  }
  static sorted(obj){
    // console.log('obj', obj)
    let newObj = {};
    let obj_key = Object.keys(obj).sort();
    for(let i=0; i< obj_key.length; i++){
      let child = obj[obj_key[i]]
      if(typeof child === 'object'){
        child = this.sorted(child)
      }
      newObj[obj_key[i]] = child;
    }
    // console.log('newobj', newObj)
    return newObj;
  } 
  static mineBlock(lastBlock, data, timestamp){
    const lastHash = lastBlock.hash;
    const hash = 'temp hash'; // Block.getHash(timestamp, lastHash, data);
    return new this(timestamp, lastHash, hash, data);
  }
  static getHash(timestamp, lastHash, data){
    data = stringify(data)
    let hash = SHA256(timestamp + lastHash + data).toString(enc.Hex);
    // console.log(hash)
    return hash;
  }
  static blockHash(block){
    const { timestamp, lastHash, data } = block;
    return Block.getHash(timestamp, lastHash, data);
  }
}

export default Block;