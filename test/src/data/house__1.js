var data = {
    house: {　
        houseWidth: 900, // 房间长度
        houseHeight: 600, // 房间宽
        angle: "东", // 房间朝向
        wall: [　　　　
            { position: { x: 0, y: 0, endX: 900, endY: 0 }, door: { isDoor: false }, windows: { isWindows: false } }, 　　　　
            { position: { x: 900, y: 0, endX: 900, endY: 600 }, door: { isDoor: false }, windows: { isWindows: true, windows__Point: [{ x: 900, y: 50, endX: 900, endY: 550 }] } }, 　　　　
            { position: { x: 0, y: 600, endX: 900, endY: 600 }, door: { isDoor: false }, windows: { isWindows: false } }, 　　　　
            { position: { x: 0, y: 0, endX: 0, endY: 600 }, door: { isDoor: true, doorNum: 2, door_Point: [{ x: 0, y: 200, endX: 0, endY: 400, doorDirection: 0 }] }, windows: { isWindows: true, windows__Point: [{ x: 0, y: 0, endX: 0, endY: 250 }, { x: 0, y: 450, endX: 0, endY: 600 }] } }　　
        ]
    }
}

export default data;