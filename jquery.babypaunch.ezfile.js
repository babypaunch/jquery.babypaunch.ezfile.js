/*
* ezfile
* dev: 정대규
* first: 2016.11.11
* version: 1.0
* lisence: MIT(free)
* email: babypaunch@gmail.com
*/
"use strict";

var L = {
	/*
	* L.formData(): file의 비동기 전송을 위한 객체를 생성한다. 이 객체를 ajax의 data부에 대입하면 됨.
	*/
	formData: function($obj, isMulti){
		var formData = new FormData();
		$obj.each(function(idx){
			if($(this)[0].files[0] !== undefined){
				formData.append($obj.attr("name") + (isMulti ? idx : ""), $(this)[0].files[0]);
			}
		});
		return formData;
	} //end: , formData: function($obj, isMulti){

	/*
	* L.ui: UI를 구성하는 preset 모음.
	*/
	, ui: {
		/*
		* L.ui.tags
		*/
		tags: {
			file: {
				wrap: "div"
				, close: "i"
				, open: "i"
			} //end: file: {
		} //end: , tags: {

		/*
		* L.ui.file(): 정해진 UI대로 file을 자동으로 그려준다.
		* TODO: div, input, i 객체를 대신하거나 이를 동적으로 대입할 수 있도록 수정이 필요함.(UI의 종속성을 최소화하기 위함)
		*/
		, file: function(json, addCallback, removeCallback){
			var parts = {
				wrap: function(groupId, file, input, open, close){
					var tag = L.ui.tags.file.wrap;
					var style = "style='position: relative; margin-bottom: 5px;'";
					return "<" + tag + " data-file-groupId=" + groupId + " " + style + ">\n" + file + input + open + close + "</" + tag + ">\n";
				}
				, paramString: function(json, addCallback, removeCallback){
					return "this, " + JSON.stringify(json) + ", \"" + addCallback + "\", \"" + removeCallback + "\"";
				}
				, file: function(json, addCallback, removeCallback){
					var attrs = "name='" + json.name + "'";
					for(var i in json){
						if(i === "true"){
							attrs += " " + i + "='" + json[i] + "'";
						}
					}
					var style = "style='display: none;'";
					return "<input type='file' " + attrs + " " + style + " onchange='L.ui.changeFile(" + this.paramString(json, addCallback, removeCallback) + ")'/>\n";
				}
				, text: function(str){
					var style = "style='width: 100%;'";
					return "<input type='text' readonly='readonly' " + style + " onclick='L.ui.clickFile(this.parentNode.children)' placeholder='" + str + "'/>\n";
				}
				, close: function(json, addCallback, removeCallback){
					var tag = L.ui.tags.file.close;
					var style = "style='position: absolute; top: 6px; right: 5px; display: none;'";
					return "<" + tag + " class='fa fa-times' " + style + " onclick='L.ui.removeFile(" + this.paramString(json, addCallback, removeCallback) + ")'></" + tag + ">\n";
				}
				, open: function(){
					var tag = L.ui.tags.file.open;
					var style = "style='position: absolute; top: 6px; right: 5px;'";
					return "<" + tag + " class='fa fa-file' " + style + " onclick='L.ui.clickFile(this.parentNode.children)'></" + tag + ">\n";
				}
			}; //end: var parts = {

			return parts.wrap(json.groupId
				, parts.file(json, addCallback, removeCallback)
				, parts.text("Choice a File.")
				, parts.close(json, addCallback, removeCallback)
				, parts.open()
			);
		} //end: , file: function(json, addCallback, removeCallback){

		/*
		* L.ui.clickFile(): input이나 file icon을 클릭하면 숨겨진 file을 trigger로 클릭해준다.
		*/
		, clickFile: function(children){
			if($(children[2]).is(":hidden")){ //.fi-times
				$(children[0]).trigger("click"); //input[type='file']
			}
		} //end: , clickFile: function(children){

		/*
		* L.ui.able: file의 uplaod를 확인하기 위한 preset 모음.
		*/
		, able: {
			/*
			* L.ui.able.ext(): 파일의 확장자를 확인한다. 문자열/배열을 받을 수 있다.
			*/
			ext: function($obj, $file, json){
				var result = true;
				if(json.ext === undefined){
					result = true;
				}else{
					var fileName = $file.name;
					var extFileName = $file.name.substring($file.name.lastIndexOf(".") + 1, $file.name.length).toLowerCase();

					switch($.type(json.ext)){
						case "string":
							var extCompare = json.ext.toLowerCase();
							result = extCompare === extFileName ? true : false;
							if(!result){
								alert("업로드 파일의 확장자는 대소문자 구분없이 " + json.ext + "만 허용됩니다.");
								$obj.parent().remove(); //객체 제거
							}
						break;
						case "array":
							result = false;
							for(var i = 0; i < json.ext.length; i++){
								if(json.ext[i].toLowerCase() === extFileName){
									return true;
								}
							}
							if(!result){
								alert("업로드 파일의 확장자는 대소문자 구분없이 " + json.ext.join() + "만 허용됩니다.");
								$obj.parent().remove(); //객체 제거
							}
						break;
						default:
							alert(L.ERROR + "L.able.ext(): 파일의 확장자는 문자열이나 배열만 입력할 수 있습니다.");
							$obj.parent().remove(); //객체 제거
							result = false;
						break;
					}
				}

				return result;
			} //end: ext: function($obj, $file, json){

			/*
			* L.ui.able.byte(): 파일의 용량을 확인한다.
			*/
			, byte: function($obj, $file, json){
				var result = true;
				if(json.byte === undefined){
					result = true;
				}else{
					var flag = json.byte.toLowerCase();
					var bytes = Number(json.byte.replace(/[^0-9]/g, ""));

					for(var i = 0, arr = ["k", "m", "g", "t", "p"]; i < arr.length; i++){
						if(flag.lastIndexOf(arr[i]) !== -1){
							result = $file.size < bytes * Math.pow(1024, i + 1) ? true : false;
						}
					}
					if(!result){
						alert("업로드 파일의 용량은 " + json.byte + "이하로 제한합니다.");
						$obj.parent().remove(); //객체 제거
					}
				}
				return result;
			} //end: , byte: function($obj, $file, json){

			/*
			* L.ui.able.size(): 이미지 파일의 가로/세로 크기를 확인한다.
			*/
			, size: function($obj, json, callback){
				this.realize("size", $obj, json, callback);
			} //end: , size: function($obj, json, callback){

			/*
			* L.ui.able.ratio(): 이미지 파일의 가로/세로 비율을 확인한다.
			*/
			, ratio: function($obj, json, callback){
				this.realize("ratio", $obj, json, callback);
			} //end: , ratio: function($obj, json, callback){

			/*
			* L.ui.able.realize(): size/ratio의 구현부분, 비동기로 동작되므로 callback패턴을 이용함.
			*/
			, realize: function(flag, $obj, json, callback){
				var fr = new FileReader;
				fr.onload = function(){ //fileReader가 load되고
					var img = new Image;
					img.onload = function(){ //img객체가 load되고
						var result = true;
						if(flag === "size"){
							if(json[flag][2]){ //보다 작은 값도 된다면
								result = this.width <= Number(json[flag][0]) && this.height <= Number(json[flag][1]) ? true : false;
								if(!result){
									alert("이미지 파일의 크기는 가로(" + Number(json[flag][0]) + "px), 세로(" + Number(json[flag][1]) + "px)보다 작거나 같아야 합니다.");
								}
							}else{ //같아야만 한다면
								result = this.width === Number(json[flag][0]) && this.height === Number(json[flag][1]) ? true : false;
								if(!result){
									alert("이미지 파일의 크기는 가로(" + Number(json[flag][0]) + "px), 세로(" + Number(json[flag][1]) + "px)와 같아야 합니다.");
								}
							}
						}else{ //ratio 비율 비교
							var compares = [Math.round(this.width / 100), Math.round(this.height / 100)];
							result = compares[0] === Number(json[flag][0]) && compares[1] === Number(json[flag][1]) ? true : false;
							if(!result){
								alert("이미지 파일의 비율은 가로(" + Number(json[flag][0]) + "), 세로(" + Number(json[flag][1]) + ")이여야 합니다.");
							}
						}
						this.remove(); //이미지 객체 제거
						callback(result);
					};
        			img.src = fr.result;
					//$obj.parent().html(img);
				}
				fr.readAsDataURL($obj[0].files[0]);
			} //end: , realize: function(flag, $obj, json, callback){
		} //end: , able: {

		/*
		* L.ui.uploadable(): file의 upload 가능을 확인
		*/
		, uploadable: function($obj, json, callback){
			var $file = $obj[0].files[0];
			var isExt = this.able.ext($obj, $file, json);
			var isByte = this.able.byte($obj, $file, json);

			if(json.size === undefined && json.ratio === undefined){
				callback(isExt && isByte);
			}else{ //파일의 size/ratio 확인 비동기로 동작되므로 분기처리
				var flag = json.size !== undefined ? "size" : "ratio";
				this.able[flag]($obj, json, function(result){
					callback(isExt && isByte && result);
				});
			}
		} //end: , uploadable: function(json){

		/*
		* L.ui.changeFile(): 파일의 값이 바뀌면 동작
		*/
		, changeFile: function(obj, jsonString, addCallback, removeCallback){
			var $obj = $(obj);
			var $val = $obj.val();
			var $parent = $obj.parent();
			var fileName = $val.substring($val.lastIndexOf("\\") + 1, $val.length); //fakePath를 제거하기 위해 파일명만 추출한다.
			var fileTag = this.tags.file;
			
			$parent.find("input[type='text']").val(fileName).end().find(fileTag.open + ".fa-file").hide().end().find(fileTag.close + ".fa-times").show();

			if(jsonString.isMulti){ //file을 다중생성가능
				if(jsonString.limit !== undefined){ //제한이 없을 경우
					if(jsonString.limit > $("div[data-file-groupId='" + jsonString.groupId + "']").length){
						$parent.parent().append(this.file(jsonString, addCallback, removeCallback));
					}
				}else{ //제한이 있을 경우
					$parent.parent().append(this.file(jsonString, addCallback, removeCallback));
				}
			}

			this.uploadable($obj, jsonString, function(result){ //file의 upload 가능여부 확인
				if(result){ //upload 가능하면
					window[addCallback](L.formData($obj, jsonString.isMulti));
				}else{ //upload 불가능하면
					L.ui.removeFile(obj, jsonString, addCallback, removeCallback);
					return false;
				}
			});
		} //end: , changeFile: function(obj, jsonString, addCallback, removeCallback){

		/*
		* L.ui.removeFile(): 파일을 제거한다.
		*/
		, removeFile: function(obj, jsonString, addCallback, removeCallback){
			var $parent = $(obj).parent();
			window[removeCallback](L.formData($parent.find("input[type='file']"), jsonString.isMulti));

			if(jsonString.isMulti){ //file의 다중생성이 가능할 경우
				if(jsonString.limit !== undefined){ //제한이 있을 경우
					var $root = $parent.parent();
					var limiter = 0;
					$("div[data-file-groupId='" + jsonString.groupId + "'] input[type='text']").each(function(){
						if($(this).val() !== ""){
							limiter++;
						}
					});

					if(limiter === jsonString.limit){
						$parent.remove();
						$root.append(this.file(jsonString, addCallback, removeCallback))
					}else{
						$parent.remove().parent().append(this.file(jsonString, addCallback, removeCallback));
					}
				}else{ //제한이 없을 경우
					$parent.remove();
				}
			}else{ //file을 하나만 생성할 경우
				$parent.parent().html(this.file(jsonString, addCallback, removeCallback));
			}
		} //end: , removeFile: function(obj, jsonString, addCallback, removeCallback){
	} //end: , ui: {
}; //end: var L = {
