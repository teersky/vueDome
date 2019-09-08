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
    },
    cabient: [
        { x: 130, z: 120, codeID: "XZ100001", angle: 0 },
        { x: 230, z: 120, codeID: "XZ100002", angle: 0.5 },
        { x: 330, z: 120, codeID: "XZ100003", angle: 1 },
        { x: 430, z: 120, codeID: "XZ100004", angle: 1.5 },

    ]
}

export default data;