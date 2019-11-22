// load loginForm JSON and return HTML output
// var loginFormJSON = jsonData.provider[0].loginForm[0] (non-MFA) or jsonData.providerAccount[0].loginForm[0] (MFA)

function login_form(loginFormJSON)
{
	var loginFormHTML = "";
    var rows = loginFormJSON.row;
    for (var i = 0; i < rows.length; i++) {
		var row = rows[i];

		// radio button edge case
		if(row.fieldRowChoice.includes("Choice")) {
			let j = i;
			for (j; j < rows.length; j++) {
				if(!rows[j].fieldRowChoice.includes("Choice")) {
					break;
				}
			}
			var sliced = rows.slice(i, j);
			loginFormHTML += edge_radio_fields_html(rows.slice(i, j));

			// update row position
			i = j - 1;
		} else {
			loginFormHTML += field_type_handler(row);
		}
	}
	
    return loginFormHTML;
}

// delegate the HTML field type for each row
function field_type_handler(row)
{
	var fieldHTML;
	
	// differently formatted radio buttons
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

// custom radio button options HTML designated with "#### Choice" in JSON
function edge_radio_fields_html(options)
{
	let html = "";
	let hidden = "";
	html = '<div id='+"'"+options[0].fieldRowChoice+"'"+'class="form-group">';
	hidden = '<div id='+"'"+options[0].fieldRowChoice+"-hidden'"+'class="form-group">';
	for(let i = 0; i < options.length;i++) {
		let choice = options[i];
		let label = choice.label.split(" ").join("-").toLowerCase();
		html += '<label>'+choice.label+'</label>';
		html += '<input type="radio" name="radio" class="form-control" value="'+choice.label+'" onClick="hideShow(\''+label+'\', \''+options[0].fieldRowChoice+'\')"/><br />';
		if(choice.field !== undefined) {
			let elementWidth = (100 / choice.field.length);
			for(let j = 0; j < choice.field.length; j++) {
				let field = choice.field[j];
				let fieldId = label+ '-' + field.name.toLowerCase();
				hidden += '<input id='+fieldId+' style="display: none;width:calc('+elementWidth+'% - 4px);" type="'+field.type+'" maxlength="'+field.maxLength+'" class="form-control"/>'
			}
		}
	}
	hidden += '</div>';
	html += '</div>';
	return html + hidden;
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