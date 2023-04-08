import AppError from "../error/appError"

// export const tranformPennyInPriceFloat = ( penny:number ):number => {

//     if( String( penny ).includes(".") || String( penny ).includes(",") ){
//         throw new AppError("Deve ser um numero inteiro")
//     }      

//     const priceString = String( penny )
//     const createAllPrice = priceString.split("").reverse()
//     createAllPrice.splice(2, 0, ".")
//     createAllPrice.reverse()

//     return parseFloat(createAllPrice.join("")) 
// }

interface IValue {
    penny:string
    value:string
    valueFomart:string
  }
  
  export const tranformPennyInPriceFloat = (penny: number): IValue => {
    const priceString = String(penny);
    let createAllPrice = priceString.split("").reverse()
  
    const pennyValue = createAllPrice.splice(0,2)
    let value = createAllPrice.splice(0,createAllPrice.length)
  
    for (let i = 3; i < value.length; i += 4) {
      value.splice(i, 0, ".")
    }
  
    const pennyFormat = pennyValue.reverse().join("")
    const valueFormat = value.reverse().join("")
  
    return {
      penny:pennyFormat,
      value:valueFormat,
      valueFomart:`${valueFormat},${pennyFormat}`
    }
  };