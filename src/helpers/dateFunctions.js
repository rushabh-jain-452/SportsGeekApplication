export const convertUTCDateToLocalDate = (date) => {
  if(!date){
    return;
  }
  // console.log(date);
  var newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));

  // var offset = date.getTimezoneOffset() / 60;
  // var hours = date.getHours();

  // newDate.setHours(hours - offset);

  // return newDate;
  return newDate.toISOString();
};

export const calDateDiffDays = (startDate, endDate) => {
  try {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let diffDays = (endDate.getTime() - startDate.getTime()) / oneDay;
    // diffDays = diffDays + 1;
    return Math.round(diffDays);
  }
  catch (err) {
    return 0;
  }
};

export const getNumberFromDate = (str) => {
  try{
    // console.log(str);
    // 2021-08-23T19:30:00.000+00:00
    const day = parseInt(str.substring(8,10));
    const mth = parseInt(str.substring(5,7));
    const yr = parseInt(str.substring(0,4));
    const total = day + mth + yr;
    return total % 2;
  }
  catch(err){
    return 0;
  }
};

export const formatDate = (dateStr) => {
  if(!dateStr){
    return '';
  }
  try{
    // const formatDate = (str) => {
    // const day = str.substring(8,10);
    // const mth = str.substring(5,7);
    // const yr = str.substring(0,4);
    // const hr = str.substring(11,13);
    // const min = str.substring(14,16);
    // const ampm;
    // if(hr < 12){
    //   ampm = 'AM';
    // }
    // else{
    //   ampm = 'PM';
    //   hr -= 12;
    // }

    // For localhost
    // console.log('Passed date : ' + dateStr);
    // const dt = new Date(dateStr);
    // const str = dt.toString();
    // // console.log(str);
    // // Wed May 26 2021 19:30:00 GMT+0530 (IST)
    // const day = str.substring(8,10);
    // const mth = str.substring(4,7);
    // const yr = str.substring(11,15);
    // const hr = str.substring(16,18);
    // const min = str.substring(19,21);
    // let ampm;
    // if(hr < 12){
    //   ampm = 'AM';
    // }
    // else{
    //   ampm = 'PM';
    //   hr -= 12;
    // }
      
    // // return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
    // return day + ' ' + mth + ' ' + yr + '  ' + hr + ':' + min + ' ' + ampm;

    // const current_timestamp = new Date();
    // console.log(current_timestamp < str);

    // console.log('--------------------------------------------');
    // console.log('Current date : ' + current_timestamp.toString());
    // console.log('Current milliseconds : ' + current_timestamp.getMilliseconds());
    // console.log('Original Date : ' + str);
    // const dt = new Date(str);
    // const dt2 = new Date(dt.toISOString());
    // console.log('Formatted date : ' + dt2.toString());
    // console.log('Match milliseconds : ' + dt2.getMilliseconds());

    // For Heroku
    // 2021-04-05T15:30:00.000+00:00
    const str = dateStr;
    const day = str.substring(8,10);
    const mth = str.substring(5,7);
    const yr = str.substring(0,4);
    let hr = str.substring(11,13);
    const min = str.substring(14,16);
    let ampm;
    if(hr < 12){
      ampm = 'AM';
    }
    else{
      ampm = 'PM';
      hr -= 12;
    }
      
    return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
  }
  catch(err){
    // console.log(err);
    return '';
  }
};