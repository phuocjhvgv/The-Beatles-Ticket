        
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAY_STORAGE_KEY = 'J1_PLAY';

const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const progress = $('#progress');
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const playlist =$('.playlist')


const app = {
    currentIndex : 0 ,
    isPlaying : false,
    isRamdom : false,
    isRepeat : false,
  //  config : JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Một triệu like",
          singer: "Đen x Lynk Lee",
          path: './assets/music/song1.mp3',
          image:
            "assets/img/img1.jpg"
        },
        {
          name: "Ai muốn nghe không",
          singer: "Đen x Biên x Trần Hậu",
          path: './assets/music/song2.mp3',
          image:
            "assets/img/img2.jpg"
        },
        {
          name: "Đưa nhau đi trốn",
          singer: "Đen x Linh Cáo",
          path: './assets/music/song3.mp3',
          image:
            "assets/img/img3.jpg"
        },
        {
          name: "Đi theo bóng mặt trời",
          singer: "Đen x Giang Nguyễn",
          path: './assets/music/song4.mp3',
          image:
            "assets/img/img4.jpg"
        },
        {
          name: "Đi Về Nhà",
          singer: "Đen x JustaTee",
          path: './assets/music/song5.mp3',
          image:
            "assets/img/img5.jpg"
        },
        {
          name: "Anh Đếch Cần Gì Nhiều Ngoài Em",
          singer: "Đen x Vũ x Thành Đồng",
          path: './assets/music/song6.mp3',
          image:
            "assets/img/img6.jpg"
        },
        {
          name: "hai triệu năm",
          singer: "Đen x Biên",
          path: './assets/music/song7.mp3',
          image:
            "assets/img/img7.jpg"
        },
        {
          name: "Mười Năm",
          singer: "Đen x Ngọc Linh",
          path: './assets/music/song8.mp3',
          image:
            "assets/img/img8.jpg"
        },
        {
          name: "Lối Nhỏ",
          singer: "Đen x Phương Anh Đào",
          path: './assets/music/song9.mp3',
          image:
            "assets/img/img9.jpg"
        },
        {
          name: "Bài Này Chill Phết",
          singer: "Đen x MIN",
          path: './assets/music/song10.mp3',
          image:
            "assets/img/img10.jpg"
        }
       
      ],
    // },
    render : function(){
       const htmls = this.songs.map((song , index ) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');">

                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
        </div>
        `
       })
       playlist.innerHTML= htmls.join('');
    },
    defineProperties : function(){
      Object.defineProperty(this,'currentSong',{
        get: function(){
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvents:function(){
      
       const cdWidth = cd.offsetWidth;
       const _this = this;
       // Xử lý CD quay và dừng

      const cdThumbAnimate = cdThumb.animate([
        { transform : 'rotate(360deg)'}
      ], {
        duration : 10000, // 10s
        iterations : Infinity,
      })
      cdThumbAnimate.pause();

      

      // xử lý phóng to thu nhỏ
       document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
       }

       // xủ lý khi click plays
       playBtn.onclick= function(){
        if(_this.isPlaying){         
           audio.pause();           
        } else {
           audio.play();
        }
       }

       // khi song được play
       audio.onplay = function () {
        cdThumbAnimate.play();
        _this.isPlaying = true;
        player.classList.add('playing')  
       }
       // khi song được pause
       audio.onpause = function() {
        cdThumbAnimate.pause();
        _this.isPlaying = false;
        player.classList.remove('playing')
       }
       // khi tiếng độ bài hát được thay đổi 
       audio.ontimeupdate = function(){
         if(audio.duration){
           const progressPercent = Math.floor( audio.currentTime / audio.duration * 100);
           progress.value = progressPercent
         }
       }
       // xử lý khi tua song

       progress.oninput = function(e){
         const seekTime = audio.duration / 100 * e.target.value;
         audio.currentTime = seekTime;
       }

       // Thêm biến để kiểm soát trạng thái khi đang tua
       let isDragging = false;

      // Xử lý sự kiện khi người dùng bắt đầu kéo thanh tua
       progress.onmousedown = function () {
        isDragging = true;
       }

      // Xử lý sự kiện khi người dùng dừng kéo thanh tua
      document.onmouseup = function () {
       if (isDragging) {
        isDragging = false;
        const seekTime = audio.duration / 100 * progress.value;
        audio.currentTime = seekTime;
         }
       }

     // Xử lý sự kiện khi chuột di chuyển ra khỏi vùng thanh tua
      progress.onmouseleave = function () {
        if (isDragging) {
          isDragging = false;
          const seekTime = audio.duration / 100 * progress.value;
          audio.currentTime = seekTime;
        }
      }
    // khi click next
      nextBtn.onclick = function (){
         if (_this.isRamdom) {
          _this.playRandomSong();
         }else {
          _this.nextSong();
         }
         audio.play();
         _this.render();
         _this.scroollToActiveSong();
      }
    // khi click prev
      prevBtn.onclick = function (){

        if(this.isRamdom){
        _this.playRandomSong()
        }else{
        _this.prevSong();
        }
        audio.play();
        _this.render();
      }

    // xử lý bật tắt khi ramdomsong
      randomBtn.onclick = function(e){
        _this.isRamdom = !_this.isRamdom;
        // _this.setConfig('isRamdom', _this.isRamdom)
        randomBtn.classList.toggle('active', _this.isRamdom);
     }
     // xử lý phát lại một song
     repeatBtn.onclick = function(e){
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);

    }
    // xử lý next song khi audio ended
      audio.onended = function (){
        if(_this.isRepeat){
          audio.play();
        }else{
          nextBtn.click();
        }    
      }
    // Lắng nghe Hành vi click vào playlist
    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)');
      if( songNode || e.target.closest('.options')){
         // xử lý khi click vào song
         if(songNode){
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render()
            audio.play()
         }
         // xử lý khi click vào song options
         if(e.target.closest('.options')){

         }
      }
    }
    
       

    },
    scroollToActiveSong : function (){
      setTimeout(function(){
        $('.song.active').scrollIntoView({
          behavior : 'smooth',
          block : 'center',
        })
      },300)
    },

    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    },

    nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length ) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong()
    },

    prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong()
    },

    

    playRandomSong: function() {
      // Tạo một mảng để lưu trữ các chỉ số của bài hát đã chơi
      let playedIndices = [];
    
      // Thêm chỉ số của bài hát hiện tại vào mảng
      playedIndices.push(this.currentIndex);
    
      // Tạo một mảng chứa các chỉ số của bài hát chưa được chơi
      let unplayedIndices = [];
      for (let i = 0; i < this.songs.length; i++) {
        if (!playedIndices.includes(i)) {
          unplayedIndices.push(i);
        }
      }
    
      // Nếu không còn bài hát nào chưa được chơi
      if (unplayedIndices.length === 0) {
        console.log("Đã chơi hết các bài hát.");
        return;
      }
    
      // Chọn một chỉ số ngẫu nhiên từ mảng các bài hát chưa được chơi
      const randomIndex = Math.floor(Math.random() * unplayedIndices.length);
      const newIndex = unplayedIndices[randomIndex];
    
      // Cập nhật currentIndex với chỉ số mới được chọn
      this.currentIndex = newIndex;
    
      // Gọi phương thức loadCurrentSong() để tải bài hát mới
      this.loadCurrentSong();
    },
    
    
    
    start : function(){
        // định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe là sử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào IU khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

       
    }

}

app.start()

