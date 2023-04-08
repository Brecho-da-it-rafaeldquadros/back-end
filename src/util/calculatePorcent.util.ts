export const calculatePorcent = async (
  price: string,
  porcent: string | null
) => {
  let priceAll = 0;
  let percentageService = 0;
  let priceService = 0;
  let priceSeller = +price;

  if (porcent) {
    if (+porcent < 100) {
      priceAll = +price * +`0.${porcent}` + +price;
      percentageService = 25;
      priceService = priceAll - +price;
    } else if (+porcent >= 100) {
      priceAll = +price * +`${porcent[0]}.${porcent[1] + porcent[2]}` + +price;
      percentageService = 25;
      priceService = priceAll - +price;
    }
  } else if (+price <= 300) {
    priceAll = +price * 0.25 + +price;
    percentageService = 25;
    priceService = priceAll - +price;
  } else if (+price > 300 && +price < 1000) {
    priceAll = +price * 0.2 + +price;
    percentageService = 20;
    priceService = priceAll - +price;
  } else {
    priceAll = +price * 0.18 + +price;
    percentageService = 18;
    priceService = priceAll - +price;
  }
  priceAll.toFixed(2);
  percentageService.toFixed(2);
  priceService.toFixed(2);
  priceSeller.toFixed(2);
  return { priceAll, percentageService, priceService, priceSeller };
};
