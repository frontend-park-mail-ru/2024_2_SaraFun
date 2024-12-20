export function getRubleSuffix(balance: number): string {
    const lastDigit = balance % 10;
    const lastTwoDigits = balance % 100;
  
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'рублей';
    }
  
    switch (lastDigit) {
      case 1:
        return 'рубль';
      case 2:
      case 3:
      case 4:
        return 'рубля';
      default:
        return 'рублей';
    }
}