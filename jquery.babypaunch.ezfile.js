/*
* ezfile
* dev: 정대규
* first: 2016.11.15
* version: 2.0
* lisence: MIT(free)
* email: babypaunch@gmail.com
*/
"use strict";

$.fn.ezfile = function(json){
	var defaults = {
		text: "업로드할 파일을 선택하세요." //"Select a file to upload."
		, limit: undefined
		, style: {
			icon: "style='display: none; background: gray; color: white; padding: 3px; margin-right: 5px;'"
			, file: "style='float: right; border: 0; background: gray; color: white; padding: 0 2px;'"
			, delete: "style='display: none; float: right; border: 0; background: gray; color: white; padding: 0 2px;'"
		}
		, icon: {
			ppt: "maroon"
			, pptx: "maroon"
			, xls: "limegreen"
			, xlsx: "limegreen"
			, doc: "dodgerblue"
			, docx: "dodgerblue"
			, "7z": "black"
			, zip: "black"
			, jar: "black"
			, tar: "black"
			, tgz: "black"
			, alz: "black"
			, tgz: "black"
			, html: "skyblue"
			, htm: "skyblue"
			, png: "orange"
			, gif: "orange"
			, jpg: "orange"
			, jpeg: "orange"
			, bmp: "orange"
		}
	};

	var ezfile = {
		file: function($element){
			var name = $element[0].files[0].name;
			return {
				name: name.substr(0, name.lastIndexOf("."))
				, ext: name.substr(name.lastIndexOf(".") + 1)
			}
		} //end: file: function($element){

		, isExt: function($element, defaults){
			if(defaults.ext === undefined){ //bypass
				return true;
			}

			var result = true;
			var name = this.file($element);
			switch($.type(defaults.ext)){ //입력받은 ext 확인
				case "string": //문자열이면
					if(defaults.ext.toLowerCase() !== name.ext){
						result = false;
						alert("업로드 파일의 확장자는 대소문자 구분없이 " + defaults.ext + "만 허용됩니다.");
					}
				break;
				case "array": //배열이면
					result = false;
					for(var i = 0; i < defaults.ext.length; i++){
						if(defaults.ext[i].toLowerCase() === name.ext){
							result = true;
							break;
						}
					}
					if(!result){
						alert("업로드 파일의 확장자는 대소문자 구분없이 " + defaults.ext.join() + "만 허용됩니다.");
					}
				break;
				default: //기타면
					result = false;
					alert("파일의 확장자는 문자열이나 배열만 입력할 수 있습니다.");
				break;
			}

			return result;
		} //end: , isExt: function($element, defaults){

		, uploadable: function($element, defaults, callback){ //width/height, ratio, byte
			var result = true;

			var fr = new FileReader();
			fr.readAsDataURL($element[0].files[0]);
			fr.onload = function(){ //fileReader가 load되고
				if(defaults.byte !== undefined){
					var flag = defaults.byte.toLowerCase();
					var bytes = Number(defaults.byte.replace(/[^0-9]/g, ""));

					for(var i = 0, arr = ["k", "m", "g", "t", "p"]; i < arr.length; i++){
						if(flag.lastIndexOf(arr[i]) !== -1){
							result = $element[0].files[0].size < bytes * Math.pow(1024, i + 1) ? true : false;
						}
					}
					if(!result){
						alert("업로드 파일의 용량은 " + defaults.byte + "이하로 제한합니다.");
						callback(result); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
						return;
					}
				} //end: if(defaults.byte !== undefined){

				if(defaults.size !== undefined || defaults.ratio !== undefined){
					var img = new Image();
					img.src = fr.result;

					img.onload = function(){ //img객체가 load되고
						if(defaults.size !== undefined){
							var size = {
								width: Number(defaults.size[0])
								, height: Number(defaults.size[1])
								, smaller: defaults.size[2] || false
							};

							if(size.smaller){ //작은 값도 허용
								result = this.width <= size.width && this.height <= size.height ? true : false;
								if(!result){
									alert("이미지 파일의 크기는 가로(" + size.width + "px), 세로(" + size.height + "px)보다 작거나 같아야 합니다.");
								}
							}else{ //같아야만 한다면
								result = this.width === size.width && this.height === size.height ? true : false;
								if(!result){
									alert("이미지 파일의 크기는 가로(" + size.width + "px), 세로(" + size.height + "px)와 같아야 합니다.");
								}
							}
						} //end: if(defaults.size !== undefined){

						if(defaults.ratio !== undefined){
							var ratio = {
								x: Number(defaults.ratio[0])
								, y: Number(defaults.ratio[1])
							};

							var compares = [Math.round(this.width / 100), Math.round(this.height / 100)];
							result = compares[0] === ratio.x && compares[1] === ratio.y ? true : false;
							if(!result){
								alert("이미지 파일의 비율은 가로(" + ratio.x + "), 세로(" + ratio.y + ")이여야 합니다.");
							}
						} //end: if(defaults.ratio !== undefined){

						this.remove(); //사용할 일 없으므로 이미지 객체 제거
						callback(result); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
					}; //end: img.onload = function(){

					img.onerror = function(){ //fake 이미지 파일인 경우 처리
						alert("정상적인 이미지 파일이 아닙니다.");
						this.remove(); //사용할 일 없으므로 이미지 객체 제거
						callback(false); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
					}
				} //end: if(defaults.size !== undefined){
			} //end: fr.onload = function(){
		} //end: , uploadable: function($element, defaults){
	}; //end: var ezfile = {

	$.extend(true, defaults, json);

	return this.each(function(){
		var $root = $(this);

		var html = ""
		+ "<div style='border: 1px solid silver; padding: 3px; margin: 5px; width: 100%;'>"
			+ "<span class='icon'" + defaults.style.icon + "></span>"
			+ "<span class='text'>" + defaults.text + "</span>"
			+ "<input type='file' name='" + defaults.name + "' style='display: none;'/>"
			+ "<button class='file' type='button' " + defaults.style.file + ">FILE</button>"
			+ "<button class='delete' type='button' " + defaults.style.delete + ">Delete</button>"
		+ "</div>";

		$root
			.html(html)
			.on("click", "button.file", function(){
				$(this).prev("input").trigger("click");
			})
			.on("change", "input[type='file']", function(){
				var $parent = $(this).parent();
				var $wrapper = $parent.parent();
				var file = ezfile.file($(this));

				if(!ezfile.isExt($(this), defaults)){
					$parent.remove();
					$root.append(html);
					return;
				}

				if(defaults.limit !== undefined){
					if(defaults.limit === 0){
						$root.append(html);
					}else{
						if(defaults.limit > $root.find("input[type='file'][name='" + $(this).attr("name") + "']").length){
							$root.append(html);
						}
					}
				}

				$(this).prev("span.text").text(file.name).prev("span.icon").show().css({"background": defaults.icon[file.ext] || "gray"}).text(file.ext).end().end().next("button.file").hide().next("button.delete").show();

				ezfile.uploadable($(this), defaults, function(result){
					if(!result){
						$parent.remove();
						if(defaults.limit === undefined){
							$root.append(html);
						}else{
							if(defaults.limit !== 0){
								var appendable = 0;
								$wrapper.find("input[type=file]").each(function(){
									if($(this).val().length > 0){
										appendable++;
									}
								});
								if(defaults.limit - 1 === appendable){
									$root.append(html);
								}
							}
						}
					}
				});
			})
			.on("click", "button.delete", function(){
				$(this).parent().remove();

				if(defaults.limit === undefined){
					$root.append(html);
				}else{
					var $files = $root.find("input[type='file'][name='" + $(this).prev().prev().attr("name") + "']");
					var count = 0;
					$files.each(function(){
						if($(this).val() !== ""){
							count++;
						}
					});
					if($files.length === count){
						$root.append(html);
					}
				}
			})
		;
	}); //end: return this.each(function(){
}; //end: $.fn.ezfile = function(json){
