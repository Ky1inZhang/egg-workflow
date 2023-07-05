let hostname = location.origin;
let req = axios.create({
  // baseURL: 'http://192.168.43.16:7001',
  baseURL: hostname
})

var getData = async (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // req.get(url).then(res=>{			//url:http://127.0.0.1:80/api
      //   resolve(res.data);
      // }).catch(err=>{
      //   console.error(err);
      // });
      // cf异常 通过使用匿名函数，可以避免TypeError异常，因为函数将作为函数表达式调用，而不是作为对象的方法调用
      req.get(url).then(function(res) {
          resolve(res.data);
      }).catch(function(err) {
          console.error(err);
      });
    },0)
  })
}

                    
function goAdd() {
  var name = $('input[type=search]')[0].value;
  if(name.length == 0 ) return false;
  let user = JSON.parse(localStorage.getItem("user"));
  if(user.length != 0) {
    goUpdate(user[0].id,name);
    return false;
  }
  $.alert({
      title: '  ',
      content: '  是否确认添加会员卡记录?',
      animation: 'scale',
      closeAnimation: 'bottom',
      backgroundDismiss: true,
      buttons: {
           ok: {
              text: '  ok  ',
              btnClass: 'btn-blue',
              action: function(){
                  add(name)
              }
          }
      }
  });
}
async function add(name) {
  let row = await this.getData(`add/${name}`);
    if(row > 0) {
      find(name);
      tip('OK, 操作成功！');
    }
}

$("#focus").keypress(function(event){
    if(event.which === 13) { 
        //点击回车要执行的事件
        find();
     }
})

async function find (name){
  name = name || $('input[type=search]')[0].value;
  if(name.length == 0) {
    all();
  } else {
    let user = await this.getData(`find/${name}`);
    localStorage.setItem("user",JSON.stringify(user));
    $(".results").empty();
    if(user.length != 0) {
      render(user);
    } else {
      $(".results").append('<h3 id="inform">— 暂无记录 请点击+添加(10次/卡). —</h3>');
    }
  }
}

function goUpdate(name){
  $.alert({
      title: '  ',
      content: '  确认续卡？剩余次数将会累加。',
      animation: 'scale',
      closeAnimation: 'bottom',
      backgroundDismiss: true,
      buttons: {
           ok: {
              text: '  ok  ',
              btnClass: 'btn-blue',
              action: function(){
                update(name);
              }
          }
      }
  });
}

async function update (name) {
  let row = await this.getData(`update/${name}`);
  if(row > 0) {
    find(name);
    tip('OK, 操作成功！');
  }
}

function goCost(name) {
  $.alert({
      title: '  ',
      content: '  确认消费？剩余次数将-1。',
      animation: 'scale',
      closeAnimation: 'bottom',
      backgroundDismiss: true,
      buttons: {
           ok: {
              text: '  ok  ',
              btnClass: 'btn-blue',
              action: function(){
                cost(name);
              }
          }
      }
  });
}

async function cost (name) {
  let row = await this.getData(`cost/${name}`);
  if(row > 0) {
    find(name);
    tip('OK, 操作成功！');
  }
}

function render(user) {
  $(".results").empty();
  let html = '';
  user.forEach(item => {
    var button = '';
    if(item.times>0){
      button = `<button  class="shinydarken enable" onclick="goCost('${item.name}')">消费</button>`
    }else{
      button = `<button  disabled  class="shinydarken disabled">消费</button>`
    }
    html += `<div class="card">
              <div class="items" onclick="showItems('${item.name}')">${item.name}</div>
              <cite>剩余次数:  <span class="times">${item.times}</span></cite><br>
              <cite>办卡次数:  <span class="all_times">${item.all_times}</span></cite><br>
              <cite>上次消费时间:</cite><br>
              <cite><span class="record_time">${item.record_time}</span></cite><br>
              <cite>
                <button class="shiny" onclick="goUpdate('${item.name}',this)">续卡</button>
                ${button}
              </cite>
            </div>`
            // <button  disabled class="shinydarken" onclick="cost(${item.id})">消费</button>
  });
  $(".results").append(html);
}

async function showItems(name){
  $.dialog({
      title: '消费记录详情',
      content: `url:${hostname}/items/${name}`,
      animation: 'scale',
      columnClass: 'medium',
      closeAnimation: 'scale',
      backgroundDismiss: true,
  });
}

async function all () {
  let user = await this.getData("all");
  $("#inform").empty();
  render(user);
}

function tip(text){
  $('.bounceInDown').html(text).fadeIn(500).delay(2000).slideUp(500);
}

all();


