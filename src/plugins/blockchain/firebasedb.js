import { 
  ref, 
  onValue, 
  child, get as get_db, 
  set as set_db, 
  push as push_db, 
  off, 
  query,
  equalTo,
  orderByChild,
  update as update_db,
  remove as delete_db
} from "firebase/database";


export const get = async (database, path, queryKey = '', queryValue = '') => {
  const dbRef = ref(database);
  try{
    if(queryKey !== '' && queryValue !== ''){
      const dbRef = query(ref(database, path), orderByChild(queryKey),  equalTo(queryValue));
      const snapshot = await get_db(dbRef)
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    }else{
      const snapshot = await get_db(child(dbRef, path))
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    }
    
  }catch(error){
    console.error(error)
    return null;
  }
}

export const getWatch = (database, path, callback, queryKey = '', queryValue = '') => {
  let unsubFn = null;
  if(queryKey === '' || queryValue === ''){
    const dbRef = ref(database, path);
    unsubFn = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }else{
    const dbRef = query(ref(database, path), orderByChild(queryKey),  equalTo(queryValue));
    unsubFn = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }
  return unsubFn;
}

export const removeWatch = (database, path) => {
  const dbRef = ref(database, path);
  off(dbRef);
}

export const convertGet = (result) => {
  if(!result) return [];
  let arr = [];
  Object.keys(result).forEach(function(key) {
    arr.push(Object.assign({key}, result[key]))
  });
  return arr;
}


export const set = async (database, path, data) => {
  try{
    await set_db(ref(database, path), data);
    return true;
  }catch(error){
    console.error(error);
    return false;
  };
  
}

export const push = async (database, path, data) => {
  try{
    let result = await push_db(ref(database, path), data);
    return result.key
  }catch(error){
    console.error(error);
    return false;
  };
  
}

export const update = async (database, path, data) => {
  try{
    await update_db(ref(database, path), data);
    return true;
  }catch(error){
    console.error(error);
    return false;
  };
  
}

export const remove = async (database, path) => {
  try{
    await delete_db(ref(database, path));
    return true;
  }catch(error){
    console.error(error);
    return false;
  };
  
}