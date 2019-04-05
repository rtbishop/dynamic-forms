// load loginForm JSON and return HTML output
// var loginFormJSON = jsonData.provider[0].loginForm[0] (non-MFA) or jsonData.providerAccount[0].loginForm[0] (MFA)
function login_form(loginFormJSON)
{
	var loginFormHTML = "";
    var rows = loginFormJSON.row;
    for (var i = 0; i < rows.length; i++) {
    	var row = rows[i];
    	loginFormHTML += field_type_handler(row);
    }
    return loginFormHTML;
}

// delegate the HTML field type for each row
function field_type_handler(row)
{
	var fieldHTML;
	if (row.field[0].type === "option" || row.field[0].type === "options") {
		fieldHTML = select_field_html(row.field[0].option.length, row.field[0].option, row.label);
	} else if (row.field[0].type === "text" && row.field[0].id === "image") {
		fieldHTML = captcha_field_html(row);
	} else if (row.field[0].type === "radio") {
		fieldHTML = radio_field_html(row.field[0].option.length, row.field[0].option, row.label);
	} else {
		fieldHTML = text_field_html(row);
	}
	return fieldHTML;
}

// text and password fields HTML
function text_field_html(row)
{
	var html;
	if (row.field[0].isOptional) {
		html = '<div class="form-group"><input type="'+row.field[0].type+'" class="form-control" placeholder="'+row.label+'" ref="'+row.field[0].name+'" /></div>';
	} else {
		html = '<div class="form-group"><input type="'+row.field[0].type+'" class="form-control" placeholder="'+row.label+'" ref="'+row.field[0].name+'" required="true" /></div>';
	}
	return html;
}

// drop-down field HTML
function select_field_html(num_options, options, label)
{
	var html = '<div class="form-group">';
	if (label !== undefined) {
		html += '<label>'+label+'</label>';
	}
	html += '<select class="form-control">';
	for (var i = 0; i < num_options; i++) {
		html += '<option value="'+options[i].optionValue+'">'+options[i].displayText+'</option>';
	}
	html += '</select></div>';
	return html;
}

// radio button options HTML
function radio_field_html(num_options, options, label)
{
	var html = '<div class="form-group">';
	if (label !== undefined) {
		html += '<label>'+label+'</label>';
	}
	for (var i = 0; i < num_options; i++) {
		html += '<input type="radio" name="radio" class="form-control" style="max-width:15px" value="'+options[i].optionValue+'" />'+options[i].displayText+'<br />';
	}
	html += '</div>';
	return html;
}

// base64-encoded captcha image HTML
function captcha_field_html(row)
{
	var html = '<div class="form-group">';
	html += '<p><img src="data:image/png;base64,'+row.field[0].value+'" /></p>';
	html += '<input type="'+row.field[0].type+'" class="form-control" placeholder="Enter Code" /></div>';
	html += '</div>';
	return html;
}