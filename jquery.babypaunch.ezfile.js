/*
* ezfile
* dev: 정대규
* first: 2016.12.15
* version: 1.1
* lisence: MIT(free)
* email: babypaunch@gmail.com
*/
"use strict";

var ezfile = {
	file: function($element){
		var file = $element[0].files[0].name;
		return {
			name: file.substr(0, file.lastIndexOf("."))
			, ext: file.substr(file.lastIndexOf(".") + 1)
		}
	} //end: file: function($element){

	, fileName: function($element){
		return $element.val().substr($element.val().lastIndexOf("\\") + 1);
	} //end: , fileName: function($element){

	, isExt: function($element, data){
		if(data.ext === undefined){ //bypass
			return true;
		}

		var result = true;
		var file = this.file($element);
		switch($.type(data.ext)){ //입력받은 ext 확인
			case "string": //문자열이면
				if(data.ext.toLowerCase() !== file.ext){
					result = false;
					alert("업로드 파일의 확장자는 대소문자 구분없이 " + data.ext + "만 허용됩니다.");
				}
			break;
			case "array": //배열이면
				result = false;
				for(var i = 0; i < data.ext.length; i++){
					if(data.ext[i].toLowerCase() === file.ext){
						result = true;
						break;
					}
				}
				if(!result){
					alert("업로드 파일의 확장자는 대소문자 구분없이 " + data.ext.join() + "만 허용됩니다.");
				}
			break;
			default: //기타면
				result = false;
				alert("파일의 확장자는 문자열이나 배열만 입력할 수 있습니다.");
			break;
		}

		return result;
	} //end: , isExt: function($element, data){

	/*
	* default는 mb로 처리함.
	*/
	, isByte: function($element, byte, callback){
		var result = true;

		var fr = new FileReader();
		fr.readAsDataURL($element[0].files[0]);
		fr.onload = function(){ //fileReader가 load되고
			var flag = byte.toLowerCase();
			var bytes = Number(byte.replace(/[^0-9]/g, ""));
			var unit = "mb";

			var isMega = true;
			for(var i = 0, arr = ["k", "m", "g", "t", "p"]; i < arr.length; i++){
				if(flag.lastIndexOf(arr[i]) !== -1){
					result = $element[0].files[0].size < bytes * Math.pow(1024, i + 1) ? true : false;
					unit = arr[i] + "b";
					isMega = false;
				}
			}

			if(isMega){
				result = $element[0].files[0].size < bytes * Math.pow(1024, 1 + 1) ? true : false;
			}

			if(!result){
				alert("업로드 파일의 용량은 " + byte + unit + " 이하로 제한합니다.");
			}

			callback(result); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
		} //end: fr.onload = function(){
	} //end: , isByte: function($element, byte, callback){

	, uploadable: function($element, data, callback){ //width/height, ratio, byte
		var result = true;

		var fr = new FileReader();
		fr.readAsDataURL($element[0].files[0]);
		fr.onload = function(){ //fileReader가 load되고
			if(data.byte !== undefined){
				var flag = data.byte.toLowerCase();
				var bytes = Number(data.byte.replace(/[^0-9]/g, ""));

				for(var i = 0, arr = ["k", "m", "g", "t", "p"]; i < arr.length; i++){
					if(flag.lastIndexOf(arr[i]) !== -1){
						result = $element[0].files[0].size < bytes * Math.pow(1024, i + 1) ? true : false;
					}
				}
				if(!result){
					alert("업로드 파일의 용량은 " + data.byte + "이하로 제한합니다.");
					callback(result); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
					return;
				}
			} //end: if(data.byte !== undefined){

			if(data.size !== undefined || data.ratio !== undefined){
				var img = new Image();
				img.src = fr.result;

				img.onload = function(){ //img객체가 load되고
					if(data.size !== undefined){
						var size = {
							width: Number(data.size[0])
							, height: Number(data.size[1])
							, smaller: data.size[2] || false
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
					} //end: if(data.size !== undefined){

					if(data.ratio !== undefined){
						var ratio = {
							x: Number(data.ratio[0])
							, y: Number(data.ratio[1])
						};

						var compares = [Math.round(this.width / 100), Math.round(this.height / 100)];
						result = compares[0] === ratio.x && compares[1] === ratio.y ? true : false;
						if(!result){
							alert("이미지 파일의 비율은 가로(" + ratio.x + "), 세로(" + ratio.y + ")이여야 합니다.");
						}
					} //end: if(data.ratio !== undefined){

					this.remove(); //사용할 일 없으므로 이미지 객체 제거
					callback(result); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
				}; //end: img.onload = function(){

				img.onerror = function(){ //fake 이미지 파일인 경우 처리
					alert("정상적인 이미지 파일이 아닙니다.");
					this.remove(); //사용할 일 없으므로 이미지 객체 제거
					callback(false); //onload는 비동기 동작이므로 callback 패턴을 통해 처리가 필요함.
				}
			} //end: if(data.size !== undefined){
		} //end: fr.onload = function(){
	} //end: , uploadable: function($element, data){
}; //end: var ezfile = {

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
			pdf: "red"
			, ppt: "maroon"
			, pptx: "maroon"
			, csv: "limegreen"
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
