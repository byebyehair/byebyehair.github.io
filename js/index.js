var offset = 0;
var limit = 5;
// var server = "https://moment.hanyu.me/api/v1/memo";
var server = "https://moment.hanyu.me/";

const {
    createApp
} = Vue;

const app = createApp({
    delimiters: ['{[', ']}'],
    data() {
        return {
            loadingtext:true,
            users:[],
            items: [],
            preAndSuf: {
                localImgPrefix: "https://hi.laohan.net/o/r/",
                localImgSuffix: "?thumbnail=1",
                remoteImgSuffix: "?q=15",
            },
            button: {
                loadbtn: {
                    text: "点击加载更多",
                    loadmore: true
                },
                navBtn: [{
                    title: "去登录，查看更多",
                    subTitle: "",
                    url: "https://hi.laohan.net/auth"
                }]
            }
        }
    },
    computed: {
        isMobile() {
            return window.innerWidth <= 768;
        },

    },
    methods: {
        tags(obj) {
            return tagHandle(obj);
        },
        imgClassHanle(obj) {
            return (obj.resourceList != undefined ? obj.resourceList.length: 0) == 1 ? 'single-pic': 'pic';
        },
        next(event) {
            this.button.loadbtn.text = "耐心等待，正在加载，有些缓慢...";
            offset += limit;
            const that = this;
            gets(that,
            function(data) {
                that.items.push(...data);
                that.button.loadbtn.text = "点击加载更多";
            });

        },
        formatDate(value) {
            return format(value, "yyyy-MM-dd HH:mm:ss");
        },
        load(event) {
            next();
        },
        markedContent(content){
            return marked.parse(content)
        }
    },
    mounted: function() {
        this.button.loadbtn.text = "耐心等待，正在加载，有些缓慢...";
        const that = this;
        gets(that,
        function(data) {
            that.items.push(...data);
            that.button.loadbtn.loadmore = true;
             that.button.loadbtn.text = "点击加载更多";
        });
    }
});

const vm = app.mount('#app');


function gets(that, callback) {
    if (that.button.loadbtn.loadmore == false) {
        return;
    }
    // that = this;
    var url = server + "api/v1/memo/all?offset=" + offset + "&limit=" + limit;
    var promise = fetch(url).then(function(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            return {}
        }
    });

    promise = promise.then(function(data) {
        if (data == undefined || data.length == 0) {
            vm.$data.button.loadbtn.loadmore = false;
            return;
        }
        getitemsuccess(data, callback);

    }).
    catch(function(err) {
        console.log(err);
    });
}

function getitemsuccess(data, callback) {
    console.log(data);
    callback(data);
};

// function format(value,args){
//     //var dt = new Date(value*1000);
//     const dt = new Date(value);
//     if(args == 'yyyy-M-d') {// yyyy-M-d
//         let year = dt.getFullYear();
//         let month = dt.getMonth() + 1;
//         let date = dt.getDate();
//         return `${year}-${month}-${date}`;
//     } else if(args == 'yyyy-M-d H:m:s'){// yyyy-M-d H:m:s
//         let year = dt.getFullYear();
//         let month = dt.getMonth() + 1;
//         let date = dt.getDate();
//         let hour = dt.getHours();
//         let minute = dt.getMinutes();
//         let second = dt.getSeconds();
//         return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
//     } else if(args == 'yyyy-MM-dd') {// yyyy-MM-dd
//         let year = dt.getFullYear();
//         let month = (dt.getMonth() + 1).toString().padStart(2,'0');
//         let date = dt.getDate().toString().padStart(2,'0');
//         return `${year}-${month}-${date}`;
//     } else {// yyyy-MM-dd HH:mm:ss
//         let year = dt.getFullYear();
//         let month = (dt.getMonth() + 1).toString().padStart(2,'0');
//         let date = dt.getDate().toString().padStart(2,'0');
//         let hour = dt.getHours().toString().padStart(2,'0');
//         let minute = dt.getMinutes().toString().padStart(2,'0');
//         let second = dt.getSeconds().toString().padStart(2,'0');
//         return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
//     };
// }
var isEmpty = function(value) {
    if (value == null || value == undefined || value == "") {
        return true;
    }
}

var isListEmpty = function(value) {
    if (value == null || value == undefined || value.length == 0) {
        return true;
    }
}

// 时间格式化
function format(timestamp) {
    // 创建 Date 对象
    var date = new Date(timestamp * 1000);

    // 获取各种时间组件
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // 月份从 0 开始，所以需要加 1
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // 格式化时间
    var formattedTime = year + '-' + addLeadingZero(month) + '-' + addLeadingZero(day) + ' ' + addLeadingZero(hours) + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds);

    return formattedTime;
}

// 在个位数前添加前导零
function addLeadingZero(number) {
    return number < 10 ? '0' + number: number;
}

var rendererMD = new marked.Renderer();
marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

hljs.initHighlightingOnLoad();

String.prototype.lefttrim = function() {
    return this.replace(/(^\s*)/g, "");
}

function tagHandle(obj) {
    var content = obj.content;
    content = content.lefttrim();
    var tags = [];
    if (content.indexOf("#") == 0) {
        var k = 0;
        for (var j = 0; j < content.length; j++) {
            var temp = j + 1 == content.length ? true: false;
            if (content.charAt(j) == " " || content.charAt(j) == "\n" || content.charAt(j) == "\t" || temp) {
                j = temp ? j + 1 : j;
                var tag = content.substring(k, j);
                tags.push(tag);
                k = j + 1;
                if (content.charAt(j + 1) != "#") {
                    break;
                }
            }
        }
        content = content.substring(k, content.length);
        obj["tags"] = tags;
    }

    content = marked(content);
    content = content.replace("\n", "<p></p>");
    obj.content = content;
    return obj;
}

function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");　　 //search,查询？后面的参数，并匹配正则
    var r = location.search.substr(1).match(reg);　　
    if (r != null) return decodeURI(decodeURI(r[2]));
};

// 菜单
var menuShow = false;
function shows() {
    var elements = document.querySelectorAll('.menu-list');
    elements.forEach(function(element) {
        if (menuShow) {
            element.style.display = 'none'
        } else {
            element.style.display = 'block'
        }
        menuShow = !menuShow
    });
}
var elements = document.querySelectorAll('.menu-list');
elements.forEach(function(element) {
    element.addEventListener('blur', () =>{
        element.style.display = 'none'
    })
});

/****/

// var token = "";

// function login(){
    
//     // that = this;
//     var url = server + "api/v1/auth/signin";
//     var param = {
//       "username": " ",
//       "password": " ",
//       "remember": true
//     };
//     var promise = fetch(url,{
//         method:"POST",
//         // headers: {
//         //     'Content-Type': 'application/x-www-form-urlencoded'
//         //   },
//          headers: {
//             "content-type": "application/json; charset=UTF-8",
//             "accept": "*/*",
//           },
//         body: JSON.stringify(param),
//         // credentials: 'include'
//     }).then(function(response) {
//         if (response.status === 200) {

//             return response.json();
//         } else {
//             return {}
//         }
//     });

//     promise = promise.then(function(data) {
//         // if (data == undefined || data.length == 0) {
//         //     vm.$data.button.loadbtn.loadmore = false;
//         //     return;
//         // }
//         console.log(data);
//          vm.$data.users.push(data);
//          token = data;

//         // getitemsuccess(data, callback);

//     }).
//     catch(function(err) {
//         console.log(err);
//     });
// }