import * as THREE from 'three';
import * as TWEEN from 'tween';
import Detector from "../assets/js/libs/Detector.js";
import { OrbitControls } from "../assets/js/control/OrbitControls";

import THREEBSP from "../assets/js/libs/ThreeBSP";


import doorRight from "../assets/images/door_right.png";
import doorLeft from "../assets/images/door_left.png";
import { Group } from 'three';
class DrawHouse {
    /**
     * 构造方法初始化
     * @param { 绘制对象 } el 
     * @param { 绘制对象距离屏幕左边的距离 } canvas_left 
     * @param { 绘制对象距离屏幕顶部的距离 } canvas_top 
     * @param { 返回函数 } callback  
     */
    constructor(el, canvas_left, canvas_top, callback) {
        this.el = el;
        this.callback = callback;
        this.canvas_left = canvas_left;
        this.canvas_top = canvas_top;

        this.transformCallback = null;

        this.container = "";
        this.controlRender = 1;

        this.camera = "";
        this.scene = null;
        this.renderer = null;
        this.plane = "";
        this.cube;
        this.mouse = "";
        this.container__W = "";
        this.container__H = "";
        this.roteteAngle = "";

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector3();
        this.isShiftDown = false;

        this.rollOverMesh = "";
        this.rollOverGroup = "";
        this.rollOverMaterial = null;
        this.cubeMaterial = null;
        this.controls = null;
        this.selection = null;

        this.isNextAppend = false;

        this.camear__x = 0;
        this.camear__y = 1000;
        this.camear__z = 0;
        this.initLen = 1500;
        this.lon = 0;

        this.houseTowards = { "东": 0, "东南": 315, "南": "270", "西南": 225, "西": 180, "西北": 135, "北": "90", "东北": "45" };

        // Three.js 全景贴图
        this.imgRendering = new THREE.TextureLoader();

        this.houseWidth = ""; // 房子的长
        this.houseHeight = ""; // 房子的宽
        this.canClickEquipment = false; // 是否允许拖动
        this.changeEquipment = false;
        this.sceneMeshList = [];

        // 3D模型旋转返回角度
        this.angleCallback = "";

        //定义材质
        this.selectEquipmentMesh = new THREE.MeshPhongMaterial({
            color: 0xf93040,
        });

        this.objects = [];

        this.DoorRenderingList = []; // 门的材质
        this.LeftDoorRenderingList = []; // 左边门的材质
        this.wallMatArray = []; // 墙体的颜色2
        this.initLambertMod = null;
        // 定义各种设备的高度
        this.equipmentJson = {
            FireCabinet: { size: 60, },
            AirCabinet: { size: 200 },
            cabient: { size: 200 },
            distributorBox: { size: 240 }
        }

        this.data = "";
        this.initCabientObject = null;
    }

    init(data) {
        let angle = this.houseTowards[data.angle] == undefined ? data.angle : this.houseTowards[data.angle];
        angle = angle * (Math.PI / 180);
        this.camear__z = Math.cos(angle) * this.initLen;
        this.camear__x = Math.sin(angle) * this.initLen;
        this.data = data;
        this.houseWidth = data.houseWidth;
        this.houseHeight = data.houseHeight;
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }
        // 初始化场景
        this.cerateScene();
        // 初始化镜头
        this.createCamear();
        // 初始化灯光
        this.createLight();
        // 初始化渲染器
        this.createRenderer();
        // 初始化墙体材质
        this.createWallMaterail();
        // 控制函数
        this.createControls();
        // 初始化帧刷新
        this.animate();
        // 加载门材质
        this.RenderingDoor(() => {
            //画房子的墙
            this.initLambert();
            this.createHouseWall();
        })

        this.initCabient();

    };


    /**
     * 初始化材质
     */
    cerateScene() {
        this.scene = new THREE.Scene();
    };
    /**
     * 初始化相机
     */
    createCamear() {
        this.camera = new THREE.PerspectiveCamera(45, this.el.offsetWidth / this.el.offsetHeight, 1, 10000);
        this.camera.position.set(this.camear__x, this.camear__y, this.camear__z);
        var target = new THREE.Vector3();
        this.camera.lookAt(target);
        this.camera.fov = 50;
    };

    /** 
     * 新建镭射器
     * 用于点击3D模型获取模型的Mesh（网格对象）
     */
    cerateRayCaster(x, y) {
        this.mouse = new THREE.Vector2();
        var geometry = new THREE.PlaneBufferGeometry(this.houseWidth + x, this.houseHeight + y);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        this.scene.add(this.plane);

        this.objects.push(this.plane);
    };

    /**
     * 初始化光源
     */
    createLight() {
        // 设置环境光
        var ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);
        // 设置平行光
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
    };
    /**
     * 初始化渲染器
     */
    createRenderer() {
        /**
         * WebGLRenderer
         * antialias 抗锯齿，平滑，默认false
         * alpha 画布是否包含透明缓冲区，默认false
         * gammaInput: Boolean 所有的纹理和颜色预乘伽马，默认false
         * gammaOutput: Boolean 需要以预乘的伽马输出，默认false
         * shadowMap: 属性有enabled(默认false)/autoUpdate(默认true)/needsUpdate(默认false)/type(默认 THREE.PCFShadowMap)
         * setPixelRatio(value) 设置设备像素比
         * setSize(width, height) 设置渲染器的范围
         * setClearColor(color,alpha) 设置渲染的环境的颜色
         */
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

        this.renderer.setClearColor(0XFFFFFF, 0);

        this.el.innerHTML = "";
        this.el.appendChild(this.renderer.domElement);
        this.container__W = this.el.offsetWidth;
        this.container__H = this.el.offsetHeight;

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderer.shadowMap.enabled = true;
    };

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 450;
        this.controls.maxDistance = 5000;
    };
    /**
     * 初始化FPS函数
     */
    animate() {
        let _self = this;
        requestAnimationFrame(_self.animate.bind(this));
        this.render();
        TWEEN.update();
    };
    /**
     * 定义FPS函数执行的内容
     */
    render() {
        //if (this.renderer && this.controlRender % 6 == 0) {
        if (this.renderer && this.controlRender % 3 == 0) {
            this.renderer.render(this.scene, this.camera);
            if (this.angleCallback != "") {
                var dir = new THREE.Vector3(-this.camera.position.x, 0, -this.camera.position.z).normalize();
                this.roteteAngle = (180 / Math.PI) * Math.atan2(-dir.x, -dir.z);
                this.angleCallback(this.roteteAngle);
            }
            this.controlRender = 0;
            this.controls.update();
        }
        this.controlRender++;
    };
    createWallMaterail() {
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0xafc0ca
        })); //前  0xafc0ca :灰色
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0x9cb2d1
        })); //后  0x9cb2d1：淡紫
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0xd6e4ec
        })); //上  0xd6e4ec： 偏白色
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0xd6e4ec
        })); //下
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0xafc0ca
        })); //左   0xafc0ca :灰色
        this.wallMatArray.push(new THREE.MeshPhongMaterial({
            color: 0xafc0ca
        })); //右
    };
    //加载门的图片
    RenderingDoor(callback) {
        //门的颜色
        this.DoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 右
        this.DoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 左
        this.DoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 上
        this.DoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 下

        this.LeftDoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 }));
        this.LeftDoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 右
        this.LeftDoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 右
        this.LeftDoorRenderingList.push(new THREE.MeshBasicMaterial({ color: 0XECF1F3 })); // 右

        this.imgRendering.load(doorRight, texture => {
            var DoorRenderingDt = new THREE.MeshBasicMaterial({
                map: texture,
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            DoorRenderingDt.opacity = 1.0;
            DoorRenderingDt.transparent = true;
            this.DoorRenderingList.push(DoorRenderingDt);
            this.imgRendering.load(doorLeft, texture => {
                var DoorRenderingDt2 = new THREE.MeshBasicMaterial({
                    map: texture,
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });
                DoorRenderingDt2.opacity = 1.0;
                DoorRenderingDt2.transparent = true;
                this.LeftDoorRenderingList.push(DoorRenderingDt2);

                callback();
            })
        })

    };
    createFloor() {
        let _self = this;
        this.imgRendering.load("/static/images/floor_1.jpg", texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(8, 8);
            var floorGeometry = new THREE.BoxGeometry(this.houseWidth, this.houseHeight, 1);
            var floorMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            floorMaterial.opacity = 1;
            floorMaterial.transparent = true;
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = 0;
            floor.rotation.x = Math.PI / 2;

            _self.scene.add(floor);
        })
    };
    createHouseWall() {
        this.data.wall.map((item) => {
            var position = item.position;
            var w = position.endX - position.x;
            var h = position.endY - position.y;
            var x = (position.x + w / 2) - (this.houseWidth / 2);
            var z = (position.y + h / 2) - (this.houseHeight / 2);
            var width = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            var angle = Math.asin(h / width) / Math.PI;


            console.log(angle);
            if (item.windows.isWindows || item.door.isDoor) {
                var window__List = [];
                var door__List = [];
                if (item.windows.isWindows) {
                    item.windows.windows__Point.map((windows__Point, window__index) => {
                        let window__Json = {};
                        let windows__w = windows__Point.endX - windows__Point.x;
                        let windows__h = windows__Point.endY - windows__Point.y;
                        window__Json.window__x = (windows__Point.x + windows__w / 2) - (this.houseWidth / 2);
                        window__Json.window__z = (windows__Point.y + windows__h / 2) - (this.houseHeight / 2);
                        window__Json.window__width = Math.sqrt(Math.pow(windows__w, 2) + Math.pow(windows__h, 2));
                        window__Json.w_Height = 120;
                        window__Json.window__y = 100;
                        window__List.push(window__Json);

                    });
                }
                if (item.door.isDoor) {
                    var door__num = item.door.doorNum || 1;
                    item.door.door_Point.map((door__Point, door__index) => {
                        var door__Json = {};
                        var windows__w = door__Point.endX - door__Point.x;
                        var windows__h = door__Point.endY - door__Point.y;
                        if (door__num == 2) {
                            let doubleDoorList = [];
                            for (var i = 0; i < 2; i++) {
                                door__Json = {};
                                door__Json.door__x = (door__Point.x + windows__w / 2) - (this.houseWidth / 2) + (door__Point.endX - door__Point.x) / 2 * i;
                                door__Json.door__z = (door__Point.y + windows__h / 2) - (this.houseHeight / 2) + (door__Point.endY - door__Point.y) / 2 * i;
                                door__Json.door__width = (Math.sqrt(Math.pow(windows__w, 2) + Math.pow(windows__h, 2))) / 2;
                                door__Json.door__height = 180;
                                door__Json.door__y = 100;
                                door__Json.doorDirection = door__Point.doorDirection;
                                if (door__Point.doorDirection < 2) {
                                    doubleDoorList.unshift(door__Json);
                                } else {
                                    doubleDoorList.push(door__Json);
                                }
                            }
                            door__List.push(doubleDoorList);
                        } else {
                            door__Json.door__x = (door__Point.x + windows__w / 2) - (this.houseWidth / 2);
                            door__Json.door__z = (door__Point.y + windows__h / 2) - (this.houseHeight / 2);
                            door__Json.door__width = Math.sqrt(Math.pow(windows__w, 2) + Math.pow(windows__h, 2));
                            door__Json.door__height = 180;
                            door__Json.door__y = 100;
                            door__Json.doorDirection = door__Point.doorDirection;
                            door__List.push(door__Json);
                        }
                    });
                }
                this.cerateWallHadDoorOrGlass(width + 10, 200, 10, angle, this.matArrayB, x, 100, z, door__List, window__List)
            } else {
                let code = this.returnLambertClone(width, 200, 10, angle, this.matArrayB, x, 100, z);
                this.scene.add(code);
            }
        });
    };
    initLambert() {
        var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.initLambertMod = new THREE.Mesh(cubeGeometry, this.wallMatArray);
    };
    /**
     * 画长方体
     * @param { 长方体的长度 } width 
     * @param { 长方体的高度 } height 
     * @param { 长方体的厚度 } depth 
     * @param { 长方体旋转的角度 } angle 
     * @param { 长方体的材质 } material 
     * @param { 长方体的X轴坐标 } x 
     * @param { 长方体的Y轴坐标 } y 
     * @param { 长方体的Z轴坐标 } z 
     */
    returnLambertClone(width, height, depth, angle, material, x, y, z) {
        var code = this.initLambertMod.clone();
        code.scale.set(width, height, depth)
        code.position.set(x, y, z);
        code.rotation.set(0, angle * Math.PI, 0); //-逆时针旋转,+顺时针
        return code;
    };
    returnLambertObject(width, height, depth, angle, material, x, y, z) {
        var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
        var cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
        return cube;
    };
    /**
     * 几何体裁切函数
     * @param { 被采裁切的集合体 } bsp 
     * @param { 要裁掉的集合体 } less_bsp 
     * @param { 区分是机房的墙还是机柜裁切的 } mat 
     */
    returnResultBsp(bsp, less_bsp, mat) {
        switch (mat) {
            case 1:
                var material = new THREE.MeshPhongMaterial({
                    color: 0x9cb2d1,
                    specular: 0x9cb2d1,
                    shininess: 30,
                    transparent: true,
                    opacity: 1
                });
                break;
            case 2:
                var material = new THREE.MeshPhongMaterial({
                    color: 0x42474c,
                    specular: 0xafc0ca,
                    shininess: 30,
                    transparent: true,
                    opacity: 1
                });
                break;
            default:
        }

        var sphere1BSP = new ThreeBSP(bsp);
        var cube2BSP = new ThreeBSP(less_bsp); //0x9cb2d1 淡紫,0xC3C3C3 白灰 , 0xafc0ca灰
        var resultBSP = sphere1BSP.subtract(cube2BSP);
        var result = resultBSP.toMesh(material);
        result.material.flatshading = THREE.FlatShading;
        result.geometry.computeFaceNormals(); //重新计算几何体侧面法向量
        result.geometry.computeVertexNormals();
        result.material.needsUpdate = true; //更新纹理
        result.geometry.buffersNeedUpdate = true;
        result.geometry.uvsNeedUpdate = true;
        if (mat == 2) {
            result.nature = "Cabinet";
        }
        return result;
    };

    //画有门和有窗子的墙（工具函数）
    cerateWallHadDoorOrGlass(width, height, depth, angle, material, x, y, z, door__list, windows__List) {
        //茶色：0x58ACFA   透明玻璃色：0XECF1F3
        var glass_material = new THREE.MeshBasicMaterial({
            color: 0XECF1F3
        });
        glass_material.opacity = 0.5;
        glass_material.transparent = true;
        var wall = this.returnLambertObject(width, height, depth, angle, material, x, y, z);
        windows__List.map((item, index) => {
            var window_cube = this.returnLambertObject(item.window__width, item.w_Height, depth, angle, material, item.window__x, item.window__y, item.window__z);
            wall = this.returnResultBsp(wall, window_cube, 1);
            let code = this.returnLambertObject(item.window__width, item.w_Height, 2, angle, glass_material, item.window__x, item.window__y, item.window__z);
            this.scene.add(code);
        });
        var status__result = [0.5, 0.5, 0, 0, ]
        door__list.map((item, index) => {
            if (item.length == 2) {
                item.map((c_item, c_index) => {
                    let door_cube = this.returnLambertObject(c_item.door__width, c_item.door__height, 10, angle, this.matArrayB, c_item.door__x, c_item.door__y, c_item.door__z);
                    wall = this.returnResultBsp(wall, door_cube, 1);
                    let doorgeometry = new THREE.BoxGeometry(100, 180, 2);
                    let door = "";
                    if (c_index == 0) {
                        door = new THREE.Mesh(doorgeometry, this.LeftDoorRenderingList);
                    } else {
                        door = new THREE.Mesh(doorgeometry, this.DoorRenderingList);
                    }
                    door.position.set(c_item.door__x, c_item.door__y, c_item.door__z);
                    door.rotation.y = status__result[c_item.doorDirection] * Math.PI;
                    door.nature = "door";
                    door.direction = c_item.doorDirection;
                    door.isClose = 1;
                    door.doorIndex = c_index;
                    this.scene.add(door);
                });
            } else {
                let door_cube = this.returnLambertObject(item.door__width, item.door__height, 10, angle, this.matArrayB, item.door__x, item.door__y, item.door__z);
                wall = this.returnResultBsp(wall, door_cube, 1);
                let doorgeometry = new THREE.BoxGeometry(100, 180, 2);
                let door = new THREE.Mesh(doorgeometry, this.DoorRenderingList);
                door.position.set(item.door__x, item.door__y, item.door__z);
                door.rotation.y = status__result[item.doorDirection] * Math.PI;
                door.nature = "door";
                door.direction = item.doorDirection;
                door.isClose = 1;
                this.scene.add(door);
            }

        });
        this.scene.add(wall);
    };
    initCabient() {
        let _self = this;
        // 用打组有个好处是我们不用管group中的Mesh的位置，我们只需要操控Group的位置
        this.initCabientObject = new Group();
        var Cabinet_material = new THREE.MeshPhongMaterial({
            color: 0x42474c,
        });
        // 注意此处不能用之前初始化同来克隆的几何体，因为用来克隆的集合体的长宽高都为1，我们看到的都是放大的，而本体尺寸其实并没有改变，所以用几何体做减法的时候会被减没了
        var Cabinet = _self.returnLambertObject(60, 200, 60, 0, Cabinet_material, 0, 0, 0);
        var Cabinet_inside = _self.returnLambertObject(54, 196, 56, 0, Cabinet_material, 3, 0, 0);
        this.initCabientObject.add(_self.returnResultBsp(Cabinet, Cabinet_inside, 2, 0)); // 这一步一个掏空的盒子已经出现了

        // 画门
        var doorgeometry = new THREE.BoxGeometry(55, 190, 2);
        var door = new THREE.Mesh(doorgeometry, _self.DoorRenderingList);
        door.position.set(30, 0, 0);
        door.rotation.y = 0.5 * Math.PI; //-逆时针旋转,+顺时针
        door.nature = "Cabinet__door";
        door.isClose = 1;
        this.initCabientObject.add(door);

        // 以下三行代码仅做演示用
        // this.initCabientObject.position.set(0, 100, 0);
        // this.initCabientObject.rotation.y = 1 * Math.PI;
        // this.scene.add(this.initCabientObject);
    };
    createCabient(result) {
        let _self = this;
        result.map((item) => {
            let cabientMod = _self.initCabientObject.clone();
            cabientMod.position.set(item.x - _self.houseWidth / 2, 100, item.z - _self.houseHeight / 2);
            cabientMod.rotation.y = item.angle * Math.PI;
            _self.scene.add(cabientMod);
        })
    };
};

export default DrawHouse;