window.chinasoft = {};

chinasoft.addTransition = function(dom) {
	dom.style.transition = "all 0.1s";
	dom.style.webkitTransition = "all 0.1s";
};
chinasoft.removeTransition = function(dom) {
	dom.style.transition = "none";
	dom.style.webkitTransition = "none";
};
chinasoft.setTranslateX = function(dom, disntanceX) {
	dom.style.transform = `translateX(${disntanceX}px)`;
	dom.style.webkitTransform = `translateX(${disntanceX}px)`;
};
chinasoft.setTranslateY = function(dom, disntanceY) {
	dom.style.transform = `translateY(${disntanceY}px)`;
	dom.style.webkitTransform = `translateY(${disntanceY}px)`;
};
chinasoft.addEvent = function(dom, callback) {
	dom.addEventListener('transitionEnd', callback)
	dom.addEventListener('webkitTransitionEnd', callback)
};
chinasoft.tap = function(dom, callback) {
	let start = 0;
	let end = 0;
	let isMove = false;
	dom.addEventListener('touchstart', function() {
		start = new Date().getTime()
	});
	dom.addEventListener('touchmove', function() {
		isMove = true;
	});
	dom.addEventListener('touchend', function() {
		end = new Date().getTime();
		if(!isMove && (end - start) < 150) {
			//如果存在回调函数就执行
			callback && callback()
		}
		start = 0;
		end = 0;
		isMove = false;
	});
}

chinasoft.swiper = function(parentBox, childBox, style) {
	/*参数说明：
	 *	 parentBox: 需要获取的父容器(传入dom元素)
	 *	 childBox : 需要获取的子容器（ul 传入dom元素）
	 * 	 style    : 根据布局选择是左右滑动还是上下滑动，可以写true或false
	 * 				其中true代表上下滑动，false代表左右滑动
	 * 
	 * 	 调用方法： chinasoft.swiper(parentBox,childBox,style)
	 * 
	 *功能分析：
	 *   1.可以滑动（touch X/Y）
	 *   2.往右/下滑动的时候到达一定距离不能滑动
	 *   3.往左/上滑动的时候到达一定距离不能滑动
	 *   滑动区间[-(W-w)-100,100]、[-(H-h)-100,100]
	 *   4.当滑动超过了最大的定位距离时，定位回去
	 *   5.当滑动超过了最小的定位距离时，定位回去
	 *   定位区间[-(W-w),0]、[-(H-h),0]
	 *   6.点击ul的时候改变当前li的样式（now）
	 *   7.点击的时候，滑动到最左/顶部，在定位距离内
	 *   8.如果点击的位置没有在定位区间内，保持原位
	 * */
	const distance = 100; //缓冲距离
	if(style) {
		var parentHeight = parentBox.offsetHeight;
		var childHeight = childBox.offsetHeight;
		//滑动区间
		var maxSwiper = 100;
		var minSwiper = parentHeight - childHeight - distance;
		//定位区间
		var maxPosition = 0;
		var minPosition = parentHeight - childHeight;
		var startY = 0;
		var moveY = 0;
		var isMove = false;
		var currY = 0;
	} else {
		var parentWidth = parentBox.offsetWidth;
		var childWidth = childBox.offsetWidth;
		console.log(childWidth);
		//滑动区间
		var maxSwiper = 100;
		var minSwiper = parentWidth - childWidth - distance;
		//定位区间
		var maxPosition = 0;
		var minPosition = parentWidth - childWidth;
		var startX = 0;
		var moveX = 0;
		var isMove = false;
		var currX = 0;
	}
	childBox.addEventListener('touchstart', function(e) {
		if(style) {
			startY = e.touches[0].clientY;
		} else {
			startX = e.touches[0].clientX;
		}
	});
	childBox.addEventListener('touchmove', function(e) {
		isMove = true;
		if(style) {
			moveY = e.touches[0].clientY;
			//可以滑动
			let distanceY = currY + moveY - startY;
			//2.往下滑动的时候到达一定距离不能滑动
			//3.往上滑动的时候到达一定距离不能滑动
			if(distanceY >= minSwiper && distanceY <= maxSwiper) {
				chinasoft.removeTransition(childBox);
				chinasoft.setTranslateY(childBox, distanceY);
			}
		} else {
			moveX = e.touches[0].clientX;
			let distanceX = currX + moveX - startX;
			if(distanceX >= minSwiper && distanceX <= maxSwiper) {
				chinasoft.removeTransition(childBox);
				chinasoft.setTranslateX(childBox, distanceX);
			}
		}
	});
	childBox.addEventListener('touchend', function(e) {
		if(style) {
			if(isMove) {
				// 4.当滑动超过了0时，定位回去
				// 5.当滑动超过了最小的定位距离时，定位回去
				if(currY + moveY - startY >= 0) {
					currY = maxPosition;
				} else if(currY + moveY - startY <= parentHeight - childHeight) {
					currY = minPosition;
				} else {
					currY = currY + moveY - startY;
				}
				chinasoft.addTransition(childBox);
				chinasoft.setTranslateY(childBox, currY);
			}
			isMove = false;
			startY = 0;
			moveY = 0;
		} else {
			if(isMove) {
				if(currX + moveX - startX >= 0) {
					currX = maxPosition;
				} else if(currX + moveX - startX <= parentWidth - childWidth) {
					currX = minPosition;
				} else {
					currX = currX + moveX - startX;
				}
				chinasoft.addTransition(childBox);
				chinasoft.setTranslateX(childBox, currX);
			}
			isMove = false;
			startX = 0;
			moveX = 0;
		}
	});

	//6.点击ul的时候改变当前li的样式（now）
	chinasoft.tap(childBox, function() {
		let currLi = event.target.parentNode;
		let liArr = childBox.querySelectorAll('li');
		for(var i = 0; i < liArr.length; i++) {
			liArr[i].index = i;
			liArr[i].className = '';
		}
		currLi.className = 'now';
		//7.点击的时候，滑动到最顶部，在定位距离内
		//8.如果点击的位置没有在定位区间内，保持原位
		let index = currLi.index;
		if(style) {
			let liHeight =liArr[0].offsetHeight;
			if(-index * liHeight > minPosition && -index * liHeight < maxPosition) {
				currY = -index * liHeight;
			} else if(-index * liHeight < minPosition) {
				currY = minPosition;
			}
			chinasoft.removeTransition(childBox);
			chinasoft.setTranslateY(childBox, currY);
		}
		else{
			let liWidth =liArr[0].offsetWidth;
			if(-index * liWidth > minPosition && -index * liWidth < maxPosition) {
				currX = -index * liWidth;
			} else if(-index * liWidth < minPosition) {
				currX = minPosition;
			}
			chinasoft.removeTransition(childBox);
			chinasoft.setTranslateX(childBox, currX);
		}

	})
}