function startMove(obj,json,fn){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var flag = true;//碰到flag先不用管它，后面自然就明白了
		for(var attr in json){ //为了应对可能出现的几个属性同时变化的情况
			var iTarget = json[attr]; //attr是一个变量，和for-in循环里的attr是同一个  可能值如：weight height 等等这些样式属性
			if(attr=="opacity"){ //由于透明度的变化也是常见的一种变化效果，但是它和其他像素相关的效果在取值上有所不同，所以单独处理
				var iCur = parseInt(getStyle(obj,"opacity")*100);//便于数据的处理，另外还考虑到IE里的兼容问题
			}else{
				var iCur = parseInt(getStyle(obj,attr));//parseInt()过滤掉px这个单位
			}
			var iSpeed = (iTarget-iCur)/7; //每一次定时器代码运行时，属性的一个变化量，这个值逐渐，实现缓冲效果
			
			//当初始值比目标值小时，iSpeed > 0 ,但是随着iSpeed会无限接近于0，当iSpeed比较小时，样式会识别不出这个值，导致当前值无法达到目标值，
			//索引当这个值小于1时，可以让这个等于1，保证当前值能达到目标值
			//iSpeed < 0,iSpeed为负值，也是无限接近于0，此时仍然向上取整，会取到0，无法达到目标值，将iSpeed变成-1
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);					
			
			
			if(attr == 'opacity'){//兼容性
				obj.style.opacity = (iCur + iSpeed)/100;
				obj.style.filter = "alpha(opacity="+(iCur+iSpeed)+")";
			}else{
				obj.style[attr] = iCur + iSpeed + "px";
			}
			
			//如果判断iCur==iTarget 就清除定时器，会导致，只要有一个属性值达到目标值，就清了，至于其他有没有达到，这个没法判断
			//所以要考虑只有所有的都达到目标值时才清除定时器
			//换句话说，只要有一个没有达到，就不能清
			//可以假设每一次定时器开启时，所有的属性都已达到目标值，可以在定时器里的第一行代码加一个变量flag设为true来表示
			if(iCur != iTarget){
				flag = false; //只要有没达到的 flag==false
			}

		}
		
		if(flag){ //flag 为true 清定时器
			clearInterval(obj.timer);
			if(fn){ //如果需要链式调用（属性依次变化），我们可以在startMove里设置一个函数，这个函数就另外属性的变化，前提要考虑，有没有这种需要
				fn();
			}
		}
		
		
	},20);
	
	
}

function getStyle(obj,attr){ //获取行内和非行内样式的封装函数
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	return getComputedStyle(obj,null)[attr];
	
}
