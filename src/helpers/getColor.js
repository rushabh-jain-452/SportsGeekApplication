const getColor = (c) => {
  // console.log('char : ' + c);
  try {
    if (c) {
      c = c.substr(0, 1).toUpperCase();
      switch (c) {
        case 'A':
          return '#007AFF';
        case 'B':
          return '#2B8339';
        case 'C':
          return '#2A9D8F';
        case 'D':
          return '#B5179E';
        case 'E':
          return '#F77F00';
        case 'F':
          return '#3F51B5';
        case 'G':
          return '#5F0F40';
        case 'H':
          return '#FCA311';
        case 'I':
          return '#6B705C';
        case 'J':
          return '#606C38';
        case 'K':
          return '#0077B6';
        case 'L':
          return '#06D6A0';
        case 'M':
          return '#8338EC';
        case 'N':
          return '#9C6644';
        case 'O':
          return '#FB5607';
        case 'P':
          return '#FFC300';
        case 'Q':
          return '#EF476F';
        case 'R':
          return '#3F51B5';
        case 'S':
          return '#774936';
        case 'T':
          return '#00BBF9';
        case 'U':
          return '#006D77';
        case 'V':
          return '#F48C06';
        case 'W':
          return '#38B000';
        case 'X':
          return '#6D6875';
        case 'Y':
          return '#457B9D';
        case 'Z':
          return '#ED2F2F';
        default:
          return '#000';
      }
    } else {
      return '#000';
    }
  } catch (error) {
    return '#000';
  }
}

export default getColor;