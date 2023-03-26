'use strict';

// ローカルストレージのデータを単語帳に表示する
setWords(0)
function setWords(page) {
    for (let i = 1; i < 11; i++) {
        document.getElementById(`no${i}`).innerText = i + page;
        document.getElementById(`no${i}word`).innerText = localStorage.key(i + page - 1);
        document.getElementById(`no${i}mean`).innerText = localStorage.getItem(localStorage.key(i + page - 1));
    }
}
// ボタンのアクション設定
document.getElementById("btnRegister").addEventListener("click", registerWord);
document.getElementById("btnRemove").addEventListener("click", removeWord);
document.getElementById("btnLeft").addEventListener("click", leftReset);
document.getElementById("btnRight").addEventListener("click", rightReset);
document.getElementById("changeTextColor").addEventListener("click", changeTextColor);

document.getElementById("regText").innerText = `登録済み　${localStorage.length}　語`;


// ボタン　文字と意味の登録関数
function registerWord() {
    const inputWord = document.getElementById("entryWord").value;
    const inputMean = document.getElementById("entryMean").value;
    if (inputWord === "") {
        document.getElementById("regText").innerText = "単語を入力してください";
    } else if (inputMean === "") {
        document.getElementById("regText").innerText = "意味を入力してください";
    } else {
        localStorage.setItem(inputWord, inputMean);
        //console.log(inputWord, inputMean)
        document.getElementById("regText").innerText = `" ${inputWord} " を登録しました（${localStorage.length}語）`;
        pageNum = 0;
        setWords(0);
    }
}

// ボタン　文字と意味の削除関数
function removeWord() {
    const inputWord = document.getElementById("entryWord").value;
    const checkWord = localStorage.getItem(inputWord);
    console.log(checkWord);
    if (checkWord === null) {
        document.getElementById("regText").innerText = `" ${inputWord} " は登録されていません`;
        console.log(`" ${inputWord} " は登録されていません`);
    } else {
        localStorage.removeItem(inputWord);
        document.getElementById("regText").innerText = `" ${inputWord} " を削除しました（${localStorage.length}語）`;
        console.log("削除しました");
        pageNum = 0;
        setWords(0);
    }
}

//　左ボタン
let pageNum = 0;
function leftReset() {
    if (pageNum > 0) {
        pageNum -= 10;
        setWords(pageNum);
    }
}

//　右ボタン
function rightReset() {
    if (pageNum < localStorage.length - 10) {
        pageNum += 10;
        console.log(pageNum);
        setWords(pageNum);
    }
}

//　文字色反転
let flagColor = false;
function changeTextColor() {
    if (!flagColor) {
        for (const element of document.getElementsByClassName("tmean")) {
            element.style.color = "white";
        }
        flagColor = true;
    } else {
        for (const element of document.getElementsByClassName("tmean")) {
            element.style.color = "#333333";
        }
        flagColor = false;
        
    }
}

//////////////////////////////
// テスト
//////////////////////////////
let randomKeyList = []; //全リストのランダム並べ替え
let randomQuestion10; //問題10個分のランダムKey配列

let questionCounter = 0;
let flagAnser = false;

// ボタンのアクション設定
document.getElementById("start").addEventListener("click", setStartQuestion);

// 開始ボタン
function setStartQuestion() {
    document.getElementById("container").style.display = "block";
    if (questionCounter === 0) {
        document.getElementById("start").innerText = "リセット";
    }
    questionCounter = 0; //問題カウンター初期化 
    resultNum = 0;
    randomKeyList = [];//全リストのランダム並べ替え 初期化  
    flagAnser = false;
    randomSeeds4(); //ランダムkeyリスト,１０個リスト生成
    setQuestion(); //問題、回答表示
}

// ローカルストレージのデータをテスト用ボタンに表示する
function setQuestion() {
    const word = localStorage.key(randomQuestion10[questionCounter]);
    if (localStorage.length >= 4){
        document.getElementById("question").innerText = `第${questionCounter + 1}/10問 : ${word}`;
    }
    const randomAnserListExceptQuestion = randomKeyList.concat();
    randomAnserListExceptQuestion.splice((questionCounter), 1); //問題以外Key配列
    arrayShuffle(randomAnserListExceptQuestion);
    const new4Array = randomAnserListExceptQuestion.concat().slice(0, 3);
    new4Array.push(randomKeyList[questionCounter]);
    const randomNew4Array = arrayShuffle(new4Array);

    console.log("counter", questionCounter);
    console.log("before", randomAnserListExceptQuestion);
    console.log("after", arrayShuffle(randomAnserListExceptQuestion));
    console.log("new4Array before", new4Array);
    console.log("new4Array after", arrayShuffle(new4Array));

    for (let i = 0; i < 4; i++) {
        let key = localStorage.key(randomNew4Array[i]);
        console.log(i, key, typeof key);
        document.getElementById(`btn${i + 1}`).innerText = localStorage.getItem(key);
        document.getElementById(`btn${i + 1}`).style.backgroundColor = "white";
        document.getElementById(`btn${i + 1}`).style.color = "#333333";
    }
}


// 配列ランダムシャッフル フィッシャーイェーツ
function arrayShuffle(array) {
    for (let i = (array.length - 1); i >= 0; i--) {
        const randomNumber = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
    }
    return array;
}

function randomSeeds4() {
    const min = 0;
    const max = localStorage.length - 1;
    if (localStorage.length < 4) {
        document.getElementById("question").innerText = "単語を４語以上登録してください。";
    } else {
        for (let i = 1; i <= localStorage.length; i++) {
            while (true) {
                let tmp = intRandom(min, max);
                if (!randomKeyList.includes(tmp)) {
                    randomKeyList.push(tmp);
                    break;
                }
            }
        }
    }
    console.log(randomKeyList);
    randomQuestion10 = randomKeyList.slice(0, 10);
    console.log(randomQuestion10);
}

function intRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 回答ボタンのアクション設定
for (let i = 1; i < 5; i++) {
    document.getElementById(`btn${i}`).addEventListener("click", anserCheck.bind(i));
}

//　回答ボタンの呼び出し関数
function anserCheck() {
    console.log(flagAnser, "flag");
    //console.log(localStorage.getItem(localStorage.key(randomQuestion10[questionCounter])))
    if (questionCounter < 10) {
        if (!flagAnser) {
            btnStyleChenge(this);
            flagAnser = true;
            if (questionCounter === 9) {
                resetBtn();
            }
        } else {
            resetBtn()
            flagAnser = false;
        }
    }
}

let resultNum = 0;
function btnStyleChenge(num) {
    console.log("ボタン押したよ", num);
    if (document.getElementById(`btn${num}`).innerText === localStorage.getItem(localStorage.key(randomQuestion10[questionCounter]))) {
        document.getElementById(`btn${num}`).innerText = "正解";
        document.getElementById(`btn${num}`).style.color = "green";
        document.getElementById(`btn${num}`).style.backgroundColor = "yellowgreen";
        resultNum += 1;
    } else {
        document.getElementById(`btn${num}`).innerText = "不正解";
        document.getElementById(`btn${num}`).style.color = "333333";
        document.getElementById(`btn${num}`).style.backgroundColor = "#FF6347";

    }
    const numArray = [1, 2, 3, 4];
    numArray.splice((num - 1), 1);
    console.log(numArray);
    for (const element of numArray) {
        document.getElementById(`btn${element}`).innerText = "　　　　";
    }

}

function resetBtn() {
    if (questionCounter < 9) {
        questionCounter += 1;
        setQuestion();
    } else {
        if (resultNum === 10) {
            document.getElementById("question").innerText = `🤗おめでとう！１０点満点です！`;
        } else if (resultNum > 3) {
            document.getElementById("question").innerText = `😁１０問中${resultNum}問正解！`;
        } else if (resultNum > 0) {
            document.getElementById("question").innerText = `😫がんばりましょう！１０問中${resultNum}問正解`;
        } else if (resultNum === 0) {
            document.getElementById("question").innerText = `👿ちゃんとやりなさい👿`;
        }
        console.log("QC,", questionCounter);
        questionCounter += 1;
    }
}









