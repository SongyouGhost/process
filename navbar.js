document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const content = document.querySelector('.container');
    navbar.innerHTML = `
    <div class="navbarbackground"></div>
      <a href="index.html">WORKS</a>
      <a href="about.html">ABOUT</a>
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
    
    const footer = document.querySelector('.footer');
    footer.innerHTML = `
    <a href="#work-title" class="work-description">↑Back to Top</a>
        <div class="class="work-description"">
        <div class="social-icons">
          <a href="https://www.behance.net/sonnngyoughost"><svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="-127 175.8 256 162.2" xml:space="preserve">
         <path d="M-9.5,192.7c4.8,6.7,7.2,14.8,7.2,24.2c0,9.6-2.4,17.4-7.3,23.3c-2.7,3.3-6.8,6.3-12.1,9c8.1,3,14.2,7.6,18.3,14
           c4.1,6.4,6.2,14.1,6.2,23.2c0,9.4-2.3,17.8-7.1,25.2c-3,4.9-6.7,9.1-11.2,12.4c-5,3.9-11,6.5-17.9,8c-6.9,1.4-14.3,2.1-22.4,2.1
           H-127V175.8h76.5C-31.3,176.1-17.6,181.7-9.5,192.7z M-95.5,203.3v34.9H-57c6.9,0,12.4-1.3,16.7-3.9s6.4-7.3,6.4-13.9
           c0-7.4-2.8-12.2-8.5-14.6c-4.9-1.6-11.1-2.5-18.7-2.5H-95.5z M-95.5,264.3v42.2H-57c6.9,0,12.2-0.9,16-2.8c7-3.5,10.4-10,10.4-19.7
           c0-8.2-3.3-13.9-10.1-17c-3.8-1.7-9-2.6-15.8-2.7H-95.5z M98.4,219.4c8.2,3.6,14.9,9.4,20.2,17.3c4.8,6.9,7.9,15,9.3,24.2
           c0.8,5.4,1.2,13.1,1,23.2H43.7c0.5,11.7,4.5,20,12.2,24.7c4.7,2.9,10.3,4.4,16.9,4.4c6.9,0,12.6-1.8,17-5.4c2.4-1.9,4.5-4.6,6.3-8.1
           h31.2c-0.8,6.9-4.6,14-11.3,21.2C105.5,332.3,90.9,338,72,338c-15.6,0-29.3-4.8-41.2-14.4c-11.9-9.6-17.9-25.2-17.9-46.8
           c0-20.3,5.4-35.8,16.1-46.6C39.8,219.4,53.7,214,70.8,214C81.1,213.9,90.3,215.7,98.4,219.4z M52.7,245.8c-4.3,4.5-7,10.5-8.2,18.1
           h52.7c-0.6-8.1-3.3-14.3-8.1-18.5c-4.9-4.2-11-6.3-18.2-6.3C63.1,239.1,57,241.4,52.7,245.8z M104.4,183.2H36.6v19.7h67.8V183.2z"/>
         </svg></a>
        <a href="https://www.instagram.com/sonnngyou.ghost/">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="800px" height="800px" viewBox="0 0 169.063 169.063"
            xml:space="preserve">
            <path d="M122.406,0H46.654C20.929,0,0,20.93,0,46.655v75.752c0,25.726,20.929,46.655,46.654,46.655h75.752
              c25.727,0,46.656-20.93,46.656-46.655V46.655C169.063,20.93,148.133,0,122.406,0z M154.063,122.407
              c0,17.455-14.201,31.655-31.656,31.655H46.654C29.2,154.063,15,139.862,15,122.407V46.655C15,29.201,29.2,15,46.654,15h75.752
              c17.455,0,31.656,14.201,31.656,31.655V122.407z"/>
            <path d="M84.531,40.97c-24.021,0-43.563,19.542-43.563,43.563c0,24.02,19.542,43.561,43.563,43.561s43.563-19.541,43.563-43.561
              C128.094,60.512,108.552,40.97,84.531,40.97z M84.531,113.093c-15.749,0-28.563-12.812-28.563-28.561
              c0-15.75,12.813-28.563,28.563-28.563s28.563,12.813,28.563,28.563C113.094,100.281,100.28,113.093,84.531,113.093z"/>
            <path d="M129.921,28.251c-2.89,0-5.729,1.17-7.77,3.22c-2.051,2.04-3.23,4.88-3.23,7.78c0,2.891,1.18,5.73,3.23,7.78
              c2.04,2.04,4.88,3.22,7.77,3.22c2.9,0,5.73-1.18,7.78-3.22c2.05-2.05,3.22-4.89,3.22-7.78c0-2.9-1.17-5.74-3.22-7.78
              C135.661,29.421,132.821,28.251,129.921,28.251z"/>
          </svg></a>
          <a href="https://www.threads.net/@sonnngyou.ghost"><svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path></svg></a>
          <a href="https://medium.com/@sam883187"><svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" fill="none"/>
                <path d="M2,40.2l5.3-6.1v-21L2.6,7.8V7H15.1l10,21.2L33.9,7H46v.8l-4,3.7V36.6l4,3.6V41H28.6v-.8l4.1-4.8V16.6L22.7,41H21.4L9.8,17.1V33.9l5.3,6.3V41H2Z"/>
                </svg></a>
                <a href="https://drive.google.com/file/d/1GOJs5EFhY47VNWHVjo0Is6ACYrt4aN9o/view?usp=sharing">PDF作品集</a>
        </div>
      </div>
    `;
  
    
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

// 取得長圖片改為滿版
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  
  images.forEach(function(img) {
      function checkImageDimensions() {
          if (img.complete) {
              if (img.height > img.width + 20) {
                  img.classList.add('longimage');
              }
              if (img.width > img.height + 100) {
                  img.classList.add('widthimage');
              }
          } else {
              img.addEventListener('load', checkImageDimensions);
          }
      }
      
      checkImageDimensions();
  });
});

  