/*********************************************************************************************
* 初始化变量
*********************************************************************************************/
var myZCloudID = "842877781350";                                   // 智云帐号
var myZCloudKey = "CQIDDgQPAw4BAQcGQxZEWVteU1FFEQ8QDAMADgAPAw0IAxkQGlpTVVIVDRgTX0BDURZPVA";                 // 智云密钥
var DemoMacA = "01:12:4B:00:8B:B3:25:85";                    	// 空气温度湿度检测节点MAC地址
var DemoMacB = "01:12:4B:00:E3:05:E4:82";                    	// 火焰烟雾传感器节点MAC地址
var DemoMacC = "01:12:4B:00:72:2A:AE:20";                    	//电压 节点MAC地址
var rtc = new WSNRTConnect(myZCloudID, myZCloudKey);            // 创建数据连接服务对象

/*********************************************************************************************
* 与智云服务连接，并监听和解析实时数据并显示
*********************************************************************************************/
$(function () {
  rtc.setServerAddr("api.zhiyun360.com:28080");                 // 设置服务器地址
  rtc.connect();                                                // 数据推送服务连接
  rtc.onConnect = function () {                                 // 连接成功回调函数
    rtc.sendMessage(DemoMacA, "{A4=?,A5=?,A6=?,A7=?,D1=?}");               // 查询初始值
    rtc.sendMessage(DemoMacB, "{A6=?,A7=?,D1=?}");               // 查询初始值
    rtc.sendMessage(DemoMacC, "{A2=?,A4=?,A5=?,A6=?,A7=?,D1=?}");               // 查询初始值
    $("#ConnectState").text("数据服务连接成功！");
  };
  rtc.onConnectLost = function () {                             // 数据服务掉线回调函数
    $("#ConnectState").text("数据服务掉线！");
  };
  rtc.onmessageArrive = function (mac, dat) {                   // 消息处理回调函数
    console.log(mac + " >>> " + dat);

    if (mac == DemoMacA) {                                   	// 判断是否是节点的数据

      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;                          // 满足条件时结束当前循环
          var lowtmp = 0;
          var hottmp = 40;
          var fir = 1000;
          var smog = 80;
          var Voltage = 200;
          var electric = 50;
          if (t[0] == "A4") {                                   // 判断参数A4
            var atm = parseFloat(t[1]);                         // 读取大气压数据
            $("#currentatm").text(atm + "hpa");                  // 在页面显示气压数据
          }
          if (t[0] == "A5") {                                   // 判断参数A5
            var air = parseFloat(t[1]);                         // 读取空气质量数据
            $("#currentair").text(air + "ppm");                   // 在页面显示空气数据
          }
          if (t[0] == "A6") {                                   // 判断参数A6
            var tmp = parseFloat(t[1]);                         // 读取温度数据
            $("#currenttmp").text(tmp + "℃");                   // 在页面显示温度数据
          }
          if (t[0] == "A7") {                                   // 判断参数A7
            var hum = parseFloat(t[1]);                         // 读取湿度数据
            $("#currenthum").text(hum + "Rh");                   // 在页面显示湿度度数据
          }
          if (t[0] == "D1") {                                   // 判断参数D1
            var LightStatus = parseInt(t[1]);                   // 根据D1的值来进行开关的切换
            if (((LightStatus & 0x80) == 0x80) && (tmp < lowtmp)) {             //空调1开关的切换
              $('#btn_kt1').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x80) == 0) {
              $('#btn_kt1').attr('src', 'images/an-off.png')
            }
            if (((LightStatus & 0x40) == 0x40) || (tmp > hottmp)) {             //空调2开关的切换
              $('#btn_kt2').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x40) == 0) {
              $('#btn_kt2').attr('src', 'images/an-off.png')
            }
            if (((LightStatus & 0x20) == 0x20) || (tmp > hottmp)) {             //风扇开关的切换
              $('#btn_fs').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x20) == 0) {
              $('#btn_fs').attr('src', 'images/an-off.png')
            }
          }
        }
      }
    }
    if (mac == DemoMacB) {                                   	// 判断是否是节点的数据

      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;                          // 满足条件时结束当前循环
          if (t[0] == "A6") {                                   // 判断参数A6
            var cono = parseFloat(t[1]);                         // 读取烟雾浓度数据
            $("#currencono").text(cono + "");                  // 在页面显示烟雾浓度数据
          }
          if (t[0] == "A7") {                                   // 判断参数A7
            var fire = parseFloat(t[1]);                         // 读取火焰数据
            $("#currentfire").text(fire + "");                   // 在页面显示火焰数据
          }
          if (t[0] == "D1") {                                   // 判断参数D1
            var LightStatus = parseInt(t[1]);                   // 根据D1的值来进行开关的切换
            if (((LightStatus & 0x80) == 0x80) || (fire > fir)) {                  //消防水泵的开关切换
              $('#btn_sb').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x80) == 0) {
              $('#btn_sb').attr('src', 'images/an-off.png')
            }
            if (((LightStatus & 0x40) == 0x40) || (cono > smog)) {                  //烟雾报警的开关切换
              $('#btn_yw').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x40) == 0) {
              $('#btn_yw').attr('src', 'images/an-off.png')
            }
          }
        }
      }
    }
    if (mac == DemoMacC) {                                   	// 判断是否是节点的数据

      if (dat[0] == '{' && dat[dat.length - 1] == '}') {        // 判断字符串首尾是否为{}
        dat = dat.substr(1, dat.length - 2);                    // 截取{}内的字符串
        var its = dat.split(',');                               // 以‘,’来分割字符串
        for (var x in its) {                                    // 循环遍历
          var t = its[x].split('=');                            // 以‘=’来分割字符串
          if (t.length != 2) continue;                          // 满足条件时结束当前循环
          if (t[0] == "A4") {                                   // 判断参数A4
            var epc = parseFloat(t[1]);                         // 读取用电量数据
            $("#currentepc").text(epc + "KW*H");                  // 在页面显示用电量数据
          }
          if (t[0] == "A5") {                                   // 判断参数A5
            var Unum = parseFloat(t[1]);                         // 读取电压值数据
            $("#currentUnum").text(Unum + "V");                   // 在页面显示电压值数据
          }
          if (t[0] == "A6") {                                   // 判断参数A6
            var I = parseFloat(t[1]);                         // 读取电流值数据
            $("#currentI").text(I + "A");                   // 在页面显示电流值数据
          }
          if (t[0] == "A7") {                                   // 判断参数A7
            var PWR = parseFloat(t[1]);                         // 读取功率值数据
            $("#currentPWR").text(PWR + "W");                   // 在页面显示功率值数据
          }
          if (t[0] == "D1") {                                   // 判断参数D1
            var LightStatus = parseInt(t[1]);                   // 根据D1的值来进行开关的切换
            if (((LightStatus & 0x80) == 0x80) || (U < Voltage) || (I < electric)) {          //柴油发电机的开关
              $('#btn_fdj').attr('src', 'images/an-on.png')
            } else if ((LightStatus & 0x80) == 0) {
              $('#btn_fdj').attr('src', 'images/an-off.png')
            }
          }
        }
      }
    }
  };
});

/*********************************************************************************************
* 处理按键事件
*********************************************************************************************/
$('#btn_kt1').click(function () {                                      //用D1实现对风扇1开和关的控制
  if (($('#btn_kt1').attr('src') == 'images/an-on.png') && (mac == DemoMacA)) {
    rtc.sendMessage(DemoMacA, "{CD1=128,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacA, "{OD1=128,D1=?}");                   // 发送打开指令
  }
})
$('#btn_kt2').click(function () {                                    //用D1实现对风扇2的控制
  if (($('#btn_kt2').attr('src') == 'images/an-on.png') && (mac == DemoMacA)) {
    rtc.sendMessage(DemoMacA, "{CD1=64,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacA, "{OD1=64,D1=?}");                   // 发送打开指令
  }
})
$('#btn_fs').click(function () {                                     //用D1实现对风扇开与关的控制
  if (($('#btn_fs').attr('src') == 'images/an-on.png') && (mac == DemoMacA)) {
    rtc.sendMessage(DemoMacA, "{CD1=32,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacA, "{OD1=32,D1=?}");                   // 发送打开指令
  }
})
$('#btn_sb').click(function () {                                     //用D1实现对水泵开与关的控制
  if (($('#btn_sb').attr('src') == 'images/an-on.png') && (mac == DemoMacB)) {
    rtc.sendMessage(DemoMacB, "{CD1=128,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacB, "{OD1=128,D1=?}");                   // 发送打开指令
  }
})
$('#btn_yw').click(function () {                                    //用D1实现对烟雾报警器开与关的控制
  if (($('#btn_yw').attr('src') == 'images/an-on.png') && (mac == DemoMacB)) {
    rtc.sendMessage(DemoMacB, "{CD1=64,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacB, "{OD1=64,D1=?}");                   // 发送打开指令
  }
})
$('#btn_fdj').click(function () {                                         //用D1实现对发电机开与关的控制
  if (($('#btn_fdj').attr('src') == 'images/an-on.png') && (mac == DemoMacC)) {
    rtc.sendMessage(DemoMacC, "{CD1=128,D1=?}");                   // 发送关闭指令
  } else {
    rtc.sendMessage(DemoMacC, "{OD1=128,D1=?}");                   // 发送打开指令
  }
})