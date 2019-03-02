var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=>{
  it('should generate correct Message object', ()=>{
    var from = 'Leela';
    var text = 'This should work';
    var res = generateMessage(from,text);

    expect(res.from).toEqual(from);
    expect(res.text).toEqual(text);
  });

});

describe('generateLocationMessage', ()=>{
  it('should generate correct Location Message object', ()=>{
    var from = 'Bhuvana';
    var latitude = 17.4432256;
    var longitude = 78.3826944;
    var res = generateLocationMessage(from, latitude, longitude);
    var url = `https://www.google.com/maps?${latitude},${longitude}`;

    expect(res.from).toEqual(from);
    expect(res.url).toEqual(url);

  });
});
