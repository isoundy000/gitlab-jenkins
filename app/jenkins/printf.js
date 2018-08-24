module.exports = function Printf(message){
    const color = (string='', style=0) =>{
      return '\033[' + style + 'm' + string + '\033[0m'
    };
    const printf = function(data, style){
      if(typeof data === 'string'){
        return message.push(color(data, style));
      }
      const array = [];
      [].forEach.call(arguments, ([data, style]) =>{
        array.push(color(data, style));
      });
      return message.push(array.join(''));
    };
    // 显示错误消息
    printf.error = function(string){
      if(string){
        string.split(/\n/).forEach(line =>{
          message.push(color(line, 31))
        });
      }
    }
    return printf;
  }