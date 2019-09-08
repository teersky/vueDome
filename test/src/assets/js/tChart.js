class TChart {
    constructor(el) {
        this.el = el;
        this.width = null;
        this.height = null;
        this.canvas = "";
        this.cxt = "";
        this.option = {};
        this.init();
    }
    init(){
        console.log(this.el);
        this.width = this.el.offsetWidth;
        this.height = this.el.offsetHeight;
        this.createCanvas();
    }
    createCanvas(){
        this.canvas = document.createElement("canvas");
        this.cxt = this.canvas.getContext("2d");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.el.appendChild(this.canvas);
    }
    setOption(option){
        console.log(option);
        this.option = option;
        this.drawXAxis();
        //this.drawYAxis();
    }
    drawXAxis(){
       this.cxt.strokeStyle = this.option.xAxis.axisLabel.color || '#f00';
       // 设置线条的宽度
       this.cxt.lineWidth = this.option.xAxis.axisLabel.width || 2;

       this.cxt.moveTo(50, this.height - 50);
       this.cxt.lineTo(this.width - 50, this.height - 50);
       this.cxt.stroke();
       this.drawXAxisMarks();
       this.drawXAxisValue();
    }
    drawXAxisMarks(){
        if(this.option.xAxis.axisLabel){
            this.cxt.strokeStyle = this.option.xAxis.axisLabel.color || '#f00';
            this.cxt.lineWidth = this.option.xAxis.axisLabel.width || 2;
        }else{
            this.cxt.strokeStyle = '#f00';
            this.cxt.lineWidth =  2;
        }
        var len = this.option.xAxis.data.length;
        var wid = (this.width - 100 ) / 6;
        for(var i = 1; i <= len; i++){
            this.cxt.moveTo(50 + wid * i, this.height - 60);
            this.cxt.lineTo(50 + wid * i, this.height - 50);
            this.cxt.stroke();
        };
    }
    drawXAxisValue(){
        if(this.option.xAxis.axisLabel){
            this.cxt.fillStyle = this.option.xAxis.axisLabel.fillStyle || '#333';
            this.cxt.textAlign = this.option.xAxis.axisLabel.textAlign || "center";
            this.cxt.textBaseline = this.option.xAxis.axisLabel.textBaseline || "middle";
            this.cxt.font = this.option.xAxis.axisLabel.font || "14px bold 黑体";
        }else{
            this.cxt.font = "14px bold 黑体";
            this.cxt.fillStyle = "#333";
            this.cxt.textAlign = "center";
            this.cxt.textBaseline = "middle";
        }
        var len = this.option.xAxis.data.length;
        var wid = (this.width - 100 ) / 6;
        this.cxt.rotate(45 * Math.PI / 180);
        this.option.xAxis.data.map((item, index) => {
            this.cxt.translate(50 + wid , 5);
            this.cxt.fillText(item, 0, 0);
            this.cxt.translate(-(50 + wid) , 0);
        });
    }
    drawYAxis(){
        console.log(this.option.yAxis);
    /*    if(this.option.yAxis.axisLabel){
            this.cxt.strokeStyle = this.option.yAxis.axisLabel.color || '#333';
            // 设置线条的宽度
            this.cxt.lineWidth = this.option.yAxis.axisLabel.width || 2;
        }else{
            this.cxt.strokeStyle = '#f00';
            // 设置线条的宽度
            this.cxt.lineWidth = 2;
        }

        this.cxt.moveTo(50, 20, );
        this.cxt.lineTo(50, this.height - 50);
        this.cxt.stroke();
        this.drawYAxisMarks(); */
    }
    drawYAxisMarks(){
    }

}
export default TChart;
