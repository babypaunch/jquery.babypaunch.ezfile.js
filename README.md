# jquery.babypaunch.ezfile.js #
* jquery를 이용한 file 관리 plugin
* 라이센스: MIT
* sample: ezfile.html

## Install js file & Usage ##
<div>1. jquery에 종속적이므로 반드시 jquery 파일의 아래에 jquery.babypaunch.ezfile.js 파일을 위치시켜야 한다.</div>
<br/>

### Example ###
    <html>
    <head>
    	<script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
    	<script src="./jquery.babypaunch.ezfile.js"></script>
    	<script>
    		$(function(){
				$("#file1").ezfile({name: "upfile1"});
				$("#file2").ezfile({name: "upfile2", limit: 0});
				$("#file3").ezfile({name: "upfile3", ext: ["gif", "jpg", "jpeg", "png"], size: [900, 300, true]});
				$("#file4").ezfile({name: "upfile4", ext: "gif", ratio: [8, 2]});
				$("#file5").ezfile({name: "upfile5", limit: 3, byte: "10mb"});
    		});
    	</script>
    </head>
    <body>
		<div id="file1"></div>
		<div id="file2"></div>
		<div id="file3"></div>
		<div id="file4"></div>
		<div id="file5"></div>
    </body>
    </html>

## ezfile(json) Method ##
* 기본적으로 json의 값중에 name은 필수로 지정해주어야 한다. 이는 input[type=file] 객체의 name으로 지정된다.

<table>
	<tr>
		<th>json</th>
		<th>설명</th>
	</tr>
	<tr>
		<th>text</th>
		<td>
			<div>input[type=file] 객체의 placeholder attribute의 값으로 지정된다.</div>
		</td>
	</tr>
	<tr>
		<th>limit</th>
		<td>
			<div>1. limit를 입력하지 않을 경우엔 하나의 file만 등록할 수 있다.</div>
			<br/>
			<div>2. limit가 0이면 무제한으로, 0이 아닌 다른 숫자이면 정해진 숫자만큼 file을 등록할 수 있다.</div>
		</td>
	</tr>
	<tr>
		<th>ext</th>
		<td>
			<div>1. 업로드할 수 있는 파일의 확장자명을 지정한다. 지정된 확장자명을 제외하고 업로드할 수 없다.</div>
			<br/>
			<div>2. 확장자명은 배열로 다수 등록할 수 있고, 문자열로는 하나만 등록할 수 있다.</div>
		</td>
	</tr>
	<tr>
		<th>size</th>
		<td>
			<div>1. 업로드할 이미지의 허용할 가로/세로 픽셀 사이즈를 지정할 수 있다.</div>
			<br/>
			<div>2. 배열순서대로 가로, 세로, 이하 사이즈 허용 여부를 입력한다. 특히 이하 사이즈 허용 여부는 값을 지정하지 않을 경우 가로, 세로가 정확히 일치해야 업로드 할 수 있다.</div>
		</td>
	</tr>
	<tr>
		<th>ratio</th>
		<td>
			<div>1. 업로드할 이미지의 허용할 가로/세로 픽셀 비율을 지정할 수 있다.</div>
			<br/>
			<div>2. 비율이 맞으면 사이즈는 상관없이 처리할 수 있다.</div>
		</td>
	</tr>
	<tr>
		<th>byte</th>
		<td>
			<div>1. 업로드할 파일의 용량을 제한할 수 있다. 제한할 용량의 숫자와 단위를 입력해서 사용한다.</div>
			<br/>
			<div>2. 제한 용량 단위는 byte로 k(b), m(b), g(b), t(b), p(b)를 사용할 수 있고, 각각 kilo, mega, giga, tera, peta를 의미한다.</div>
		</td>
	</tr>
</table>