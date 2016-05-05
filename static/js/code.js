function initializeCodeMirror(t)
{

	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	  lineNumbers: true,
	  theme: t,
	  indentUnit: 4,
	  extraKeys: {
	    "F11": function(cm) {
	      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
	    },
	    "Esc": function(cm) {
	      if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
	    }
	  }
	});

	return editor;
}

function bindSave(editor)
{
	$('#save').click(function(){
		saveCode(editor);
	});

	setInterval( function(){ $('#save').click() }, 3000);
}

function saveCode(editor){
	console.log('click');
	var text = editor.getValue();
	text = text.trim();
	if(text == ""){
		return false;
	}
	var name = $('#name').text();
	var id = $('#id').val();
	var json = {'code':text, 'name':name};

	if(id == 0){
		var xhr = $.ajax({
	        type: "POST",
	        data: json,
	        url: "/snippets",
	        dataType: "json",
	        success: function (arg) {
	        	console.log('saved');
	        	var resp = JSON.parse(arg);
	        	$('#id').val(resp.id);
	        },
	        timeout: 30000,
	        error: function (request, error) {
	            console.log(error);
	        },
	        async: true
	    });
	}
	else{
		var xhr = $.ajax({
	        type: "PUT",
	        data: json,
	        url: "/snippet/"+id,
	        dataType: "json",
	        success: function (arg) {
	        	console.log(arg)
	        },
	        timeout: 30000,
	        error: function (request, error) {
	            console.log(error);
	        },
	        async: true
	    });
	}
}

function bindCNR(editor){
	$('#cnr').click(function(){
		var lang = $('#lang').val();
		var text = editor.getValue();
		var name = $('#name').text();
		var checked = $("#useCustom").is(":checked");
		var input = $('#input').val();
		var id = $('#id').val();

		if(checked)
			checked = true
		else
			checked = false

		var json = {'code':text, 'lang':lang, 'usecustom':checked,'input':input  };
		var xhr = $.ajax({
	        type: "POST",
	        data: JSON.stringify(json),
	        url: "/run",
	        dataType: "json",
	        success: function (arg) {
	        	$('#resultCover').css('display','block');
	        	$('#timeUsed').text("");
	        	$('#memoryUsed').text("");
	        	$('#llink').html("");
	        	$('#helink').html("");
	        	if(arg.compile_status == 'CE' || arg.run_status.status == 'CE'){
	        		$('#error').css('display','block');
	        		$('#error').text(arg.compile_status);
	        		$('#compileStatus').text('Not OK');
	        		$('#output').html(arg.run_status.status_detail);
	        	}
	        	else if(arg.compile_status == 'OK' && arg.run_status.status == 'RE'){
	        		$('#compileStatus').text('OK');
	        		$('#timeUsed').text(arg.run_status.time_used);
	        		$('#memoryUsed').text(arg.run_status.memory_limit);
	        		$('#output').html(arg.run_status.stderr);

	        		var ll = "http://localhost:5000/"+id;
	        		$('#llink').append($('<a>', {
	        			href:ll,
	        			title: "Shared local link"
	        		}).append(ll));
	        		$('#helink').append($('<a>', {href:arg.web_link}).append(arg.web_link));
	        	}
	        	else{
	        		$('#error').text("");	
	        		$('#error').css('display','none');
	        		$('#compileStatus').text('OK');
	        		$('#timeUsed').text(arg.run_status.time_used);
	        		$('#memoryUsed').text(arg.run_status.memory_limit);
	        		$('#output').html(arg.run_status.output_html);

	        		var ll = "http://localhost:5000/"+id;
	        		$('#llink').append($('<a>', {
	        			href:ll,
	        			title: "Shared local link"
	        		}).append(ll));
	        		$('#helink').append($('<a>', {href:arg.web_link}).append(arg.web_link));
	        	}
	        },
	        timeout: 30000,
	        error: function (request, error) {
	            console.log(error);
	        },
	        async: true
	    });
	});
}

function bindActions(){
	$('#name').click(function(){
		var name = $(this).text();
		$(this).css('display','none');
		$('#tempNameCover').css('display','inline-block');
		$('#tempName').val(name);
	});

	$('#saveName').click(function(){
		var name = $('#tempName').val();
		if(name.trim() && name.trim() != ""){
			$(this).parent().css('display','none');
			$('#name').text(name);
			$('#name').css('display','inline-block');
		}
	});

	$('#cancelName').click(function(){
		$(this).parent().css('display','none');
		$('#name').css('display','inline-block');
	});

	$("#useCustom").change(function() {
	    if(this.checked) 
	        $('#input').css('display','block');
	    else
	    	$('#input').css('display','none');
	});
}

function loadCode(editor){
	var id = $('#id').val();
	if(id != 0){
		var xhr = $.ajax({
	        type: "GET",
	        data: {},
	        url: "/snippet/"+id,
	        dataType: "json",
	        success: function (arg) {
	        	if(arg == "Not Found"){
	        		$(location).attr('href', '/code');
	        	}
	        	else{
		        	cs = JSON.parse(arg);
		        	editor.setValue(cs.code);
		        	$('#name').text(cs.name);
	        	}
	        },
	        timeout: 30000,
	        error: function (request, error) {
	            $(location).attr('href', '/code');
	        },
	        async: true
	    });
	}	
}

function getCodeFiles(){
	var xhr = $.ajax({
        type: "GET",
        data: {},
        url: "/snippets",
        dataType: "json",
        success: function (arg) {
        	resp = JSON.parse(arg);
        	console.log(resp);
        	if(resp.length == 0){
        		var tr = $('<tr>',{class:"file-item"});
            	tr.append($('<td>',{class:"file-id", text:"No message files."}));
            	tr.append($('<td>',{class:"file-name", text:" "}));
            	tr.append($('<td>',{class:"file-date", text:" "}));
	        	tr.append($('<td>',{class:"file-link", text:" "}));
            	$('#logFileList').append(tr);
        	}
        	else{
	            $.each(resp, function(i,v){	        
	            	if(i % 2 == 0)
	            		classname = "file-item li-even"
	            	else
	            		classname = "file-item li-even"

	            	var tr = $('<tr>',{class:classname});
	            	tr.append($('<td>',{class:"file-id", text:v.id}));
	            	tr.append($('<td>',{class:"file-name", text:v.name}));
	            	tr.append($('<td>',{class:"file-date", text:v.pub_date}));
	            	tr.append($('<td>',{class:"file-link"}).append($('<a>',{
	            		href:'http://localhost:5000/code/'+v.id,
	            		title: v.name
	            	}).append('http://localhost:5000/code/'+v.id)));
	            	$('#codeFileList').append(tr);
	            });
        	}
        },
        timeout: 30000,
        error: function (request, error) {
            console.log(error);
            var tr = $('<tr>',{class:"file-item"});
            tr.append($('<td>',{class:"file-id", text:"Cannot get list of code files."}));
            tr.append($('<td>',{class:"file-name", text:" "}));
            tr.append($('<td>',{class:"file-date", text:" "}));
	        tr.append($('<td>',{class:"file-link", text:" "}));
            $('#codeFileList').append(tr);
        },
        async: false
    });
}