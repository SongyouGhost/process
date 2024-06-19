document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const content = document.querySelector('.container');
    const start = document.querySelector('.start');
    const workcon = document.getElementById('works-container');
    navbar.innerHTML = `
    <div class="navbarbackground"></div>
      <a href="../index.html">WORKS</a>
      <a href="../about.html">ABOUT</a>
        <div class="radio-container">
            <input type="radio" id="lightMode" name="mode" value="light">
            <label for="lightMode">light</label>
            <input type="radio" id="darkMode" name="mode" value="dark">
            <label for="darkMode">dark</label>
        </div>
      <a href="javascript:void(0);" class="icon" onclick="toggleNavbar()">&#9776;</a>
    `;
  
    window.toggleNavbar = function() {
        const navbar = document.querySelector('.navbar');
        const icon = navbar.querySelector('.icon');
        if (navbar.className === 'navbar') {
          navbar.className += ' responsive';
          icon.innerHTML = '&#10005;'; // 顯示叉叉圖標
          content.classList.add('blur'); // 增加模糊效果
        } else {
          navbar.className = 'navbar';
          icon.innerHTML = '&#9776;'; // 顯示漢堡圖標
          content.classList.remove('blur'); // 移除模糊效果
        }
      };
  });
  // 檢查文件是否存在的函數
  function fileExists(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false); // 使用同步請求
    xhr.send();
    return xhr.status !== 404;
  }

  // 檢查並動態更改超連結
  document.addEventListener('DOMContentLoaded', function() {
    var worksLink = document.querySelector('a[href="index.html"]');
    var aboutLink = document.querySelector('a[href="about.html"]');

    if (!fileExists('index.html')) {
      worksLink.href = '../index.html';
    }

    if (!fileExists('about.html')) {
      aboutLink.href = '../about.html';
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    const lightModeRadio = document.getElementById('lightMode');
    const darkModeRadio = document.getElementById('darkMode');
    
    // 初始化狀態
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.style.setProperty('--BGcolor', '#000000');
        document.documentElement.style.setProperty('--Maincolor', '#DBDCDC');
        darkModeRadio.checked = true;
    } else {
        document.documentElement.style.setProperty('--BGcolor', '#DBDCDC');
        document.documentElement.style.setProperty('--Maincolor', '#000000');
        lightModeRadio.checked = true;
    }

    lightModeRadio.addEventListener('change', function() {
        if (lightModeRadio.checked) {
            document.documentElement.style.setProperty('--BGcolor', '#DBDCDC');
            document.documentElement.style.setProperty('--Maincolor', '#000000');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    darkModeRadio.addEventListener('change', function() {
        if (darkModeRadio.checked) {
            document.documentElement.style.setProperty('--BGcolor', '#000000');
            document.documentElement.style.setProperty('--Maincolor', '#DBDCDC');
            localStorage.setItem('darkMode', 'enabled');
        }
    });
});
document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX + 'px';
  const mouseY = event.clientY + 'px';
  document.documentElement.style.setProperty('--mouseX', mouseX);
  document.documentElement.style.setProperty('--mouseY', mouseY);
});
document.addEventListener('mousemove', function(event) {
  // 取得滑鼠的X位置
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  // 取得視窗寬度
  const windowWidth = window.innerWidth;
  // 获取窗口的高度
  const windowHeight = window.innerHeight;
});
function addContent() {
  const body = document.body;

  // 創建 <div> 元素，設置 class 為 mouse，並添加到 body
  const mouseDiv = document.createElement('div');
  mouseDiv.className = 'mouse';
  body.appendChild(mouseDiv);

  // 創建 <div> 元素，設置 class 為 ghost，並包含一個 SVG
  const ghostDiv = document.createElement('div');
  ghostDiv.className = 'ghost';
  
  const svgContent = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 93.71 63.19" style="enable-background:new 0 0 93.71 63.19;" xml:space="preserve">
	<path style="fill:var(--BGcolor)" d="M65.16,7.18l-0.22,0c-5.91,0.03-9.78,1.11-13.19,2.06c-2.83,0.79-5.28,1.48-8.58,1.48
		c-3.98,0-7.09-0.99-10.1-1.94c-0.45-0.14-4.25-1.6-7.64-1.6c-5.15,0-9.32,5.13-9.92,12.04c-4.07,2.09-5.94,7.1-6.28,11.24
		c-0.41,4.93,1.02,11.62,6.37,14.33c0.96,7.69,5.61,11.22,9.83,11.22c0.9,0,3.79-0.03,4.4-0.03c0.03,0,0.07,0,0.1,0
		c3.1-0.09,6.13-0.27,9-0.54c14.13-1.33,25.82-4.78,33.81-10c3.07-2,5.59-4.26,7.51-6.75c0.02-0.02,0.04-0.04,0.05-0.07
		c2.32-3.04,3.7-6.37,4.1-9.91c0.03-0.27,0.06-0.55,0.08-0.83c0-0.01,0-0.02,0-0.03c0-0.01,0-0.02,0-0.02l0.02-0.32
		c0.01-0.19,0.02-0.39,0.02-0.53c0-0.14,0-0.28,0-0.42C84.54,15.87,75.85,7.18,65.16,7.18z"/>
	<g>
		<path d="M65.16,10.68c-0.07,0-0.14,0-0.2,0c-5.44,0.02-8.91,0.99-12.26,1.93c-2.95,0.83-5.74,1.61-9.53,1.61
			c-4.52,0-8.05-1.12-11.16-2.11c-0.44-0.14-0.87-0.28-1.29-0.4c0.24,0.29,0.47,0.61,0.69,0.94c1.36,2.09,2.15,4.83,2.23,7.73
			c3.65,1.28,6.26,6.07,6.27,11.61c0,0.01,0,0.02,0,0.02c0,0.02,0,0.04,0,0.05c-0.01,5.55-2.66,10.36-6.34,11.6
			c-0.45,4.85-2.19,7.45-3.73,8.82c3.02-0.09,5.96-0.26,8.77-0.53c13.56-1.27,24.71-4.54,32.23-9.45c2.77-1.81,5.02-3.82,6.68-6
			c0,0,0.01-0.01,0.01-0.01c1.93-2.53,3.08-5.28,3.41-8.18c0.03-0.23,0.05-0.46,0.06-0.7c0-0.01,0-0.01,0-0.02
			c0.01-0.1,0.01-0.2,0.02-0.3c0.01-0.15,0.01-0.29,0.01-0.44c0-0.11,0-0.22,0-0.32C81.04,17.8,73.92,10.68,65.16,10.68z"/>
		<path d="M18.95,20.09c6.42,0.05,11.49,1.03,15.05,2.91c0.64,0.34,1.23,0.71,1.77,1.1c-0.62-0.93-0.8-1.11-1.42-1.7
			c-1.34-1.26-2.46-1.51-2.46-1.51c0-5.62-2.9-10.2-6.47-10.22C22.05,10.68,19.22,14.86,18.95,20.09z"/>
		<path  d="M23.1,33.66c3.55-1.87,8.59-2.85,14.97-2.91c-0.85-5.75-7.77-8.91-19.58-8.92c-3.77,0.75-5.46,5.26-5.76,8.91
			c-0.35,4.26,0.92,9.16,4.51,10.95C17.56,38.29,19.57,35.52,23.1,33.66z"/>
		<path d="M25.44,52.52c3,0,6.2-3.18,6.47-10.3c1.31-0.07,2.57-0.78,3.63-2.02c0.64-0.75,1.17-1.66,1.6-2.71
			c0.61-1.5,0.96-3.21,1.01-4.98c-12.4,0.09-19.22,3.7-19.22,10.16C19.2,49.43,22.49,52.52,25.44,52.52z"/>
	</g>
</svg>
            `;
            ghostDiv.innerHTML = svgContent;
            body.appendChild(ghostDiv);
}
// 取得 <link> 標籤
const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
link.rel = 'icon';
link.href = '../ghostlogo.png'; // 更換為新的 favicon 圖片路徑
document.head.appendChild(link);


  