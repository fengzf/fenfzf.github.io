(function() {
	function slider() {
		let json = [{
				bac: "url(./images/slide_01_2000x410.jpg)",
				img: "./images/slide_01_640x340.jpg"
			},
			{
				bac: "url(./images/slide_02_2000x410.jpg)",
				img: "./images/slide_02_640x340.jpg"
			},
			{
				bac: "url(./images/slide_03_2000x410.jpg)",
				img: "./images/slide_03_640x340.jpg"
			},
			{
				bac: "url(./images/slide_04_2000x410.jpg)",
				img: "./images/slide_04_640x340.jpg"
			}
		];
		let width = $(window).width();
		let isMobile = true;
		if(width < 768) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		let html = template("sliderWrapper", {
			data: json,
			isMobile
		});
		$('#inner').html(html);
		
		let isMove =false;
		let startX =0;
		let moveX =0;
		let distanceX =0;
		$('#inner').on('touchstart',function(e){
			startX = e.originalEvent.touches[0].clientX;
		})
		$('#inner').on('touchmove',function(e){
			moveX = e.originalEvent.touches[0].clientX;
			isMove =true;
		})
		$('#inner').on('touchend',function(e){
			distanceX =startX -moveX;
			if(isMove){
				if(distanceX>0){
                    //后一张
                    $("#wjs_swiper").carousel("next");
                }else if(distanceX<0){
                    //前一张
                    $("#wjs_swiper").carousel("prev");
                }
			}
			isMove = false;
            startX = 0;
            moveX = 0;
            distanceX = 0;
		})
	}
	
	function huadong(){
		let parent = $('.wjs_product_tabs_parent');
        let ul = parent.find('ul');
        let lis = ul.find('li');
        let sum = 0;
        lis.each(function(index,item){
            sum+=$(item).innerWidth();
        });
        ul.width(sum);
		chinasoft.swiper(parent[0],ul[0],false);
	}
	

	$(window).on('resize', function() {
		slider();
		huadong();
	}).trigger('resize')

	//小圆点渲染
	let point = template("point", {});
	$('#wjs_point').html(point);

	//es6 解构赋值
	//	let name ="张三",age =18;
	//	let people ={name,age};

	let people = {
		name: "zhangsan",
		age: 18
	};
	//	let name =people.name;
	//	let age =people.age;
	let {
		name,
		age
	} = people; //简写

	function fn({
		name,
		age
	}) {

	}
	fn({
		name: "lisi",
		age: 18
	});

})();