var request = require("request");
var jsonfile = require('jsonfile');
var path = require('path');

//form xiaomiquan js
function handleTime(e, o) {
  var i = function(e, o) {
    var i = e.toString().length;
    for (o || (o = 2); i < o;) e = "0" + e,
    i++;
    return e
  },
  t = new Date(e.substring(0, 23)).getTime() - 288e5;
  o ? t += o: t -= 1;
  var s = new Date(t),
  a = s.getFullYear() + "-" + i(s.getMonth() + 1) + "-" + i(s.getDate()) + "T" + i(s.getHours()) + ":" + i(s.getMinutes()) + ":" + i(s.getSeconds()) + "." + i(s.getMilliseconds(), 3) + "+0800";
  return a = encodeURIComponent(a)
}

var allTopics = [];

function getTopic(endTime) {
  var topicId = 8421258182;
  var count = 30; //max count
  endTime = endTime ? `&end_time=${endTime}`: '';
  var topicAPI = `https://wapi.xiaomiquan.com/v1.6/groups/${topicId}/topics?count=${count}${endTime}`;
  console.log(topicAPI);
  request({
    url: topicAPI,
    headers: {
      Host: 'wapi.xiaomiquan.com',
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://wx.xiaomiquan.com",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 MicroMessenger/6.5.12 NetType/WIFI Language/zh_CN",
      "Referer": `https://wx.xiaomiquan.com/mweb/views/topic/topic.html?group_id=${topicId}`,
      "Authorization": "9F8D1C7B-6B8A-D027-37E2-DBAF5C60EF74"
    }
  },
  (error, res, body) => {
    var data = JSON.parse(body);
    if (data.succeeded && data.resp_data.topics.length) {
      var topics = data.resp_data.topics;
      var endTime = topics[topics.length - 1]['create_time'];
      allTopics = allTopics.concat(topics);
      getTopic(handleTime(endTime));
    } else {
      var file = path.join(__dirname, './data.json');
      jsonfile.writeFile(file, {
        data: allTopics
      },
      function(err, obj) {
        console.log('抓取写入结束', allTopics.length);
      });
    }
  });
}

getTopic();

