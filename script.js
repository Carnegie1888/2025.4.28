// 初始化变量
let clickCount = 0;
const images = [
    'images/3ae641514cb516663ea036720f0c03db.jpg',
    'images/8ab69939e2a3f34a9ab2f647efeaac99.jpg',
    'images/10e804cc613b0521c69433f933e19047.jpg',
    'images/22b1ee9e0d6c59c6bb2a3637e47aeba2.jpg',
    'images/59e1474063f4c36240e8292f87e92435.jpg',
    'images/99b6c0d86532895cc7d0bdc6a0b22ef7.jpg',
    'images/153ce2aee351be859632a333830f1ed4.jpg',
    'images/488c825ecb854bb8ae5b3a4077960059.jpg',
    'images/693c741025e98e7e2a432072f4968e97.jpg',
    'images/846f9fdd111921300a75f38eb53e2e11.jpg',
    'images/2598517e5dc53f210f36d9e3a37bd992.jpg',
    'images/7097486ea3816e09afbda7e3a7fed222.jpg',
    'images/a765e5786821455e0d91f6cc55c48f16.jpg',
    'images/a5623f7a92ace70241d6be5fea1f621f.jpg',
    'images/b1940f59333121eaaa272d462dfcbf02.jpg',
    'images/c554475dca14409da50227876b22c916.jpg'
];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载后立即强制显示气球容器
    const balloonsContainer = document.querySelector('.floating-balloons');
    if (balloonsContainer) {
        balloonsContainer.style.display = 'block';
        balloonsContainer.style.opacity = '1';
        balloonsContainer.style.visibility = 'visible';
    }
    
    // 立即创建气球动画
    createBalloons();
    
    // 设置音频播放器
    setTimeout(function() {
        setupAudioPlayer();
    }, 100);
    
    // 加载照片
    setTimeout(function() {
        loadPhotos();
    }, 200);
    
    // 点击事件监听
    document.addEventListener('click', handleSecretClick);
    
    // 蜡烛动画
    setTimeout(function() {
        createCandleAnimation();
    }, 300);
});

// 设置音频播放器相关功能
function setupAudioPlayer() {
    const playButton = document.getElementById('playButton');
    const audio = document.getElementById('birthdayMusic');
    const progressBar = document.querySelector('.progress-bar .progress');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalTimeDisplay = document.querySelector('.total-time');

    // 记录是否是第一次播放
    let isFirstPlay = true;

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playButton.classList.remove('paused');
            playButton.classList.add('on');
            
            // 如果是第一次播放，触发handleSecretClick事件
            if (isFirstPlay) {
                clickCount = 6;
                isFirstPlay = false;
            }
        } else {
            audio.pause();
            playButton.classList.add('paused');
            playButton.classList.remove('on');
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    });

    progressBar.parentElement.addEventListener('click', (event) => {
        const rect = progressBar.parentElement.getBoundingClientRect();
        const offset = event.clientX - rect.left;
        const percent = offset / rect.width;
        audio.currentTime = percent * audio.duration;
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 加载照片到瀑布流画廊
function loadPhotos() {
    const gallery = document.querySelector('.masonry-gallery');
    
    // 清空画廊
    gallery.innerHTML = '';
    
    // 创建时间线
    const mainTimeline = gsap.timeline();
    
    images.forEach((imgSrc, index) => {
        const masonryItem = document.createElement('div');
        masonryItem.className = 'masonry-item';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '生日照片';
        img.loading = 'lazy';
        
        // 创建图片容器
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        imgContainer.appendChild(img);
        
        // 添加元素到DOM
        masonryItem.appendChild(imgContainer);
        gallery.appendChild(masonryItem);

        // 初始状态
        gsap.set(masonryItem, { 
            opacity: 0,
            y: 100,
            rotationX: -10,
            transformOrigin: "center center"
        });
        
        // 添加到主时间线
        mainTimeline.to(masonryItem, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.1
        }, index * 0.1);
        
        // 创建随机微动画
        createRandomAnimation(masonryItem);
        
        // 点击放大效果
        imgContainer.addEventListener('click', function() {
            openFullscreen(imgSrc);
        });

        // 鼠标悬停3D效果
        masonryItem.addEventListener('mouseenter', (e) => {
            // 计算鼠标在元素上的位置
            const rect = masonryItem.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; 
            const mouseY = e.clientY - rect.top;
            
            // 转换为相对值 -1 到 1
            const xValue = (mouseX / rect.width - 0.5) * 2;
            const yValue = (mouseY / rect.height - 0.5) * 2;
            
            gsap.to(imgContainer, {
                rotationY: xValue * 10, 
                rotationX: -yValue * 10,
                scale: 1.05,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        masonryItem.addEventListener('mouseleave', () => {
            gsap.to(imgContainer, {
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        // 鼠标移动时的视差效果
        masonryItem.addEventListener('mousemove', (e) => {
            const rect = masonryItem.getBoundingClientRect();
            const mouseX = e.clientX - rect.left; 
            const mouseY = e.clientY - rect.top;
            
            const xValue = (mouseX / rect.width - 0.5) * 2;
            const yValue = (mouseY / rect.height - 0.5) * 2;
            
            gsap.to(img, {
                x: xValue * 10,
                y: yValue * 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // 添加滚动触发动画
    setupScrollAnimations();
}

// 创建随机微动画
function createRandomAnimation(element) {
    // 为元素创建随机轻微动画
    const randomDelay = Math.random() * 5;
    const randomDuration = Math.random() * 3 + 4;
    
    gsap.to(element, {
        y: '+=5',
        rotate: '+=2',
        repeat: -1,
        yoyo: true,
        duration: randomDuration,
        delay: randomDelay,
        ease: 'sine.inOut'
    });
}

// 设置滚动视差动画
function setupScrollAnimations() {
    const items = document.querySelectorAll('.masonry-item');
    
    // 添加滚动监听器
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        items.forEach((item, index) => {
            // 根据元素在文档中的位置计算视差效果
            const offset = item.offsetTop;
            const speed = index % 3 === 0 ? 0.05 : (index % 3 === 1 ? 0.03 : 0.07);
            const yPos = -(scrollTop * speed);
            
            gsap.to(item, {
                y: yPos,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
}

// 全屏查看照片
function openFullscreen(src) {
    const fullscreen = document.createElement('div');
    fullscreen.className = 'fullscreen-overlay';
    
    const fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.style.transform = 'scale(0.8) rotate(-5deg)';
    fullImg.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    fullscreen.appendChild(fullImg);
    document.body.appendChild(fullscreen);
    
    // 添加动画效果
    setTimeout(() => {
        fullImg.style.transform = 'scale(1) rotate(0deg)';
    }, 10);
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'fullscreen-close';
    closeButton.innerHTML = '&times;';
    fullscreen.appendChild(closeButton);
    
    // 点击关闭
    fullscreen.addEventListener('click', function(e) {
        if (e.target === fullscreen || e.target === closeButton) {
            fullImg.style.transform = 'scale(0.8) rotate(5deg)';
            setTimeout(() => {
                document.body.removeChild(fullscreen);
            }, 300);
        }
    });
    
    // 键盘ESC关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(fullscreen)) {
        fullImg.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(fullscreen);
        }, 300);
        }
    });
}

// 创建气球动画
function createBalloons() {
    const colors = ['#ff6b9d', '#ffcc5c', '#88d8b0', '#ff9ff3', '#feca57', '#74b9ff', '#a29bfe', '#ff7675', '#55efc4', '#81ecec', '#fdcb6e', '#e84393', '#00b894', '#00cec9'];
    const balloonsContainer = document.querySelector('.floating-balloons');
    
    // 确保容器是可见的
    balloonsContainer.style.display = 'block';
    balloonsContainer.style.opacity = '1';
    balloonsContainer.style.visibility = 'visible';
    
    // 清空容器
    balloonsContainer.innerHTML = '';
    
    // 减少气球数量
    const balloonCount = 12; // 减少气球数量
    
    // 预先创建所有气球并立即添加到DOM
    const fragment = document.createDocumentFragment(); // 使用文档片段提高性能
    const balloons = [];
    
    // 创建多个气球
    for (let i = 0; i < balloonCount; i++) {
        // 创建气球元素
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // 增大气球尺寸
        const size = Math.random() * 70 + 90; // 增大气球尺寸，现在范围是60-130px
        const color = colors[Math.floor(Math.random() * colors.length)];
        // 添加透明度到颜色
        const opacity = Math.random() * 0.3 + 0.4; // 透明度范围在0.4-0.7之间
        const rgbaColor = convertToRGBA(color, opacity);
        
        // 设置气球样式
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        balloon.style.background = rgbaColor;
        balloon.style.left = `${Math.random() * 90}%`;
        balloon.style.bottom = `-${size}px`;
        balloon.style.opacity = '1';
        balloon.style.visibility = 'visible';
        
        // 创建气球线
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.width = '2px';
        string.style.height = '120px'; // 增加气球线长度
        string.style.background = 'rgba(255, 255, 255, 0.5)'; // 气球线也使用半透明效果
        string.style.bottom = `-${120}px`;
        string.style.left = '50%';
        string.style.transformOrigin = 'top';
        
        // 添加气球线到气球
        balloon.appendChild(string);
        
        // 将气球添加到文档片段
        fragment.appendChild(balloon);
        
        // 将气球和大小存储在数组中
        balloons.push({element: balloon, size: size});
    }
    
    // 一次性将所有气球添加到DOM
    balloonsContainer.appendChild(fragment);
    
    // 均匀分布气球的位置，确保不重叠
    distributeBalloonsEvenly(balloons);
    
    // 立即启动所有气球的动画，无延迟
    balloons.forEach((balloon, index) => {
        // 立即开始动画，无需延迟
        animateBalloon(balloon.element, balloon.size);
    });
}

// 均匀分布气球的辅助函数
function distributeBalloonsEvenly(balloons) {
    // 将视口宽度划分为几个区域
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const columns = 4; // 水平区域数
    const rows = 3; // 垂直区域数
    
    const columnWidth = viewportWidth / columns;
    const rowHeight = viewportHeight / rows;
    
    balloons.forEach((balloon, index) => {
        // 计算气球应该在哪个区域
        const column = index % columns;
        const row = Math.floor(index / columns) % rows;
        
        // 在这个区域内随机放置，但保持一定边距
        const margin = 0.2; // 区域内的边距比例
        const leftPosition = (column * columnWidth) + (margin * columnWidth) + 
                             (Math.random() * (1 - 2 * margin) * columnWidth);
        
        // 将位置转换为百分比
        const leftPercent = (leftPosition / viewportWidth) * 100;
        balloon.element.style.left = `${leftPercent}%`;
        
        // 让一些气球一开始就在视口中，一些在视口下方
        if (index < balloons.length / 2) {
            // 上半部分气球在屏幕内的不同高度
            const startY = row * rowHeight + Math.random() * rowHeight * 0.8;
            gsap.set(balloon.element, {
                y: startY
            });
        }
    });
}

// 转换HEX颜色为RGBA格式的辅助函数
function convertToRGBA(hexColor, opacity) {
    // 处理缩写的HEX格式，如#abc
    if (hexColor.length === 4) {
        const r = parseInt(hexColor.substring(1, 2) + hexColor.substring(1, 2), 16);
        const g = parseInt(hexColor.substring(2, 3) + hexColor.substring(2, 3), 16);
        const b = parseInt(hexColor.substring(3, 4) + hexColor.substring(3, 4), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // 标准的HEX格式，如#aabbcc
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// 单独的气球动画函数
function animateBalloon(balloon, size) {
    // 确保气球立即可见，设置显示样式
    balloon.style.opacity = "1";
    balloon.style.visibility = "visible";
    
    // 获取当前位置
    const startX = parseFloat(balloon.style.left);
    // 大气球飘动得更慢一些
    const duration = 2 + (size / 30); // 较大的气球有更长的动画时间
    
    // 获取已设置的初始位置，如果没有则从屏幕下方开始
    const currentY = gsap.getProperty(balloon, "y");
    const startY = currentY || (Math.random() < 0.5 ? 
                  Math.random() * window.innerHeight * 0.7 : // 50%的气球已经在屏幕中
                  window.innerHeight); // 其余50%在屏幕底部
    
    // 设置起始动画状态
    gsap.set(balloon, {
        y: startY,
        x: startX + "%",
        opacity: 1
    });
    
    // 创建浮动动画，无延迟立即开始
    gsap.to(balloon, {
        y: -size * 2 - 100, // 移动到屏幕外
        x: `+=${(Math.random() - 0.5) * 100}`, // 减少水平移动范围，避免气球跑得太远
        rotation: (Math.random() - 0.5) * 15, // 减小旋转角度，大气球旋转幅度不要太大
        duration: duration,
        delay: 0, // 无延迟立即开始
        ease: 'power1.inOut',
        onComplete: function() {
            // 重置气球位置，并再次开始动画
            gsap.set(balloon, {
                y: window.innerHeight + size,
                x: `${Math.random() * 90}%`,
            });
            // 递归调用以创建无限循环
            animateBalloon(balloon, size);
        }
    });
    
    // 添加轻微的摆动效果，立即开始
    gsap.to(balloon, {
        rotation: `+=${(Math.random() - 0.5) * 8}`, // 减小摆动角度
        duration: 3 + Math.random() * 2, // 增加摆动时间，更加自然
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// 调整颜色亮度的辅助函数
function adjustColor(color, amount) {
    // 解析颜色
    let r, g, b;
    
    // 如果是十六进制颜色
    if (color.startsWith('#')) {
        r = parseInt(color.substring(1, 3), 16);
        g = parseInt(color.substring(3, 5), 16);
        b = parseInt(color.substring(5, 7), 16);
    } 
    // 如果是命名颜色或其他格式，使用默认暗色
    else {
        return 'rgba(0,0,0,0.2)';
    }
    
    // 调整亮度
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // 转回十六进制
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 蜡烛动画
function createCandleAnimation() {
    const candleContainer = document.querySelector('.candle-animation') || document.createElement('div');
candleContainer.className = 'candle-animation';
document.body.appendChild(candleContainer);
    
    for (let i = 0; i < 5; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        
        candle.appendChild(flame);
        candleContainer.appendChild(candle);
        
        // 火焰动画
        gsap.to(flame, {
            scale: 0.9,
            y: -5,
            repeat: -1,
            yoyo: true,
            duration: 0.5,
            delay: i * 0.2
        });
    }
}

// 秘密点击计数器
function handleSecretClick() {
    clickCount++;
    if (clickCount === 7) {
        // 创建自定义弹窗
        const customModal = document.createElement('div');
        customModal.className = 'custom-modal';
        customModal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 生日快乐！🎉</h2>
                <p>这是给你的小惊喜！希望你度过美好的一天！</p>
                <button class="modal-close">关闭</button>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .custom-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background-color: #fff;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(255, 107, 157, 0.6);
                text-align: center;
                max-width: 400px;
                animation: modalPop 0.5s ease-out;
            }
            .modal-content h2 {
                color: #ff6b9d;
                margin-top: 0;
            }
            .modal-content p {
                margin: 20px 0;
                font-size: 18px;
            }
            .modal-close {
                background-color: #ff6b9d;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
            }
            .modal-close:hover {
                background-color: #ff4b8d;
            }
            @keyframes modalPop {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(customModal);
        
        // 关闭按钮事件
        const closeButton = customModal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(customModal);
        });
        
        clickCount = 0;
    }
}

// 轮播索引
let slideIndex = 0;

// 加载轮播图
function loadCarousel() {
    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    const slidesDiv = document.createElement('div');
    slidesDiv.className = 'slides';

    images.forEach(imgSrc => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '轮播图照片';

        slide.appendChild(img);
        slidesDiv.appendChild(slide);
    });

    const prevButton = document.createElement('button');
    prevButton.className = 'prev';
    prevButton.textContent = '❮';
    prevButton.addEventListener('click', () => {
        showSlides(slideIndex -= 1);
    });

    const nextButton = document.createElement('button');
    nextButton.className = 'next';
    nextButton.textContent = '❯';
    nextButton.addEventListener('click', () => {
        showSlides(slideIndex += 1);
    });

    carousel.appendChild(slidesDiv);
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);

    document.querySelector('.birthday-container').appendChild(carousel);

    const slides = document.querySelectorAll('.slide');
    showSlides(slideIndex);

    // 自动切换轮播图
    setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        slides[slideIndex].classList.remove('active');
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    }, 3000);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.slide');
    if (n >= slides.length) {slideIndex = 0}
    if (n < 0) {slideIndex = slides.length - 1}

    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    slides[slideIndex].style.display = 'block';
// 由于块级作用域内不能重复声明变量 slides，这里使用另一个变量名 newSlides
const slidesDiv = document.createElement('div');
    slidesDiv.className = 'slides';
    images.forEach(imgSrc => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '生日照片';
        slide.appendChild(img);
        slidesDiv.appendChild(slide);
    });
    carousel.appendChild(slidesDiv);
    // 添加导航按钮
    const prevButton = document.createElement('button');
    prevButton.className = 'prev';
    prevButton.innerHTML = '&#10094;';
    prevButton.addEventListener('click', () => changeSlide(-1));
    const nextButton = document.createElement('button');
    nextButton.className = 'next';
    nextButton.innerHTML = '&#10095;';
    nextButton.addEventListener('click', () => changeSlide(1));
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
    const gallery = document.querySelector('.masonry-gallery');
    gallery.replaceWith(carousel);
    showSlide(slideIndex);
}

// 切换幻灯片
function changeSlide(n) {
    showSlide(slideIndex += n);
}

// 显示指定幻灯片
function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    if (n >= slides.length) {slideIndex = 0} 
    if (n < 0) {slideIndex = slides.length - 1}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex].style.display = 'block';
}
