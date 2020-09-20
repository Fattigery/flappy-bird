let bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 220,
  birdStepY: 0,
  startColor: 'blue',
  startFlag: false,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  score: 0,

  init: function () {
    this.initData();
    this.animate();
    this.handle();

    if (sessionStorage.getItem('play')) {
      this.start();
    }
  },

  initData: function () {
    this.el = document.querySelector('#game');
    this.oBird = this.el.querySelector('.bird');
    this.oStart = this.el.querySelector('.start');
    this.oScore = this.el.querySelector('.score');
    this.oMask = this.el.querySelector('.mask');
    this.oEnd = this.el.querySelector('.end');
    this.oFinalScore = this.oEnd.querySelector('.final-score');
    this.oRankList = this.oEnd.querySelector('.rank-list');
    this.oRestart = this.oEnd.querySelector('.restart');
    this.scoreArr = this.getScore();
  },

  getScore() {
    let scoreArr = getLocal('score');
    return scoreArr ? scoreArr : [];
  },

  animate() {
    let count = 0;

    this.timer = setInterval(() => {
      this.skyMove();

      if (this.startFlag) {
        this.birdDrop();
        this.pipeMove();
      }
      if (++count % 10 === 0) {
        if (!this.startFlag) {
          this.birdJump();
          this.startBound();
        }
        this.birdFly(count);
      }
    }, 30);

    this.birdFly();
    this.startBound();
  },

  /**
   * 天空移动
   */
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + 'px';
  },

  /**
   * 小鸟蹦
   */
  birdJump: function () {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.oBird.style.top = this.birdTop + 'px';
  },

  /**
   * 小鸟飞
   */
  birdFly: function (count) {
    this.oBird.style.backgroundPositionX = (count % 3) * -30 + 'px';
  },

  birdDrop: function () {
    this.birdTop += ++this.birdStepY;
    this.oBird.style.top = this.birdTop + 'px';
    this.judgeKnock();
    this.addScore();
  },

  pipeMove: function () {
    for (let i = 0; i < this.pipeLength; i++) {
      let oUpPipe = this.pipeArr[i].up;
      let oDownPipe = this.pipeArr[i].down;

      let x = oUpPipe.offsetLeft - this.skyStep;

      if (x < -52) {
        let lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        oUpPipe.style.left = lastPipeLeft + 300 + 'px';
        oDownPipe.style.left = lastPipeLeft + 300 + 'px';
        this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;

        continue;
      }

      oUpPipe.style.left = x + 'px';
      oDownPipe.style.left = x + 'px';
    }
  },

  // getPipeHeight: function () {
  //   let upHeight = 50 + Math.floor(Math.random() * 175);
  //   let downHeight = 600 - 150 - upHeight;

  //   return {
  //     up: upHeight,
  //     down: downHeight,
  //   };
  // },

  startBound: function () {
    let prevColor = this.startColor;
    this.startColor = prevColor === 'blue' ? 'white' : 'blue';

    this.oStart.classList.remove('start-' + prevColor);
    this.oStart.classList.add('start-' + this.startColor);
  },

  judgeKnock: function () {
    this.judgeBoundary();
    this.judgePipe();
  },

  /**
   * 进行边界碰撞检测
   */
  judgeBoundary: function () {
    if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
      this.failGame();
    }
  },

  /**
   * 进行柱子碰撞检测
   */
  judgePipe: function () {
    let index = this.score % this.pipeLength;
    let pipeX = this.pipeArr[index].up.offsetLeft;
    let pipeY = this.pipeArr[index].y;
    let birdY = this.birdTop;

    if (pipeX <= 95 && pipeX >= 13 && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
      this.failGame();
    }
  },

  addScore: function () {
    let index = this.score % this.pipeLength;
    let pipeX = this.pipeArr[index].up.offsetLeft;
    if (pipeX < 13) {
      this.oScore.innerHTML = ++this.score;
    }
  },

  // 事件集中处理
  handle: function () {
    this.handleStart();
    this.handleClick();
    this.handleRestart();
  },

  handleStart: function () {
    this.oStart.onclick = this.start.bind(this);
  },

  start() {
    this.oStart.style.display = 'none';
    this.oScore.style.display = 'block';
    this.skyStep = 5;
    this.oBird.style.left = '80px';
    this.oBird.style.transition = 'none';
    this.startFlag = true;

    for (let i = 0; i < this.pipeLength; i++) {
      this.createPipe(300 * (i + 1));
    }
  },

  /**
   * 点击小鸟飞
   */
  handleClick: function () {
    this.el.onclick = e => {
      if (!e.target.classList.contains('start')) {
        this.birdStepY = -10;
      }
    };
  },

  handleRestart() {
    this.oRestart.onclick = function () {
      sessionStorage.setItem('play', true);
      window.location.reload();
    };
  },

  createPipe: function (x) {
    let upHeight = 50 + Math.floor(Math.random() * 175);
    let downHeight = 600 - 150 - upHeight;

    let oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
      height: upHeight + 'px',
      left: x + 'px',
    });

    let oDownPipe = createEle('div', ['pipe', 'pipe-bottom'], {
      height: downHeight + 'px',
      left: x + 'px',
    });

    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);

    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [upHeight, upHeight + 150],
    });
  },

  setScore() {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate(),
    });
    this.scoreArr.sort((a, b) => b.score - a.score);
    setLocal('score', this.scoreArr);
  },

  getDate: function () {
    let d = new Date();
    let year = formatNum(d.getFullYear());
    let month = formatNum(d.getMonth() + 1);
    let day = formatNum(d.getDate());
    let hour = formatNum(d.getHours());
    let minute = formatNum(d.getMinutes());
    let second = formatNum(d.getSeconds());

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },

  failGame() {
    clearInterval(this.timer);
    this.setScore();
    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
    this.oFinalScore.innerHTML = this.score;
    this.renderRankList();
  },

  renderRankList() {
    let template = '';

    for (let i = 0; i < (this.scoreArr.length >= 8 ? 8 : this.scoreArr.length); i++) {
      let degreeClass = '';
      switch (i) {
        case 0:
          degreeClass = 'first';
          break;
        case 1:
          degreeClass = 'second';
          break;
        case 2:
          degreeClass = 'third';
          break;
      }
      template += `
      <li class="rank-item">
        <span class="rank-degree ${degreeClass}">${i + 1}</span>
        <span class="rank-score">${this.scoreArr[i].score}</span>
        <span class="rank-time">${this.scoreArr[i].time}</span>
      </li>
      `;
    }
    this.oRankList.innerHTML = template;
  },
};

bird.init();
