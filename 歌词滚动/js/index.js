
/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词的对象
 * {time:开始时间，words:歌词内容}
 */
function parseLrc(lrc) {
    var lines = lrc.split('\n')
    var result = []
    for (var i = 0; i < lines.length; i++) {
        var str = lines[i]
        var parts = str.split(']')
        var timeStr = parts[0].substring(1)
        var obj = {
            time: parseTime(timeStr),
            words: parts[1]
        }
        result.push(obj)
    }

    return result

}

function parseTime(timeStr) {
    var parse = timeStr.split(':')
    // console.log('parse', +parse[0] * 60 + parseFloat(parse[1]))
    return +parse[0] * 60 + parseFloat(parse[1]);
}

var lrcData = parseLrc(text)

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul'),
    container: document.querySelector('.container')
}

/**
 * 计算出在当前的情况下
 * lrcData数组中，应该高亮显示的歌词下表
 */
function findIndex() {
    // 播放当前时间
    var currentTime = doms.audio.currentTime;
    for (var i = 0; i < lrcData.length; i++) {
        if (currentTime < lrcData[i].time) {
            return i - 1;
        }
    }

    // 找遍了都没找到（说明播放最后一句）
    return lrcData.length - 1
}

// 界面
// 创建歌词元素 li
function createLrcElments() {
    var frag = document.createDocumentFragment()
    for (var i = 0; i < lrcData.length; i++) {
        var li = document.createElement('li')
        li.textContent = lrcData[i].words;
        frag.appendChild(li); //改动dom树
    }
    doms.ul.appendChild(frag);
}

createLrcElments()

// 容器高度
var containerHeight = doms.container.clientHeight;
// 每个li的高度
var liHeight = doms.ul.children[0].clientHeight;

var maxOffset = doms.ul.clientHeight - containerHeight;


function setOffSet() {
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - containerHeight/2;
    if (offset < 0) {
        offset = 0
    }

    if (offset > maxOffset ) {
        offset = maxOffset
    }

    // 去掉之前的样式
    var li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }
    doms.ul.style.transform = `translateY(-${offset}px)`

    li = doms.ul.children[index];
    if (li) {
        li.classList.add('active')
    }
}

doms.audio.addEventListener('timeupdate',function(){
    console.log('播放时间变化')
    setOffSet()
})