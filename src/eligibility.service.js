class EligibilityService {
  isEligible(cart, criteria) {
      const getValue = (obj, path) => {
          return path.split('.').reduce((value, key) => {
              if (value && typeof value === 'object') {
                  return value[key];
              }
              return undefined;
          }, obj);
      };

      const checkCondition = (cartValue, condition) => {
          if (typeof condition !== 'object') {
              return cartValue == condition; 
          }

          if (condition.gt !== undefined) return cartValue > condition.gt;
          if (condition.lt !== undefined) return cartValue < condition.lt;
          if (condition.gte !== undefined) return cartValue >= condition.gte;
          if (condition.lte !== undefined) return cartValue <= condition.lte;
          if (condition.in !== undefined) return condition.in.includes(cartValue);
          if (condition.and !== undefined) return condition.and.every(subCond => checkCondition(cartValue, subCond));
          if (condition.or !== undefined) return condition.or.some(subCond => checkCondition(cartValue, subCond));

          return false; 
      };

      for (const key in criteria) {
          if (criteria.hasOwnProperty(key)) {
              const cartValue = getValue(cart, key);
              if (!checkCondition(cartValue, criteria[key])) return false;
          }
      }
      return true;
  }
}

module.exports = {
EligibilityService,
};
