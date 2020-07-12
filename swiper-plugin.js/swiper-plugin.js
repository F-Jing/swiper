class swiper {
  constructor(props, opt) {
    this._$ = selector => document.querySelectorAll(selector);
    this._setAttribute = (elem, name, value) => elem.setAttribute(name, value);
    this._creatElement = type => document.createElement(type);
    this._propsNum = this._$(props).length;
    this._slides = []
    this._num = []
    this._translateX = []
    this._width = []
    this._length = []
    this._containers = []
    // this._paginationEl = []
    for (let i = 0; i < this._propsNum; i++) {
      let temp = this._$(props)[i].children[0];
      this._slides.push(temp);
      this._slide = this._slides[i].children;
      this._length.push(this._slides[i].children.length);
      this._width.push(null)
      this._num.push(0)
      this._translateX.push(null)
      this._containers.push(this._$(props)[i]);
    }
    this._opt = opt;
    this._props = props
    this._init();
  }
  _init() {
    this._initSwiper();
    this.swiperButton();
    this.pagination();
  }
  _initSwiper() {
    this._slides.map((data, index) => {
      let first = this._slide[this._length[index] - 1].cloneNode(true);
      let last = this._slide[0].cloneNode(true);
      data.appendChild(last);
      data.prepend(first);
      this._translateX[index] = -(data.clientWidth);
      this._width[index] = data.clientWidth;
      data.style.transform = `translateX(-${data.clientWidth}px)`;
    });
    let temp = [...this._slide];
    temp.map((data, index) => {
      this._setAttribute(data, 'data-index', `${index}`)
    });
    let conTemp = [...this._containers];
    conTemp.map((data, index) => {
      this._setAttribute(data, 'data-id', `${index}`)
    })
    window.addEventListener('resize', this.resize.bind(this));
  }
  swiperButton() {
    let btnLength = [...this._$('.swiper-button-prev')].length
    for (let i = 0; i < btnLength; i++) {
      let next = this._$(`${this._opt.swiperButton.nextEl}`)[i];
      let prev = this._$(`${this._opt.swiperButton.prevEl}`)[i];
      next.addEventListener('click', this.next.bind(this));
      prev.addEventListener('click', this.prev.bind(this));
    }
  }
  resize() {
    for (let i = 0; i < this._propsNum; i++) {
      let width = this._$('.swiper-wrapper')[i].offsetWidth;
      let num = this._num[i];
      let translateX = -(width + width * num);
      this._slides[i].style.transform = `translateX(${translateX}px)`;
      this._translateX[i] = translateX;
      this._width[i] = width;
    }
  }
  setSwiper(val, i) {
    let width = this._width[i];
    let duration = swiper.duration;
    let begin = this._translateX[i];
    let end = -(width + width * val);
    if (swiper.lock) {
      return;
    }
    swiper.lock = true;
    swiper.animateTo(begin, end, duration, function (value) {
      mySwiper._slides[i].style.transform = `translateX(${value}px)`;
    }, function (value) {
      if (mySwiper._opt.loop == true) {
        if (val == mySwiper._length[i]) {
          val = 0;
          value = -(mySwiper._width[i] + mySwiper._width[i] * val)
        }
        if (val == -1) {
          val = mySwiper._length[i] - 1;
          value = -(mySwiper._width[i] + mySwiper._width[i] * val)
        }
        mySwiper._slides[i].style.transform = `translateX(${value}px)`
        mySwiper._translateX[i] = value;
        mySwiper._num[i] = val;
      }
      swiper.lock = false;
      if (mySwiper._paginationEl[i] !== "") {
        swiper.highligh(val, i)
      }
    })
  }
  static animateTo(begin, end, duration, processCallback, finishCallback) {
    let startTime = Date.now();
    requestAnimationFrame(function update() {
      let timeNow = Date.now();
      let processTime = timeNow - startTime;
      let value = swiper.linear(begin, end, duration, processTime)
      processCallback(value);
      if (startTime + duration > timeNow) {
        requestAnimationFrame(update);
      } else {
        finishCallback(end);
      }
    })
  }
  static linear(begin, end, duration, processTime) {
    return ((end - begin) * processTime / duration + begin);
  }
  prev(e) {
    for (let i = 0; i < this._propsNum; i++) {
      if (e.target.parentNode.dataset.id == i) {
        let num = Number(this._num[i] - 1);
        if (this._opt.loop == false) {
          if (num < 0) {
            return
          }
        }
        this.setSwiper(num, i, e);
      }
    }
  }
  next(e) {
    for (let i = 0; i < this._propsNum; i++) {
      if (e.target.parentNode.dataset.id == i) {
        let num = Number(this._num[i] + 1);
        if (this._opt.loop == false) {
          if (num > this._length[i] - 1) {
            return
          }
        }
        this.setSwiper(num, i, e);
      }
    }
  }
  pagination() {
    let paginationEl = [...this._$(`${this._opt.pagination.el}`)];
    let bullet = this._creatElement('span');
    this._setAttribute(bullet, 'class', 'swiper-pagination-bullet active')
    paginationEl.map(data => {
      data.appendChild(bullet.cloneNode(true))
    })
    for (var x in this._length) {
      if ([...this._containers[x].childNodes].every(data => {
        return data.className !== 'swiper-pagination'
      })) {
        paginationEl.splice(x, 0, "")
      }
      this._paginationEl = paginationEl
      for (let i = 0; i < this._length[x] - 1; i++) {
        let pageNum = bullet.cloneNode(true);
        pageNum.className = 'swiper-pagination-bullet'
        if (paginationEl[x] !== "") {
          paginationEl[x].appendChild(pageNum.cloneNode(true))
        }
      }
    }
  }
  static highligh(val, i) {
    for (let n = 0; n < mySwiper._length[i]; n++) {
      mySwiper._paginationEl[i].children[n].className = 'swiper-pagination-bullet';
    }
    mySwiper._paginationEl[i].children[val].className = 'swiper-pagination-bullet active'
  }
}
swiper.duration = 500;
swiper.lock = false;






