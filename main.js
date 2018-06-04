// let args = process.argv.splice(2)
// const PROCESS_NAME = args[0];
const PROCESS_NAME = "Code.exe";
const { Date, String } = require('./date');
const fs = require("fs");
const childProcess = require('child_process');
const exec = childProcess.exec;

const readFile = function (path, charset) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, charset, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
};

const viewProcessMessage = async function (name, isMainCode, cb) {
  let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return console.error(err)
    }

    var lines = stdout.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let processMessage = lines[i].trim().split(/\s+/)
      let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
      if (processName === name) {
        if (isMainCode) {
          cb && cb(processMessage[1]);
        }
        return
      }
    }
    console.log("vscode 没有打开，即将关闭本程序")
    process.exit();

  })
}

const statistic = async function () {
  // var NOWDATE = new Date().format("yyyy年MM月dd日hh时mm分");
  var NOWDATE = new Date();
  console.log(`VSCode launch at ${NOWDATE.format('yyyy年MM月dd日hh时mm分')}`);
  NOWDATE = NOWDATE.getTime();
  fs.writeFile('./last-launch', NOWDATE, { flag: 'w', encoding: 'utf-8' }, function (err, data) {
    if (err) {
      console.log("err")
    } else {
      // console.log("文件写入成功");

    }

  });

  var total_running_time = await readFile("./total-running-time", "utf-8") || 0;
  var totalTime = parseInt(total_running_time);
  var recordTotalTimer = setInterval(async function () {
    totalTime = parseInt(totalTime) + 1000 * 60;
    fs.writeFile('./total-running-time', totalTime, { encoding: 'utf-8' }, function (err, data) {
      if (err) {
        console.log("err")
      } else {
      }
    });

  }, 1000 * 60)
  var checkVSCodeALiveTimer = setInterval(function () {
    viewProcessMessage(PROCESS_NAME);
  }, 1000)
  var showTotalTimer = setInterval(function () {
    figureTotalTime(totalTime);
  }, 1000 * 60 * 4)

}

function figureTotalTime(data) {
  var leave1 = data % (3600 * 1000)
  var hours = Math.floor(data / (3600 * 1000))
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000))
  console.log(`Total Running Time:${hours} hours ${minutes} minutes`);
}

const getLastLaunchDate = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./last-launch", "utf-8", function (err, data) {
      if (err) {
        console.log('err')
        reject()
      } else {
        console.log('Last Luanch Data:', new Date(parseInt(data)).format("yyyy年MM月dd日hh时mm分ss秒"));
        console.log('Last Luanch Data:', new Date().ago(parseInt(data)));
        resolve()
      }
    });
  })
}

setTimeout(function () {
  viewProcessMessage(PROCESS_NAME, true, async function (msg) {
    //关闭匹配的进程
    // process.kill(msg)
    console.log("如果关闭了该命令行，或者关闭了VSCode，将不会统计使用时间");
  
    fs.readFile("./total-running-time", "utf-8", function (err, data) {
      if (err) {
        console.log('err')
      } else {
        //计算出小时数  

        figureTotalTime(data);
      }
    });


    await getLastLaunchDate();

    statistic();

  })
}, 1000)


