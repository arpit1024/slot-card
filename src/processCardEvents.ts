import { CardEvent, Transaction } from './types'

type CardTransactionMapping = {
  [cardId: string]: Transaction
}

/**
 * Write a function that receives a large batch of card events from multiple cards,
 * returning an object which maps from cardId -> valid transaction. Only cardIds with
 * a valid transaction should appear in the returned object.
 *
 * A valid transaction is a pair of card events, starting with a RESERVATION event
 * and finishing with either a CONFIRMATION or CANCELLATION event.
 *
 * The input is an array of unprocessed card events. Some events might be duplicated
 * or missing. For duplicated events, you may only use one of its occurrences and
 * discard the rest. Missing events invalidate the transaction.
 *
 * @param cardEvents CardEvent[] List of card events
 * @returns CardTransactionMapping Valid transactions grouped by cardId
 */
export const processCardEvents = (cardEvents: CardEvent[]): CardTransactionMapping => {

  // logic

  var uniqueArr = cardEvents.filter((v,i,a)=>a.findIndex(t=>(t.id===v.id))===i) //Filtering duplicates
     
  let map = new Map();
  for (let i = 0; i < uniqueArr.length; i++) { 
   for (let j = i+1; j < uniqueArr.length; j++) {
     let cardId =uniqueArr[i].cardId      
     //Matching a possible transaction
     if(uniqueArr[i].amount == uniqueArr[j].amount && uniqueArr[i].cardId == uniqueArr[j].cardId){ 
             // Checking if it is a valid transaction
        if((uniqueArr[i].type =='RESERVATION' && uniqueArr[j].type =="CANCELLATION" || uniqueArr[j].type=="CONFIRMATION" )|| (uniqueArr[i].type =="CANCELLATION"||uniqueArr[i].type=="CONFIRMATION" && uniqueArr[j].type =="RESERVATION")){
         map.has(cardId)===true?map.get(cardId).push(...[uniqueArr[i],uniqueArr[j]]):map.set(cardId,[uniqueArr[i],uniqueArr[j]])
        } 
   }
     //  if(uniqueArr[i].amount == uniqueArr[j].amount && uniqueArr[i].cardId == uniqueArr[j].cardId &&(uniqueArr[i].type == "RESERVATION" && uniqueArr[j].type =="CANCELLATION" || uniqueArr[j].type=="CONFIRMATION")){ 
     //      map.has(cardId)===true?map.get(cardId).push(uniqueArr[i]).push(uniqueArr[j]):map.set(cardId,[uniqueArr[i],uniqueArr[j]]) 
     //  }
   }
  }  
  let obj = Array.from(map).reduce((obj, [key, value]) => (
   Object.assign(obj, { [key]: value }) 
 ), {});  
  return obj as CardTransactionMapping
}
