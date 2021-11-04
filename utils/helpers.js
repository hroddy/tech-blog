module.exports = {
    format_date: date => {
      console.log("type of", typeof date) // console.log(Date.parse(date).getMonth() + 1)
      console.log("date", date)
      console.log("new date", new Date(date).getMonth() + 1)
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },
    format_url: url => {
      return url
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('/')[0]
        .split('?')[0];
    },
    format_plural: (word, amount) => {
      if (amount !== 1) {
        return `${word}s`;
      }
  
      return word;
    }
  };
  