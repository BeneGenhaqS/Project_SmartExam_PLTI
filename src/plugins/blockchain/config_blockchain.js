import { reactive, markRaw } from "vue"
import { database as db_bc1, auth as auth_bc1 } from '@/plugins/blockchain/firebase_blockchain_1'
import { database as db_bc2, auth as auth_bc2 } from '@/plugins/blockchain/firebase_blockchain_2'
import { database as db_bc3, auth as auth_bc3 } from '@/plugins/blockchain/firebase_blockchain_3'
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import _ from 'lodash'

export const bc_network = reactive({
  bc1: {
    blockchain: undefined,
    db: markRaw(db_bc1),
    auth: markRaw(auth_bc1)
  },
  bc2: {
    blockchain: undefined,
    db: markRaw(db_bc2),
    auth: markRaw(auth_bc2)
  },
  bc3: {
    blockchain: undefined,
    db: markRaw(db_bc3),
    auth: markRaw(auth_bc3)
  }
})

export const loginBlockChain = async (auth) => {
  try{
    await setPersistence(auth, browserLocalPersistence).then(async ()=>{
      await signInWithEmailAndPassword(auth, 'adminBlockChain@smartexam.com', 'adminBlockChain123456!');
    })
    
  }catch(error){
    console.log('error bc', error)
  }
}

export const logoutBlockChain = async (auth) => {
  await signOut(auth)
}

export const loadPossibleNode = async (all_bc) => {
  let data = [];

  let keys_bc = Object.keys(all_bc);
  let data_bc = [];
  for(let i=0; i<keys_bc.length; i++){
    data_bc.push({
      node: keys_bc[i],
      rawData: JSON.stringify(all_bc[keys_bc[i]].blockchain.chain)
    })
  }

  let unique = [...new Map(data_bc.map(item => [item['rawData'], item])).values()];
  if(unique.length === 1){
    for(let i=0; i<data_bc.length; i++){
      data.push(data_bc[i].node)
    }
  }
  else if(unique.length === 2){
    for(let j=0; j<unique.length; j++){
      unique[j].count = 0;
      for(let i=0; i<keys_bc.length; i++){
        if(unique[j].rawData === JSON.stringify(all_bc[keys_bc[i]].blockchain.chain))
          unique[j].count++;
      }
    }
    unique = unique.sort((a,b) => b.count - a.count);
    let rawData = unique[0].rawData;
    for(let i=0; i<data_bc.length; i++){
      if(data_bc[i].rawData === rawData)
        data.push(data_bc[i].node)
    }
  }else{
    data.push(data_bc[0].node) // kalau beda semua, percaya ke node 1
  }
  
  return data;
}

export const getDataBlockchain = async (all_bc) => {


  let data = {};
  let data_bc = [];

  let keys_bc = Object.keys(all_bc);
  for(let i=0; i<keys_bc.length; i++){
    let ujian_keys_bc = Object.keys(all_bc[keys_bc[i]].ujian_key);
    for(let j=0; j<ujian_keys_bc.length; j++){
      let ujian_data = all_bc[keys_bc[i]].ujian_key[ujian_keys_bc[j]]
      let ujian_key = ujian_keys_bc[j]
      data_bc.push({
        node: keys_bc[i],
        ujian_key: ujian_key,
        ujian_data: JSON.stringify(ujian_data),
        count: 0
      })
    }
  }

  let unique = [...new Map(data_bc.map(item => [`${item['ujian_key']}___${item['ujian_data']}`, item])).values()];

  for(let x=0; x<unique.length; x++){
    let rawData = unique[x].ujian_data;
    for(let i=0; i<keys_bc.length; i++){
      let ujian_keys_bc = Object.keys(all_bc[keys_bc[i]].ujian_key);
      for(let j=0; j<ujian_keys_bc.length; j++){
        let ujian_data = all_bc[keys_bc[i]].ujian_key[ujian_keys_bc[j]]
        if(JSON.stringify(ujian_data) === rawData){
          unique[x].count++
        }
      }
    }
  }
  
  for(let i=0; i< unique.length; i++){
    if(typeof data[unique[i].ujian_key] === 'undefined'){
      data[unique[i].ujian_key] = {
        data: JSON.parse(unique[i].ujian_data),
        count: unique[i].count
      }
    }else if(unique[i].count > data[unique[i].ujian_key].count){
      data[unique[i].ujian_key] = {
        data: JSON.parse(unique[i].ujian_data),
        count: unique[i].count
      }
    }
  }
  return data;
}