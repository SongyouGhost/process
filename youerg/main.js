let scene, camera, renderer, character;
        let terrain;
        let composer;
        let monoliths = [];
        let score = 0;
        

        // 攝影機參數
        let cameraDistance = 15;
        let cameraHeight = 5;
        let cameraLerpFactor = 0.1;

        // 新增變量用於平滑旋轉和八方向移動
        let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
        let velocity = new THREE.Vector3();
        let direction = new THREE.Vector3();
        let rotation = new THREE.Euler(0, 0, 0, 'YXZ');
        let rotationVelocity = new THREE.Vector3();
        let isMoving = false;  // 新增的標誌
        let lastMoveTime = 0;  // 最後一次移動的時間
        let baseRotation = 0;
        let isBaseRotationSet = false;


        // 初始化函數
        function init() {
            // 創建場景
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000117); // 設置場景背景顏色

            
            // 添加霧效果
            scene.fog = new THREE.FogExp2(0x4D1F00, 0.01); // 可以調整顏色和密度
            // 初始化音效系統
            initAudio();
        
            // 創建相機
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.y = 1; // 設置相機高度
        
            // 創建渲染器
            renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gameCanvas')});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true; // 啟用陰影

            // 配置後處理
            composer = new THREE.EffectComposer(renderer);
            const renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);

    // 添加像素化濾鏡
    const pixelPass = new THREE.ShaderPass(THREE.PixelShader);
    pixelPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
    pixelPass.uniforms['pixelSize'].value = 8; // 調整這個值來設置像素大小
    composer.addPass(pixelPass);

    // 添加對比度和飽和度調整的濾鏡
    const contrastSaturationPass = new THREE.ShaderPass(ContrastSaturationShader);
    composer.addPass(contrastSaturationPass);
        
            // 加載資源並顯示進度
            loadAssets();
        }

        const ContrastSaturationShader = {
            uniforms: {
                'tDiffuse': { value: null },
                'contrast': { value: 3 }, // 對比度值，>1 增加對比度，<1 降低對比度
                'saturation': { value: 1.5 } // 飽和度值，>1 增加飽和度，<1 降低飽和度
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float contrast;
                uniform float saturation;
                varying vec2 vUv;
        
                vec3 AdjustContrast(vec3 color, float contrast) {
                    return (color - 0.5) * contrast + 0.5;
                }
        
                vec3 AdjustSaturation(vec3 color, float saturation) {
                    float grey = dot(color, vec3(0.299, 0.587, 0.114));
                    return mix(vec3(grey), color, saturation);
                }
        
                void main() {
                    vec4 texel = texture2D(tDiffuse, vUv);
                    vec3 color = texel.rgb;
                    color = AdjustContrast(color, contrast);
                    color = AdjustSaturation(color, saturation);
                    gl_FragColor = vec4(color, texel.a);
                }
            `
        };
        
        
//REsize函數
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    const pixelPass = composer.passes[1]; // 獲取 PixelShader pass
    pixelPass.uniforms['resolution'].value.set(window.innerWidth, window.innerHeight);
    pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
}

function loadAssets() {
    let loadedAssets = 0;
    const totalAssets = 5;
    const progressBar = document.querySelector('#progressBar > div');
    const progressText = document.getElementById('progressText');

    function updateProgress(content) {
        loadedAssets++;
        progressBar.style.width = `${(loadedAssets / totalAssets) * 100}%`;
        progressText.textContent = content;
        console.log(`Loading content: ${content}`);

        if (loadedAssets === totalAssets) {
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
                setTimeout(() => {
                    showTutorial();
                }, 100); // 延遲 1000 毫秒後顯示操作教學
                startGame();
            }, 100);
        }
    }

    // 直接加載資源，不模擬小型加載過程
    createTerrain(() => updateProgress('地圖創立中...'));
    createCharacter(() => updateProgress('角色建構中...'));
    addCacti(() => updateProgress('正在長仙人掌...'));
    createMonolith(() => updateProgress('石碑從天上掉下來...'));
    createSandstorm(() => updateProgress('沙塵暴出現了...'));// 創建沙塵暴效果
    playMusic(() => updateProgress('即將演奏音樂'));
    toggleSound(() => updateProgress('打開音效按鈕'));
    updateProgress('快好了...'); // 最後一次更新進度條，模擬加載完成
}


         

        // 創建地形函數
        // 修改：調整地形大小以適應巨大石碑
        function createTerrain(callback) {
            const geometry = new THREE.PlaneGeometry(200, 200, 200, 200); // 擴大地形
            const material = new THREE.MeshPhongMaterial({color: 0xa88703, flatShading: true});
            terrain = new THREE.Mesh(geometry, material);
        
            const simplex = new SimplexNoise();
            const vertices = terrain.geometry.attributes.position.array;
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                vertices[i + 2] = simplex.noise2D(x * 0.05, y * 0.05) * 2; // 增加地形的起伏
            }
            terrain.geometry.attributes.position.needsUpdate = true;
            terrain.geometry.computeVertexNormals();
        
            terrain.rotation.x = -Math.PI / 2;
            terrain.receiveShadow = true;
            scene.add(terrain);
            callback();
        }
        //頂點著色器 (Vertex Shader)
        const edgeVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}
`;
//片段著色器 (Fragment Shader)
const edgeFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
    if (intensity > 0.1) {
        discard; // 丟棄內部片段
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // 設置邊緣顏色為黑色
}
`;


        
function createCharacter(callback) {
    const loader = new THREE.TextureLoader();

    // 加載身體貼圖
    const bodyTexture = loader.load('bodyTexture.jpg');
    const bodyMaterial = new THREE.MeshPhongMaterial({map: bodyTexture});

    // 加載頭部貼圖
    const headTexture = loader.load('headTexture.jpg');
    const headMaterial = new THREE.MeshPhongMaterial({map: headTexture});

    // 邊緣檢測著色器材質
    const edgeShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragmentShader,
        side: THREE.BackSide
    });

    // 創建身體
    const bodyGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.2);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;

    const bodyOutline = new THREE.Mesh(bodyGeometry, edgeShaderMaterial);
    bodyOutline.scale.multiplyScalar(1.05); // 增加外框的比例
    body.add(bodyOutline);

    // 創建頭部
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.3;
    head.castShadow = true;

    const headOutline = new THREE.Mesh(headGeometry, edgeShaderMaterial);
    headOutline.scale.multiplyScalar(1.05);
    head.add(headOutline);

    // 創建手臂
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.3, 30);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.3, 0.2, 0);
    leftArm.rotation.z = Math.PI / 3;
    leftArm.castShadow = true;

    const leftArmOutline = new THREE.Mesh(armGeometry, edgeShaderMaterial);
    leftArmOutline.scale.multiplyScalar(1.05);
    leftArm.add(leftArmOutline);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.3, 0.2, 0);
    rightArm.rotation.z = -Math.PI / 3;
    rightArm.castShadow = true;

    const rightArmOutline = new THREE.Mesh(armGeometry, edgeShaderMaterial);
    rightArmOutline.scale.multiplyScalar(1.05);
    rightArm.add(rightArmOutline);

    // 創建腿
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 30);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-0.10, -0.5, 0);
    leftLeg.castShadow = true;

    const leftLegOutline = new THREE.Mesh(legGeometry, edgeShaderMaterial);
    leftLegOutline.scale.multiplyScalar(1.05);
    leftLeg.add(leftLegOutline);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(0.10, -0.5, 0);
    rightLeg.castShadow = true;

    const rightLegOutline = new THREE.Mesh(legGeometry, edgeShaderMaterial);
    rightLegOutline.scale.multiplyScalar(1.05);
    rightLeg.add(rightLegOutline);

    // 創建小女孩組
    character = new THREE.Group();
    character.add(body);
    character.add(head);
    character.add(leftArm);
    character.add(rightArm);
    character.add(leftLeg);
    character.add(rightLeg);

    // 添加紅色披風
    const capeGeometry = new THREE.PlaneGeometry(0.4, 0.8);
    const capeMaterial = new THREE.MeshPhongMaterial({color: 0xFF001E, side: THREE.DoubleSide});
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(0, 0, -0.2);
    cape.rotation.x = Math.PI / 8;

    const capeOutline = new THREE.Mesh(capeGeometry, edgeShaderMaterial);
    capeOutline.scale.multiplyScalar(1.05);
    cape.add(capeOutline);

    character.add(cape);

    // 添加紅色的三角形高帽子
    const hatGeometry = new THREE.ConeGeometry(0.15, 0.5, 32);
    const hatMaterial = new THREE.MeshPhongMaterial({color: 0xFF001E});
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.set(0, 0.4, -0.1); // 調整帽子的位置，使其位於頭部上方
    hat.rotation.x = -Math.PI / 8; // 向後傾斜，調整這個值可以改變傾斜角度
    hat.castShadow = true;

    const hatOutline = new THREE.Mesh(hatGeometry, edgeShaderMaterial);
    hatOutline.scale.multiplyScalar(1.05);
    hat.add(hatOutline);

    head.add(hat);

    // 添加點光源
    const bpointLight = new THREE.PointLight(0xffffff, 0.2, 3); // 調整光強度和距離
    bpointLight.position.set(0, 1, 0); // 設置點光源位置
    character.add(bpointLight);

    character.position.y = 1; // 設置角色初始高度
    scene.add(character);
    callback(); // 資源加載完成後調用回調函數
}
        
        // 在遊戲循環中調用 update 函數
        function update(deltaTime) {
            updateCharacterAndCamera(deltaTime);
            updateCharacterAnimation(deltaTime);
            renderer.render(scene, camera);
            requestAnimationFrame(update);
        }

        function addCacti(callback) {
            const cactusBodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
            const cactusArmGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
            const cactusMaterial = new THREE.MeshPhongMaterial({ color: 0x9AFF02 }); // 綠色仙人掌顏色
        
            for (let i = 0; i < 100; i++) {
                const cactus = new THREE.Group();
        
                // 主幹
                const body = new THREE.Mesh(cactusBodyGeometry, cactusMaterial);
                body.position.y = 0.5;
                body.castShadow = true; // 主幹投射陰影
                cactus.add(body);
        
                // 左臂
                const leftArm = new THREE.Mesh(cactusArmGeometry, cactusMaterial);
                leftArm.position.set(-0.25, 0.75, 0);
                leftArm.rotation.z = Math.PI / 4; // 旋轉角度
                leftArm.castShadow = true; // 左臂投射陰影
                cactus.add(leftArm);
        
                // 右臂
                const rightArm = new THREE.Mesh(cactusArmGeometry, cactusMaterial);
                rightArm.position.set(0.25, 0.75, 0);
                rightArm.rotation.z = -Math.PI / 4; // 旋轉角度
                rightArm.castShadow = true; // 右臂投射陰影
                cactus.add(rightArm);
        
                cactus.position.x = Math.random() * 180 - 90; // 調整分佈範圍
                cactus.position.z = Math.random() * 180 - 90;
                cactus.position.y = getYPosition(cactus.position.x, cactus.position.z);
        
                cactus.receiveShadow = true; // 仙人掌接收陰影
                scene.add(cactus);
            }
            callback(); // 資源加載完成後調用回調函數
        }

        function createMonolith(callback) {
            const loader = new THREE.TextureLoader();
            const textures = Array.from({ length: 12 }, (_, i) => `monolithTXT${i + 1}.png`);
            
            const createSingleMonolith = (texture, description) => {
                const monolithGeometry = new THREE.BoxGeometry(7.5, 15, 1); // 10倍大小
                const monolithMaterial = new THREE.MeshStandardMaterial({
                    map: texture || null,
                    color: texture ? 0xffffff : 0xe2e2e2, // 如果沒有貼圖，則顏色為黑色
                    emissive: 0xffffee, // 發光顏色
                    emissiveIntensity: 0.4 // 發光強度
                });
                const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
                
                monolith.position.set(
                    Math.random() * 200 - 100, // 擴大 x 範圍
                    Math.random() * 1 + 3,   // 提高高度範圍
                    Math.random() * 200 - 100  // 擴大 z 範圍
                );
                
                monolith.rotation.y = Math.random() * Math.PI * 2;
                
                monolith.castShadow = true;
                monolith.receiveShadow = true;
                
                

                // 添加點光源
    const pointLight = new THREE.PointLight(0xffffff, 2, 40);
    pointLight.position.set(0, 18, 0); // 設置在石碑的中心
    pointLight.castShadow = true; // 點光源產生陰影
    monolith.add(pointLight);
    
    monolith.pointLight = pointLight; // 添加 pointLight 屬性

    
                
                monolith.hasCollided = false;
                monolith.description = description; // 添加描述
                
                scene.add(monolith);
                monoliths.push(monolith);
            };
            
            let loadedTextures = 0;
            
            
            textures.forEach((texturePath, index) => {
                loader.load(
                    texturePath,
                    (texture) => {
                        createSingleMonolith(texture, descriptions[index]);
                        loadedTextures++;
                        if (loadedTextures === textures.length) {
                            callback();
                        }
                    },
                    undefined,
                    () => {
                        createSingleMonolith(null, descriptions[index]);
                        loadedTextures++;
                        if (loadedTextures === textures.length) {
                            callback();
                        }
                    }
                );
            });
        }

        //動態霧變化
        function updateFogDensity(time) {
            let baseDensity = 0.01; // 基本霧密度
            let amplitude = 0.04; // 霧密度變化幅度
            const frequency = 0.1; // 霧密度變化頻率
        
            const newDensity = baseDensity + amplitude * Math.sin(frequency * time);
            scene.fog.density = newDensity;
        }
        

//沙塵暴系統
let sandstormParticles, sandstormIntensity = 0.1;

function createSandstorm() {
    const particleCount = 5000; // 粒子數量
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 1] = Math.random() * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xCD853F,
        size: 1,
        transparent: true,
        opacity: 0.8
    });

    sandstormParticles = new THREE.Points(particles, particleMaterial);
    scene.add(sandstormParticles);
}

// 更改沙塵暴顏色的函數
function changeSandstormColor(newColor) {
    if (sandstormParticles) {
        sandstormParticles.material.color.set(newColor);
    }
}

function updateSandstorm(deltaTime) {
    const positions = sandstormParticles.geometry.attributes.position.array;
    const characterPosition = new THREE.Vector3(character.position.x, character.position.y, character.position.z);

    // 動態調整粒子數量
    const amplitude = baseParticleCount;
    const particleCount = Math.floor(baseParticleCount + amplitude * Math.sin(0.5 * time));
    sandstormParticles.geometry.setDrawRange(0, particleCount);

    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * sandstormIntensity;
        positions[i + 1] += (Math.random() - 0.5) * sandstormIntensity;
        positions[i + 2] += (Math.random() - 0.5) * sandstormIntensity;

        // 讓粒子在一定範圍內循環
        if (positions[i] > 200 || positions[i] < -200) positions[i] = (Math.random() - 0.5) * 400;
        if (positions[i + 1] > 50) positions[i + 1] = 0;
        if (positions[i + 2] > 200 || positions[i + 2] < -200) positions[i + 2] = (Math.random() - 0.5) * 400;

        // 計算粒子與主角的距離，並根據距離調整透明度
        const particlePosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const distance = particlePosition.distanceTo(characterPosition);
        const maxDistance = 300; // 最大距離
        const minDistance = 10;  // 最小距離

        let opacity = 1 - (distance - minDistance) / (maxDistance - minDistance);
        opacity = Math.max(0, Math.min(1, opacity));

        sandstormParticles.material.opacity = opacity;
    }

    sandstormParticles.geometry.attributes.position.needsUpdate = true;
}

// 更改沙塵暴材質屬性的函數
function changeSandstormProperties({ color, size, transparent, opacity }) {
    if (sandstormParticles) {
        const material = sandstormParticles.material;
        if (color !== undefined) material.color.set(color);
        if (size !== undefined) material.size = size;
        if (transparent !== undefined) material.transparent = transparent;
        if (opacity !== undefined) material.opacity = opacity;
        material.needsUpdate = true; // 確保材質更新
    }
}

//更新沙塵暴系統
function updateSandstorm(deltaTime) {
    const positions = sandstormParticles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * sandstormIntensity;
        positions[i + 1] += (Math.random() - 0.5) * sandstormIntensity;
        positions[i + 2] += (Math.random() - 0.5) * sandstormIntensity;

        // 讓粒子在一定範圍內循環
        if (positions[i] > 200 || positions[i] < -200) positions[i] = (Math.random() - 0.5) * 400;
        if (positions[i + 1] > 50) positions[i + 1] = 0;
        if (positions[i + 2] > 200 || positions[i + 2] < -200) positions[i + 2] = (Math.random() - 0.5) * 400;
    }

    sandstormParticles.geometry.attributes.position.needsUpdate = true;
}

        // 根據 x 和 z 坐標獲取地形高度
        function getYPosition(x, z) {
            const raycaster = new THREE.Raycaster(new THREE.Vector3(x, 10, z), new THREE.Vector3(0, -1, 0));
            const intersects = raycaster.intersectObject(terrain);
            return intersects.length > 0 ? intersects[0].point.y : 0;
        }

        // 鍵盤按下事件處理函數
function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            isMoving = true;
            lastMoveTime = performance.now();
            startNoise(); // 開始播放噪音
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            isMoving = true;
            lastMoveTime = performance.now();
            startNoise(); // 開始播放噪音
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            isMoving = true;
            lastMoveTime = performance.now();
            startNoise(); // 開始播放噪音
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            isMoving = true;
            lastMoveTime = performance.now();
            startNoise(); // 開始播放噪音
            break;
    }
}

// 鍵盤放開事件處理函數
function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }

    // 如果所有移動鍵都沒有按下，設置 isMoving 為 false
    if (!moveForward && !moveBackward && !moveLeft && !moveRight) {
        isMoving = false;
        baseRotation = character.rotation.y; // 記錄當前角色的面向方向
        isBaseRotationSet = true; // 設置基準方向已經記錄
        stopNoise(); // 停止播放噪音
    }
}


        function startGame() {
            console.log('Starting game...');
        
            // 添加事件監聽器來處理鍵盤輸入
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            // 添加環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    scene.add(ambientLight);

    // 添加聚光燈
    const spotLight = new THREE.SpotLight(0xffffff, 0.6);
    spotLight.position.set(10, 20, 10);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true; // 聚光燈產生陰影
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    scene.add(spotLight);


    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xFFFFDF, 0.8);
    directionalLight.position.set(1, 2, 1);
    directionalLight.castShadow = true; // 方向光產生陰影
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
        
            // 開始動畫循環
            animate();
        }

        

        function updateCharacterAndCamera(deltaTime) {
            // 計算移動方向
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();
        
            // 如果基準方向已經設置，使用基準方向來計算相對方向
            if (isBaseRotationSet) {
                const cosBase = Math.cos(baseRotation);
                const sinBase = Math.sin(baseRotation);
        
                const relativeX = direction.x * cosBase - direction.z * sinBase;
                const relativeZ = direction.x * sinBase + direction.z * cosBase;
        
                direction.x = relativeX;
                direction.z = relativeZ;
            }
        
            // 應用加速度
            const acceleration = 50.0;
            velocity.x += direction.x * acceleration * deltaTime;
            velocity.z += direction.z * acceleration * deltaTime;
        
            // 應用摩擦力
            const friction = 10.0;
            velocity.x -= velocity.x * friction * deltaTime;
            velocity.z -= velocity.z * friction * deltaTime;
        
            // 更新角色位置
            character.position.x += velocity.x * deltaTime;
            character.position.z += velocity.z * deltaTime;
        
            // 限制角色位置在地圖範圍內
            const mapSize = 100; // 地圖邊界的一半
            character.position.x = Math.max(-mapSize, Math.min(mapSize, character.position.x));
            character.position.z = Math.max(-mapSize, Math.min(mapSize, character.position.z));
        
            // 計算目標旋轉角度
            if (direction.length() > 0) {
                rotation.y = Math.atan2(direction.x, direction.z);
            }
        
            // 平滑旋轉
            const rotationSpeed = 10.0;
            character.rotation.y += (rotation.y - character.rotation.y) * rotationSpeed * deltaTime;
        
            // 更新角色的Y位置以適應地形
            character.position.y = getYPosition(character.position.x, character.position.z) + 1;
        
            // 更新相機位置
            if (isMoving) {
                // 如果角色在移動，相機跟隨但不鎖定在背後
                const cameraOffset = new THREE.Vector3(0, 2, 15);
                const targetCameraPosition = character.position.clone().add(cameraOffset);
                camera.position.lerp(targetCameraPosition, 0.1);
                camera.lookAt(character.position);
            } else {
                // 如果角色停止移動，相機重新鎖定在背後
                const timeSinceLastMove = performance.now() - lastMoveTime;
                if (timeSinceLastMove > 500) {  // 停止後 0.5 秒重置相機
                    const cameraOffset = new THREE.Vector3(0, 2, -15).applyAxisAngle(new THREE.Vector3(0, 1, 0), character.rotation.y);
                    const targetCameraPosition = character.position.clone().add(cameraOffset);
                    camera.position.lerp(targetCameraPosition, 0.1);
                    camera.lookAt(character.position);
                } else {
                    // 在 0.5 秒內，保持相機在角色正後方
                    camera.lookAt(character.position);
                }
                // 記錄基準方向
                if (!isBaseRotationSet) {
                    baseRotation = character.rotation.y;
                    isBaseRotationSet = true;
                }
            }

            let walkOffset = 0;
            const walkSpeed = 20; //移動速度
    const easeSpeed = 0.5;

    // 更新 walkOffset 以模擬走路動畫
    if (isMoving) {
        walkOffset += deltaTime * walkSpeed;
    }

    // 使用 ease 函數計算擺動
    const easedOffset = easeInOutQuad((walkOffset % 1) * easeSpeed);

    // 更新手臂和腿的旋轉以模擬走路動畫
    character.children[2].rotation.x = Math.sin(easedOffset * Math.PI * 2) * 0.5; // 左臂
    character.children[3].rotation.x = -Math.sin(easedOffset * Math.PI * 2) * 0.5; // 右臂
    character.children[4].rotation.x = -Math.sin(easedOffset * Math.PI * 2) * 0.5; // 左腿
    character.children[5].rotation.x = Math.sin(easedOffset * Math.PI * 2) * 0.5; // 右腿

    // 更新披風的擺動
    const cape = character.children.find((child) => child.geometry && child.geometry.type === 'PlaneGeometry');
    if (cape) {
        cape.rotation.x = Math.PI / 6 + Math.sin(Date.now() * 0.005) * 0.5;
    }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        
        

        // 動畫循環函數
        // 修改：調整相機和角色移動
        function animate() {
            requestAnimationFrame(animate);

            const deltaTime = 0.016; // 假設60fps
            const time = performance.now() * 0.001; // 獲取當前時間並轉換為秒
            updateCharacterAndCamera(deltaTime);
        
            const moveSpeed = 0.4; // 增加移動速度
            let moveDirection = new THREE.Vector3();

            
        
            if (moveForward) moveDirection.z -= moveSpeed;
            if (moveBackward) moveDirection.z += moveSpeed;
            if (moveLeft) moveDirection.x -= moveSpeed;
            if (moveRight) moveDirection.x += moveSpeed;
        
            character.position.add(moveDirection);
        
            if (moveDirection.length() > 0) {
                character.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
            }
        
            character.position.y = getYPosition(character.position.x, character.position.z) + 1;
        
            // 調整相機位置以適應更大的場景
            const cameraOffset = new THREE.Vector3(0, 3, -5).applyAxisAngle(new THREE.Vector3(0, 1, 0), character.rotation.y);
            const targetCameraPosition = character.position.clone().add(cameraOffset);
        
            camera.position.lerp(targetCameraPosition, 0.1);
            camera.lookAt(character.position);

            if (!checkAllMonolithsCollected()) { // 如果未收集完石碑
                updateFogDensity(time); // 更新霧密度
                updateSandstorm(deltaTime, time); // 更新沙暴密度
            } else {
                console.log("All monoliths collected, not updating fog density.");
            }

    
    
        
            let hideInfoTimeout;

            // 石碑碰撞檢測
            const characterBoundingBox = new THREE.Box3().setFromObject(character);
// 在碰撞檢測時顯示石碑描述
monoliths.forEach((monolith, index) => {
    const monolithBoundingBox = new THREE.Box3().setFromObject(monolith);
    if (characterBoundingBox.intersectsBox(monolithBoundingBox)) {
        if (!monolith.hasCollided) {
            addScore();
            monolith.hasCollided = true;
            monolith.pointLight.intensity = 0.05; // 關閉石碑的點光源
            monolith.material.emissiveIntensity = 0.3; // 調整發光強度為0
            playEffect(); // 播放電子音效
        }
        
        if (checkAllMonolithsCollected()) {
            onAllMonolithsCollected(); // 所有石碑收集完畢
        }

        const monolithTexture = monolith.material.map ? monolith.material.map.image.src : '';
        showMonolithInfo(monolithTexture, monolith.description);
        
        clearTimeout(hideInfoTimeout);
        hideInfoTimeout = setTimeout(() => {
            closeMonolithInfo();
        }, 500);
    }
});
            composer.render();
        }

        function addScore() {
            score++;
            document.getElementById('scoreDisplay').textContent = `${score}/12`;
        }
        // 顯示石碑信息的函數
function showMonolithInfo(imageSrc, text) {
    document.getElementById('monolithImage').src = imageSrc;
    document.getElementById('monolithText').textContent = text;
    document.getElementById('monolithInfo').style.display = 'block';
}

// 關閉石碑信息的函數
function closeMonolithInfo() {
    document.getElementById('monolithInfo').style.display = 'none';
}



// 檢查是否收集完所有石碑
function checkAllMonolithsCollected() {
    return monoliths.every(monolith => monolith.hasCollided);
}

// 當所有石碑收集完畢後，將分數欄位變成按鈕
function onAllMonolithsCollected() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = '<button id="finishButton" onclick="onFinishButtonClick()"><img src="fin.svg" alt="完成"></button>';
    scene.fog.density = 0;
    //createStarrySky(); // 創建天空
    changeSandstormProperties({
        color: 0xFFFFFF, // 將顏色更改為白色
        size: 0.3,       // 更改大小
        transparent: true, // 設置透明
        opacity: 0.8     // 更改不透明度
    });
}

// 當按下完成按鈕時的處理函數
function onFinishButtonClick() {
    // 顯示視窗並播放影片
    const videoWindow = document.getElementById('videoWindow');
    const videoPlayer = document.getElementById('videoPlayer');
    videoWindow.style.display = 'flex';

    soundVolume = 0; //設置背景音樂

    videoPlayer.play();
}

function closeVideoWindow() {
    // 隱藏視窗並停止播放影片
    const videoWindow = document.getElementById('videoWindow');
    const videoPlayer = document.getElementById('videoPlayer');
    videoWindow.style.display = 'none';

    soundVolume = 1; //設置背景音樂

    videoPlayer.pause();
    videoPlayer.currentTime = 0; // 重置影片到開頭
}
let audioContext;
let noiseSource;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function createWhiteNoise() {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
}

function startNoise() {
    if (!noiseSource) {
        noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = createWhiteNoise();
        noiseSource.loop = true;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.008 * soundVolume; // 調整音量

        noiseSource.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noiseSource.start(0);
    }
}

function stopNoise() {
    if (noiseSource) {
        noiseSource.stop(0);
        noiseSource = null;
    }
}

function playEffect() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime); // A4音高
    gainNode.gain.setValueAtTime(0.1 * soundVolume, audioContext.currentTime); // 調整音量

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // 播放0.2秒
}



let usedDialogues = new Set();


function showSubtitle() {
    // 選擇一個未使用過的對話
    let dialogueIndex;
    do {
        dialogueIndex = Math.floor(Math.random() * dialogues.length);
    } while (usedDialogues.has(dialogueIndex) && usedDialogues.size < dialogues.length);

    // 如果所有對話都顯示過，重置已使用的對話
    if (usedDialogues.size >= dialogues.length) {
        usedDialogues.clear();
    }

    usedDialogues.add(dialogueIndex);
    const dialogue = dialogues[dialogueIndex];

    let sentenceIndex = 0;
    const subtitleContainer = document.getElementById('subtitleContainer');
    const subtitleText = document.getElementById('subtitleText');

    subtitleContainer.style.display = 'block';
    subtitleText.textContent = '';

    const displayNextSentence = () => {
        if (sentenceIndex < dialogue.length) {
            const sentence = dialogue[sentenceIndex];
            subtitleText.textContent = sentence;
            sentenceIndex++;

            // 計算該句子的顯示時間
            const displayTime = sentence.length * 200;

            // 每個字符播放逼逼聲
            let charIndex = 0;
            const beepInterval = setInterval(() => {
                if (charIndex < sentence.length) {
                    playBeep();
                    charIndex++;
                } else {
                    clearInterval(beepInterval);
                }
            }, 100);

            setTimeout(displayNextSentence, displayTime + 1000); // 加上1秒的間隔
        } else {
            subtitleContainer.style.display = 'none';
            // 設置下一次顯示字幕的時間
            setTimeout(showSubtitle, Math.random() * 10000 + 30000);
        }
    };

    displayNextSentence();
}

// 開始顯示字幕
setTimeout(showSubtitle, 20000);

let soundVolume = 0; // 變數用於控制音效音量，1是開啟，0是關閉

function toggleSound() {
    soundVolume = soundVolume === 1 ? 0 : 1; // 切換音效開關
    const button = document.getElementById('toggleSoundButton');
    button.src = soundVolume === 1 ? 'musicon.svg' : 'musicoff.svg'; // 更新按鈕圖片
}

function playBeep() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    // 隨機設置頻率在800 Hz 到 1200 Hz 之間
    const randomFrequency = Math.random() * 300 + 800;
    oscillator.frequency.setValueAtTime(randomFrequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1 * soundVolume, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}


//背景音樂
// 創建 AudioContext
const backGroundMusic = new (window.AudioContext || window.webkitAudioContext)();

// 創建並配置振盪器
function createOscillator(frequency, type) {
    const oscillator = backGroundMusic.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, backGroundMusic.currentTime);
    return oscillator;
}

// 創建並配置增益（音量）控制
function createGain(value) {
    const gain = backGroundMusic.createGain();
    gain.gain.setValueAtTime(value * 0.05 * soundVolume, backGroundMusic.currentTime);
    return gain;
}

// 配置振盪器的參數
const baseOscillators = [
    { frequency: 261.63, type: 'sine', gain: 0.3 }, // C4
    { frequency: 329.63, type: 'sine', gain: 0.3 }, // E4
    { frequency: 392.00, type: 'sine', gain: 0.3 }, // G4
];

const melody = [
    { frequency: 392.00, time: 0 },    // G4
    { frequency: 392.00, time: 0.5 },  // G4
    { frequency: 523.25, time: 1 },     // C5
    { frequency: 440.00, time: 1 },    // A4
    { frequency: 392.00, time: 1.5 },  // G4
    { frequency: 587.33, time: 2 },    // D5
    { frequency: 493.88, time: 2.5 },  // B4
    { frequency: 392.00, time: 3 },    // G4
    { frequency: 392.00, time: 3.5 },  // G4
    { frequency: 440.00, time: 4 },    // A4
    { frequency: 392.00, time: 4.5 },  // G4
    { frequency: 523.25, time: 5 },    // C5
    
    
];

const drumPattern = [
    { time: 0, type: 'kick' },
    { time: 0.1, type: 'snare' },
    { time: 1, type: 'kick' },
    { time: 2, type: 'snare' },
    { time: 2.5, type: 'snare' },
    { time: 3, type: 'kick' },
    { time: 3.5, type: 'snare' },
    { time: 4, type: 'kick' },
    { time: 4.5, type: 'snare' },
    { time: 5, type: 'kick' },
];

function playDrum(time, type) {
    const osc = backGroundMusic.createOscillator();
    const gain = backGroundMusic.createGain();
    osc.connect(gain);
    gain.connect(backGroundMusic.destination);
    osc.type = 'square';

    if (type === 'kick') {
        osc.frequency.setValueAtTime(50, time);
        gain.gain.setValueAtTime(0.05 * soundVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    } else if (type === 'snare') {
        osc.frequency.setValueAtTime(120, time);
        gain.gain.setValueAtTime(0.1 * soundVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    }

    osc.start(time);
    osc.stop(time + 0.2);
}

// 創建並連接振盪器和增益
function playBackground() {
    baseOscillators.forEach(({ frequency, type, gain }) => {
        const oscillator = createOscillator(frequency, type);
        const gainNode = createGain(gain);
        oscillator.connect(gainNode).connect(backGroundMusic.destination);
        oscillator.start();

        oscillator.stop(backGroundMusic.currentTime + 6); // 6 秒後停止振盪器
    });
}

// 播放旋律
function playMelody() {
    melody.forEach(({ frequency, time }) => {
        const oscillator = createOscillator(frequency, 'sine');
        const gainNode = createGain(0.5);
        oscillator.connect(gainNode).connect(backGroundMusic.destination);
        oscillator.start(backGroundMusic.currentTime + time);
        oscillator.stop(backGroundMusic.currentTime + time + 0.5);
    });
}

// 播放鼓組
function playDrums() {
    drumPattern.forEach(({ time, type }) => {
        playDrum(backGroundMusic.currentTime + time, type);
    });
}

// 播放背景、旋律和鼓組
function playMusic() {
    playBackground();
    playMelody();
    playDrums();
    setTimeout(playMusic, 6000); // 每6秒重新播放
}



// 顯示教學介面的函數
function showTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    tutorialOverlay.style.display = 'flex';

    // 添加鍵盤事件監聽器以關閉教學介面
    document.addEventListener('keydown', closeTutorial, { once: true });
}

// 關閉教學介面的函數
function closeTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    tutorialOverlay.style.display = 'none';
}

function createStarrySky() {
    const loader = new THREE.TextureLoader();
    const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
    const skyMaterialOptions = {
        side: THREE.BackSide
    };

    loader.load('sky.png', texture => {
        skyMaterialOptions.map = texture;
        const skyMaterial = new THREE.MeshBasicMaterial(skyMaterialOptions);
        const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(skyMesh);
    });
}

        // 初始化遊戲
        init();