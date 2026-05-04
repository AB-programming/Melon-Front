function numberDisplay(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 10000) {
    if (num % 1000 === 0) {
      return (num / 1000) + 'k';
    } else {
      return Math.floor(num / 100) / 10 + 'k';
    }
  } else if (num < 1000000) {
    if (num % 10000 === 0) {
      return (num / 10000) + 'w';
    } else {
      return Math.floor(num / 1000) / 10 + 'w';
    }
  } else {
    return '100w+';
  }
}

export {numberDisplay}